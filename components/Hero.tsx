// components/Hero.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { translations } from "@/lib/i18n";
import { useLanguage } from "./LanguageProvider";

type Slide = { src: string; alt: string; position?: string };

export default function Hero() {
  const { language, t } = useLanguage();
  const heroCopy = t.hero;
  const slides: Slide[] = heroCopy.slides?.length ? heroCopy.slides : translations.EN.hero.slides;
  const revealClass = useMemo(
    () =>
      "transition-opacity duration-[700ms] ease-[cubic-bezier(.22,1,.36,1)] opacity-0 translate-y-6 animate-[heroReveal_0.7s_ease_0.1s_forwards]",
    []
  );

  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => window.clearInterval(id);
  }, [slides.length]);

  useEffect(() => {
    setActive(0);
  }, [language, slides.length]);

  return (
    <section
      className="relative isolate pt-0 pb-16 sm:pb-20"
      aria-label="Velah reusable glass water service"
    >
      <style>{`
        @keyframes heroReveal {
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_-10%,rgba(127,203,216,0.18),transparent_75%)]" />
      </div>

      {/* Full-width slider */}
      <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden -mt-16 sm:-mt-20" dir="ltr">
        <div className="relative aspect-[20/12] sm:aspect-[22/12] lg:aspect-[24/12]" dir="ltr" aria-live="polite">
          <div
            className="flex h-full w-full transition-transform duration-[1200ms] ease-[cubic-bezier(.22,1,.36,1)] will-change-transform"
            style={{ transform: `translateX(-${active * 100}%)` }}
          >
            {slides.map((slide, idx) => {
              const isSvg = slide.src.toLowerCase().endsWith(".svg");
              return (
                <div key={`${slide.src}-${idx}`} className="relative h-full w-full shrink-0 min-w-full bg-black" aria-hidden={idx !== active}>
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    sizes="100vw"
                    priority={idx === 0}
                    className="object-cover object-center"
                    style={{ objectPosition: slide.position ?? "50% 50%" }}
                    unoptimized={isSvg}
                    loading={idx === 0 ? "eager" : "lazy"}
                    draggable={false}
                  />
                </div>
              );
            })}
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center sm:justify-between items-end px-4 pb-6 sm:px-8 sm:pb-8">
            {heroCopy.sliderLabel ? (
              <div className="hidden sm:block text-xs font-semibold uppercase tracking-[0.26em] text-white/80">
                {heroCopy.sliderLabel}
              </div>
            ) : (
              <div className="hidden sm:block text-xs font-semibold uppercase tracking-[0.26em] text-white/80">
                Velah
              </div>
            )}
            <div className="flex items-center gap-2 pointer-events-auto">
              {slides.map((_, idx) => {
                const isActive = idx === active;
                return (
                  <button
                    key={idx}
                    type="button"
                    aria-label={`Show slide ${idx + 1}`}
                    onClick={() => setActive(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 focus-ring ${
                      isActive ? "w-8 bg-white" : "w-2.5 bg-white/50 hover:bg-white/80"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Hero content */}
      <div className="mt-10 px-4 sm:px-6 sm:mt-14">
        <div className={`${revealClass} mx-auto flex max-w-3xl flex-col items-center gap-5 text-center`}>
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-500">
              {heroCopy.badge}
            </div>
            <h1 className="mt-3 text-3xl sm:text-[2.75rem] font-semibold tracking-tight text-slate-900">
              {heroCopy.heading}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
              {heroCopy.body}
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
            <button
              type="button"
              className="btn btn-primary h-11 px-6 focus-ring"
              onClick={() => {
                window.dispatchEvent(new Event("velah:open-waitlist"));
              }}
            >
              {heroCopy.primaryCta}
            </button>
            <Link href="/#about" className="link-underline text-sm font-medium">
              {heroCopy.secondaryCta}
            </Link>
          </div>
        </div>
      </div>

    </section>
  );
}
