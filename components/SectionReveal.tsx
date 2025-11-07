'use client';

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

type SectionRevealProps = {
  children: ReactNode;
  delay?: number;
  once?: boolean;
};

type SectionRevealStyle = CSSProperties & {
  "--section-reveal-delay"?: string;
};

export default function SectionReveal({ children, delay = 0, once = true }: SectionRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [once]);

  const style: SectionRevealStyle = delay
    ? {
        ["--section-reveal-delay" as const]: `${delay}s`,
      }
    : {};

  return (
    <div ref={ref} className={`section-reveal${isVisible ? " section-reveal--visible" : ""}`} style={style}>
      {children}
    </div>
  );
}
