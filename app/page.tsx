import Name from "@/components/name";
import NavBar from "@/components/navBar";
import Footer from "@/components/footer";
import { gsap } from "gsap";
import ResizingSquares from "@/components/social/socials";

export default function Home() {
	return (
		<div className="flex flex-col h-full w-full">
			<NavBar />

			<section className="h-screen w-full flex items-center justify-center sm:px-6 md:px-8 lg:px-12 xl:px-16 sm:py-12">
				<Name />
			</section>

			{/* Bio Section divided into 6 tiles */}
			<section className="bio h-screen px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 sm:py-12">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full">
					{/* Combined Tile 1 + 2 */}
					<div className="tile flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg shadow-md col-span-1 md:col-span-2">
						{/* Combined content of Tile 2 and Tile 3 */}
					</div>

					{/* Tile 3 */}
					<div className="tile flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg shadow-md">
						{/* Component for Tile 4 */}
					</div>

					{/* Tile 4 */}
					<div className="tile flex flex-col rounded-lg justify-center">
						<ResizingSquares />
					</div>
					{/* Combined Tile 5 + 6 */}
					<div className="tile flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg shadow-md col-span-1 md:col-span-2">
						{/* Combined content of Tile 5 and Tile 6 */}
					</div>
				</div>
			</section>

			<Footer />
		</div>
	);
}
