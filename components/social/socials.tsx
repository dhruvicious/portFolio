"use client";
import React, { useState, CSSProperties, useRef, useEffect } from "react";

type SquarePosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

const ResizingSquares: React.FC = () => {
	const [hoveredSquare, setHoveredSquare] = useState<SquarePosition | null>(
		null
	);
	const containerRef = useRef<HTMLDivElement>(null);
	const [containerSize, setContainerSize] = useState<{
		width: number;
		height: number;
	}>({
		width: 400,
		height: 400,
	});

	useEffect(() => {
		const updateSize = () => {
			if (containerRef.current) {
				const { width, height } =
					containerRef.current.getBoundingClientRect();
				setContainerSize({ width, height });
			}
		};
		updateSize();
		window.addEventListener("resize", updateSize);
		return () => window.removeEventListener("resize", updateSize);
	}, []);

	const socialLinks: Record<
		SquarePosition,
		{ url: string; svgPath: string }
	> = {
		"top-left": {
			url: "https://x.com/HalfBldPrinc3",
			svgPath: "/twitter-new.svg",
		},
		"top-right": {
			url: "https://www.linkedin.com/in/thehalfbldprinc3/",
			svgPath: "/linkedin.svg",
		},
		"bottom-left": {
			url: "https://github.com/dhruvicious",
			svgPath: "/github.svg",
		},
		"bottom-right": {
			url: "https://www.instagram.com/be.dhruvicious/",
			svgPath: "/insta.svg",
		},
	};

	const getSquareStyle = (position: SquarePosition): CSSProperties => {
		const normal = 50; // %
		const expanded = 70; // %
		const shrunk = 30; // %

		let width = normal;
		let height = normal;
		let left = position.includes("right") ? 50 : 0;
		let top = position.includes("bottom") ? 50 : 0;

		if (hoveredSquare) {
			switch (hoveredSquare) {
				case "top-left":
					if (position === "top-left") width = height = expanded;
					else if (position === "top-right") {
						width = shrunk;
						height = expanded;
						left = expanded;
					} else if (position === "bottom-left") {
						width = expanded;
						height = shrunk;
						top = expanded;
					} else {
						width = height = shrunk;
						left = expanded;
						top = expanded;
					}
					break;
				case "top-right":
					if (position === "top-right") {
						width = height = expanded;
						left = shrunk;
					} else if (position === "top-left") {
						width = shrunk;
						height = expanded;
					} else if (position === "bottom-right") {
						width = expanded;
						height = shrunk;
						left = shrunk;
						top = expanded;
					} else {
						width = height = shrunk;
						top = expanded;
					}
					break;
				case "bottom-left":
					if (position === "bottom-left") {
						width = height = expanded;
						top = shrunk;
					} else if (position === "bottom-right") {
						width = shrunk;
						height = expanded;
						left = expanded;
						top = shrunk;
					} else if (position === "top-left") {
						width = expanded;
						height = shrunk;
					} else {
						width = height = shrunk;
						left = expanded;
					}
					break;
				case "bottom-right":
					if (position === "bottom-right") {
						width = height = expanded;
						left = shrunk;
						top = shrunk;
					} else if (position === "bottom-left") {
						width = shrunk;
						height = expanded;
						top = shrunk;
					} else if (position === "top-right") {
						width = expanded;
						height = shrunk;
						left = shrunk;
					} else {
						width = height = shrunk;
					}
					break;
			}
		}

		return {
			position: "absolute",
			left: `${left}%`,
			top: `${top}%`,
			width: `${width}%`,
			height: `${height}%`,
			transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
		};
	};

	const getSquareColor = (position: SquarePosition): string => {
		switch (position) {
			case "top-left":
				return "bg-[#575C55] dark:bg-white";
			case "top-right":
				return "bg-[#0077B5] dark:bg-[#005983]";
			case "bottom-left":
				return "bg-[#333333] dark:bg-[#1f1f1f]";
			case "bottom-right":
				return "bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] dark:from-[#e07a29] dark:via-[#c71d75] dark:to-[#6b2d95]";
			default:
				return "bg-gray-400 dark:bg-gray-600";
		}
	};

	return (
		<div
			ref={containerRef}
			className="relative w-full h-full overflow-hidden"
			onMouseLeave={() => setHoveredSquare(null)}
		>
			{(
				[
					"top-left",
					"top-right",
					"bottom-left",
					"bottom-right",
				] as SquarePosition[]
			).map((position) => (
				<a
					key={position}
					href={socialLinks[position].url}
					target="_blank"
					rel="noopener noreferrer"
				>
					<div
						className={`${getSquareColor(
							position
						)} cursor-pointer hover:shadow-lg`}
						style={getSquareStyle(position)}
						onMouseEnter={() => setHoveredSquare(position)}
					>
						<img
							src={socialLinks[position].svgPath}
							alt={`${position} icon`}
							style={{ width: "50%", height: "50%" }}
							className="object-contain transition-all duration-300"
						/>
					</div>
				</a>
			))}
		</div>
	);
};

export default ResizingSquares;
