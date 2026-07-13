"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Hook that returns true when the target element is in or near the viewport.
 * Uses IntersectionObserver with a configurable rootMargin for preloading.
 * Once visible, it stays mounted (no unmounting on leave) unless `unmountOnLeave` is true.
 */
export function useInView(options?: {
  rootMargin?: string;
  threshold?: number;
  unmountOnLeave?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const hasBeenInView = useRef(false);

  const {
    rootMargin = "200px 0px",
    threshold = 0,
    unmountOnLeave = false,
  } = options ?? {};

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          hasBeenInView.current = true;
          setIsInView(true);
        } else if (unmountOnLeave) {
          setIsInView(false);
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin, threshold, unmountOnLeave]);

  return { ref, isInView: unmountOnLeave ? isInView : (isInView || hasBeenInView.current) };
}
