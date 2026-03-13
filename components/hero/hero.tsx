"use client";

import { FlipAvatar } from "@/components/flip-avatar/flip-avatar";
import { HeroText } from "@/components/hero-text/hero-text";
import styles from "./hero.module.css";

export function Hero() {
  return (
    <div className={styles.heroContainer}>
      <div className={styles.heroContent}>
        <FlipAvatar />
        <HeroText />
      </div>
    </div>
  );
}
