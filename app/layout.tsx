// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// import { ThemeProvider } from "@/components/themeProvider";

// const geistSans = Geist({
// 	variable: "--font-geist-sans",
// 	subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
// 	variable: "--font-geist-mono",
// 	subsets: ["latin"],
// });

// export const metadata: Metadata = {
// 	title: "Dhruv Khatri",
// 	description: "This is my portfolio website",
// };

// export default function RootLayout({
// 	children,
// }: Readonly<{ children: React.ReactNode }>) {
// 	return (
// 		<html lang="en" suppressHydrationWarning>
// 			<body
// 				className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
// 			>
// 				<ThemeProvider
// 					attribute="class"
// 					defaultTheme="system"
// 					enableSystem
// 					disableTransitionOnChange
// 				>
// 					{/* Light mode video */}
// 					<video
// 						autoPlay
// 						loop
// 						muted
// 						playsInline
// 						className="fixed top-0 left-0 w-full h-full object-cover z-0 filter blur-xl opacity-50 dark:hidden"
// 					>
// 						<source src="/background-light.mp4" type="video/mp4" />
// 						Your browser does not support the video tag.
// 					</video>

// 					{/* Dark mode video */}
// 					<video
// 						autoPlay
// 						loop
// 						muted
// 						playsInline
// 						className="fixed top-0 left-0 w-full h-full object-cover z-0 filter blur-xl opacity-50 hidden dark:block"
// 					>
// 						<source src="/background.mp4" type="video/mp4" />
// 						Your browser does not support the video tag.
// 					</video>

// 					{/* Main content */}
// 					<div className="relative flex flex-col min-h-screen w-full max-w-full z-10 bg-transparent text-black dark:text-white">
// 						{children}
// 					</div>
// 				</ThemeProvider>
// 			</body>
// 		</html>
// 	);
// }
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/themeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#CC76A1" },
    { media: "(prefers-color-scheme: dark)", color: "#22031F" },
  ],
};

export const metadata: Metadata = {
  icons: {
    icon: "/icon.png",
  },
  title: "Dhruv Khatri",
  description: "This is my portfolio website",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Background layer */}
          <div className="fixed inset-0 -z-10">
            <div className="absolute inset-0 bg-[url('/background-light.jpg')] dark:bg-[url('/background.png')] bg-cover bg-center filter blur-xl opacity-50"></div>
          </div>
          {/* Main content */}
          <div className="relative flex flex-col min-h-screen w-full max-w-full z-10 bg-transparent text-black dark:text-white">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
