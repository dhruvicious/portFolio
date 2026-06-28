"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./themeSwitch.module.css";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const toggleTheme = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    const targetTheme = theme === "light" ? "dark" : "light";

    const event = new CustomEvent("theme-sweep-trigger", {
      detail: {
        targetTheme,
        toggle: () => setTheme(targetTheme),
      },
    });
    window.dispatchEvent(event);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 1000); // match sweep animation duration
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={styles.themeSwitch}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 90, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {theme === "light" ? (
            <Sun className={styles.icon} />
          ) : (
            <Moon className={styles.icon} />
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  );
}
