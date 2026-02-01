'use client';

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Counter from "./Counter";
import { useLanguage } from "./LanguageProvider";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type ImpactCopy = ReturnType<typeof useLanguage>["t"]["impact"];

export default function ImpactStats() {
  const { t } = useLanguage();
  const copy = t.impact;
  const stats = copy.stats;
  const sectionRef = useRef<HTMLElement | null>(null);

  useGSAP(() => {
    gsap.to(".impact-bg", {
      y: -80,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    gsap.to(".impact-content", {
      y: 40,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  }, { scope: sectionRef });


  return (
    <section
      ref={sectionRef}
      id="sustainability"
      className="relative isolate overflow-hidden py-28 sm:py-36"
    >
      <div className="absolute inset-0 impact-bg">
        <Image
          src="/about/Oasis_bg.png"
          alt=""
          fill
          sizes="100vw"
          priority={false}
          className="object-cover object-bottom scale-[0.95]"
        />
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-white via-white/65 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-white via-white/70 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-white via-white/80 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-white via-white/80 to-transparent" />
      <div className="section-shell relative z-10 impact-content">
        <Content stats={stats} copy={copy} />
      </div>
    </section>
  );
}

const Content = ({ stats, copy }: { stats: ImpactCopy["stats"]; copy: ImpactCopy }) => (
  <>
    <div className="flex flex-col gap-6">
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
    <div className="mt-8">
      <Link href="/sustainability" className="inline-block group focus-ring rounded-xl">
        <span className="relative inline-flex items-center gap-2 text-slate-700 transition-colors group-hover:text-velah">
          <span>{copy.cta}</span>
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          <span className="absolute left-0 -bottom-0.5 h-[2px] w-0 bg-current transition-all duration-300 group-hover:w-full" />
        </span>
      </Link>
    </div>
  </>
);
