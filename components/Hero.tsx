// components/Hero.tsx
"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { ABOUT_COPY } from "@/lib/aboutCopy";
import BottleCarouselStage from "@/components/BottleCarouselStage";
import { useLanguage } from "./LanguageProvider";
import { useParallaxEnabled } from "@/lib/useParallaxEnabled";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const { language } = useLanguage();
  const copy = ABOUT_COPY[language].hero;

  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-white via-[#f6fbfb] to-white pb-12 pt-0 sm:pb-24 sm:pt-8">
      <div className="absolute inset-0">
        <ScrollParallax amount={60} className="absolute inset-0">
          <Image
            src="/about/About_hero_bg.png"
            alt="Velah hero desert background"
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
        </ScrollParallax>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white via-white/70 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-white" />
        <ScrollParallax amount={30} className="absolute inset-x-0 top-0 flex justify-center opacity-70">
          <div className="mt-8 h-32 w-[70%] rounded-full bg-white/40 blur-3xl" />
        </ScrollParallax>
      </div>
      <div className="section-shell relative z-10">
        <ScrollParallax amount={-55}>
          <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,1.5fr)]">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease }}
              className="space-y-6 text-center lg:text-left"
            >
              <h1 className="text-5xl font-semibold uppercase tracking-[0.35em] text-slate-900 sm:text-6xl lg:text-[4.2rem]">
                Velah
              </h1>
              <h2 className="text-2xl font-semibold leading-tight text-slate-900 sm:text-3xl lg:text-[2.75rem]">
                {copy.heading}
              </h2>
              <p className="text-lg leading-relaxed text-slate-600 sm:text-xl">{copy.body}</p>
              <div className="flex flex-wrap justify-center gap-3 text-sm text-slate-500 lg:justify-start">
                {copy.bullets.map((bullet, idx) => (
                  <span key={bullet} className="inline-flex items-center gap-2">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        idx === 0 ? "bg-[var(--velah)]" : "bg-slate-300"
                      }`}
                    />
                    {bullet}
                  </span>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.9, ease, delay: 0.1 }}
              className="relative mx-auto flex w-full max-w-4xl flex-col items-center gap-6"
            >
              <BottleCarouselStage shots={copy.carouselShots} heightClass="h-[70vh] sm:h-[80vh]" showBackground={false} />
              <div className="text-center text-sm text-slate-500">
                {copy.scrollHint}
                <motion.span
                  className="mt-3 block text-lg text-slate-400"
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                >
                  ↓
                </motion.span>
              </div>
            </motion.div>
          </div>
        </ScrollParallax>
      </div>
    </section>
  );
}

type ScrollParallaxProps = {
  amount?: number;
  className?: string;
  children: ReactNode;
};

const ScrollParallax = ({ amount = 40, className, children }: ScrollParallaxProps) => {
  const parallaxEnabled = useParallaxEnabled();
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-amount, amount]);
  if (!parallaxEnabled || amount === 0) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
};
