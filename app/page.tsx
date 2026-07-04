"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Loader } from "@/components/loader";
import { StarWarsIntroText } from "@/components/starwars-intro";
import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/about-section";
import { WorkSection } from "@/components/work-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import styles from "./page.module.css";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [loading]);

  return (
    <>
      {loading && <Loader onComplete={() => setLoading(false)} />}
      
      <StarWarsIntroText />

      <div className={styles.page}>
        <HeroSection />
        <AboutSection />
        <WorkSection />
        <ContactSection />
        <Footer />
        <Navbar />
      </div>
    </>
  );
}
