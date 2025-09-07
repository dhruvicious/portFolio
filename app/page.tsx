import Name from "@/components/name";
import NavBar from "@/components/navBar";
import Footer from "@/components/footer";
import ResizingSquares from "@/components/socials";
import AboutMe from "@/components/aboutMe";

export default function Home() {
	return (
		<div className="flex flex-col min-h-screen w-full">
			<NavBar />

			<section className="mx-auto h-screen w-full flex items-center justify-center sm:px-6 md:px-8 lg:px-12 xl:px-16 sm:py-12">
				<Name />
			</section>

			{/* Bio Section divided into 6 tiles */}
			<section className="bio min-h-screen w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 sm:py-12">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-full w-full auto-rows-fr">
					{/* Tile 1 + 2 Combined (spans 2 columns on md+) */}
					<div className="tile flex flex-col items-center justify-center md:col-span-2 lg:col-span-2 min-h-[300px]">
						{/* Combined content of Tile 1 and Tile 2 */}
						<AboutMe />
					</div>
					{/* Tile 3 */}
					<div className="tile flex flex-col  justify-center shadow-md min-h-[300px]">
						<ResizingSquares />
					</div>
					{/* Tile 4 */}
					<div className="tile flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg shadow-md min-h-[300px]">
						{/* Component for Tile 3 */}
					</div>
					{/* Tile 5 + 6 Combined (spans 2 columns on md+) */}
					<div className="tile flex flex-col items-center justify-center p-4 bg-purple-50 rounded-lg shadow-md md:col-span-2 lg:col-span-2 min-h-[300px]">
						{/* Combined content of Tile 5 and Tile 6 */}
					</div>
				</div>
			</section>

			<Footer />
		</div>
	);
}
