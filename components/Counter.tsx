"use client";
import { useEffect, useRef, useState } from "react";

export default function Counter({
  to = 100,
  duration = 900,
  prefix = "",
  suffix = "",
  ease = 1.5,
  className = "",
}: {
  to?: number;
  duration?: number;     // ms
  prefix?: string;
  suffix?: string;
  ease?: number;         // 1–3 feels nice
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [val, setVal] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let started = false;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started) {
        started = true;
        const t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / duration);
          const eased = 1 - Math.pow(1 - p, ease);
          setVal(Math.round(eased * to));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.35 });

    obs.observe(el);
    return () => obs.disconnect();
  }, [to, duration, ease]);

  return (
    <div
      ref={ref}
      className={`text-3xl sm:text-4xl font-semibold tracking-tight ${className}`}
    >
      {prefix}{val}{suffix}
    </div>
  );
}
