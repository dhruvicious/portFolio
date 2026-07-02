"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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

          const travelDist = panel.scrollHeight;
          const totalTravel = travelDist * 1.1;

          gsap.set(container, { height: `calc(${totalTravel}px + 100vh)` });
          gsap.set(panel, { top: 0 });

          gsap.fromTo(
            panel,
            {
              y: vh,
              z: 0,
              rotationX: 20,
              xPercent: -50,
            },
            {
              y: vh - totalTravel,
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
    >
      <div className={styles.stickySection}>
        <div className={styles.glassFade} />

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
      </div>
    </section>
  );
}
