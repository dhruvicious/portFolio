"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { TypeAnimation } from "react-type-animation";

export default function LogoWithName() {
	const [showDesignation, setShowDesignation] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => setShowDesignation(true), 1500);
		return () => clearTimeout(timer);
	}, []);

	return (
		<div className="flex justify-center w-full h-full">
			<div className="flex items-center gap-[clamp(0.5rem,4vw,4rem)] flex-col sm:flex-row text-center sm:text-left">
				{/* Flip Logo */}
				<div className="group [perspective:1000px] aspect-square w-[clamp(4rem,15vw,16rem)] min-w-[4rem] shrink-0">
					<div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
						{/* Front */}
						<div className="absolute inset-0 flex items-center justify-center bg-background border border-muted rounded-2xl overflow-hidden [backface-visibility:hidden]">
							<Image
								src="/alt.jpg"
								alt="Dhruv Khatri"
								fill
								className="object-cover select-none"
								sizes="(max-width: 640px) 4rem, (max-width: 1024px) 12vw, 16rem"
								priority
							/>
						</div>
						{/* Back */}
						<div className="absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden] rounded-2xl overflow-hidden">
							<Image
								src="/me-new.jpg"
								alt="Dhruv Khatri"
								fill
								className="object-cover select-none"
								sizes="(max-width: 640px) 4rem, (max-width: 1024px) 12vw, 16rem"
								priority
							/>
						</div>
					</div>
				</div>

				{/* Name + Designation */}
				<div className="flex flex-col items-center sm:items-start text-center sm:text-left min-w-0 flex-1">
					<TypeAnimation
						sequence={["Hey there! I'm ..."]}
						wrapper="span"
						cursor={false}
						repeat={0}
						className="select-none font-semibold text-gray-600 dark:text-gray-300 tracking-wide leading-snug text-[clamp(1rem,2.5vw,2.5rem)] sm:text-[clamp(1.25rem,3vw,2.5rem)] lg:text-[clamp(1.5rem,3.5vw,2.5rem)]"
					/>
					<TypeAnimation
						sequence={["Dhruv Khatri"]}
						wrapper="span"
						cursor={false}
						repeat={1}
						className="select-none font-extrabold bg-clip-text tracking-wide leading-tight drop-shadow-sm text-[clamp(1.5rem,4vw,4.5rem)] sm:text-[clamp(2rem,4.5vw,4.5rem)] lg:text-[clamp(2.5rem,5vw,4.5rem)] min-w-[8ch] sm:min-w-[12ch]"
					/>

					<div
						className={`mt-[clamp(0.25rem,1vw,1.5rem)] h-[clamp(1.5rem,4vw,4rem)] sm:h-[clamp(2rem,5vw,4rem)] flex items-start justify-center sm:justify-start transition-opacity duration-700 ${
							showDesignation ? "opacity-100" : "opacity-0"
						}`}
					>
						<TypeAnimation
							sequence={[
								"Developer",
								1200,
								"Engineer",
								1200,
								"Writer",
								1200,
							]}
							wrapper="span"
							cursor={false}
							repeat={Infinity}
							className="type select-none font-semibold text-gray-600 dark:text-gray-300 tracking-wide leading-snug text-[clamp(1rem,2.5vw,2.5rem)] sm:text-[clamp(1.25rem,3vw,2.5rem)] lg:text-[clamp(1.5rem,3.5vw,2.5rem)]"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
