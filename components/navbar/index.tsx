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
  const [navTheme, setNavTheme] = useState("light");
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

  // Dynamically update the theme based on which data-nav-theme element is in view
  useEffect(() => {
    if (!mounted) return;

    const themeObserverOptions = {
      root: null,
      rootMargin: "-85% 0px -10% 0px", // Band near the bottom where the navbar sits
      threshold: 0,
    };

    const activeThemeElements = new Set<Element>();

    const themeObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeThemeElements.add(entry.target);
        } else {
          activeThemeElements.delete(entry.target);
        }
      });

      // Pick the theme from the element closest to the bottom of the set
      // (i.e. the one the user is scrolling into)
      if (activeThemeElements.size > 0) {
        // Get the one with the largest top offset (furthest down the page)
        let latest: Element | null = null;
        let latestTop = -Infinity;
        activeThemeElements.forEach((el) => {
          const rect = el.getBoundingClientRect();
          if (rect.top > latestTop) {
            latestTop = rect.top;
            latest = el;
          }
        });
        if (latest) {
          const theme = (latest as HTMLElement).dataset.navTheme || "light";
          setNavTheme(theme);
        }
      }
    }, themeObserverOptions);

    // Observe all elements with data-nav-theme
    const observeThemeElements = () => {
      document.querySelectorAll("[data-nav-theme]").forEach((el) => {
        if (!(el as HTMLElement).dataset.navThemeObserved) {
          themeObserver.observe(el);
          (el as HTMLElement).dataset.navThemeObserved = "true";
        }
      });
    };

    observeThemeElements();
    const pollInterval = setInterval(observeThemeElements, 500);

    return () => {
      themeObserver.disconnect();
      clearInterval(pollInterval);
    };
  }, [mounted]);

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

  const handlePillClick = (index: number, id: string) => {
    // Disable scrollspy updates during the scroll transition
    isNavClickScrollRef.current = true;
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    
    setActiveIndex(index);
    
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }

    // Use a scroll listener to detect when smooth scrolling finishes
    const checkScrollEnd = () => {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        isNavClickScrollRef.current = false;
        window.removeEventListener("scroll", checkScrollEnd);
        
        // When scroll ends, force an update based on the current intersecting sections
        // Wait for next tick so any pending observer callbacks have fired
        setTimeout(() => {
          if (!isNavClickScrollRef.current && activeIndexRef.current !== -1) {
            // (We could manually trigger an update here, but the observer will naturally be in sync now)
          }
        }, 50);
      }, 150); // 150ms after the last scroll event, consider scrolling finished
    };

    window.addEventListener("scroll", checkScrollEnd);
    checkScrollEnd(); // initial call in case no scroll events fire
  };

  // Scroll spy (IntersectionObserver) to sync active index with page scroll position
  useEffect(() => {
    if (!mounted) return;

    const sections = ["home", "about-me", "my-work", "contact-me"];
    const observerOptions = {
      root: null,
      rootMargin: "-40% 0px -40% 0px", // Use center of viewport for scroll spy
      threshold: 0, // MUST be 0 so massive GSAP pinned sections can trigger it
    };

    const intersectingSections = new Set<number>();

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      let changed = false;
      entries.forEach((entry) => {
        const index = sections.indexOf(entry.target.id);
        if (index !== -1) {
          if (entry.isIntersecting) {
            intersectingSections.add(index);
            changed = true;
          } else {
            intersectingSections.delete(index);
            changed = true;
          }
        }
      });

      // ALWAYS update the intersectingSections Set above before returning early!
      // Otherwise, the Set becomes corrupted during smooth scrolls.

      // If we are currently smooth scrolling from a click/drag, ignore UI updates
      if (isNavClickScrollRef.current) {
        return;
      }
      
      // If the user is currently dragging the indicator, ignore scroll spy updates
      if (indicatorRef.current && Draggable.get(indicatorRef.current)?.isDragging) {
        return;
      }

      if (changed && intersectingSections.size > 0) {
        const active = Math.max(...Array.from(intersectingSections));
        setActiveIndex(active);
      }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const observeSections = () => {
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el && !el.dataset.observed) {
          observer.observe(el);
          el.dataset.observed = "true";
        }
      });
    };

    observeSections();

    // Since 'about-me' is mounted asynchronously after fetching the markdown file,
    // we need to check periodically to attach the observer when it finally spawns.
    const pollInterval = setInterval(observeSections, 500);

    return () => {
      observer.disconnect();
      clearInterval(pollInterval);
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

        const checkScrollEnd = () => {
          if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
          scrollTimeoutRef.current = setTimeout(() => {
            isNavClickScrollRef.current = false;
            window.removeEventListener("scroll", checkScrollEnd);
          }, 150);
        };

        window.addEventListener("scroll", checkScrollEnd);
        checkScrollEnd();

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
      <div className={styles.wrap}>
        <nav ref={navRef} className={`${styles.nav} ${navTheme === "dark" ? styles.darkTheme : ""} ${navTheme === "hidden" ? styles.hiddenTheme : ""}`} id="nav">
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
  );
}
