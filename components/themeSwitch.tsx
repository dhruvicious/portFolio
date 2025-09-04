"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
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
		<Button
			variant="outline"
			size="icon"
			onClick={toggleTheme}
			aria-label="Toggle theme"
			className="m-2 border-2 border-gray-300 dark:border-gray-600 rounded-xl transition-colors duration-500 ease-in-out"
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
		</Button>
	);
}
