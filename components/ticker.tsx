"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";

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
    return (
      <div
        className="absolute inset-x-0 top-1/2 -translate-y-1/2
                   h-32 sm:h-48 md:h-64 lg:h-[30vh]
                   overflow-hidden z-10 pointer-events-none"
        suppressHydrationWarning
      />
    );
  }

  return (
    <div
      className="absolute inset-x-0 top-1/2 -translate-y-1/2
                 h-32 sm:h-48 md:h-64 lg:h-[30vh]
                 overflow-hidden z-10 pointer-events-none"
      suppressHydrationWarning
    >
      <div
        ref={trackRef}
        className="flex w-max"
        style={{ willChange: "transform" }}
      >
        <Image
          src="/ScrollingName.svg"
          alt="Scrolling Name"
          width={8372}
          height={652}
          className="h-32 sm:h-48 md:h-64 lg:h-[30vh] w-auto shrink-0"
          priority
        />
        <Image
          src="/ScrollingName.svg"
          alt=""
          width={8372}
          height={652}
          className="h-32 sm:h-48 md:h-64 lg:h-[30vh] w-auto shrink-0"
          priority
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
