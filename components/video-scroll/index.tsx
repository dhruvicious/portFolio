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

  // Smooth playback state — lives outside React render cycle for performance
  const targetTimeRef = useRef(0);
  const currentTimeRef = useRef(0);
  const isActiveRef = useRef(false);
  const rafRef = useRef<number>(0);
  const durationRef = useRef(1);

  // Smooth interpolation loop — runs independently of scroll
  useEffect(() => {
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    let lastSeekTime = 0;

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
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  useGSAP(
    () => {
      const spacer = spacerRef.current;
      const video = videoRef.current;
      const flash = flashRef.current;
      const overlay = overlayRef.current;
      const track = trackRef.current;
      const thumb = thumbRef.current;

      if (!spacer || !video || !flash || !overlay || !track || !thumb) return;

      const setupScroll = () => {
        const dur = video.duration || 1;
        durationRef.current = dur;

        ScrollTrigger.create({
          trigger: spacer,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const p = self.progress;

            // Show/hide the fixed overlay
            if (p > 0.001 && p < 0.999) {
              overlay.style.visibility = "visible";
            } else {
              overlay.style.visibility = "hidden";
            }

            if (p <= 0.04) {
              // ENTER FLASH IN
              const t = p / 0.04;
              flash.style.opacity = String(t);
              video.style.opacity = "0";
              track.style.opacity = "0";
              isActiveRef.current = false;
              overlay.style.background = "#000";
            } else if (p <= 0.08) {
              // ENTER FLASH OUT — reveal video
              const t = (p - 0.04) / 0.04;
              flash.style.opacity = String(1 - t);
              video.style.opacity = "1";
              track.style.opacity = String(t);
              isActiveRef.current = true;
              targetTimeRef.current = 0;
            } else if (p <= 0.92) {
              // SCRUB VIDEO — set TARGET time, the lerp loop handles the rest
              flash.style.opacity = "0";
              video.style.opacity = "1";
              track.style.opacity = "1";
              isActiveRef.current = true;

              const videoProgress = (p - 0.08) / 0.84;
              targetTimeRef.current = videoProgress * dur;

              // Move the scroll thumb
              const trackHeight = track.offsetHeight;
              const thumbHeight = thumb.offsetHeight;
              const maxTravel = trackHeight - thumbHeight;
              thumb.style.top = `${videoProgress * maxTravel}px`;
            } else if (p <= 0.96) {
              // EXIT FLASH IN
              const t = (p - 0.92) / 0.04;
              flash.style.opacity = String(t);
              video.style.opacity = "1";
              targetTimeRef.current = dur;
              track.style.opacity = String(1 - t);
            } else {
              // EXIT FLASH OUT — reveal next section
              const t = (p - 0.96) / 0.04;
              flash.style.opacity = String(1 - t);
              video.style.opacity = "0";
              track.style.opacity = "0";
              isActiveRef.current = false;
              // Remove the black background so it doesn't peek through
              overlay.style.background = "transparent";
            }
          },
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

        {/* Flash layer */}
        <div ref={flashRef} className={styles.flash} />
      </div>

      {/* Spacer — lives in document flow between About and My Work */}
      <div ref={spacerRef} className={styles.spacer} data-nav-theme="dark" />
    </>
  );
}
