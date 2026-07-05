"use client";

import { useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./video-scroll.module.css";

gsap.registerPlugin(ScrollTrigger);

export function VideoScrollSequence() {
  const spacerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  // HUD Refs
  const hudRef = useRef<HTMLDivElement>(null);
  const heapRef = useRef<HTMLSpanElement>(null);
  const entropyRef = useRef<HTMLSpanElement>(null);
  const cafRef = useRef<HTMLSpanElement>(null);
  const worksTargetRef = useRef<HTMLSpanElement>(null);
  const aboutTargetRef = useRef<HTMLSpanElement>(null);

  // Smooth playback state — lives outside React render cycle for performance
  const targetTimeRef = useRef(0);
  const currentTimeRef = useRef(0);
  const isActiveRef = useRef(false);
  const rafRef = useRef<number>(0);
  const durationRef = useRef(1);

  // Smooth interpolation loop — runs independently of scroll
  useEffect(() => {
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      rafRef.current = requestAnimationFrame(tick);

      if (!isActiveRef.current) return;

      const video = videoRef.current;
      if (!video) return;

      currentTimeRef.current = lerp(currentTimeRef.current, targetTimeRef.current, 0.06);

      const dur = durationRef.current;
      currentTimeRef.current = Math.max(0, Math.min(dur, currentTimeRef.current));

      const delta = Math.abs(video.currentTime - currentTimeRef.current);
      if (delta > 0.01) {
        // Now that the video has all keyframes, we can seek every frame (60fps) on all browsers.
        video.currentTime = currentTimeRef.current;
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    // WAKE UP FIX: When returning to the tab, the browser often suspends the video decoder.
    // Playing and immediately pausing it forces the browser to wake the video back up.
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && videoRef.current) {
        videoRef.current.play().then(() => {
          videoRef.current?.pause();
        }).catch(() => {
          // Ignore play interruption errors
        });
      }
    };
    
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useGSAP(
    () => {
      const spacer = spacerRef.current;
      const video = videoRef.current;
      const flash = flashRef.current;
      const overlay = overlayRef.current;
      const track = trackRef.current;
      const thumb = thumbRef.current;
      const hud = hudRef.current;

      if (!spacer || !video || !flash || !overlay || !track || !thumb || !hud) return;

      const setupScroll = () => {
        const dur = video.duration || 1;
        durationRef.current = dur;

        ScrollTrigger.create({
          trigger: spacer,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const p = self.progress;

            // Update Target text based on scroll direction (1 = down, -1 = up)
            if (worksTargetRef.current && aboutTargetRef.current) {
              if (self.direction === 1) {
                worksTargetRef.current.style.opacity = "1";
                aboutTargetRef.current.style.opacity = "0";
              } else if (self.direction === -1) {
                worksTargetRef.current.style.opacity = "0";
                aboutTargetRef.current.style.opacity = "1";
              }
            }

            // Show/hide the fixed overlay
            if (p > 0.001 && p < 0.999) {
              overlay.style.visibility = "visible";
              video.style.opacity = "1";
              track.style.opacity = "1";
              hud.style.opacity = "1";
              isActiveRef.current = true;
              
              // Map the entire scroll progress to the video
              targetTimeRef.current = p * dur;

              // Move the scroll thumb
              const trackHeight = track.offsetHeight;
              const thumbHeight = thumb.offsetHeight;
              const maxTravel = trackHeight - thumbHeight;
              thumb.style.top = `${p * maxTravel}px`;

              // Update Nerd Paradise HUD Stats
              if (heapRef.current) {
                const mem = (performance as any).memory;
                if (mem && mem.usedJSHeapSize) {
                  const mb = mem.usedJSHeapSize / (1024 * 1024);
                  heapRef.current.innerText = mb.toFixed(1);
                } else {
                  heapRef.current.innerText = (120 + Math.random() * 5).toFixed(1);
                }
              }
              
              if (entropyRef.current) entropyRef.current.innerText = "0x" + Math.random().toString(16).substring(2, 8).toUpperCase();
              if (cafRef.current) cafRef.current.innerText = (1.2 + p * 2.8).toFixed(1);

            } else {
              overlay.style.visibility = "hidden";
              isActiveRef.current = false;
            }
          },
          onEnter: () => {
            gsap.fromTo(flash, { opacity: 0 }, { opacity: 1, duration: 0.15, yoyo: true, repeat: 1 });
            overlay.style.background = "transparent";
          },
          onLeave: () => {
            gsap.fromTo(flash, { opacity: 0 }, { opacity: 1, duration: 0.15, yoyo: true, repeat: 1 });
          },
          onEnterBack: () => {
            gsap.fromTo(flash, { opacity: 0 }, { opacity: 1, duration: 0.15, yoyo: true, repeat: 1 });
          },
          onLeaveBack: () => {
            gsap.fromTo(flash, { opacity: 0 }, { opacity: 1, duration: 0.15, yoyo: true, repeat: 1 });
          }
        });
      };

      if (video.readyState >= 2) {
        setupScroll();
      } else {
        video.addEventListener("loadedmetadata", setupScroll);
        video.addEventListener("error", setupScroll);
      }

      return () => {
        video.removeEventListener("loadedmetadata", setupScroll);
        video.removeEventListener("error", setupScroll);
      };
    },
    { scope: spacerRef }
  );

  return (
    <>
      {/* Fixed overlay — sits on top of everything, controlled by scroll */}
      <div ref={overlayRef} className={styles.fixedOverlay}>
        <video
          ref={videoRef}
          className={styles.video}
          src="/video_scrub.mp4"
          playsInline
          muted
          preload="auto"
        />

        {/* Discrete scroll indicator */}
        <div ref={trackRef} className={styles.scrollTrack}>
          <div ref={thumbRef} className={styles.scrollThumb} />
        </div>

        {/* HUD Overlay */}
        <div ref={hudRef} className={styles.hudOverlay}>
          {/* Top Left - System Core */}
          <div className={styles.hudTopLeft}>
            <span className={styles.hudLabel}>Kernel</span>
            <span className={styles.hudValue}>Linux 6.9-arch1-1</span>
            <span className={styles.hudLabel}>Heap Usage</span>
            <span className={styles.hudValue}><span ref={heapRef}>120.4</span> MB</span>
            <span className={styles.hudLabel}>Entropy Hash</span>
            <span className={styles.hudValue} ref={entropyRef}>0x4FA9B2</span>
          </div>

          {/* Top Right - Dev Environment */}
          <div className={styles.hudTopRight}>
            <span className={styles.hudLabel}>Editor</span>
            <span className={styles.hudValue}>Neovim v0.10.0</span>
            <span className={styles.hudLabel}>Indentation</span>
            <span className={styles.hudValue}>2 Spaces</span>
            <span className={styles.hudLabel}>Caffeine : LOC</span>
            <span className={styles.hudValue}><span ref={cafRef}>1.2</span> mg</span>
          </div>

          {/* Bottom Left - Hardware / Network */}
          <div className={styles.hudBottomLeft}>
            <span className={styles.hudLabel}>Switches</span>
            <span className={styles.hudValue} style={{ color: "#a8a29e" }}>Cherry MX Brown</span>
          </div>

          {/* Bottom Right */}
          <div className={styles.hudBottomRight}>
            <span className={styles.hudLabel}>Target</span>
            <div style={{ position: "relative", height: "1.2rem", width: "100px" }}>
              <span 
                className={styles.hudValue} 
                ref={worksTargetRef} 
                style={{ position: "absolute", right: 0, transition: "opacity 0.4s ease", opacity: 1, whiteSpace: "nowrap" }}
              >
                MY WORKS
              </span>
              <span 
                className={styles.hudValue} 
                ref={aboutTargetRef} 
                style={{ position: "absolute", right: 0, transition: "opacity 0.4s ease", opacity: 0, whiteSpace: "nowrap" }}
              >
                ABOUT ME
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Flash layer */}
      <div ref={flashRef} className={styles.flash} />

      {/* Spacer — lives in document flow between About and My Work */}
      <div ref={spacerRef} className={styles.spacer} data-nav-theme="hidden" />
    </>
  );
}
