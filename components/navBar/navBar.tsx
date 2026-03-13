"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, FolderGit2, Linkedin, Menu, PenSquare } from "lucide-react";
import { Logo } from "@/components/logo/logo";
import { ModeToggle } from "@/components/themeSwitch/themeSwitch";
import { NavItem } from "@/components/nav-item/nav-item";
import { siteConfig } from "@/config/site";
import styles from "./navBar.module.css";

const iconMap: Record<string, React.ReactNode> = {
  PenSquare: <PenSquare size={18} />,
  FileText: <FileText size={18} />,
  FolderGit2: <FolderGit2 size={18} />,
  Linkedin: <Linkedin size={18} />,
};

const iosSpring = {
  type: "spring",
  stiffness: 300,
  damping: 30,
} as const;

export function NavBar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleHoverStart = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsExpanded(true);
  };

  const handleHoverEnd = () => {
    timeoutRef.current = setTimeout(() => {
      setIsExpanded(false);
    }, 500);
  };

  return (
    <div className={styles.navBarWrapper}>
      <motion.nav
        layout
        transition={iosSpring}
        initial={false}
        onHoverStart={handleHoverStart}
        onHoverEnd={handleHoverEnd}
        onClick={() => {
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          setIsExpanded(!isExpanded);
        }}
        className={styles.navBar}
      >
        {/* LEFT: Logo */}
        <motion.div layout="position" className={styles.logoContainer}>
          <div className={styles.logoScale}>
            <Logo />
          </div>
        </motion.div>

        {/* MIDDLE: Content */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, width: 0, scale: 0.9 }}
              animate={{ opacity: 1, width: "auto", scale: 1 }}
              exit={{ opacity: 0, width: 0, scale: 0.9 }}
              transition={{
                opacity: { duration: 0.2 },
                width: iosSpring,
                scale: { duration: 0.2 },
              }}
              onClick={(e) => e.stopPropagation()}
              className={styles.menuContent}
            >
              <div className={styles.menuInner}>
                {/* Separator */}
                <div className={styles.separator} />

                <div className={styles.linkGroup}>
                  {siteConfig.navLinks.map((link) => (
                    <NavItem
                      key={link.label}
                      href={link.href}
                      icon={iconMap[link.iconType]}
                      label={link.label}
                      external={link.external}
                    />
                  ))}
                </div>

                {/* Separator */}
                <div className={styles.separator} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* RIGHT: Toggle Container */}
        <motion.div
          layout="position"
          className={styles.toggleWrapper}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.toggleButton}>
            <AnimatePresence mode="wait" initial={false}>
              {isExpanded ? (
                <motion.div
                  key="theme-toggle"
                  initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                  className={styles.iconWrapper}
                >
                  <ModeToggle />
                </motion.div>
              ) : (
                <motion.div
                  key="menu-icon"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                  className={styles.menuIcon}
                >
                  <Menu size={20} strokeWidth={2.5} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.nav>
    </div>
  );
}

