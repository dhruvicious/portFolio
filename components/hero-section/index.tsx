"use client";

import Image from "next/image";
import { ScrollingTicker } from "@/components/ticker";
import styles from "./hero-section.module.css";

export function HeroSection() {
  return (
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
  );
}
