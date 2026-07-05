"use client";

import styles from "./work-section.module.css";

export function WorkSection() {
  return (
    <section id="my-work" className={styles.scrollContainer} data-nav-theme="hidden">
      {/* The navbar checks the bottom of the screen. 
          By placing this trigger 100vh down, the navbar turns 'light' 
          exactly when the top of the My Work section hits the top of the screen! */}
      <div style={{ position: "absolute", top: "100vh", bottom: 0, width: "100%", pointerEvents: "none" }} data-nav-theme="light" />

      <div className={styles.stickySection}>
        <h2 className={styles.sectionHeading}>My Work</h2>
      </div>
    </section>
  );
}
