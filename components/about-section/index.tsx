"use client";

import { AboutCrawl } from "@/components/about-crawl";
import { VideoScrollSequence } from "@/components/video-scroll";

interface AboutSectionProps {
  paragraphs: string[];
}

export function AboutSection({ paragraphs }: AboutSectionProps) {
  if (!paragraphs || paragraphs.length === 0) return null;

  return (
    <section id="about-me">
      <AboutCrawl title="ABOUT ME" paragraphs={paragraphs} />
      <VideoScrollSequence />
    </section>
  );
}
