"use client";
import NavBar from "@/components/navBar";
import Footer from "@/components/footer";

export default function ProjectsPage() {
	return (
		<div className="min-h-screen">
			<NavBar />

			<main className="flex items-center justify-center min-h-[80vh] px-6">
				<div className="text-center max-w-2xl p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
					<h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white/90 via-white/60 to-white/90 bg-clip-text text-transparent leading-tight">
						Projects
					</h1>
					<p className="text-xl md:text-2xl text-white/80 font-light">
						Will be updating soon
					</p>
				</div>
			</main>

			<Footer />
		</div>
	);
}
