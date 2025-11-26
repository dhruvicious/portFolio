"use client";

import Link from "next/link";
import { Fira_Code } from "next/font/google";

// Fira Code is the quintessential "Dev" font
const firaCode = Fira_Code({
  subsets: ["latin"],
  weight: ["400", "500", "700"], // Load a few weights for variety
});

export default function Logo() {
  return (
    <div className={`inline-flex cursor-pointer ${firaCode.className}`}>
      <Link
        href="/"
        className="
          group relative flex items-center gap-0.5 
          select-none text-sm sm:text-base md:text-lg
          transition-all duration-300
        "
      >
        {/* Opening Bracket: Subtle syntax color */}
        <span className="text-neutral-400 dark:text-neutral-600 font-medium transition-colors group-hover:text-blue-500/70">
          {"<"}
        </span>

        {/* The Name: Bold and crisp */}
        <span className="font-bold text-neutral-800 dark:text-neutral-200 tracking-tight">
          bedhruvicious
        </span>

        {/* Self-closing Slash & Bracket */}
        <span className="text-neutral-400 dark:text-neutral-600 font-medium transition-colors group-hover:text-blue-500/70">
          {"/ >"}
        </span>

        {/* Optional: A subtle glow behind the text on hover for that "IDE" feel */}
        <div className="absolute inset-0 -z-10 bg-blue-500/0 group-hover:bg-blue-500/5 blur-lg transition-colors duration-500 rounded-full" />
      </Link>
    </div>
  );
}
