import type { Metadata, Viewport } from "next";
import "./globals.css";

import { ThemeProvider } from "@/components/themeProvider/themeProvider";
import { plusJakartaSans } from "@/lib/fonts";
import { ThemeSweep } from "@/components/theme-sweep/theme-sweep";

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
        className={`${plusJakartaSans.className} antialiased overflow-x-hidden`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeSweep />
          {/* Background layer */}
          <div className="fixed inset-0 -z-10">
            {/* Light background image (fades out in dark mode) */}
            <div className="absolute inset-0 bg-[url('/background-light.avif')] bg-cover bg-center filter blur-xl opacity-50 transition-opacity duration-700 dark:opacity-0"></div>
            {/* Dark background image (fades in in dark mode) */}
            <div className="absolute inset-0 bg-[url('/background.avif')] bg-cover bg-center filter blur-xl opacity-0 transition-opacity duration-700 dark:opacity-50"></div>
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
