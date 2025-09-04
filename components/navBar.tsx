"use client";

import Logo from "@/components/logo";
import ModeToggle from "@/components/themeSwitch";
import Link from "next/link";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const navButtonClass =
	"px-3 sm:px-4 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium";

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

					{/* Contact Dropdown */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<button className={navButtonClass}>Contact</button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-40 z-50">
							<DropdownMenuItem asChild>
								<Link href="mailto:dhruvkhatri1234@gmail.com">
									Email
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link
									href="https://linkedin.com/in/thehalfbldprinc3"
									target="_blank"
								>
									LinkedIn
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem asChild>
								<Link
									href="https://github.com/dhruvicious"
									target="_blank"
								>
									GitHub
								</Link>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					<div className="relative z-50">
						<ModeToggle />
					</div>
				</div>
			</div>
		</nav>
	);
}
