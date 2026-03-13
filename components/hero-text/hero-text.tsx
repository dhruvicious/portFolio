"use client";

import { useEffect, useState } from "react";
import { TypeAnimation } from "react-type-animation";
import { AnimatedSvgName } from "@/components/animated-svg-name/animated-svg-name";
import styles from "./hero-text.module.css";

export function HeroText() {
  const [showDesignation, setShowDesignation] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowDesignation(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.heroTextContainer}>
      <TypeAnimation
        sequence={["Hey there! I'm ..."]}
        wrapper="span"
        cursor={false}
        repeat={0}
        className={styles.greetingText}
      />

      <AnimatedSvgName />

      <div
        className={`${styles.designationWrapper} ${showDesignation ? "opacity-100" : "opacity-0"
          }`}
      >
        <TypeAnimation
          sequence={["Developer", 1200, "Engineer", 1200, "Writer", 1200]}
          wrapper="span"
          cursor={false}
          repeat={Infinity}
          className={styles.designationText}
        />
      </div>
    </div>
  );
}
