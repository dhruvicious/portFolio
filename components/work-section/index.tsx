"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./work-section.module.css";
import projects from "../../lib/projects.json";
import { FigmaWorksAnimation } from "@/components/figma-works-animation";

export function WorkSection() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top bottom",
      end: "bottom top",
    });
  }, { scope: containerRef });

  // Group projects by type
  const groupedProjects = projects.reduce((acc, project) => {
    const { type } = project;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(project);
    return acc;
  }, {} as Record<string, typeof projects>);

  // A curated palette of deeper light blueish colors
  const ACCENT_COLORS = [
    "#7DD3FC", // Sky Blue 300
    "#93C5FD", // Blue 300
    "#38BDF8", // Sky Blue 400
    "#60A5FA", // Blue 400
    "#22D3EE", // Cyan 400
  ];

  return (
    <section ref={containerRef} id="my-work" className={styles.scrollContainer} data-nav-theme="dark">
      <div className={styles.contentWrapper}>
        <FigmaWorksAnimation />
        <div className={styles.categoriesContainer}>
          {Object.entries(groupedProjects).map(([category, items]) => (
            <div key={category} className={styles.categorySection}>
              <h3 className={styles.categoryTitle}>{category}</h3>
              <div className={styles.projectsList}>
                {items.map((project, index) => {
                  const accent = ACCENT_COLORS[index % ACCENT_COLORS.length];

                  return (
                    <a
                      key={index}
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.projectCard}
                      style={{ "--accent": accent } as React.CSSProperties}
                    >
                      <div className={styles.cardTop}>
                        <div className={styles.titleWrapper}>
                          <h4 className={styles.projectTitleOriginal}>{project.title}</h4>
                          <h4 className={styles.projectTitleHover}>{project.title}</h4>
                        </div>
                      </div>

                    <div className={styles.expandedArea}>
                      <div className={styles.expandedInner}>
                        <div className={styles.leftCol}>
                          <h5 className={styles.projectSubtitle}>{project.subtitle}</h5>
                        </div>
                        <div className={styles.rightCol}>
                          <p className={styles.projectDescription}>{project.description}</p>
                        </div>
                      </div>
                    </div>
                  </a>
                );
              })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
