import { type RefObject, useEffect, useState } from 'react';

// True while the element is on screen. The small demos only run then.
export function useInView(ref: RefObject<HTMLElement | null>, share = 0.35) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: share },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, share]);

  return inView;
}

export function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}
