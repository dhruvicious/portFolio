"use client";
import { JSX, useEffect, useRef } from "react";
import { TypeAnimation } from "react-type-animation";

export default function AboutMe(): JSX.Element {
	const containerRef = useRef<HTMLDivElement>(null);
	const titleRef = useRef<HTMLHeadingElement>(null);
	const paragraphRef = useRef<HTMLDivElement>(null);
	const lineRef = useRef<HTMLDivElement>(null);

	const paragraph: string = `I'm Dhruv, an Electronics and Communications engineering student with a passion for building both hardware and software projects that deepen my understanding of how things work. My portfolio spans full-stack applications like a voice-controlled SmartMirror, which combines hardware and software, a book review API, and even toy projects like numNet, a tiny deep learning framework built with NumPy just to see how neural networks function under the hood. I've also created classics like a C++ Snake game and a web-based tripleArcade. Each project reflects a hands-on, curiosity-driven approach to learning and creating.`;

	const highlights: Record<string, string> = {
		"voice-controlled SmartMirror":
			"text-black dark:text-white font-medium border-b border-gray-300 dark:border-gray-600 hover:border-black dark:hover:border-white transition-all duration-500 cursor-pointer",
		"book review API":
			"text-black dark:text-white font-medium border-b border-gray-300 dark:border-gray-600 hover:border-black dark:hover:border-white transition-all duration-500 cursor-pointer",
		numNet: "text-black dark:text-white font-medium border-b border-gray-300 dark:border-gray-600 hover:border-black dark:hover:border-white transition-all duration-500 cursor-pointer",
		"C++ Snake game":
			"text-black dark:text-white font-medium border-b border-gray-300 dark:border-gray-600 hover:border-black dark:hover:border-white transition-all duration-500 cursor-pointer",
		"web-based tripleArcade":
			"text-black dark:text-white font-medium border-b border-gray-300 dark:border-gray-600 hover:border-black dark:hover:border-white transition-all duration-500 cursor-pointer",
	};

	const italicPhrases = ["hands-on,", "curiosity-driven"];

	useEffect(() => {
		const container = containerRef.current;
		const title = titleRef.current;
		const paragraph = paragraphRef.current;
		const line = lineRef.current;

		if (!container || !title || !paragraph || !line) return;

		title.style.opacity = "0";
		title.style.transform = "translateY(20px)";
		paragraph.style.opacity = "0";
		paragraph.style.transform = "translateY(20px)";
		line.style.width = "0";
		line.style.opacity = "0";

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setTimeout(() => {
							title.style.transition =
								"all 1s cubic-bezier(0.16, 1, 0.3, 1)";
							title.style.opacity = "1";
							title.style.transform = "translateY(0)";
						}, 200);

						setTimeout(() => {
							paragraph.style.transition =
								"all 1.2s cubic-bezier(0.16, 1, 0.3, 1)";
							paragraph.style.opacity = "1";
							paragraph.style.transform = "translateY(0)";
						}, 600);

						setTimeout(() => {
							line.style.transition =
								"all 1.5s cubic-bezier(0.16, 1, 0.3, 1)";
							line.style.width = "64px";
							line.style.opacity = "1";
						}, 1000);

						observer.disconnect();
					}
				});
			},
			{ threshold: 0.3 }
		);

		observer.observe(container);

		return () => {
			observer.disconnect();
		};
	}, []);

	// Fixed renderParagraph: only wrap phrases, keep the rest as raw text
	const renderParagraph = (): JSX.Element[] => {
		const text = paragraph;
		type P = { phrase: string; kind: "highlight" | "italic" };
		const phrases: P[] = [
			...Object.keys(highlights).map((phrase) => ({
				phrase,
				kind: "highlight" as const,
			})),
			...italicPhrases.map((phrase) => ({
				phrase,
				kind: "italic" as const,
			})),
		].sort((a, b) => b.phrase.length - a.phrase.length); // longer first

		const out: JSX.Element[] = [];
		let i = 0;
		let last = 0;
		let key = 0;

		while (i < text.length) {
			let matched = false;

			for (const { phrase, kind } of phrases) {
				if (text.startsWith(phrase, i)) {
					if (last < i)
						out.push(
							<span key={`t-${key++}`}>
								{text.slice(last, i)}
							</span>
						);

					if (kind === "highlight") {
						out.push(
							<span
								key={`h-${key++}`}
								className={highlights[phrase]}
							>
								{phrase}
							</span>
						);
					} else {
						out.push(
							<span
								key={`i-${key++}`}
								className="italic font-medium text-gray-800 dark:text-gray-200"
								style={{
									fontFamily: "Charter, Georgia, serif",
								}}
							>
								{phrase}
							</span>
						);
					}

					i += phrase.length;
					last = i;
					matched = true;
					break;
				}
			}

			if (!matched) i++;
		}

		if (last < text.length)
			out.push(<span key={`t-${key++}`}>{text.slice(last)}</span>);

		return out;
	};

	return (
		<div ref={containerRef} className="w-full">
			<h2
				ref={titleRef}
				className="mb-6 tracking-tight"
				style={{
					fontFamily: "Inter, system-ui, sans-serif",
					letterSpacing: "-0.025em",
				}}
			>
				<TypeAnimation
					sequence={["About Me"]}
					wrapper="span"
					cursor={false}
					repeat={1}
					className="select-none font-light text-black dark:text-white text-4xl md:text-5xl"
				/>
			</h2>

			<div
				ref={paragraphRef}
				className="select-none text-lg md:text-xl leading-8 text-gray-700 dark:text-gray-300 mb-10 text-justify"
				style={{
					fontFamily: "Inter, system-ui, sans-serif",
					fontWeight: "400",
					letterSpacing: "-0.01em",
				}}
			>
				{renderParagraph()}
			</div>

			<div className="flex">
				<div
					ref={lineRef}
					className="h-px w-16 bg-black dark:bg-white"
					style={{
						transition: "width 1.5s cubic-bezier(0.16,1,0.3,1)",
					}}
				/>
			</div>
		</div>
	);
}
