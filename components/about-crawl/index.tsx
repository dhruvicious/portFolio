"use client";

import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { TechTicker } from "../tech-ticker";
import styles from "./about-crawl.module.css";

gsap.registerPlugin(ScrollTrigger);

// Belt-and-suspenders: tell ScrollTrigger to ignore resize events that look
// like mobile browser chrome (address bar) showing/hiding rather than a
// real layout change.
ScrollTrigger.config({ ignoreMobileResize: true });

interface AboutCrawlProps {
  title: string;
  paragraphs: string[];
}

export function AboutCrawl({ title, paragraphs }: AboutCrawlProps) {
  const containerRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [showTab, setShowTab] = useState(false);
  const [showTicker, setShowTicker] = useState(false);
  const [gameOpen, setGameOpen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const hasSkippedRef = useRef(false);
  const tickerLockRef = useRef(false);
  const scrollLockTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleSkip = () => {
      hasSkippedRef.current = true;
      setShowTab(false); // Immediately hide if it was somehow visible
    };
    window.addEventListener("crawlSkipped", handleSkip);
    return () => {
      window.removeEventListener("crawlSkipped", handleSkip);
      if (scrollLockTimeoutRef.current) {
        clearTimeout(scrollLockTimeoutRef.current);
      }
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (gameOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [gameOpen]);

  useGSAP(
    () => {
      const panel = panelRef.current;
      const container = containerRef.current;
      if (!panel || !container) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          reduceMotion: "(prefers-reduced-motion: reduce)",
          isDesktop: "(min-width: 768px)",
        },
        (ctx) => {
          const { reduceMotion } = ctx.conditions as {
            reduceMotion: boolean;
            isDesktop: boolean;
          };

          if (reduceMotion) {
            gsap.set(panel, { clearProps: "all" });
            return;
          }

          // Snapshot the viewport height ONCE per setup instead of reading
          // window.innerHeight live inside the tween's function-based values.
          const vh = window.innerHeight;

          // By decoupling the physical text movement from the actual scroll distance,
          // we can apply a multiplier to make the scroll feel "heavier".
          const scrollWeight = 2.5; // 2.5x more scrolling required for the same distance
          const physicalTravel = panel.scrollHeight * 1.1;
          const scrollDuration = physicalTravel * scrollWeight;
          // The container height dictates how far the user actually has to scroll
          gsap.set(container, { height: `calc(${scrollDuration}px + 100vh)` });
          gsap.set(panel, { top: 0 });
          ScrollTrigger.refresh();

          // A perfectly linear scroll from start to finish (no heavy pull)
          gsap.fromTo(
            panel,
            {
              y: vh,
              z: 0,
              rotationX: 20,
              xPercent: -50,
            },
            {
              y: vh - physicalTravel,
              z: -1500,
              rotationX: 20,
              xPercent: -50,
              ease: "none",
              scrollTrigger: {
                trigger: container,
                start: "top top",
                end: "bottom bottom",
                scrub: true,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                  // If they scroll all the way back up to the start of the crawl, forgive them!
                  // This resets the lock so they can earn the easter egg if they do it properly.
                  if (self.progress <= 0.05) {
                    hasSkippedRef.current = false;
                  }

                  // Only show the easter egg if they actually patiently watched the crawl!
                  if (self.progress > 0.7 && !hasSkippedRef.current) {
                    setShowTab(true);
                  } else {
                    setShowTab(false);
                    if (self.progress < 0.6) setGameOpen(false);
                  }

                  if (self.progress > 0.95) {
                    setShowTicker(true);
                  } else {
                    setShowTicker(false);
                  }
                },
              },
            },
          );
        },
      );

      return () => mm.revert();
    },
    { scope: containerRef, dependencies: [paragraphs] },
  );

  return (
    <section
      ref={containerRef}
      id="about-me"
      className={styles.scrollContainer}
      data-nav-theme="dark"
    >
      <div className={styles.stickySection}>
        {/* The new frosted glass overlay at the top of the viewport */}
        <div className={styles.glassFade} />
        {/* Symmetrical frosted glass overlay at the bottom of the viewport */}
        <div className={styles.glassFadeBottom} />

        {/* The Game Tab (Easter Egg) */}
        <div
          className={`${styles.easterEggTab} ${showTab && !gameOpen ? styles.visible : ""}`}
          onClick={() => setGameOpen(true)}
          title="Secret Mini-Game"
        >
          <Image
            src="/icons8-darth-vader.svg"
            alt="Darth Vader"
            width={48}
            height={48}
            className={styles.vaderIcon}
          />
        </div>

        {/* The Game Window Overlay */}
        <div className={`${styles.gameWindow} ${gameOpen ? styles.open : ""}`}>
          <div className={styles.gameHeader}>
            <h3 className={styles.gameTitle}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polygon points="10 8 16 12 10 16 10 8"></polygon>
              </svg>
              Arcade
            </h3>
            <button
              className={styles.closeButton}
              onClick={() => setGameOpen(false)}
              aria-label="Close Game"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          {gameOpen && (
            <iframe
              ref={iframeRef}
              src="https://tripplearcade.bedhruvicious.co.in"
              className={styles.gameIframe}
              title="Arcade"
              onLoad={() => {
                if (iframeRef.current) {
                  iframeRef.current.focus();
                }
              }}
            />
          )}
        </div>

        <div className={styles.wrapper}>
          <div ref={panelRef} className={styles.scrollText}>
            <h2 className={styles.title}>{title}</h2>
            {paragraphs.map((p, i) => (
              <p key={i} className={styles.paragraph}>
                {p}
              </p>
            ))}
          </div>
        </div>

        {/* The tech stack ticker that appears at the bottom after scrolling */}
        <TechTicker visible={showTicker} />
      </div>
    </section>
  );
}
