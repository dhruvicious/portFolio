"use client";

import Image from "next/image";
import styles from "./flip-avatar.module.css";

export function FlipAvatar() {
  return (
    <div className={styles.avatarWrapper}>
      <div className={styles.avatarInner}>
        <div className={styles.frontFace}>
          <Image
            src="/alt.jpg"
            alt="Dhruv Khatri"
            fill
            className={styles.image}
            sizes="(max-width: 640px) 4rem, (max-width: 1024px) 12vw, 16rem"
            priority
          />
        </div>
        <div className={styles.backFace}>
          <Image
            src="/me-new.jpeg"
            alt="Dhruv Khatri"
            fill
            className={styles.image}
            sizes="(max-width: 640px) 4rem, (max-width: 1024px) 12vw, 16rem"
            priority
          />
        </div>
      </div>
    </div>
  );
}
