"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ScrollingTicker } from "@/components/ticker";
import { Navbar } from "@/components/navbar";
import { Loader } from "@/components/loader";
import { AboutCrawl } from "@/components/about-crawl";
import { StarWarsIntroText } from "@/components/starwars-intro";
import { VideoScrollSequence } from "@/components/video-scroll";
import styles from "./page.module.css";

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
  const [loading, setLoading] = useState(true);
  const [dots, setDots] = useState<PolkaDot[]>([]);

  const [aboutParagraphs, setAboutParagraphs] = useState<string[]>([]);

  useEffect(() => {
    fetch('/about.md')
      .then((res) => res.text())
      .then((text) => {
        const paras = text.split('\n\n').map(p => p.trim()).filter(Boolean);
        setAboutParagraphs(paras);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const generated = Array.from({ length: 30 }).map(() => {
      const lightness = Math.floor(15 + Math.random() * 80);
      return {
        x: Math.random() * 100,
        y: Math.random() * 100,
        r: 3 + Math.random() * 12,
        color: `hsl(0, 0%, ${lightness}%)`,
        opacity: 0.12 + Math.random() * 0.28,
        delay: Math.random() * -6,
        duration: 4 + Math.random() * 4,
      };
    });
    setDots(generated);
  }, []);

  useEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [loading]);

  return (
    <>
      {loading && <Loader onComplete={() => setLoading(false)} />}
      
      <StarWarsIntroText />

      <div className={styles.page}>
        {/* Section 1: Home */}
        <section id="home" className={styles.sectionHome} data-nav-theme="light">
          <ScrollingTicker />

          <Image
            src="/hero.png"
            alt="Hero Graphic"
            fill
            priority
            className={styles.heroImage}
          />

          <div className={styles.heroHint}>SCROLL DOWN TO EXPLORE</div>
        </section>

        {/* Section 2: About Me & Video Transition — only mount once content is ready so GSAP
            never measures scrollHeight against an empty paragraphs array */}
        {aboutParagraphs.length > 0 && (
          <>
            <AboutCrawl title="ABOUT ME" paragraphs={aboutParagraphs} />
            <VideoScrollSequence />
          </>
        )}

        {/* Section 3: My Work */}
        <section id="my-work" className={styles.section} data-nav-theme="light">
          <h2 className={styles.sectionHeading}>My Work</h2>
        </section>

        {/* Section 4: Contact Me */}
        <section id="contact-me" className={styles.sectionContact} data-nav-theme="light">
          <h2 className={styles.sectionHeading}>Contact Me</h2>
        </section>

        {/* Scrolling Ticker behind Footer */}
        <div className={styles.footerTickerWrap}>
          <ScrollingTicker />
        </div>

        {/* Footer */}
        <footer className={styles.footer}>
          <svg className={styles.dotsSvg}>
            {dots.map((dot, index) => (
              <circle
                key={index}
                cx={`${dot.x}%`}
                cy={`${dot.y}%`}
                r={dot.r}
                fill={dot.color}
                opacity={dot.opacity}
                className={styles.floatDot}
                style={{
                  animationDelay: `${dot.delay}s`,
                  animationDuration: `${dot.duration}s`,
                }}
              />
            ))}
          </svg>

          <div className={styles.socialRow}>
            <a
              href="https://x.com/bedhruvicious"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="Twitter (X)"
            >
              <svg viewBox="0 0 24 24" className={styles.iconFill}>
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://github.com/dhruvicious"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="GitHub"
            >
              <svg viewBox="0 0 24 24" className={styles.iconStroke}>
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/bedhruvicious/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="LinkedIn"
            >
              <svg viewBox="0 0 24 24" className={styles.iconStroke}>
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
          </div>
        </footer>

        <Navbar />
      </div>
    </>
  );
}
