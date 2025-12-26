"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

export default function ProgressRing({
  value,
  total,
}: {
  value: number;
  total: number;
}) {
  const reduceMotion = useReducedMotion();
  const percent = total > 0 ? Math.min(100, Math.round((value / total) * 100)) : 0;

  const { dash, circumference } = useMemo(() => {
    const size = 180;
    const stroke = 12;
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    return { dash: (percent / 100) * c, circumference: c };
  }, [percent]);

  return (
    <div className="relative flex items-center justify-center">
      <svg viewBox="0 0 180 180" className="h-44 w-44" aria-hidden>
        <defs>
          <linearGradient id="ringGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7FCBD8" />
            <stop offset="100%" stopColor="#4CAAB5" />
          </linearGradient>
        </defs>
        <circle cx="90" cy="90" r="78" stroke="#E5E7EB" strokeWidth="12" fill="none" />
        <motion.circle
          cx="90"
          cy="90"
          r="78"
          stroke="url(#ringGradient)"
          strokeWidth="12"
          fill="none"
          strokeDasharray={`${dash} ${circumference - dash}`}
          strokeLinecap="round"
          style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
          animate={reduceMotion ? undefined : { strokeDasharray: `${dash} ${circumference - dash}` }}
          transition={{ duration: reduceMotion ? 0 : 0.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-3xl font-semibold text-slate-900 tabular-nums">{percent}%</div>
        <div className="mt-1 text-xs text-slate-500">{value} / {total || 0} ml</div>
      </div>
    </div>
  );
}
