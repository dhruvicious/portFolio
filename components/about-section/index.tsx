"use client";

import { AboutCrawl } from "@/components/about-crawl";
import { VideoScrollSequence } from "@/components/video-scroll";

interface AboutSectionProps {
  paragraphs: string[];
  techStack: string[];
}

export function AboutSection({ paragraphs, techStack }: AboutSectionProps) {
  if (!paragraphs || paragraphs.length === 0) return null;

  return (
    <section id="about-me">
      <AboutCrawl title="ABOUT ME" paragraphs={paragraphs} techStack={techStack} />
      <VideoScrollSequence />
    </section>
  );
}
