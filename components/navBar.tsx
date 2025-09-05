"use client";

import Logo from "@/components/logo";
import ModeToggle from "@/components/themeSwitch";
import Link from "next/link";

const navButtonClass =
	"px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 " +
	"bg-white/70 dark:bg-gray-800/70 hover:bg-white/90 dark:hover:bg-gray-700/90 " +
	"text-gray-800 dark:text-gray-200 shadow-sm hover:shadow-md " +
	"border border-transparent hover:border-gray-300 dark:hover:border-gray-600 " +
	"transform hover:-translate-y-0.5 active:translate-y-0";

export default function NavBar() {
	return (
		<nav className="w-full h-16 border-b backdrop-blur-md">
			{/* Center container with max width for large screens */}
			<div className="w-full h-full flex items-center justify-between px-4 sm:px-6">
				{/* Left side: Logo */}
				<div className="flex items-center h-full">
					<Logo />
				</div>

				{/* Right side: Links + Controls */}
				<div className="flex items-center h-full space-x-2 sm:space-x-4 lg:space-x-6">
					<Link href="/projects" className={navButtonClass}>
						<span>Projects</span>
					</Link>
					<Link
						href="mailto:dhruvkhatri1234@gmail.com"
						className={navButtonClass}
					>
						<span>E-mail</span>
					</Link>
					<div className="relative z-50 w-10 h-10 flex items-center justify-center">
						<ModeToggle />
					</div>
				</div>
			</div>
		</nav>
	);
}
