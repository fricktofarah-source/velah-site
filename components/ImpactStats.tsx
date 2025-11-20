'use client';

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Counter from "./Counter";
import { useLanguage } from "./LanguageProvider";
import { useParallaxEnabled } from "@/lib/useParallaxEnabled";

type ImpactCopy = ReturnType<typeof useLanguage>["t"]["impact"];

export default function ImpactStats() {
  const { t } = useLanguage();
  const copy = t.impact;
  const stats = copy.stats;
  const sectionRef = useRef<HTMLElement | null>(null);
  const parallaxEnabled = useParallaxEnabled();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgParallax = useTransform(scrollYProgress, [0, 1], [-140, 180]);
  const fgParallax = useTransform(scrollYProgress, [0, 1], [40, -60]);

  return (
    <section
      ref={sectionRef}
      id="sustainability"
      className="relative isolate overflow-hidden py-28 sm:py-36"
    >
      {parallaxEnabled ? (
        <motion.div style={{ y: bgParallax }} className="absolute inset-0">
          <Image
            src="/about/Oasis_bg.png"
            alt=""
            fill
            sizes="100vw"
            priority={false}
            className="object-cover object-bottom scale-[0.95]"
          />
        </motion.div>
      ) : (
        <div className="absolute inset-0">
          <Image
            src="/about/Oasis_bg.png"
            alt=""
            fill
            sizes="100vw"
            priority={false}
            className="object-cover object-bottom scale-[0.95]"
          />
        </div>
      )}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-white via-white/65 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-white via-white/70 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-white via-white/80 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-white via-white/80 to-transparent" />
      {parallaxEnabled ? (
        <motion.div style={{ y: fgParallax }} className="section-shell relative z-10">
          <Content stats={stats} copy={copy} />
        </motion.div>
      ) : (
        <div className="section-shell relative z-10">
          <Content stats={stats} copy={copy} />
        </div>
      )}
    </section>
  );
}

const Content = ({ stats, copy }: { stats: ImpactCopy["stats"]; copy: ImpactCopy }) => (
  <>
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <span className="text-[11px] uppercase tracking-[0.2em] text-slate-500 font-medium">
          {copy.badge}
        </span>
        <h2 className="mt-3 text-2xl sm:text-4xl font-semibold tracking-tight text-slate-900">
          {copy.heading}
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl lg:max-w-[32rem]">
          {copy.body}
        </p>
      </div>
      <Link href="/sustainability" className="btn btn-primary h-11 rounded-full px-6">
        {copy.cta}
      </Link>
    </div>

    <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((item) => (
        <div
          key={item.label}
          className="rounded-[2rem] border border-white/60 bg-white/90 p-6 text-center shadow-[0_30px_70px_rgba(15,23,42,0.15)] backdrop-blur [mask-image:linear-gradient(90deg,rgba(0,0,0,0.95),rgba(0,0,0,0.95),rgba(0,0,0,0.4))]"
        >
          <Counter to={item.value} suffix={item.suffix} duration={1200} className="text-4xl" />
          <div className="mt-2 text-sm font-semibold text-slate-900">{item.label}</div>
          <p className="mt-1 text-sm text-slate-600">{item.description}</p>
        </div>
      ))}
    </div>
  </>
);
