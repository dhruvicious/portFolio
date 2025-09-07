import Name from "@/components/name";
import NavBar from "@/components/navBar";
import Footer from "@/components/footer";
import ResizingSquares from "@/components/socials";
import AboutMe from "@/components/aboutMe";
import GithubDashboard from "@/components/gitStats";
import Subheading from "@/components/subhead";

export default function Home() {
	return (
		<div className="flex flex-col min-h-screen w-full">
			<NavBar />

			{/* Hero Section */}
			<section className="mx-auto h-screen w-full flex items-center justify-center sm:px-6 md:px-8 lg:px-12 xl:px-16 sm:py-12">
				<Name />
			</section>

			{/* Bio Section */}
			<section className="bio min-h-screen w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 sm:py-12">
				{/* Grid with About Me + Socials */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-full w-full">
					{/* About Me spans 2 cols on large screens */}
					<div className="tile flex flex-col items-center justify-center min-h-[300px] lg:col-span-2">
						<AboutMe />
					</div>

					{/* Socials */}
					<div className="tile flex flex-col justify-center shadow-md min-h-[300px]">
						<ResizingSquares />
					</div>
				</div>

				{/* GitHub Dashboard */}
				<div className="flex flex-col justify-center min-h-full w-full mt-10">
					<div className="mt-6 mb-4">
						<Subheading name="Github Stats" />
					</div>
					<GithubDashboard />
				</div>
			</section>

			<Footer />
		</div>
	);
}
