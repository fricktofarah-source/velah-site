// components/About.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const QUOTES = [
  {
    by: "Founder",
    text:
      "We built Velah so water at home could be quiet, pure, and thoughtful. Glass keeps taste honest. The service removes friction so the ritual stays simple.",
    sub: "Fresh bottles delivered. Empties collected.",
  },
  {
    by: "Customer",
    text:
      "Switching to glass changed more than taste. The bottles look good on the counter and weekly swaps mean we never think about running out.",
    sub: "Consistent routes. Easy confirmations.",
  },
  {
    by: "Team",
    text:
      "Every bottle is sanitized and recirculated. Deposits make the loop work, and scheduling makes it feel effortless at the door.",
    sub: "Clean process from pickup to delivery.",
  },
];

export default function About() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // 10s rotate; pause on hover
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % QUOTES.length), 10000);
    return () => clearInterval(t);
  }, [paused]);

  const q = QUOTES[index];

  return (
    <section id="about" className="section max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-labelledby="about-title">
      <div className="grid md:grid-cols-2 gap-10 sm:gap-12 md:gap-12 items-center">
        {/* Left copy (unchanged) */}
        <div>
          <h2 id="about-title" className="text-4xl md:text-5xl font-semibold tracking-tight">About Velah</h2>

          <p className="mt-5 text-lg text-slate-700 leading-relaxed max-w-xl">
            Velah is water without noise. We deliver in reusable glass, sealed with stainless,
            and picked up on weekly routes so bottles keep circulating.
          </p>
          <p className="mt-4 text-lg text-slate-700 leading-relaxed max-w-xl">
            The idea is simple. Pure taste at home, less waste in the city. A service that
            feels as considered as the product. You confirm deliveries when you need them,
            and we handle the rest at your door.
          </p>
          <p className="mt-4 text-lg text-slate-700 leading-relaxed max-w-xl">
            Velah is a small ritual in glass. Clean, calm, and made to last.
          </p>

          <div className="mt-6">
            <Link href="/about" className="inline-block group focus-ring rounded-xl">
              <span className="relative inline-flex items-center gap-2 text-slate-700 transition-colors group-hover:text-velah">
                <span>Read more</span>
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                <span className="absolute left-0 -bottom-0.5 h-[2px] w-0 bg-current transition-all duration-300 group-hover:w-full" />
              </span>
            </Link>
          </div>
        </div>

        {/* Right: speech bubble that rotates */}
        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div
            key={index} // re-mount to pop on change
            className="
              relative
              rounded-2xl border border-slate-200 bg-white/80 backdrop-blur
              shadow-md p-6 sm:p-7 md:p-8
              animate-pop-in
              after:content-[''] after:absolute after:-bottom-3 after:left-10
              after:h-4 after:w-4 after:rotate-45 after:bg-white/80 after:border after:border-slate-200
            "
            aria-live="polite"
          >
            <div className="text-slate-900 text-lg sm:text-xl leading-relaxed">
              “{q.text}”
            </div>
            <div className="mt-3 text-sm text-slate-500">{q.by}</div>
            {q.sub && <div className="mt-3 text-sm text-slate-600/90">{q.sub}</div>}

            {/* selectors — small, not massive */}
            <div className="mt-5 flex items-center gap-2">
              {QUOTES.map((_, i) => {
                const active = i === index;
                return (
                  <button
                    key={i}
                    aria-label={`Show quote ${i + 1}`}
                    onClick={() => setIndex(i)}
                    className="h-6 w-6 grid place-items-center rounded-full hover:bg-slate-100 focus-ring"
                  >
                    <span
                      className={[
                        "block rounded-full transition",
                        active ? "h-2.5 w-2.5 bg-slate-900" : "h-2 w-2 bg-slate-300 group-hover:bg-slate-400",
                      ].join(" ")}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
