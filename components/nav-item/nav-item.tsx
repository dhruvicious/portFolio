"use client";

import Link from "next/link";
import styles from "./nav-item.module.css";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  external?: boolean;
}

export function NavItem({ href, icon, label, external }: NavItemProps) {
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.navItem}
      >
        <span className={styles.innerContent}>
          <span className={styles.icon}>
            {icon}
          </span>
          <span>{label}</span>
        </span>
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={styles.navItem}
    >
      <span className={styles.innerContent}>
        <span className={styles.icon}>
          {icon}
        </span>
        <span>{label}</span>
      </span>
    </Link>
  );
}
