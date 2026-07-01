'use client';

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import styles from "./ticker.module.css";

export function ScrollingTicker() {
  const [mounted, setMounted] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const track = trackRef.current;
    if (!track) return;

    let tween: gsap.core.Tween | null = null;
    let currentWidth = 0;

    const createAnimation = () => {
      const singleWidth = track.scrollWidth / 2;
      if (singleWidth <= 0 || singleWidth === currentWidth) return;

      currentWidth = singleWidth;
      if (tween) {
        tween.kill();
      }

      // GSAP smooth horizontal scroll
      tween = gsap.to(track, {
        x: -singleWidth,
        duration: 24, // Adjust duration for scroll speed (lower = faster)
        ease: "none",
        repeat: -1,
      });
    };

    // Run initially
    createAnimation();

    // Recalculate on image load or window resize to ensure no gap or jitter
    const resizeObserver = new ResizeObserver(() => {
      createAnimation();
    });
    resizeObserver.observe(track);

    return () => {
      if (tween) tween.kill();
      resizeObserver.disconnect();
    };
  }, [mounted]);

  if (!mounted) {
    // Return matching simple shell layout to prevent mismatched tree hydration
    return (
      <div className={styles.container} suppressHydrationWarning />
    );
  }

  return (
    <div className={styles.container} suppressHydrationWarning>
      <div ref={trackRef} className={styles.track}>
        <Image
          src="/ScrollingName.svg"
          alt="Scrolling Name"
          width={8372}
          height={652}
          className={styles.image}
          priority
        />
        <Image
          src="/ScrollingName.svg"
          alt=""
          width={8372}
          height={652}
          className={styles.image}
          priority
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
