'use client';

import { useEffect, useRef, useState } from "react";
import { animate } from "animejs";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import styles from "./navbar.module.css";

// Register Draggable on client side
if (typeof window !== "undefined") {
  gsap.registerPlugin(Draggable);
}

const NAV_PADDING = 8;
const NAV_GAP = 4;

export function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [collapsedWidth, setCollapsedWidth] = useState(40);
  const [expandedWidths, setExpandedWidths] = useState<number[]>([76, 122, 118, 140]);

  const navRef = useRef<HTMLElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const pillsRef = useRef<(HTMLDivElement | null)[]>([]);
  const animeRef = useRef<any>(null); // Store active AnimeJS v4 instances for cancellation

  // Keep refs of state values to prevent re-initializing GSAP Draggable when state changes
  const activeIndexRef = useRef(activeIndex);
  activeIndexRef.current = activeIndex;

  const collapsedWidthRef = useRef(collapsedWidth);
  collapsedWidthRef.current = collapsedWidth;

  const expandedWidthsRef = useRef(expandedWidths);
  expandedWidthsRef.current = expandedWidths;

  // Scrolling guards to prevent scrollspy from triggering intermediate states during automated scroll
  const isNavClickScrollRef = useRef(false);
  const scrollTimeoutRef = useRef<any>(null);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  // Measure elements on mount to get exact pixel widths
  useEffect(() => {
    if (!mounted) return;

    const nav = navRef.current;
    if (!nav) return;

    const pillElements = pillsRef.current;
    const measuredWidths: number[] = [];

    // Measure collapsed width dynamically from the first pill
    let colWidth = 40;
    const firstPill = pillElements[0] as any;
    if (firstPill) {
      const clone = firstPill.cloneNode(true);
      clone.style.transition = "none";
      const span = clone.querySelector("span");
      if (span) span.style.transition = "none";
      clone.style.position = "absolute";
      clone.style.visibility = "hidden";
      clone.style.left = "-9999px";
      clone.classList.remove(styles.active);
      
      nav.appendChild(clone);
      colWidth = clone.getBoundingClientRect().width;
      nav.removeChild(clone);
      setCollapsedWidth(colWidth);
    }

    // Measure expanded widths for all pills
    pillElements.forEach((el: any) => {
      if (!el) return;
      const clone = el.cloneNode(true);
      clone.style.transition = "none";
      const span = clone.querySelector("span");
      if (span) span.style.transition = "none";
      clone.style.position = "absolute";
      clone.style.visibility = "hidden";
      clone.style.left = "-9999px";
      clone.classList.add(styles.active);

      nav.appendChild(clone);
      const width = clone.getBoundingClientRect().width;
      measuredWidths.push(width);
      nav.removeChild(clone);
    });

    setExpandedWidths(measuredWidths);
  }, [mounted]);

  // Layout helper to compute left offset and width for a given index
  const layoutFor = (index: number) => {
    let left = NAV_PADDING;
    for (let i = 0; i < index; i++) {
      left += collapsedWidth + NAV_GAP;
    }
    return { left, width: expandedWidths[index] || collapsedWidth };
  };

  // Scroll to section when pill is clicked
  const handlePillClick = (index: number, id: string) => {
    // Disable scrollspy updates during the scroll transition
    isNavClickScrollRef.current = true;
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    
    setActiveIndex(index);
    
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }

    scrollTimeoutRef.current = setTimeout(() => {
      isNavClickScrollRef.current = false;
    }, 1000); // Allow 1s for the smooth scroll to complete
  };

  // Scroll spy (IntersectionObserver) to sync active index with page scroll position
  useEffect(() => {
    if (!mounted) return;

    const sections = ["home", "about-me", "my-work", "contact-me"];
    const observerOptions = {
      root: null,
      rootMargin: "-30% 0px -40% 0px", // focus viewport range in the middle
      threshold: 0.1,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      // If we are currently smooth scrolling from a click/drag, ignore observer updates
      if (isNavClickScrollRef.current) {
        return;
      }
      
      // If the user is currently dragging the indicator, ignore scroll spy updates
      if (indicatorRef.current && Draggable.get(indicatorRef.current)?.isDragging) {
        return;
      }

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = sections.indexOf(entry.target.id);
          if (index !== -1) {
            setActiveIndex(index);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [mounted]);

  // Glow cursor tracking
  useEffect(() => {
    if (!mounted) return;

    const nav = navRef.current;
    if (!nav) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = nav.getBoundingClientRect();
      const mx = ((e.clientX - rect.left) / rect.width) * 100;
      const my = ((e.clientY - rect.top) / rect.height) * 100;
      nav.style.setProperty("--mx", mx + "%");
      nav.style.setProperty("--my", my + "%");
      nav.style.setProperty("--glow-opacity", "1");
    };

    const handleMouseLeave = () => {
      nav.style.setProperty("--glow-opacity", "0");
    };

    nav.addEventListener("mousemove", handleMouseMove);
    nav.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      nav.removeEventListener("mousemove", handleMouseMove);
      nav.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mounted]);

  // Spring animation & Drag (GSAP Draggable)
  useEffect(() => {
    if (!mounted || expandedWidthsRef.current.length === 0) return;

    const indicator = indicatorRef.current;
    const nav = navRef.current;
    if (!indicator || !nav) return;

    let dragInstance: Draggable[] | null = null;

    // Helper to calculate the closest pill index while dragging
    const getClosestIndex = (x: number) => {
      const currentLeft = parseFloat(indicator.style.left) + x;
      const indicatorCenter = currentLeft + indicator.offsetWidth / 2;

      let closestIdx = 0;
      let minDistance = Infinity;

      pillsRef.current.forEach((pillEl, index) => {
        if (!pillEl) return;
        const rect = pillEl.getBoundingClientRect();
        const navRect = nav.getBoundingClientRect();
        const pillCenter = (rect.left + rect.right) / 2 - navRect.left;

        const distance = Math.abs(indicatorCenter - pillCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closestIdx = index;
        }
      });

      return closestIdx;
    };

    const layoutForIdx = (index: number) => {
      let left = NAV_PADDING;
      for (let i = 0; i < index; i++) {
        left += collapsedWidthRef.current + NAV_GAP;
      }
      return { left, width: expandedWidthsRef.current[index] || collapsedWidthRef.current };
    };

    // Configure GSAP Draggable
    dragInstance = Draggable.create(indicator, {
      type: "x",
      bounds: nav,
      inertia: true,
      onDragStart: function () {
        if (animeRef.current) {
          animeRef.current.cancel();
        }
      },
      onDrag: function () {
        const closestIdx = getClosestIndex(this.x);
        if (closestIdx !== activeIndexRef.current) {
          setActiveIndex(closestIdx);
        }
      },
      onDragEnd: function () {
        const closestIdx = getClosestIndex(this.x);
        setActiveIndex(closestIdx);

        // Convert the current temporary drag translateX position to inline absolute left
        const currentLeft = parseFloat(indicator.style.left) + this.x;
        gsap.set(indicator, { x: 0 });
        indicator.style.left = currentLeft + "px";

        // Scroll the page to the selected section
        const sections = ["home", "about-me", "my-work", "contact-me"];
        const targetId = sections[closestIdx];

        // Disable scrollspy updates during automated scroll on drag release
        isNavClickScrollRef.current = true;
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }

        scrollTimeoutRef.current = setTimeout(() => {
          isNavClickScrollRef.current = false;
        }, 1000);

        // Spring animate both left and width back to exact grid alignment
        const target = layoutForIdx(closestIdx);
        if (animeRef.current) {
          animeRef.current.cancel();
        }
        animeRef.current = animate(indicator, {
          left: target.left,
          width: target.width,
          duration: 380,
          ease: "spring(1, 140, 15, 0)", // custom mass, stiffness, damping
        });
      },
    });

    return () => {
      if (dragInstance) {
        dragInstance[0].kill();
      }
    };
  }, [mounted]); // Only run on mount!

  // Handle AnimeJS spring transitions when activeIndex changes from clicking or scrollspy
  useEffect(() => {
    if (!mounted || expandedWidths.length === 0) return;

    const indicator = indicatorRef.current;
    if (!indicator) return;

    const isDragging = Draggable.get(indicator)?.isDragging;
    if (isDragging) {
      // If the user is dragging, only animate the width dynamically
      const target = layoutFor(activeIndex);
      if (animeRef.current) {
        animeRef.current.cancel();
      }
      animeRef.current = animate(indicator, {
        width: target.width,
        duration: 220,
        ease: "easeOutExpo",
      });
      return;
    }

    const target = layoutFor(activeIndex);
    if (animeRef.current) {
      animeRef.current.cancel();
    }
    animeRef.current = animate(indicator, {
      left: target.left,
      width: target.width,
      duration: 380,
      ease: "spring(1, 140, 15, 0)",
    });
  }, [activeIndex, expandedWidths, mounted]);

  if (!mounted) return null;

  return (
    <>
      {/* SVG Liquid Distortion Filter */}
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <filter id="glass-distortion" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.008 0.012" numOctaves="2" seed="8" result="noise" />
          <feGaussianBlur in="noise" stdDeviation="2.5" result="softNoise" />
          <feDisplacementMap in="SourceGraphic" in2="softNoise" scale="40" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <div className={styles.wrap}>
        <nav ref={navRef} className={styles.nav} id="nav">
          <div ref={indicatorRef} className={styles.indicator} id="indicator" />
          
          <div
            ref={(el) => { pillsRef.current[0] = el; }}
            className={`${styles.pill} ${activeIndex === 0 ? styles.active : ""}`}
            onClick={() => handlePillClick(0, "home")}
          >
            <svg viewBox="0 0 24 24"><path d="M3 11.5 12 4l9 7.5" /><path d="M5.5 10v9.5h13V10" /><path d="M9.5 19.5V14h5v5.5" /></svg>
            <span>Home</span>
          </div>

          <div
            ref={(el) => { pillsRef.current[1] = el; }}
            className={`${styles.pill} ${activeIndex === 1 ? styles.active : ""}`}
            onClick={() => handlePillClick(1, "about-me")}
          >
            <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.4" /><path d="M5 20c0-3.6 3.1-6.5 7-6.5s7 2.9 7 6.5" /></svg>
            <span>About Me</span>
          </div>

          <div
            ref={(el) => { pillsRef.current[2] = el; }}
            className={`${styles.pill} ${activeIndex === 2 ? styles.active : ""}`}
            onClick={() => handlePillClick(2, "my-work")}
          >
            <svg viewBox="0 0 24 24">
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
            <span>My Work</span>
          </div>

          <div
            ref={(el) => { pillsRef.current[3] = el; }}
            className={`${styles.pill} ${activeIndex === 3 ? styles.active : ""}`}
            onClick={() => handlePillClick(3, "contact-me")}
          >
            <svg viewBox="0 0 24 24"><rect x="7" y="3" width="10" height="18" rx="2.5" /><circle cx="12" cy="17.5" r="0.6" fill="#17181c" /></svg>
            <span>Contact Me</span>
          </div>
        </nav>
      </div>
    </>
  );
}
