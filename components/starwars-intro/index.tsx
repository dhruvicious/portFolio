'use client';

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import styles from "./starwars-intro.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function StarWarsIntroText() {
  const textRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let tl: gsap.core.Timeline | null = null;

    const initScrollTrigger = () => {
      if (!textRef.current || !overlayRef.current) return false;

      // Instead of fighting the DOM for the .pin-spacer, we can just ask GSAP directly!
      // We find the exact ScrollTrigger instance that AboutCrawl created for #about-me
      const aboutST = ScrollTrigger.getAll().find(st => st.trigger && st.trigger.id === "about-me");
      
      if (!aboutST) {
        return false; // Wait until AboutCrawl finishes generating its ScrollTrigger
      }

      // Create a scrubbed timeline using the exact absolute pixel coordinates from AboutCrawl!
      tl = gsap.timeline({
        scrollTrigger: {
          start: aboutST.start, // The exact pixel where #about-me pins to the top!
          end: aboutST.start + 1200, // Tripled the scrub distance (1200px) so the text stays on screen much longer!
          scrub: true,
          onEnter: () => {
            // Scrolling DOWN from Home -> About. Enable the overlay so the scrub is visible.
            if (overlayRef.current) overlayRef.current.style.display = "block";
          },
          onEnterBack: () => {
            // Scrolling UP from bottom of About -> Top of About. Disable the overlay so it doesn't play backwards!
            if (overlayRef.current) overlayRef.current.style.display = "none";
          }
        }
      });

      // Scrub logic:
      // 0-25%: fade in
      // 25-75%: stay solid
      // 75-100%: fade out
      tl.to(textRef.current, { opacity: 1, duration: 0.25 })
        .to(textRef.current, { opacity: 1, duration: 0.5 })
        .to(textRef.current, { opacity: 0, duration: 0.25 });

      return true;
    };

    // Poll until AboutCrawl's GSAP instance is registered
    const pollInterval = setInterval(() => {
      if (initScrollTrigger()) {
        clearInterval(pollInterval);
        setMounted(true); // Reveal the overlay container
      }
    }, 100);

    return () => {
      clearInterval(pollInterval);
      if (tl) tl.kill();
    };
  }, []);

  const handleSkip = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Notify the app that the user has explicitly skipped the crawl
    window.dispatchEvent(new CustomEvent("crawlSkipped"));
    
    // Find the ScrollTrigger instance that controls the About crawl
    const aboutST = ScrollTrigger.getAll().find(st => st.trigger && st.trigger.id === "about-me");
    
    if (aboutST) {
      // Scroll exactly to the bottom of the pinned crawl! 
      // This will instantly trigger the tech stack ticker animation.
      window.scrollTo({
        top: aboutST.end,
        behavior: "smooth"
      });
    } else {
      // Fallback
      const target = document.getElementById("my-work");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div ref={overlayRef} className={styles.introOverlay} style={{ display: mounted ? "block" : "none" }}>
      <div ref={textRef} className={styles.introText}>
        IN THIS GALAXY NOT VERY.....EH! DOES ANYONE EVEN READ THESE{" "}
        <span className={styles.skipLink} onClick={handleSkip}>
          ANYWAYS
        </span>
        ?
      </div>
    </div>
  );
}
