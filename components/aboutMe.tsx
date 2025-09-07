"use client";
import { JSX, useEffect, useRef, useState } from "react";
import { TypeAnimation } from "react-type-animation";

export default function AboutMe(): JSX.Element {
	const containerRef = useRef<HTMLDivElement>(null);
	const [visible, setVisible] = useState(false);

	const paragraph: string = `I'm Dhruv, an Electronics and Communications engineering student with a passion for building both hardware and software projects that deepen my understanding of how things work. My portfolio spans full-stack applications like a voice-controlled SmartMirror, which combines hardware and software, a book review API, and even toy projects like numNet, a tiny deep learning framework built with NumPy just to see how neural networks function under the hood. I've also created classics like a C++ Snake game and a web-based tripleArcade. Each project reflects a hands-on, curiosity-driven approach to learning and creating.`;

	useEffect(() => {
		if (!containerRef.current) return;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setVisible(true);
						observer.disconnect();
					}
				});
			},
			{ threshold: 0.3 }
		);

		observer.observe(containerRef.current);

		return () => observer.disconnect();
	}, []);

	return (
		<div ref={containerRef} className="w-full">
			<h2
				className="mb-6 tracking-tight"
				style={{
					fontFamily: "Inter, system-ui, sans-serif",
					letterSpacing: "-0.025em",
				}}
			>
				{visible ? (
					<TypeAnimation
						sequence={["About Me"]}
						wrapper="span"
						cursor={false}
						speed={10}
						repeat={1}
						className="select-none text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-wide text-foreground select-none"
					/>
				) : (
					<span className="opacity-0">About Me</span>
				)}
			</h2>

			{/* Reserved space for paragraph */}
			<div
				className="select-none text-lg md:text-xl leading-8 text-gray-700 dark:text-gray-300 mb-10 text-justify min-h-[14rem]"
				style={{
					fontFamily: "Inter, system-ui, sans-serif",
					fontWeight: "400",
					letterSpacing: "-0.01em",
				}}
			>
				{visible ? (
					<TypeAnimation
						sequence={[paragraph]}
						wrapper="span"
						cursor={false}
						speed={99}
						repeat={1}
					/>
				) : (
					<span className="opacity-0">{paragraph}</span> // placeholder to hold space
				)}
			</div>

			<div className="flex">
				<div className="h-px w-16 bg-black dark:bg-white" />
			</div>
		</div>
	);
}
