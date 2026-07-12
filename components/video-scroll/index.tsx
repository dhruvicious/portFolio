"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RubiksCube } from "@/components/rubiks-cube";
import styles from "./video-scroll.module.css";

export function ShaderBackground({ scrollProgressRef }: { scrollProgressRef: React.MutableRefObject<number> }) {
  const { viewport } = useThree();
  const materialRef = useRef<any>(null);

  const uniforms = useMemo(() => ({
    uProgress: { value: 0 },
    uTime: { value: 0 }
  }), []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      // Smoothly interpolate the progress value so it feels buttery
      materialRef.current.uniforms.uProgress.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uProgress.value,
        scrollProgressRef.current,
        0.05
      );
    }
  });

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    uniform float uProgress;
    varying vec2 vUv;

    // Noise functions
    float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
    float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
                   mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
    }
    
    // Fractal Brownian Motion for complex flowing clouds
    float fbm(vec2 p) {
        float f = 0.0;
        float w = 0.5;
        for (int i = 0; i < 4; i++) {
            f += w * noise(p);
            p *= 2.0;
            w *= 0.5;
        }
        return f;
    }

    void main() {
      vec2 uv = vUv;
      float t = uTime * 0.15 + uProgress * 2.0;

      // 1. Define the vertical ribs (Fluted/Reeded Glass)
      float ribs = 120.0; // Number of vertical glass tubes
      
      // Make the bars slide horizontally based on scroll progress!
      float barShift = uProgress * 2.5; 
      float ribLocal = fract((uv.x + barShift) * ribs); // 0.0 to 1.0 inside each tube
      
      // Calculate the normal of the cylindrical rib 
      float nx = ribLocal * 2.0 - 1.0; 
      float nz = sqrt(max(0.0, 1.0 - nx * nx)); 
      
      // Refraction: bending the sample UV based on the glass curvature
      float refractionIndex = 0.015;
      vec2 refractedUv = uv + vec2(nx * refractionIndex, 0.0);
      
      // 2. Generate the background light field (Abstract blue/white glowing waves)
      vec2 warpUv = refractedUv;
      warpUv.x += fbm(refractedUv * 2.0 + vec2(0.0, t * 0.2)) * 0.5;
      warpUv.y += fbm(refractedUv * 1.5 + vec2(t * 0.3, 0.0)) * 0.5;
      
      // Calculate light intensity
      float lightBase = fbm(warpUv * 3.0 - vec2(t * 0.1, t * 0.4));
      float light = smoothstep(0.2, 0.8, lightBase);
      
      // Add a sweeping diagonal wave of light
      float diagonal = smoothstep(0.3, 0.7, noise(vec2(refractedUv.x * 2.0 + refractedUv.y, t * 0.2) * 3.0));
      light = max(light, diagonal * 0.9);
      
      // 3. Colorize (Deep Blacks -> Rich Blues -> Electric Icy Blue/White)
      vec3 colBlack = vec3(0.0, 0.0, 0.02);
      vec3 colBlue = vec3(0.02, 0.15, 0.6);
      vec3 colBright = vec3(0.5, 0.8, 1.0);
      
      vec3 bgColor;
      if (light < 0.5) {
          bgColor = mix(colBlack, colBlue, light * 2.0);
      } else {
          bgColor = mix(colBlue, colBright, (light - 0.5) * 2.0);
      }
      
      // 4. Glass lighting effects (Specular highlights & edge shadows)
      // Darken the deep crevices between the glass tubes
      float edgeShadow = smoothstep(0.0, 0.15, ribLocal) * smoothstep(1.0, 0.85, ribLocal);
      
      // Specular highlight: simulate a directional light bouncing off the glass curves
      vec3 lightDir = normalize(vec3(0.6, 0.4, 1.0));
      vec3 normal = vec3(nx, 0.0, nz);
      float specular = pow(max(0.0, dot(normal, lightDir)), 12.0);
      
      vec3 finalColor = bgColor * (0.3 + 0.7 * edgeShadow);
      
      // Add specular reflection where the background light is bright enough
      finalColor += vec3(0.8, 0.95, 1.0) * specular * light * 1.2;
      
      // 5. Heavy Film Grain (Trademark aesthetic of the reference image)
      float grain = (hash(uv * 300.0 + t) - 0.5) * 0.18;
      finalColor += grain;
      
      // Darken edges slightly (Vignette)
      float dist = length(uv - 0.5);
      finalColor *= smoothstep(0.8, 0.2, dist);
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial 
        ref={materialRef}
        vertexShader={vertexShader} 
        fragmentShader={fragmentShader} 
        uniforms={uniforms}
      />
    </mesh>
  );
}

gsap.registerPlugin(ScrollTrigger);

export function VideoScrollSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  // HUD Refs
  const hudRef = useRef<HTMLDivElement>(null);
  const heapRef = useRef<HTMLSpanElement>(null);
  const entropyRef = useRef<HTMLSpanElement>(null);
  const cafRef = useRef<HTMLSpanElement>(null);
  const worksTargetRef = useRef<HTMLSpanElement>(null);
  const aboutTargetRef = useRef<HTMLSpanElement>(null);

  // Animation Refs
  const titleRef = useRef<HTMLDivElement>(null);
  const titleInnerRef = useRef<HTMLDivElement>(null);
  const titleCharsRef = useRef<(HTMLSpanElement | null)[]>([]);
  
  const setARef = useRef<HTMLDivElement>(null);
  const setAItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const setATexts = ["\"POWERED BY COFFEE\"", "\"FUELED BY CURIOSITY\"", "\"DRIVEN BY PASSION\"", "\"BUILT WITH CODE\""];
  
  const processTitleRef = useRef<HTMLDivElement>(null);
  const processInnerRef = useRef<HTMLSpanElement>(null);
  const loopCircleRef = useRef<HTMLDivElement>(null);
  const processCharsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const processCharWidthsRef = useRef<number[]>([]);
  
  const setBRef = useRef<HTMLDivElement>(null);
  const setBItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const setBTexts = ["I THINK", "I CODE", "I BREAK", "I FIX"];

  // Easter Egg State
  const [isCubeExpanded, setIsCubeExpanded] = useState(false);
  const scrollProgressRef = useRef(0);

  useEffect(() => {
    if (isCubeExpanded) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isCubeExpanded]);

  useGSAP(
    () => {
      const container = containerRef.current;
      const track = trackRef.current;
      const thumb = thumbRef.current;
      const hud = hudRef.current;

      if (!container || !track || !thumb || !hud) return;

      hud.style.opacity = "1";
      track.style.opacity = "1";

      ScrollTrigger.create({
        trigger: container,
        pin: true,
        start: "top top", 
        end: "+=600%", // Long pin for complex sequence
        onUpdate: (self) => {
          const p = self.progress;
          scrollProgressRef.current = p;

          // HUD Updates
          if (worksTargetRef.current && aboutTargetRef.current) {
            if (self.direction === 1) {
              worksTargetRef.current.style.opacity = "1";
              aboutTargetRef.current.style.opacity = "0";
            } else if (self.direction === -1) {
              worksTargetRef.current.style.opacity = "0";
              aboutTargetRef.current.style.opacity = "1";
            }
          }

          const maxTravel = track.offsetHeight - thumb.offsetHeight;
          thumb.style.top = `${p * maxTravel}px`;

          if (heapRef.current) {
            const mem = (performance as any).memory;
            if (mem && mem.usedJSHeapSize) {
              heapRef.current.innerText = (mem.usedJSHeapSize / (1024 * 1024)).toFixed(1);
            } else {
              heapRef.current.innerText = (120 + Math.random() * 5).toFixed(1);
            }
          }
          if (entropyRef.current) entropyRef.current.innerText = "0x" + Math.random().toString(16).substring(2, 8).toUpperCase();
          if (cafRef.current) cafRef.current.innerText = (1.2 + p * 2.8).toFixed(1);

          // ─── PHASE 1: Snail Title Stretch (0.0 - 0.2) ───
          if (p < 0.2 && titleRef.current && titleInnerRef.current) {
            titleRef.current.style.display = "block";
            const localP = p / 0.2; 
            
            const numChars = titleCharsRef.current.length;
            
            titleCharsRef.current.forEach((charEl, i) => {
              if (!charEl) return;
              
              if (localP < 0.2) {
                 // 1. Staggered Float Up
                 titleInnerRef.current!.style.top = "auto";
                 titleInnerRef.current!.style.bottom = "0";
                 charEl.style.transformOrigin = "bottom center";
                 
                 const floatP = localP / 0.2; 
                 const staggerStart = (i / numChars) * 0.5;
                 
                 let charP = 0;
                 if (floatP >= staggerStart) {
                    charP = Math.min(1.0, (floatP - staggerStart) / 0.5);
                 }
                 
                 const easeOut = 1 - Math.pow(1 - charP, 3);
                 const yOffset = (1 - easeOut) * 100; // 100vh down to 0
                 
                 charEl.style.transform = `translateY(${yOffset}vh) scaleY(1)`;
                 charEl.style.opacity = easeOut.toString();
              }
              else if (localP < 0.5) {
                 // 2. Stretch to fullscreen
                 titleInnerRef.current!.style.top = "auto";
                 titleInnerRef.current!.style.bottom = "0";
                 charEl.style.transformOrigin = "bottom center";
                 
                 const stretchP = (localP - 0.2) / 0.3;
                 // Smooth easing
                 const easeInOut = stretchP < 0.5 ? 2 * stretchP * stretchP : 1 - Math.pow(-2 * stretchP + 2, 2) / 2;
                 
                 // 100vh / 12vh font size ≈ 8.333 scale needed to hit top of screen
                 const currentScale = 1.0 + easeInOut * 7.333; 
                 charEl.style.transform = `translateY(0vh) scaleY(${currentScale})`;
                 charEl.style.opacity = "1";
              }
              else if (localP < 0.8) {
                 // 3. Compress to top
                 titleInnerRef.current!.style.top = "0";
                 titleInnerRef.current!.style.bottom = "auto";
                 charEl.style.transformOrigin = "top center";
                 
                 const compP = (localP - 0.5) / 0.3;
                 const easeInOut = compP < 0.5 ? 2 * compP * compP : 1 - Math.pow(-2 * compP + 2, 2) / 2;
                 
                 const currentScale = 8.333 - easeInOut * 7.333; 
                 charEl.style.transform = `translateY(0vh) scaleY(${currentScale})`;
                 charEl.style.opacity = "1";
              }
              else {
                 // 4. Staggered float away to disappear
                 titleInnerRef.current!.style.top = "0";
                 titleInnerRef.current!.style.bottom = "auto";
                 charEl.style.transformOrigin = "top center";
                 
                 const floatOutP = (localP - 0.8) / 0.2; 
                 const staggerStart = (i / numChars) * 0.5;
                 
                 let charP = 0;
                 if (floatOutP >= staggerStart) {
                    charP = Math.min(1.0, (floatOutP - staggerStart) / 0.5);
                 }
                 
                 // accelerating upwards away
                 const easeIn = charP * charP * charP;
                 const yOffset = -(easeIn * 100); // 0vh to -100vh
                 
                 charEl.style.transform = `translateY(${yOffset}vh) scaleY(1)`;
                 charEl.style.opacity = (1 - charP).toString();
              }
            });
          } else if (titleRef.current) {
            titleRef.current.style.display = "none";
          }

          // ─── PHASE 2: Blurred Scroll (0.2 - 0.5) ───
          if (p >= 0.2 && p < 0.5 && setARef.current) {
            setARef.current.style.display = "flex";
            const localP = (p - 0.2) / 0.3;
            
            const yOffset = (0.5 - localP) * 150; // Scroll through 150vh
            setARef.current.style.transform = `translate(-50%, calc(-50% + ${yOffset}vh))`;
            
            const centerY = window.innerHeight / 2;
            setAItemsRef.current.forEach(item => {
              if (!item) return;
              const rect = item.getBoundingClientRect();
              const itemCenter = rect.top + rect.height / 2;
              const dist = Math.abs(itemCenter - centerY);
              
              // Blur based on distance from center of screen
              const blurAmount = Math.min(20, (dist / (window.innerHeight * 0.25)) * 20);
              const op = Math.max(0.1, 1.0 - (dist / (window.innerHeight * 0.25)));
              
              item.style.filter = `blur(${blurAmount}px)`;
              item.style.opacity = op.toString();
              item.style.transform = `scale(${1.0 + (1.0 - op) * 0.2})`; // Slightly scale down blurred items
            });
          } else if (setARef.current) {
            setARef.current.style.display = "none";
          }

          // ─── PHASE 3: The Process Morph (0.5 - 0.75) ───
          if (p >= 0.5 && p < 0.75 && processTitleRef.current && processInnerRef.current) {
            processTitleRef.current.style.display = "flex";
            const localP = (p - 0.5) / 0.25;
            
            const el = processInnerRef.current;
            
            // Measure true rendered dimensions to ensure perfectly accurate scaling
            if (!processCharWidthsRef.current[0]) {
               const rect = el.getBoundingClientRect();
               processCharWidthsRef.current[0] = rect.width || window.innerWidth * 0.5;
               processCharWidthsRef.current[1] = rect.height || window.innerHeight * 0.1;
            }
            
            const W = processCharWidthsRef.current[0];
            const H = processCharWidthsRef.current[1];
            const SW = window.innerWidth;
            const SH = window.innerHeight;
            
            // Fit exactly to the viewport bounds
            const maxScaleX = SW / W;
            const maxScaleY = SH / H;
            
            el.style.transformOrigin = "center center";
            
            if (localP < 0.2) {
               // 1. Appear in the middle (fade in + slight scale up)
               const pPhase = localP / 0.2;
               const easeOut = 1 - Math.pow(1 - pPhase, 3);
               
               el.style.transform = `scale(${0.8 + easeOut * 0.2})`; // 0.8 to 1.0
               el.style.opacity = easeOut.toString();
               
               if (loopCircleRef.current) loopCircleRef.current.style.opacity = "0";
            }
            else if (localP < 0.5) {
               // 2. Morph OUT to fill screen
               const pPhase = (localP - 0.2) / 0.3;
               const easeInOut = pPhase < 0.5 ? 2 * pPhase * pPhase : 1 - Math.pow(-2 * pPhase + 2, 2) / 2;
               
               const currentScaleX = 1.0 + easeInOut * (maxScaleX - 1.0);
               const currentScaleY = 1.0 + easeInOut * (maxScaleY - 1.0);
               
               el.style.transform = `scale(${currentScaleX}, ${currentScaleY})`;
               el.style.opacity = "1";
               
               if (loopCircleRef.current) loopCircleRef.current.style.opacity = "0";
            }
            else if (localP < 0.75) {
               // 3. Morph BACK to normal
               const pPhase = (localP - 0.5) / 0.25;
               const easeInOut = pPhase < 0.5 ? 2 * pPhase * pPhase : 1 - Math.pow(-2 * pPhase + 2, 2) / 2;
               
               const currentScaleX = maxScaleX - easeInOut * (maxScaleX - 1.0);
               const currentScaleY = maxScaleY - easeInOut * (maxScaleY - 1.0);
               
               el.style.transform = `scale(${currentScaleX}, ${currentScaleY})`;
               el.style.opacity = "1";
               
               if (loopCircleRef.current) loopCircleRef.current.style.opacity = "0";
            }
            else {
               // 4. Text disappears, Loop Circle appears and rotates!
               const pPhase = (localP - 0.75) / 0.25;
               
               // Text fades out quickly
               const textFade = Math.max(0, 1.0 - pPhase * 3.0);
               el.style.transform = `scale(${1.0 - pPhase * 0.5})`; 
               el.style.opacity = textFade.toString();
               
               if (loopCircleRef.current) {
                  // Circle fades in, rotates, then fades out at the very end
                  const circleFadeIn = Math.min(1.0, pPhase * 3.0);
                  const circleFadeOut = Math.max(0, 1.0 - (pPhase - 0.8) * 5.0); // fades out in last 20%
                  
                  const opacity = pPhase > 0.8 ? circleFadeOut : circleFadeIn;
                  
                  // Rotate slowly as pPhase goes 0->1 (half rotation = 180deg)
                  loopCircleRef.current.style.opacity = opacity.toString();
                  loopCircleRef.current.style.transform = `scale(${0.5 + pPhase * 0.8}) rotate(${pPhase * 180}deg)`;
               }
            }
          } else if (processTitleRef.current) {
            processTitleRef.current.style.display = "none";
          }

          // ─── PHASE 4: Sequential Reveal (0.75 - 1.0) ───
          if (p >= 0.75 && setBRef.current) {
            setBRef.current.style.display = "flex";
            const localP = (p - 0.75) / 0.25;
            
            const step = 1.0 / setBItemsRef.current.length;
            setBItemsRef.current.forEach((item, i) => {
              if (!item) return;
              const start = i * step;
              if (localP > start) {
                // Quick pop-in calculation
                const pItem = Math.min(1.0, (localP - start) / (step * 0.4));
                item.style.opacity = pItem.toString();
                item.style.transform = `scale(${0.8 + pItem * 0.2})`;
                item.style.filter = `blur(${Math.max(0, 10 - pItem * 10)}px)`;
              } else {
                item.style.opacity = "0";
                item.style.transform = "scale(0.8)";
                item.style.filter = "blur(10px)";
              }
            });
          } else if (setBRef.current) {
            setBRef.current.style.display = "none";
          }
        }
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className={styles.relativeContainer} data-nav-theme="dark">
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }}>
        <Canvas orthographic camera={{ position: [0, 0, 1], zoom: 1 }} dpr={[1, 1.5]}>
          <ShaderBackground scrollProgressRef={scrollProgressRef} />
        </Canvas>
      </div>

      {/* PHASE 1: Snail Title */}
      <div
        ref={titleRef}
        style={{
          position: "absolute",
          inset: 0,
          display: "none",
          zIndex: 2,
          pointerEvents: "none"
        }}
      >
        <div ref={titleInnerRef} style={{ position: "absolute", bottom: 0, width: "100%", textAlign: "center" }}>
          {"THE WORKFLOW".split("").map((char, i) => (
            <span
              key={i}
              ref={el => { titleCharsRef.current[i] = el; }}
              style={{
                display: "inline-block",
                color: "white",
                fontSize: "12vh",
                lineHeight: "12vh",
                height: "12vh",
                fontWeight: 900,
                textShadow: "0 0 40px rgba(0,0,0,0.9)",
                transformOrigin: "bottom center",
                willChange: "transform, opacity",
                whiteSpace: "pre"
              }}
            >
              {char}
            </span>
          ))}
        </div>
      </div>

      {/* PHASE 2: Blurred Scroll */}
      <div
        ref={setARef}
        style={{
          position: "absolute",
          top: "50%", left: "50%",
          display: "none",
          flexDirection: "column",
          gap: "15vh",
          zIndex: 2,
          pointerEvents: "none",
        }}
      >
        {setATexts.map((text, i) => (
          <div
            key={i}
            ref={el => { setAItemsRef.current[i] = el; }}
            style={{
              fontSize: "clamp(2rem, 6vw, 5rem)",
              fontWeight: 900,
              color: "white",
              whiteSpace: "nowrap",
              textAlign: "center",
              textShadow: "0 4px 30px rgba(0,0,0,0.9)",
              willChange: "filter, opacity, transform"
            }}
          >
            {text}
          </div>
        ))}
      </div>

      {/* PHASE 3: The Loop Morph */}
      <div
        ref={processTitleRef}
        style={{
          position: "absolute",
          inset: 0,
          display: "none",
          zIndex: 2,
          pointerEvents: "none",
          alignItems: "center", // Vertical center
          justifyContent: "center" // Horizontal center
        }}
      >
        <span
          ref={processInnerRef}
          style={{
            display: "inline-block",
            color: "white",
            fontSize: "12vh",
            lineHeight: "12vh",
            fontWeight: 900,
            willChange: "transform, opacity",
            whiteSpace: "nowrap",
            textTransform: "uppercase",
            textShadow: "0 0 40px rgba(0,0,0,0.8)",
            position: "relative",
            zIndex: 2
          }}
        >
          THE LOOP
        </span>
        
        {/* The Rotating Loop Circle (Text Ring) */}
        <div
          ref={loopCircleRef}
          style={{
             position: "absolute",
             width: "40vh",
             height: "40vh",
             opacity: 0,
             willChange: "transform, opacity",
             zIndex: 1
          }}
        >
          <svg viewBox="0 0 200 200" style={{ width: "100%", height: "100%", overflow: "visible" }}>
            <path id="loopPath" d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0" fill="none" />
            <text fill="white" fontSize="16.5" fontWeight="900" letterSpacing="2" style={{ textShadow: "0 0 20px rgba(0,0,0,0.8)" }}>
              <textPath href="#loopPath" startOffset="0%" textLength="471" lengthAdjust="spacing">
                THE LOOP • THE LOOP • THE LOOP • THE LOOP • 
              </textPath>
            </text>
          </svg>
        </div>
      </div>

      {/* PHASE 4: Sequential Reveal */}
      <div
        ref={setBRef}
        style={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          display: "none",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
          width: "90vw",
          gap: "1.5vw",
          zIndex: 2,
        }}
      >
        {setBTexts.map((text, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "1.5vw" }}>
            <div
              ref={el => { setBItemsRef.current[i] = el; }}
              style={{
                fontSize: "clamp(1.5rem, 4vw, 4rem)",
                fontWeight: 900,
                color: "white",
                textShadow: "0 0 20px rgba(0,0,0,0.9)",
                willChange: "opacity, transform, filter"
              }}
            >
              {text}
            </div>
            {i < setBTexts.length - 1 && (
              <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "clamp(1.5rem, 4vw, 4rem)" }}>•</span>
            )}
          </div>
        ))}
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
  );
}
