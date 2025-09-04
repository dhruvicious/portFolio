"use client";

export default function Footer() {
	return (
		<footer className="w-full py-3 sm:py-4 border-t border-gray-200 dark:border-gray-700 text-sm sm:text-base flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 px-4">
			<p className="select-none text-center sm:text-left">
				© {new Date().getFullYear()} Dhruv Khatri. All rights reserved.
			</p>
			<a
				href="https://github.com/dhruvicious/"
				target="_blank"
				rel="noopener noreferrer"
				className="select-none hover:underline transition-colors"
			>
				View source code
			</a>
		</footer>
	);
}
