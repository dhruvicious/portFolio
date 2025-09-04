"use client";
import { Pacifico } from "next/font/google";
import Link from "next/link";

const pacifico = Pacifico({
	subsets: ["latin"],
	weight: "400",
});

export default function Logo() {
	return (
		<div className="inline-flex cursor-pointer">
			<Link href="/">
				<h1
					className={`text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-medium tracking-wide text-foreground select-none transition-all duration-200 hover:scale-105 active:scale-95 ${pacifico.className}`}
				>
					bedhruvicious.co.in
				</h1>
			</Link>
		</div>
	);
}
