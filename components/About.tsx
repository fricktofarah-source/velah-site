// components/About.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "./LanguageProvider";

export default function About() {
  const { language, t } = useLanguage();
  const aboutCopy = t.about;
  const quotes = aboutCopy.quotes;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // 10s rotate; pause on hover
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % quotes.length), 10000);
    return () => clearInterval(timer);
  }, [paused, quotes.length]);

  useEffect(() => {
    setIndex(0);
  }, [language]);

  const q = quotes[index];

  return (
    <section
      id="about"
      className="section section-decor scroll-mt-24 sm:scroll-mt-32"
      data-tone="frost"
      aria-labelledby="about-title"
    >
      <div className="section-shell section-shell--wide">
        <div className="grid md:grid-cols-2 gap-10 sm:gap-12 md:gap-12 items-center">
          <div>
            <h2 id="about-title" className="text-4xl md:text-5xl font-semibold tracking-tight">{aboutCopy.heading}</h2>

            {aboutCopy.paragraphs.map((paragraph, idx) => (
              <p
                key={idx}
                className={`text-lg text-slate-700 leading-relaxed max-w-xl ${idx === 0 ? "mt-5" : "mt-4"}`}
              >
                {paragraph}
              </p>
            ))}

            <div className="mt-6">
              <Link href="/about" className="inline-block group focus-ring rounded-xl">
                <span className="relative inline-flex items-center gap-2 text-slate-700 transition-colors group-hover:text-velah">
                  <span>{aboutCopy.readMore}</span>
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
              key={index}
              className="
              relative
              rounded-2xl border border-slate-200 bg-white/80 backdrop-blur
              shadow-md p-6 sm:p-7 md:p-8
              transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)]
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
                {quotes.map((_, i) => {
                  const active = i === index;
                  return (
                    <button
                      key={i}
                      aria-label={language === "AR" ? `عرض الاقتباس ${i + 1}` : `Show quote ${i + 1}`}
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
      </div>
    </section>
  );
}
