"use client";

import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShaderBackground } from "@/components/video-scroll";
import { useInView } from "@/lib/use-in-view";

export function GlobalBackgroundWrapper({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef<number>(0);
  const { ref: canvasGateRef, isInView: isCanvasVisible } = useInView({ rootMargin: "400px 0px" });

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        scrollProgressRef.current = self.progress;
      }
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} style={{ position: "relative", backgroundColor: "#000" }}>
      <div 
        ref={canvasGateRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          pointerEvents: "none",
          clipPath: "inset(0)"
        }}
      >
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh" }}>
          {isCanvasVisible && (
            <Canvas orthographic camera={{ position: [0, 0, 1], zoom: 1 }} dpr={[1, 1.5]}>
              <ShaderBackground scrollProgressRef={scrollProgressRef} />
            </Canvas>
          )}
        </div>
      </div>
      <div style={{ position: "relative", zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}
