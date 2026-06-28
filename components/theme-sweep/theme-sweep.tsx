"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function ThemeSweep() {
  const [sweepState, setSweepState] = useState<{
    isActive: boolean;
    targetTheme: "light" | "dark";
  }>({ isActive: false, targetTheme: "dark" });

  useEffect(() => {
    const handleTrigger = (e: Event) => {
      const customEvent = e as CustomEvent<{
        targetTheme: "light" | "dark";
        toggle: () => void;
      }>;
      
      const { targetTheme, toggle } = customEvent.detail;

      // Start the sweep animation with the target theme colors
      setSweepState({ isActive: true, targetTheme });

      // Trigger the theme toggle exactly at the midpoint of the animation (500ms)
      // when the screen is completely covered by the sweep curtain.
      const toggleTimer = setTimeout(() => {
        toggle();
      }, 500);

      // Reset the component state once the full animation completes (1000ms)
      const endTimer = setTimeout(() => {
        setSweepState((prev) => ({ ...prev, isActive: false }));
      }, 1000);

      return () => {
        clearTimeout(toggleTimer);
        clearTimeout(endTimer);
      };
    };

    window.addEventListener("theme-sweep-trigger", handleTrigger);
    return () => {
      window.removeEventListener("theme-sweep-trigger", handleTrigger);
    };
  }, []);

  if (!sweepState.isActive) return null;

  // Select dynamic premium gradient depending on the target theme
  const gradientClass = sweepState.targetTheme === "dark"
    ? "bg-gradient-to-r from-[#12021c] via-[#24063b] to-[#040108] shadow-[0_0_100px_rgba(36,6,59,0.5)]" // Nightfall cosmic gradient
    : "bg-gradient-to-r from-[#ffc4dc] via-[#ffe5d9] to-[#b3e5fc] shadow-[0_0_100px_rgba(255,196,220,0.5)]"; // Sunrise sky gradient

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
      <motion.div
        initial={{ clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)" }}
        animate={{
          clipPath: [
            "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",          // Start off-screen (left)
            "polygon(0% 0%, 120% 0%, 100% 100%, 0% 100%)",       // Screen fully covered (slanted sweep)
            "polygon(120% 0%, 120% 0%, 120% 100%, 120% 100%)"    // Reveal screen (right)
          ]
        }}
        transition={{
          duration: 1.0,
          ease: [0.76, 0, 0.24, 1], // Premium cubic-bezier transition
          times: [0, 0.5, 1],
        }}
        className={`w-full h-full pointer-events-auto ${gradientClass}`}
      />
    </div>
  );
}
