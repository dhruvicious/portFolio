"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ScrollingTicker } from "@/components/ticker";
import { Navbar } from "@/components/navbar";

interface PolkaDot {
  x: number;
  y: number;
  r: number;
  color: string;
  opacity: number;
  delay: number;
  duration: number;
}

export default function Home() {
  const [dots, setDots] = useState<PolkaDot[]>([]);

  useEffect(() => {
    const generated = Array.from({ length: 30 }).map(() => {
      // Lightness from 15% (dark gray) to 95% (light gray/silver), avoiding pitch black (0-14%)
      const lightness = Math.floor(15 + Math.random() * 80);
      return {
        x: Math.random() * 100,
        y: Math.random() * 100,
        r: 3 + Math.random() * 12,
        color: `hsl(0, 0%, ${lightness}%)`,
        opacity: 0.12 + Math.random() * 0.28,
        delay: Math.random() * -6, // negative delay starts animation mid-cycle immediately
        duration: 4 + Math.random() * 4,
      };
    });
    setDots(generated);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden flex flex-col" suppressHydrationWarning>
      {/* Section 1: Home */}
      <section id="home" className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        {/* Ticker (sandwiched: z-10) */}
        <ScrollingTicker />

        {/* Hero Graphic (on top of ticker: z-20) */}
        <Image
          src="/hero.svg"
          alt="Hero Graphic"
          fill
          priority
          className="object-cover z-20 pointer-events-none"
        />

        {/* Hero Welcome Text */}
        <div className="absolute bottom-24 text-center z-10 select-none text-black/40 dark:text-white/40 font-mono text-sm tracking-widest animate-pulse">
          SCROLL DOWN TO EXPLORE
        </div>
      </section>

      {/* Section 2: About Me */}
      <section id="about-me" className="relative w-full h-screen flex items-center justify-center select-none">
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-black dark:text-white uppercase">
          About Me
        </h2>
      </section>

      {/* Section 3: My Work */}
      <section id="my-work" className="relative w-full h-screen flex items-center justify-center select-none">
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-black dark:text-white uppercase">
          My Work
        </h2>
      </section>

      {/* Section 4: Contact Me */}
      <section id="contact-me" className="relative w-full h-screen flex items-center justify-center select-none pb-24">
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-black dark:text-white uppercase">
          Contact Me
        </h2>
      </section>

      {/* Scrolling Ticker behind Footer to show translucency */}
      <div className="absolute bottom-10 inset-x-0 overflow-hidden z-10 pointer-events-none opacity-50">
        <ScrollingTicker />
      </div>

      {/* Minimal Footer Strip */}
      <footer className="relative w-full py-8 px-6 border-t border-black/5 dark:border-white/5 bg-white/5 dark:bg-black/5 backdrop-blur-sm z-30 select-none pb-24 md:pb-28 overflow-hidden">
        {/* Funky Polka Dots */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none -z-10 opacity-75">
          {dots.map((dot, index) => (
            <circle
              key={index}
              cx={`${dot.x}%`}
              cy={`${dot.y}%`}
              r={dot.r}
              fill={dot.color}
              opacity={dot.opacity}
              className="animate-float-dot"
              style={{
                animationDelay: `${dot.delay}s`,
                animationDuration: `${dot.duration}s`
              }}
            />
          ))}
        </svg>

        <div className="flex items-center justify-center gap-8 text-black/40 dark:text-white/40">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-black/80 dark:hover:text-white/80 transition-colors duration-200"
            aria-label="Twitter (X)"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-black/80 dark:hover:text-white/80 transition-colors duration-200"
            aria-label="GitHub"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2 stroke-linecap-round stroke-linejoin-round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-black/80 dark:hover:text-white/80 transition-colors duration-200"
            aria-label="LinkedIn"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2 stroke-linecap-round stroke-linejoin-round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect x="2" y="9" width="4" height="12" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          </a>
        </div>
      </footer>

      {/* Floating Navigation */}
      <Navbar />
    </div>
  );
}
