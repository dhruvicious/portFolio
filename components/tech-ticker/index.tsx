import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./tech-ticker.module.css";

interface TechTickerProps {
  visible: boolean;
}

export function TechTicker({ visible }: TechTickerProps) {
  const [animationKey, setAnimationKey] = useState(0);
  const [techStack, setTechStack] = useState<string[]>([]);

  // Fetch the tech stack from the markdown file on mount
  useEffect(() => {
    fetch('/tech-stack.md')
      .then(res => res.text())
      .then(text => {
        // Split by newlines, trim whitespace, and filter out empty lines
        const stack = text.split('\n').map(t => t.trim()).filter(Boolean);
        if (stack.length > 0) {
          setTechStack(stack);
        }
      })
      .catch(console.error);
  }, []);

  // Every time the ticker becomes visible, we increment the key
  // This forces React to unmount and remount the track,
  // effectively resetting the CSS animation so the Falcon always zips through first!
  useEffect(() => {
    if (visible) {
      setAnimationKey(prev => prev + 1);
    }
  }, [visible]);

  return (
    <div className={`${styles.tickerContainer} ${visible ? styles.visible : ""}`}>
      {/* 
        The Falcon overlay with animationKey so it gets completely rebuilt 
        and retriggers its CSS animation every time the ticker becomes visible 
      */}
      {visible && (
        <Image 
          key={`falcon-${animationKey}`}
          src="/millennium-falcon-svgrepo-com.svg" 
          alt="Millennium Falcon" 
          width={120} 
          height={60} 
          className={styles.falconOverlay}
        />
      )}

      {visible && (
        <>
          <div className={styles.centerLabel}>
            MY TECH STACK
          </div>
          
          <div className={styles.trackWrapper}>
            <div className={`${styles.track} ${styles.animate}`}>
              {/* Render multiple lists for seamless infinite scrolling */}
              {[...Array(4)].map((_, i) => (
                <div key={i} className={styles.list}>
                  {techStack.map((tech, j) => (
                    <span key={`${i}-${j}`} className={styles.item}>
                      {tech}
                      <span className={styles.separator}>•</span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

