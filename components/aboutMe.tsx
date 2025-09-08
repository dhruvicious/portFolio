"use client";
import React, { JSX, useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function AboutMe(): JSX.Element {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const headingRef = useRef<HTMLHeadingElement | null>(null);
	const paraRef = useRef<HTMLDivElement | null>(null);

	const paragraph: string = `I’m Dhruv, an ECE student who can’t resist poking at things, whether hardware, software, or just ideas, to see what happens. Curious, hands-on, and stubborn in the best way, I tinker until things behave or spectacularly don’t. I approach learning with a mix of mischief and obsession. If it can be broken, optimized, or overthought, I’m on it. Mostly, I like building stuff that makes sense of the world or at least makes me laugh along the way.`;

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		container.style.perspective = "1000px";

		const handleMouse = (e: MouseEvent) => {
			const rect = container.getBoundingClientRect();
			const x = (e.clientX - rect.left) / rect.width - 0.5;
			const y = (e.clientY - rect.top) / rect.height - 0.5;

			gsap.to(container, {
				rotationY: x * 10,
				rotationX: -y * 10,
				transformOrigin: "center",
				ease: "power2.out",
				duration: 0.5,
			});

			gsap.to(headingRef.current, {
				x: x * 20,
				y: y * 10,
				duration: 0.5,
				ease: "power2.out",
			});

			gsap.to(paraRef.current, {
				x: x * -15,
				y: y * -10,
				duration: 0.5,
				ease: "power2.out",
			});
		};

		const resetTilt = () => {
			gsap.to([container, headingRef.current, paraRef.current], {
				rotationX: 0,
				rotationY: 0,
				x: 0,
				y: 0,
				duration: 0.6,
				ease: "power2.out",
			});
		};

		container.addEventListener("mousemove", handleMouse);
		container.addEventListener("mouseleave", resetTilt);

		return () => {
			container.removeEventListener("mousemove", handleMouse);
			container.removeEventListener("mouseleave", resetTilt);
		};
	}, []);

	return (
		<div
			ref={containerRef}
			className="relative w-full p-6 rounded-2xl bg-white/5 dark:bg-slate-900/40"
		>
			<h2
				ref={headingRef}
				className="mb-6 select-none text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground"
			>
				About Me
			</h2>

			<div
				ref={paraRef}
				className="select-none text-base md:text-lg leading-7 text-gray-700 dark:text-gray-300 mb-10 text-justify"
			>
				{paragraph}
			</div>

			<div className="flex">
				<div className="h-px w-20 bg-black/80 dark:bg-white/80" />
			</div>
		</div>
	);
}
