"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

export default function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="
        group relative flex items-center justify-center
        /* Fill parent container (matches the w-9 h-9 in NavBar) */
        w-full h-full
        
        /* Shape consistency */
        rounded-full
        
        /* Visual consistency: Transparent base, subtle hover like NavItems */
        bg-transparent
        hover:bg-black/5 dark:hover:bg-white/10
        
        /* Text Colors matching NavBar */
        text-neutral-600 dark:text-neutral-400
        hover:text-black dark:hover:text-white
        
        transition-colors duration-300 ease-out
        focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500/50
      "
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
            <Sun className="h-[1.2rem] w-[1.2rem] transition-colors duration-500 ease-in-out" />
          ) : (
            <Moon className="h-[1.2rem] w-[1.2rem] transition-colors duration-500 ease-in-out" />
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  );
}
