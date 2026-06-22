import { useEffect, useRef, useState } from "react";

type Options = { threshold?: number; rootMargin?: string; once?: boolean };

export function useReveal(opts: Options = {}) {
  const { threshold = 0.1, rootMargin = "0px", once = true } = opts;
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || revealed) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          if (once) observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once, revealed]);

  return { ref, revealed };
}
