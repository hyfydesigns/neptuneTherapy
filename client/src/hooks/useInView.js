import { useEffect, useRef, useState } from 'react';

/**
 * Returns [ref, isInView].
 * Once the element enters the viewport it stays "in view" (no re-trigger on scroll out).
 */
export default function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect(); // fire once
      }
    }, { threshold: 0.12, ...options });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, inView];
}
