"use client";

import { useEffect, useRef, useState } from "react";

export function AnimatedCounter({ value, suffix = "" }: { value: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const num = parseInt(value.replace(/\D/g, ""));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const end = num || 0;
    const duration = 1500;
    const step = Math.ceil(end / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setDisplay(end);
        clearInterval(timer);
      } else {
        setDisplay(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [visible, num]);

  if (isNaN(num)) {
    return <span ref={ref}>{value}</span>;
  }

  return (
    <span ref={ref} className={visible ? "animate-count-up" : "opacity-0"}>
      {display}
      {suffix}
    </span>
  );
}