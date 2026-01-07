// components/HowItWorks.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "./LanguageProvider";
import { useParallaxEnabled } from "@/lib/useParallaxEnabled";

const STEP_ICONS: Record<number, React.ReactElement> = {
  1: (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path fill="currentColor" d="M7 4h10v2H7zM4 9h16v2H4zM7 14h10v2H7zM10 19h4v2h-4z" />
    </svg>
  ),
  2: (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M3 7h11v10H3zM14 10h3l4 4v3h-7zM7 20a2 2 0 1 0 0-4a2 2 0 0 0 0 4m10 0a2 2 0 1 0 0-4a2 2 0 0 0 0 4"
      />
    </svg>
  ),
  3: (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path fill="currentColor" d="M12 2a5 5 0 0 1 5 5v2H7V7a5 5 0 0 1 5-5m-2 20v-8h4v8z" />
    </svg>
  ),
  4: (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path fill="currentColor" d="M12 6V3l5 5l-5 5V9a5 5 0 1 0 5 5h2a7 7 0 1 1-7-7" />
    </svg>
  ),
};

const ease = [0.22, 1, 0.36, 1] as const;

export default function HowItWorks() {
  const { language, t } = useLanguage();
  const copy = t.howItWorks;
  const steps = copy.steps;
  const visuals = copy.visuals;
  const [active, setActive] = useState(1);
  const step = steps.find((s) => s.id === active) ?? steps[0];
  const stepCounterLabel = language === "AR" ? `الخطوة ${active} من ${steps.length}` : `Step ${active} of ${steps.length}`;
  const sectionRef = useRef<HTMLElement | null>(null);
  const parallaxEnabled = useParallaxEnabled();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgParallax = useTransform(scrollYProgress, [0, 1], [-120, 140]);
  const fgParallax = useTransform(scrollYProgress, [0, 1], [30, -60]);

  useEffect(() => {
    if (!steps.some((s) => s.id === active)) {
      setActive(steps[0]?.id ?? 1);
    }
  }, [steps, active]);

  useEffect(() => {
    setActive(steps[0]?.id ?? 1);
  }, [language, steps]);

  const sectionContent = (
    <>
      <header className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">{copy.tagline}</p>
        <h2 id="how-title" className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          {copy.heading}
        </h2>
      </header>

      <div className="mt-12 space-y-12">
        <Timeline steps={steps} active={active} onSelect={setActive} />

        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <motion.div
            key={`story-${active}`}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease }}
            className="space-y-6 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
              <span className="text-[var(--velah)]">{STEP_ICONS[step.id]}</span>
              {stepCounterLabel}
            </div>
            <h3 className="text-2xl font-semibold text-slate-900 sm:text-3xl">{step.title}</h3>
            <p className="text-lg leading-relaxed text-slate-600">{step.body}</p>
            <div className="flex flex-wrap justify-center gap-3 text-sm text-slate-600 lg:justify-start">
              {step.chips.map((chip) => (
                <span
                  key={chip}
                  className="inline-flex items-center rounded-full bg-white/70 px-4 py-1.5 font-medium shadow-[0_18px_40px_rgba(15,23,42,0.06)] backdrop-blur"
                >
                  {chip}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <button
                className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500"
                onClick={() => setActive((active % steps.length) + 1)}
              >
                {copy.next}
              </button>
              <Link href="/subscription" className="btn btn-primary rounded-full px-6 py-3 text-sm font-semibold">
                {copy.aiPlanCta}
              </Link>
            </div>
          </motion.div>

          <motion.div
            key={`scene-${active}`}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.05 }}
            className="relative overflow-hidden rounded-[3rem] border border-white/60 bg-white/30 p-8 shadow-[0_40px_120px_rgba(15,23,42,0.12)] backdrop-blur-xl"
          >
            <div className="pointer-events-none absolute inset-x-6 top-4 h-40 rounded-[2rem] bg-white/40 blur-3xl" />
            <StepScene stepId={step.id} visuals={visuals} />
          </motion.div>
        </div>
      </div>
    </>
  );

  return (
    <section
      ref={sectionRef}
      id="how"
      className="relative isolate overflow-hidden py-24 sm:py-32"
      aria-labelledby="how-title"
    >
      {parallaxEnabled ? (
        <motion.div style={{ y: bgParallax }} className="absolute inset-0">
          <Image
            src="/about/Desert_camels_bg.png"
            alt=""
            fill
            sizes="100vw"
            priority={false}
            className="object-cover object-center opacity-80 scale-x-[-1]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white/40 to-white" />
        </motion.div>
      ) : (
        <div className="absolute inset-0">
          <Image
            src="/about/Desert_camels_bg.png"
            alt=""
            fill
            sizes="100vw"
            priority={false}
            className="object-cover object-center opacity-80 scale-x-[-1]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white/40 to-white" />
        </div>
      )}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white via-white/70 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white via-white/70 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-16 mx-auto h-64 w-[80%] rounded-full bg-white/60 blur-[150px]" />
      <div className="pointer-events-none absolute left-[10%] top-12 h-56 w-56 rounded-full bg-[radial-gradient(circle,_rgba(127,203,216,0.18),_transparent_60%)] blur-3xl" />
      <div className="pointer-events-none absolute right-[5%] bottom-4 h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(148,163,184,0.2),_transparent_65%)] blur-[120px]" />
      {parallaxEnabled ? (
        <motion.div style={{ y: fgParallax }} className="section-shell relative z-10">
          {sectionContent}
        </motion.div>
      ) : (
        <div className="section-shell relative z-10">{sectionContent}</div>
      )}
    </section>
  );
}

const Timeline = ({
  steps,
  active,
  onSelect,
}: {
  steps: ReturnType<typeof useLanguage>["t"]["howItWorks"]["steps"];
  active: number;
  onSelect: (id: number) => void;
}) => (
  <div className="relative">
    <div className="hidden md:block absolute top-6 left-4 right-4 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
    <div className="flex snap-x gap-4 overflow-x-auto px-2 md:grid md:grid-cols-4 md:gap-8 md:px-0">
      {steps.map((s) => {
        const isActive = s.id === active;
        return (
          <button
            key={s.id}
            onClick={() => onSelect(s.id)}
            className="flex min-w-[8rem] snap-center flex-col items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-slate-500 transition"
            aria-current={isActive ? "step" : undefined}
          >
            <span
              className={`flex h-14 w-14 items-center justify-center rounded-full border-2 text-slate-700 transition ${
                isActive ? "scale-110 border-[var(--velah)] bg-white/90 text-[var(--velah)] shadow-[0_18px_40px_rgba(15,23,42,0.12)]" : "border-white/70 bg-white/40"
              }`}
            >
              {STEP_ICONS[s.id]}
            </span>
            <span className="text-[0.7rem] text-slate-600">{s.title}</span>
          </button>
        );
      })}
    </div>
  </div>
);

const StepScene = ({
  stepId,
  visuals,
}: {
  stepId: number;
  visuals: ReturnType<typeof useLanguage>["t"]["howItWorks"]["visuals"];
}) => {
  if (stepId === 1) {
    return <PlanScene items={visuals.plan} />;
  }
  if (stepId === 2) {
    return <DeliveryScene items={visuals.delivery} />;
  }
  if (stepId === 3) {
    return <EnjoyScene items={visuals.enjoy} />;
  }
  return <ReturnScene items={visuals.return} />;
};

const PlanScene = ({ items }: { items: Array<{ label: string; value: string }> }) => (
  <div className="space-y-4">
    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Plan Preview</p>
    <div className="space-y-3 text-sm text-slate-700">
      {items.map((item) => (
        <div key={item.label} className="flex items-center justify-between border-b border-white/60 pb-2">
          <span className="text-slate-500">{item.label}</span>
          <span className="font-semibold text-slate-900">{item.value}</span>
        </div>
      ))}
    </div>
  </div>
);

const DeliveryScene = ({ items }: { items: string[] }) => (
  <div className="space-y-5">
    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Route timeline</p>
    <div className="space-y-4 text-sm text-slate-700">
      {items.map((text) => (
        <div key={text} className="flex items-start gap-3">
          <span className="mt-1 h-2 w-2 rounded-full bg-[var(--velah)]" aria-hidden />
          <p>{text}</p>
        </div>
      ))}
    </div>
  </div>
);

const EnjoyScene = ({ items }: { items: string[] }) => (
  <div className="space-y-4">
    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Counter ritual</p>
    <div className="flex items-end justify-between gap-4">
      {items.map((text) => (
        <div key={text} className="flex flex-col items-center text-slate-600">
          <span className="h-28 w-12 rounded-full bg-gradient-to-b from-white/80 to-slate-100/50 shadow-inner shadow-white/30" />
          <span className="mt-3 text-sm font-semibold text-slate-900">{text}</span>
        </div>
      ))}
    </div>
  </div>
);

const ReturnScene = ({ items }: { items: string[] }) => (
  <div className="space-y-4">
    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Loop status</p>
    <div className="space-y-3 text-sm text-slate-700">
      {items.map((text, idx) => (
        <div key={text} className="flex items-center gap-3">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--velah)]/15 text-xs font-semibold text-[var(--velah)]">
            {idx + 1}
          </span>
          <p>{text}</p>
        </div>
      ))}
    </div>
  </div>
);
