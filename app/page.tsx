import Name from "@/components/name";
import NavBar from "@/components/navBar";
// import ResizingSquares from "@/components/socials";
// import AboutMe from "@/components/aboutMe";
// import GithubDashboard from "@/components/gitStats";
// import Subheading from "@/components/subhead";

export default function Home() {
	return (
		<div className="flex flex-col min-h-screen w-full">
			<NavBar />
			<section className="mx-auto h-screen w-full flex items-center justify-center sm:px-6 md:px-8 lg:px-12 xl:px-16 sm:py-12">
				<Name />
			</section>
		</div>
	);
}
