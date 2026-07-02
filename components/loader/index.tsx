'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import styles from './loader.module.css';

const DISPLAY_NAME = 'DHRUV.';
const SWEEP_DURATION_MS = 2200; // Always takes this long to go 0→100

export function Loader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const pageLoadedRef = useRef(false);
  const sweepDoneRef = useRef(false);
  const exitStartedRef = useRef(false);

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
    }, 500);
  }, [onComplete]);

  // Try to exit — only fires when BOTH conditions are met
  const tryExit = useCallback(() => {
    if (pageLoadedRef.current && sweepDoneRef.current) {
      beginExit();
    }
  }, [beginExit]);

  // Smooth 0→100 sweep driven by requestAnimationFrame with easeOutQuart
  useEffect(() => {
    const startTime = performance.now();
    let rafId: number;

    const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / SWEEP_DURATION_MS, 1);
      const eased = easeOutQuart(t);
      const value = Math.round(eased * 100);

      setProgress(value);

      if (t < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        // Sweep complete
        sweepDoneRef.current = true;
        tryExit();
      }
    };

    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
  }, [tryExit]);

  // Listen for page load
  useEffect(() => {
    const onLoad = () => {
      pageLoadedRef.current = true;
      tryExit();
    };

    if (document.readyState === 'complete') {
      pageLoadedRef.current = true;
      // Don't call tryExit here — let the sweep finish on its own
    } else {
      window.addEventListener('load', onLoad);
    }

    return () => window.removeEventListener('load', onLoad);
  }, [tryExit]);

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
        {/* Staggered letter reveal */}
        <div className={styles.nameRow}>
          {DISPLAY_NAME.split('').map((char, i) => (
            <span
              key={i}
              className={`${styles.letter} ${char === '.' ? styles.dot : ''}`}
              style={{ animationDelay: `${0.15 + i * 0.07}s` }}
            >
              {char}
            </span>
          ))}
        </div>

        {/* Progress bar */}
        <div className={styles.progressWrap}>
          <div
            className={styles.progressBar}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Percentage */}
        <div className={styles.percentage}>{progress}%</div>
      </div>
    </div>
  );
}
