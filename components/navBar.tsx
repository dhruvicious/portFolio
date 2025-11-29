"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, FolderGit2, Menu, PenSquare } from "lucide-react";
import Logo from "@/components/logo";
import ModeToggle from "@/components/themeSwitch";

const iosSpring = {
  type: "spring",
  stiffness: 300,
  damping: 30,
} as const;

export default function NavBar() {
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
    <div className="fixed bottom-6 w-full z-50 flex justify-center px-4">
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
        className="
            relative flex items-center gap-2 p-2
            bg-white/80 dark:bg-[#121212]/80 
            backdrop-blur-xl backdrop-saturate-150
            ring-1 ring-black/5 dark:ring-white/10
            shadow-[0px_4px_8px_-2px_rgba(0,0,0,0.1),0px_8px_20px_-2px_rgba(0,0,0,0.1)] 
            dark:shadow-[0px_4px_20px_-2px_rgba(0,0,0,0.5)]
            cursor-pointer group rounded-full
            h-16 transform-gpu
        "
      >
        {/* LEFT: Logo */}
        <motion.div layout="position" className="pl-3 pr-1 z-10">
          <div className="scale-100 hover:scale-105 transition-transform duration-300">
            <Logo />
          </div>
        </motion.div>

        {/* MIDDLE: Content */}
        {/* Removed mode="popLayout" to allow smooth width shrinking */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, width: 0, scale: 0.9 }}
              animate={{ opacity: 1, width: "auto", scale: 1 }}
              exit={{ opacity: 0, width: 0, scale: 0.9 }}
              transition={{
                opacity: { duration: 0.2 },
                width: iosSpring, // Match the parent spring for smooth shrink
                scale: { duration: 0.2 },
              }}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center overflow-hidden"
            >
              <div className="flex items-center whitespace-nowrap">
                {/* Separator */}
                <div className="w-px h-6 mx-2 bg-neutral-200 dark:bg-neutral-800" />

                <div className="flex items-center gap-1">
                  <NavItem
                    href="/projects"
                    icon={<FolderGit2 size={18} />}
                    label="Projects"
                  />
                  <NavItem
                    href="https://writes.bedhruvicious.co.in"
                    icon={<PenSquare size={18} />}
                    label="Blog"
                  />
                  <a
                    href="/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-medium text-neutral-600 dark:text-neutral-400 transition-all duration-300 hover:bg-black/5 dark:hover:bg-white/10 hover:text-black dark:hover:text-white"
                  >
                    <FileText size={18} />
                    Resume
                  </a>
                </div>

                {/* Separator */}
                <div className="w-px h-6 mx-2 bg-neutral-200 dark:bg-neutral-800" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* RIGHT: Toggle Container */}
        <motion.div
          layout="position"
          className="z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="
            flex items-center justify-center 
            w-12 h-12 rounded-full 
            bg-neutral-100/80 dark:bg-neutral-800/80
            hover:bg-neutral-200/80 dark:hover:bg-neutral-700/80
            transition-colors duration-300
            ring-1 ring-black/5 dark:ring-white/5
          "
          >
            <AnimatePresence mode="wait" initial={false}>
              {isExpanded ? (
                <motion.div
                  key="theme-toggle"
                  initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-center"
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
                  className="text-neutral-600 dark:text-neutral-300"
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

function NavItem({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="
        group flex items-center gap-2.5 px-5 py-2.5 rounded-full
        text-sm font-medium text-neutral-600 dark:text-neutral-400
        transition-all duration-300
        hover:bg-black/5 dark:hover:bg-white/10
        hover:text-black dark:hover:text-white
      "
    >
      <span className="relative z-10 flex items-center gap-2.5">
        <span className="opacity-70 group-hover:opacity-100 transition-opacity">
          {icon}
        </span>
        <span>{label}</span>
      </span>
    </Link>
  );
}
