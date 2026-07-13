import fs from 'fs';
import path from 'path';
import { Navbar } from "@/components/navbar";
import { StarWarsIntroText } from "@/components/starwars-intro";
import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/about-section";
import { WorkSection } from "@/components/work-section";
import { ContactSection } from "@/components/contact-section";
import { PageManager } from "@/components/page-manager";
import styles from "./page.module.css";
import { GlobalBackgroundWrapper } from "@/components/global-background-wrapper";

export default function Home() {
  // 1. Extreme Optimization: Read the file strictly on the server at build/request time
  // This completely eliminates the client-side fetch waterfall that was delaying the render.
  const aboutText = fs.readFileSync(path.join(process.cwd(), 'public', 'about.md'), 'utf-8');
  const aboutParagraphs = aboutText.split('\n\n').map(p => p.trim()).filter(Boolean);

  return (
    <PageManager>
      <StarWarsIntroText />
      <div className={styles.page}>
        <HeroSection />
        <GlobalBackgroundWrapper>
          <AboutSection paragraphs={aboutParagraphs} />
          <WorkSection />
          <ContactSection />
        </GlobalBackgroundWrapper>
        <Navbar />
      </div>
    </PageManager>
  );
}
