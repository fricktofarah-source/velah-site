// components/About.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

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

  // advance quotes on a timer (10s), pause on hover
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % QUOTES.length), 10000);
    return () => clearInterval(t);
  }, [paused]);

  const q = QUOTES[index];

  return (
    <section
      id="about"
      className="section max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      aria-labelledby="about-title"
    >
      <div className="grid md:grid-cols-2 gap-10 sm:gap-12 md:gap-12 items-center">
        {/* Left: brand story */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
        >
          <h2 id="about-title" className="text-4xl md:text-5xl font-semibold tracking-tight">
            About Velah
          </h2>

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
        </motion.div>

        {/* Right: rotating quote bubble (re-mounts each time for a clean pop) */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          <div
            key={index} /* re-mount to trigger a fresh pop each time */
            className="
              velah-bubble animate-velah-bubble-pop
              card-glass card-press
              p-6 sm:p-7 md:p-8 relative md:max-w-[560px] min-h-[180px]
            "
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            aria-live="polite"
          >
            <div className="text-slate-900 text-lg sm:text-xl leading-relaxed">
              “{q.text}”
            </div>
            <div className="mt-3 text-sm text-slate-500">{q.by}</div>

            {q.sub && (
              <div className="mt-3 text-sm text-slate-600/90">
                {q.sub}
              </div>
            )}

            {/* little selectors */}
            <div className="mt-5 flex items-center gap-2">
              {QUOTES.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Show quote ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`h-2.5 w-2.5 rounded-full transition tap ${
                    i === index ? "bg-slate-900" : "bg-slate-300 hover:bg-slate-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
