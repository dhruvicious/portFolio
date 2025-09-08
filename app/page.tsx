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
			<section className="bio min-h-screen w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 sm:py-12 flex flex-col gap-6">
				{/* About Me + Socials flex container */}
				<div className="flex flex-col lg:flex-row gap-6 w-full">
					{/* About Me */}
					<div className="flex-1 flex flex-col items-center justify-center min-h-[300px]">
						<AboutMe />
					</div>

					{/* Socials */}
					<div className="flex-1 flex flex-col justify-center shadow-md min-h-[300px] relative">
						<ResizingSquares />
					</div>
				</div>

				{/* GitHub Dashboard */}
				<div className="flex flex-col justify-center min-h-[300px] mt-10 w-full">
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
