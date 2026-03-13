"use client";

import Link from "next/link";
import { limelight } from "@/lib/fonts";
import styles from "./logo.module.css";

export function Logo() {
  return (
    <div className={`${styles.logoContainer} ${limelight.className}`}>
      <Link href="/" className={styles.logoLink}>
        {/* Opening Bracket: Subtle syntax color */}
        <span className={styles.bracket}>{"<"}</span>

        {/* The Name: Bold and crisp */}
        <span className={styles.name}>bedhruvicious</span>

        {/* Self-closing Slash & Bracket */}
        <span className={styles.bracket}>{"/>"}</span>

        {/* Optional: A subtle glow behind the text on hover for that "IDE" feel */}
        <div className={styles.glow} />
      </Link>
    </div>
  );
}
