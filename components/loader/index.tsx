'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { animate, svg, stagger } from 'animejs';
import styles from './loader.module.css';

export function Loader({ onComplete }: { onComplete: () => void }) {
  const [exiting, setExiting] = useState(false);
  const pageLoadedRef = useRef(false);
  const animationDoneRef = useRef(false);
  const exitStartedRef = useRef(false);
  const pathRef = useRef<SVGPathElement>(null);

  const beginExit = useCallback(() => {
    if (exitStartedRef.current) return;
    exitStartedRef.current = true;

    // Brief pause at 100% so the user registers it
    setTimeout(() => {
      setExiting(true);
      // Match the CSS transition duration (1.2s)
      setTimeout(() => {
        onComplete();
      }, 1200);
    }, 400);
  }, [onComplete]);

  // Try to exit — only fires when BOTH conditions are met
  const tryExit = useCallback(() => {
    if (pageLoadedRef.current && animationDoneRef.current) {
      beginExit();
    }
  }, [beginExit]);

  const [progress, setProgress] = useState(0);
  const drawablesRef = useRef<any>(null);

  // Setup the drawable once
  useEffect(() => {
    if (!pathRef.current) return;
    drawablesRef.current = svg.createDrawable(pathRef.current);
  }, []);

  // Update simulated progress tied to page load
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) return 100;
        
        if (pageLoadedRef.current) {
          // Finish drawing smoothly taking about 1 second if instantly loaded
          return Math.min(100, p + 5); 
        } else {
          // Fake progress asymptotes towards 90%
          const diff = 90 - p;
          const increment = Math.max(0.2, diff * 0.05);
          return Math.min(90, p + increment);
        }
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Tie the drawable state to the progress state
  useEffect(() => {
    if (!drawablesRef.current) return;

    animate(drawablesRef.current, {
      draw: `0 ${progress / 100}`,
      ease: 'linear',
      duration: 150 // Smoothly catch up to the interval increments
    });

    if (progress >= 100) {
      animationDoneRef.current = true;
      tryExit();
    }
  }, [progress, tryExit]);

  // Listen for page load
  useEffect(() => {
    const onLoad = () => {
      pageLoadedRef.current = true;
    };

    if (document.readyState === 'complete') {
      pageLoadedRef.current = true;
    } else {
      window.addEventListener('load', onLoad);
    }

    return () => window.removeEventListener('load', onLoad);
  }, []);

  return (
    <div
      className={`${styles.overlay} ${exiting ? styles.exiting : ''}`}
      aria-hidden="true"
    >
      {/* Noise texture */}
      <div className={styles.noise} />

      {/* Ambient glow orb */}
      <div className={styles.orb} />

      {/* Content wrapper — isolates perspective from backdrop-filter */}
      <div className={styles.content}>
        
        {/* SVG Drawing of the name */}
        <div className={styles.svgWrap}>
          <svg 
            width="219.1" 
            height="94" 
            viewBox="-2 -2 219.1 94"
            xmlns="http://www.w3.org/2000/svg"
            className={styles.nameSvg}
          >
            <g strokeLinecap="round" fillRule="nonzero" fill="none">
              <path 
                ref={pathRef}
                style={{ stroke: 'white', strokeWidth: 1, fill: 'none' }}
                d="M54.075 46.688L54.075 46.688Q54.075 52.613 52.031 57.619Q49.987 62.625 46.275 66.281Q42.563 69.938 37.331 71.981Q32.100 74.025 25.725 74.025L25.725 74.025L4.500 74.025L4.500 19.388L25.725 19.388Q32.100 19.388 37.331 21.450Q42.563 23.513 46.275 27.150Q49.987 30.788 52.031 35.794Q54.075 40.800 54.075 46.688ZM41.100 46.688L41.100 46.688Q41.100 42.638 40.050 39.375Q39 36.113 37.031 33.844Q35.063 31.575 32.212 30.356Q29.362 29.138 25.725 29.138L25.725 29.138L17.250 29.138L17.250 64.275L25.725 64.275Q29.362 64.275 32.212 63.056Q35.063 61.838 37.031 59.569Q39 57.300 40.050 54.038Q41.100 50.775 41.100 46.688ZM71.775 74.025L60.150 74.025L60.150 17.888L71.775 17.888L71.775 38.550Q73.875 36.750 76.331 35.644Q78.787 34.538 82.200 34.538L82.200 34.538Q85.387 34.538 87.844 35.644Q90.300 36.750 91.987 38.719Q93.675 40.688 94.537 43.406Q95.400 46.125 95.400 49.313L95.400 49.313L95.400 74.025L83.775 74.025L83.775 49.313Q83.775 46.463 82.463 44.869Q81.150 43.275 78.600 43.275L78.600 43.275Q76.688 43.275 75 44.100Q73.313 44.925 71.775 46.313L71.775 46.313L71.775 74.025ZM115.275 74.025L103.650 74.025L103.650 35.138L110.550 35.138Q111.413 35.138 111.994 35.288Q112.575 35.438 112.969 35.756Q113.363 36.075 113.569 36.600Q113.775 37.125 113.925 37.875L113.925 37.875L114.563 41.513Q116.700 38.213 119.363 36.300Q122.025 34.388 125.175 34.388L125.175 34.388Q127.838 34.388 129.450 35.663L129.450 35.663L127.950 44.213Q127.800 45.000 127.350 45.319Q126.900 45.638 126.150 45.638L126.150 45.638Q125.513 45.638 124.650 45.469Q123.788 45.300 122.475 45.300L122.475 45.300Q117.900 45.300 115.275 50.175L115.275 50.175L115.275 74.025ZM133.875 35.138L145.500 35.138L145.500 59.813Q145.500 62.700 146.813 64.275Q148.125 65.850 150.675 65.850L150.675 65.850Q152.588 65.850 154.256 65.063Q155.925 64.275 157.500 62.850L157.500 62.850L157.500 35.138L169.125 35.138L169.125 74.025L161.925 74.025Q159.750 74.025 159.075 72.075L159.075 72.075L158.363 69.825Q157.238 70.913 156.037 71.794Q154.838 72.675 153.469 73.294Q152.100 73.913 150.525 74.269Q148.950 74.625 147.075 74.625L147.075 74.625Q143.887 74.625 141.431 73.519Q138.975 72.413 137.287 70.425Q135.600 68.438 134.738 65.738Q133.875 63.038 133.875 59.813L133.875 59.813L133.875 35.138ZM214.725 35.138L199.650 74.025L189.075 74.025L174 35.138L183.675 35.138Q184.912 35.138 185.756 35.719Q186.600 36.300 186.900 37.163L186.900 37.163L192.300 54.600Q192.938 56.738 193.519 58.763Q194.100 60.788 194.512 62.813L194.512 62.813Q194.925 60.788 195.525 58.763Q196.125 56.738 196.800 54.600L196.800 54.600L202.425 37.163Q202.725 36.300 203.550 35.719Q204.375 35.138 205.500 35.138L205.500 35.138L214.725 35.138Z"
              />
            </g>
          </svg>
        </div>

      </div>
    </div>
  );
}
