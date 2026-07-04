"use client";

import { useEffect, useState } from "react";
import { AboutCrawl } from "@/components/about-crawl";
import { VideoScrollSequence } from "@/components/video-scroll";

export function AboutSection() {
  const [aboutParagraphs, setAboutParagraphs] = useState<string[]>([]);

  useEffect(() => {
    fetch('/about.md')
      .then((res) => res.text())
      .then((text) => {
        const paras = text.split('\n\n').map(p => p.trim()).filter(Boolean);
        setAboutParagraphs(paras);
      })
      .catch(console.error);
  }, []);

  if (aboutParagraphs.length === 0) return null;

  return (
    <>
      <AboutCrawl title="ABOUT ME" paragraphs={aboutParagraphs} />
      <VideoScrollSequence />
    </>
  );
}
