import { Hero } from "@/components/hero/hero";
import { NavBar } from "@/components/navBar/navBar";

export default function Home() {
	return (
		<div className="flex flex-col min-h-screen w-full">
			<NavBar />
			<section className="mx-auto h-screen w-full flex items-center justify-center sm:px-6 md:px-8 lg:px-12 xl:px-16 sm:py-12">
				<Hero />
			</section>
		</div>
	);
}
