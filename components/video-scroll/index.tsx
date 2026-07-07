"use client";

import { useRef, useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RubiksCube } from "@/components/rubiks-cube";
import styles from "./video-scroll.module.css";

function VideoBackground({ videoRef }: { videoRef: React.RefObject<HTMLVideoElement | null> }) {
  const { viewport } = useThree();
  const [texture, setTexture] = useState<THREE.VideoTexture | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      const tex = new THREE.VideoTexture(videoRef.current);
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.colorSpace = THREE.SRGBColorSpace;
      setTexture(tex);
    }
  }, [videoRef]);

  useFrame(() => {
    if (texture) {
      texture.needsUpdate = true;
    }
  });

  if (!texture) return null;

  const videoAspect = videoRef.current && videoRef.current.videoWidth 
    ? videoRef.current.videoWidth / videoRef.current.videoHeight 
    : 16 / 9;

  const viewportAspect = viewport.width / viewport.height;
  
  let scaleX = viewport.width;
  let scaleY = viewport.height;
  
  if (viewportAspect > videoAspect) {
    scaleY = viewport.width / videoAspect;
  } else {
    scaleX = viewport.height * videoAspect;
  }

  return (
    <mesh scale={[scaleX, scaleY, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} toneMapped={false} depthTest={false} />
    </mesh>
  );
}

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

  // Easter Egg State
  const [isCubeExpanded, setIsCubeExpanded] = useState(false);
  const scrollProgressRef = useRef(0);

  // Disable page scrolling when the Rubik's cube is expanded in focus
  useEffect(() => {
    if (isCubeExpanded) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isCubeExpanded]);

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

    // WAKE UP FIX: When returning to the tab or refocusing the window, the browser often suspends the video decoder.
    // Playing and immediately pausing it forces the browser to wake the video back up.
    const wakeUpVideo = () => {
      if (videoRef.current) {
        // Only attempt to wake up if the document is actually visible
        if (document.visibilityState === "visible") {
          videoRef.current.play().then(() => {
            videoRef.current?.pause();
          }).catch(() => {
            // Ignore play interruption errors
          });
        }
      }
    };
    
    document.addEventListener("visibilitychange", wakeUpVideo);
    window.addEventListener("focus", wakeUpVideo);

    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener("visibilitychange", wakeUpVideo);
      window.removeEventListener("focus", wakeUpVideo);
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

              // Update progress for WebGL easter egg
              scrollProgressRef.current = p;

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
          style={{ display: "none" }} // Hidden, used only as WebGL texture source
        />

        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }}>
          <Canvas orthographic camera={{ position: [0, 0, 1], zoom: 1 }}>
            <VideoBackground videoRef={videoRef} />
          </Canvas>
        </div>

        {/* Discrete scroll indicator */}
        <div ref={trackRef} className={styles.scrollTrack} style={{ zIndex: 10 }}>
          <div ref={thumbRef} className={styles.scrollThumb} />
        </div>

        {/* HUD Overlay */}
        <div 
          ref={hudRef} 
          className={styles.hudOverlay} 
          style={{ 
            zIndex: 10,
            opacity: isCubeExpanded ? 0 : 1,
            pointerEvents: isCubeExpanded ? "none" : "auto",
            transition: "opacity 0.4s ease"
          }}
        >
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

        {/* Easter Egg: The Actual Interactive Cube */}
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 9999,
            pointerEvents: "none",
            backgroundColor: isCubeExpanded ? "rgba(0, 0, 0, 0.6)" : "transparent",
            backdropFilter: isCubeExpanded ? "blur(12px)" : "none",
            WebkitBackdropFilter: isCubeExpanded ? "blur(12px)" : "none",
            transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div style={{ width: "100%", height: "100%", pointerEvents: "auto" }}>
            <RubiksCube 
              transparent={true} 
              fullscreen={true} 
              interactive={isCubeExpanded}
              isExpanded={isCubeExpanded}
              onExpand={() => setIsCubeExpanded(true)}
              onClose={() => setIsCubeExpanded(false)}
              scrollProgress={scrollProgressRef}
            />
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
