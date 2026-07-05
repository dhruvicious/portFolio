"use client";

import styles from "./work-section.module.css";

export function WorkSection() {
  return (
    <section id="my-work" className={styles.scrollContainer} data-nav-theme="light">
      <div className={styles.stickySection}>
        <h2 className={styles.sectionHeading}>My Work</h2>
      </div>
    </section>
  );
}
