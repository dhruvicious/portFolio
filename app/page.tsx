import Name from "@/components/name";
import NavBar from "@/components/navBar";
import Footer from "@/components/footer";

export default function Home() {
	return (
		<div className="flex flex-col min-h-screen w-full">
			<NavBar />

			<main className="flex-1 flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 sm:py-12">
				<Name />
			</main>

			<Footer />
		</div>
	);
}