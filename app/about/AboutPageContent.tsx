// app/about/AboutPageContent.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { animate, motion, useInView, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { ABOUT_COPY, type AboutCopy } from "@/lib/aboutCopy";

const ease = [0.22, 1, 0.36, 1] as const;

const LOGO_OUTER_PATH =
  "M373.8,396.3c44.65-3.5,85.61,15.16,118.21,44.19,3.75,3.33,16.86,18.6,20.51,18.5,2.11-.06,10.07-9.35,12.46-11.5,40-35.84,84.5-59.26,140.24-49.21,111.93,20.18,137.37,170.67,31.13,219.59-67.11,30.9-136.35-.55-184-49.79-38.96,34.81-82.78,65.27-137.9,61.97-151.93-9.09-151.64-221.91-.66-233.74";
const LOGO_WAVE_PATH =
  "M643,589h-14.5c-26.43,0-58.34-25.24-75.01-43.99-48.65-54.67-97.31-133.12-182.86-122.89-99.44,11.9-116.5,145.81-21.59,177.33,58.26,19.35,111.82-14.69,150.47-55.44,4-4.22,6.09-11.11,13.01-11.05,5.98.05,8.51,7.35,11.97,11.05,40.06,42.89,95.85,77.53,156.19,53.17,84.48-34.11,70.51-153.47-15.48-172.88-54.04-12.2-99.58,15.43-135.02,53.19,31.39,34.27,54.25,76.98,93.9,102.93l18.92,8.58";
const LOGO_FULL_PATH = `${LOGO_OUTER_PATH}Z${LOGO_WAVE_PATH}Z`;

const LOGO_SEGMENTS = [
  { d: LOGO_OUTER_PATH, duration: 5 },
  { d: LOGO_WAVE_PATH, duration: 3.5 },
] as const;
const LOGO_TOTAL_DURATION = LOGO_SEGMENTS.reduce((acc, segment) => acc + segment.duration, 0);

type ScrollParallaxProps = {
  amount?: number;
  className?: string;
  children: ReactNode;
};

const ScrollParallax = ({ amount = 40, className, children }: ScrollParallaxProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-amount, amount]);
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
};

const revealProps = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.4 },
  transition: { duration: 0.8, ease, delay },
});

type AnimatedCounterProps = {
  value: number;
  suffix?: string;
};

const AnimatedCounter = ({ value, suffix = "" }: AnimatedCounterProps) => {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.1,
      ease,
      onUpdate: (v) => setDisplay(Math.floor(v)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref} className="text-3xl font-semibold text-slate-900 sm:text-4xl">
      {display}
      {suffix}
    </span>
  );
};

const PlaceholderBlock = ({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) => (
  <div
    className={`relative flex items-center justify-center rounded-[2rem] border border-slate-200 bg-white/80 text-[0.65rem] font-semibold uppercase tracking-[0.45em] text-slate-400 shadow-[0_35px_80px_rgba(15,23,42,0.08)] ${className}`}
    aria-hidden="true"
  >
    {label}
  </div>
);

const AboutPageContent = () => {
  const { language } = useLanguage();
  const copy = ABOUT_COPY[language];

  return (
    <div className="bg-white text-slate-900">
      <HeroSection copy={copy.hero} />
      <ProblemSection copy={copy.problem} />
      <SparkSection copy={copy.spark} />
      <FlowSection copy={copy.flow} />
      <SustainabilitySection copy={copy.sustainability} />
      <DubaiSection copy={copy.dubai} />
      <UseCasesSection copy={copy.useCases} />
      <PartnersMarquee copy={copy.partners} />
      <ClosingSection copy={copy.closing} />
    </div>
  );
};

const HeroSection = ({ copy }: { copy: AboutCopy["hero"] }) => {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-white via-[#f6fbfb] to-white pb-12 pt-0 sm:pb-24 sm:pt-8">
      <div className="absolute inset-0">
        <ScrollParallax amount={30} className="absolute inset-0">
          <Image
            src="/about/About_hero_bg.png"
            alt="Velah hero desert background"
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
        </ScrollParallax>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-white" />
        <ScrollParallax amount={15} className="absolute inset-x-0 top-0 flex justify-center opacity-70">
          <div className="mt-8 h-32 w-[70%] rounded-full bg-white/40 blur-3xl" />
        </ScrollParallax>
      </div>
      <div className="section-shell relative z-10">
        <ScrollParallax amount={-35}>
          <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,1.5fr)]">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease }}
              className="space-y-6 text-center lg:text-left"
            >
              <div className="text-xs font-semibold uppercase tracking-[0.45em] text-slate-500">
                {copy.badge}
              </div>
              <h1 className="text-4xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-[3.4rem]">
                {copy.heading}
              </h1>
              <p className="text-lg leading-relaxed text-slate-600 sm:text-xl">
                {copy.body}
              </p>
              <div className="flex flex-wrap justify-center gap-3 text-sm text-slate-500 lg:justify-start">
                {copy.bullets.map((bullet, idx) => (
                  <span key={bullet} className="inline-flex items-center gap-2">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${idx === 0 ? "bg-[var(--velah)]" : "bg-slate-300"}`}
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
              className="relative mx-auto flex w-full max-w-3xl flex-col items-center_gap-6"
            >
              <div className="relative flex h-[65vh] w-full items-center justify-center">
                <motion.div
                  className="absolute inset-x-10 top-1/2 h-28 -translate-y-1/2 rounded-full bg-white/35 blur-3xl"
                  animate={{ opacity: [0.25, 0.55, 0.25], scaleX: [1, 1.12, 1] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute inset-8 flex items-center justify-center"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
                >
                  <div className="h-[86%] w-[86%] rounded-full border border-white/20" />
                </motion.div>
                <AnimatedVelahLogo />
              </div>
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
};

const AnimatedVelahLogo = () => {
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    const t = requestAnimationFrame(() => setIsReady(true));
    return () => cancelAnimationFrame(t);
  }, []);
  return (
    <motion.div
      className="relative flex h-full w-full max-w-[420px] items-center justify-center drop-shadow-[0_35px_90px_rgba(15,23,42,0.18)]"
      animate={{ y: [0, -12, 0], scale: [1, 1.012, 1], rotate: [0, 0.2, 0] }}
      transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <motion.svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" className="w-full">
        <motion.path
          d={LOGO_FULL_PATH}
          fill="none"
          stroke="#0F172A"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          initial={{ strokeDasharray: 1, strokeDashoffset: 1 }}
          animate={{ strokeDashoffset: isReady ? 0 : 1 }}
          transition={{ duration: LOGO_TOTAL_DURATION, ease: "easeInOut" }}
        />
        <motion.path
          d={LOGO_FULL_PATH}
          fill="#0F172A"
          initial={{ opacity: 0 }}
          animate={{ opacity: isReady ? 1 : 0 }}
          transition={{ delay: LOGO_TOTAL_DURATION - 1, duration: 1, ease: "easeInOut" }}
        />
      </motion.svg>
    </motion.div>
  );
};

const ProblemSection = ({ copy }: { copy: AboutCopy["problem"] }) => (
  <section className="section-shell py-24 sm:py-32">
    <div className="grid gap-12 lg:grid-cols-2">
      <motion.div {...revealProps()} className="text-center lg:text-left">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">{copy.label}</p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          {copy.heading}
        </h2>
        <p className="mt-6 text-lg leading-relaxed text-slate-600">{copy.body}</p>
        <div className="mt-10 grid gap-8 text-center sm:grid-cols-3 sm:text-left">
          {copy.stats.map((stat) => (
            <div key={stat.label} className="relative space-y-2">
              <span className="absolute -left-3 top-2 hidden h-2 w-2 rounded-full bg-[var(--velah)]/70 sm:block" />
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              <p className="text-sm text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
      <motion.div {...revealProps(0.1)} className="relative">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2.5rem]">
          <Image
            src="/about/Dirty_plastic_bottle.jpg"
            alt="Discarded plastic bottle"
            fill
            sizes="(min-width: 1024px) 520px, 90vw"
            className="object-cover"
          />
        </div>
      </motion.div>
    </div>
  </section>
);

const SparkSection = ({ copy }: { copy: AboutCopy["spark"] }) => (
  <section className="section-shell py-24 sm:py-32">
    <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
      <motion.div {...revealProps()} className="text-center lg:text-left">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
          {copy.label}
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-[2.6rem]">
          {copy.heading}
        </h2>
        <p className="mt-6 text-lg leading-relaxed text-slate-600">{copy.body}</p>
      </motion.div>
      <motion.div {...revealProps(0.1)} className="relative">
        {/* POUR PHOTO OR SHORT LOOP HERE */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-white via-slate-50 to-[#f6fbfb]">
          <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(127,203,216,0.12),_transparent_60%)]" />
          <div className="relative flex aspect-[4/3] w-full items-center justify-center text-[0.65rem] font-semibold uppercase tracking-[0.45em] text-slate-400">
            POUR PHOTO
          </div>
        </div>
        <p className="mt-5 text-sm text-slate-500">{copy.note}</p>
      </motion.div>
    </div>
  </section>
);

const FlowSection = ({ copy }: { copy: AboutCopy["flow"] }) => (
  <section className="section-shell py-24 sm:py-32">
    <div className="text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
        {copy.label}
      </p>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
        {copy.heading}
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">{copy.body}</p>
    </div>
    <div className="relative mt-12 grid gap-10 lg:grid-cols-3">
      <motion.span
        className="pointer-events-none absolute top-6 hidden h-0.5 w-full bg-gradient-to-r from-transparent via-[var(--velah)] to-transparent lg:block"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.9, ease }}
        style={{ transformOrigin: "left center" }}
      />
      {copy.steps.map((step, idx) => (
        <motion.div
          key={step.title}
          {...revealProps(idx * 0.15)}
          className="relative pl-12 text-center lg:text-left"
        >
          <div className="absolute left-0 top-1 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--velah)]/12 text-sm font-semibold text-[var(--velah)]">
            {step.icon}
          </div>
          <h3 className="text-xl font-semibold text-slate-900">{step.title}</h3>
          <p className="mt-3 text-base text-slate-600">{step.body}</p>
        </motion.div>
      ))}
    </div>
  </section>
);

const SustainabilitySection = ({ copy }: { copy: AboutCopy["sustainability"] }) => (
  <section className="relative isolate overflow-hidden py-24 sm:py-32">
    <ScrollParallax amount={50} className="pointer-events-none absolute inset-0 opacity-80">
      <div className="absolute left-[-10%] top-10 h-64 w-64 rounded-full bg-[radial-gradient(circle,_rgba(127,203,216,0.12),_transparent_60%)] blur-3xl" />
      <div className="absolute bottom-4 right-[-10%] h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(148,163,184,0.15),_transparent_65%)] blur-3xl" />
    </ScrollParallax>
    <div className="section-shell relative z-10">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <ScrollParallax amount={25} className="space-y-4 text-center lg:text-left">
          <motion.div {...revealProps()}>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">{copy.label}</p>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{copy.heading}</h2>
            <p className="text-lg leading-relaxed text-slate-600">{copy.body}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-slate-500 lg:justify-start">
              {copy.bullets.map((bullet, idx) => (
                <span key={bullet} className="inline-flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${idx === 0 ? "bg-[var(--velah)]" : "bg-slate-400"}`}
                  />
                  {bullet}
                </span>
              ))}
            </div>
          </motion.div>
        </ScrollParallax>
        <div className="flex flex-col items-center">
          <ScrollParallax amount={-20} className="hidden w-full lg:block">
            <motion.div {...revealProps(0.1)}>
              <LoopDiagram
                data={{
                  title: copy.loopTitle,
                  heading: copy.loopHeading,
                  body: copy.loopBody,
                  indicator: copy.loopIndicatorLabel,
                  points: copy.loopPoints,
                }}
              />
            </motion.div>
          </ScrollParallax>
          <motion.ul
            {...revealProps(0.15)}
            className="mt-8 w-full space-y-4 text-left text-sm text-slate-600 lg:hidden"
          >
            {copy.loopPoints.map((point) => (
              <li key={point.title} className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-[var(--velah)]/60" />
                <div>
                  <p className="text-base font-semibold text-slate-900">{point.title}</p>
                  <p className="mt-1">{point.detail}</p>
                </div>
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
    </div>
  </section>
);

const DubaiSection = ({ copy }: { copy: AboutCopy["dubai"] }) => (
  <section className="relative isolate overflow-hidden bg-gradient-to-b from-white via-[#f4f7fb] to-white py-24 sm:py-32">
    <div className="absolute inset-0">
      <Image
        src="/about/Desertbg.png"
        alt="Velah Dubai desert background"
        fill
        sizes="100vw"
        priority={false}
        className="object-cover opacity-95"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
    </div>
    <div className="section-shell relative z-10">
      <ScrollParallax amount={-45}>
        <div className="grid gap-12 lg:grid-cols-[1fr_0.8fr] lg:items-center">
          <motion.div {...revealProps()} className="text-center lg:text-left">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
              {copy.label}
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              {copy.heading}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-slate-600">{copy.body}</p>
          </motion.div>
          <motion.div {...revealProps(0.1)} className="relative">
            <div className="relative aspect-[5/3] w-full overflow-hidden rounded-[2.5rem] border border-white/70 bg-slate-50 shadow-[0_35px_80px_rgba(15,23,42,0.12)]">
              <Image
                src="/about/velah_bottle_desert.png"
                alt="Velah bottle in the Dubai desert"
                fill
                sizes="(min-width: 1024px) 560px, 90vw"
                className="object-cover"
                priority={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/15 via-transparent to-transparent" />
            </div>
          </motion.div>
        </div>
      </ScrollParallax>
    </div>
  </section>
);

const UseCasesSection = ({ copy }: { copy: AboutCopy["useCases"] }) => (
  <section className="section-shell py-24 sm:py-32">
    <div className="text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">{copy.label}</p>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
        {copy.heading}
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">{copy.body}</p>
    </div>
    <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {copy.cards.map((card, idx) => (
        <motion.div
          key={card.title}
          {...revealProps(idx * 0.1)}
          className="flex flex-col gap-4 rounded-[1.75rem] border border-slate-200 bg-white/90 p-6 text-center shadow-[0_30px_70px_rgba(15,23,42,0.07)] lg:text-left"
        >
          {/* USE CASE IMAGE HERE */}
          <PlaceholderBlock
            label={`${card.title} IMAGE`}
            className="aspect-[4/3] w-full bg-gradient-to-b from-white to-slate-100/40"
          />
          <div className="space-y-2 lg:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
              {card.caption}
            </p>
            <p className="text-xl font-semibold text-slate-900">{card.title}</p>
            <p className="text-base text-slate-600">{card.text}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);

const PartnersMarquee = ({ copy }: { copy: AboutCopy["partners"] }) => (
  <section className="section-shell pt-0 pb-16">
    <motion.div {...revealProps(0.1)} className="space-y-6">
      <p className="text-center text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
        {copy.label}
      </p>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.8, ease }}
        className="relative -mx-6 overflow-hidden sm:mx-0"
      >
        <div className="flex animate-[marquee_22s_linear_infinite] gap-8 whitespace-nowrap text-base font-semibold text-slate-500">
          {[...Array(2)].map((_, loopIdx) => (
            <span key={loopIdx} className="flex gap-8">
              {copy.items.map((item) => (
                <span key={`${item}-${loopIdx}`} className="tracking-tight">
                  {item}
                </span>
              ))}
            </span>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent" />
      </motion.div>
    </motion.div>
  </section>
);

const ClosingSection = ({ copy }: { copy: AboutCopy["closing"] }) => (
  <section className="section-shell pb-24 pt-16 sm:pb-32">
    <motion.div
      {...revealProps()}
      className="rounded-[2.5rem] border border-slate-200 bg-white px-8 py-12 text-center shadow-[0_40px_120px_rgba(15,23,42,0.12)] sm:px-12"
    >
      <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/60 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--velah)]" />
        {copy.brandLabel}
      </div>
      <h2 className="mt-6 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
        {copy.heading}
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">{copy.body}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link href="/hydration" className="btn btn-primary min-w-[11rem] rounded-full px-6 py-3">
          {copy.primaryCta}
        </Link>
        <Link href="/subscription" className="btn btn-ghost min-w-[11rem] rounded-full px-6 py-3">
          {copy.secondaryCta}
        </Link>
      </div>
    </motion.div>
  </section>
);

export default AboutPageContent;
const LoopDiagram = ({
  data,
}: {
  data: {
    title: string;
    heading: string;
    body: string;
    indicator: string;
    points: Array<{ title: string; detail: string }>;
  };
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end center"],
  });
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 260]);
  const transforms = data.points.map((_, idx, arr) => {
    const angle = (idx / arr.length) * Math.PI * 2 - Math.PI / 2;
    const radius = 165;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  });

  return (
    <div
      ref={ref}
      className="relative mx-auto aspect-square w-full max-w-md rounded-full border border-slate-200 bg-white p-10"
    >
      <motion.div
        style={{ rotate }}
        className="absolute inset-6 rounded-full border-2 border-dashed border-[var(--velah)]/40"
      />
      <motion.div style={{ rotate }} className="pointer-events-none absolute inset-0">
        <span className="absolute -top-4 left-1/2 flex -translate-x-1/2 items-center gap-1 text-[var(--velah)]">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--velah)]/40 bg-white/80 text-[0.75rem] font-semibold">
            →
          </span>
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.4em]">
            {data.indicator}
          </span>
        </span>
      </motion.div>
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
        <p className="text-sm font-semibold tracking-[0.3em] text-slate-400">{data.title}</p>
        <p className="mt-3 text-2xl font-semibold text-slate-900">{data.heading}</p>
        <p className="mt-4 max-w-xs text-sm text-slate-500">{data.body}</p>
      </div>
      {data.points.map((point, idx) => {
        const pos = transforms[idx];
        return (
          <motion.div
            key={point.title}
            {...revealProps(idx * 0.08)}
            className="absolute hidden w-40 flex-col gap-1 rounded-2xl border border-white/70 bg-white/95 p-3 text-center text-xs text-slate-600 shadow-[0_18px_40px_rgba(15,23,42,0.08)] lg:flex"
            style={{
              top: `calc(50% + ${pos.y}px)`,
              left: `calc(50% + ${pos.x}px)`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <p className="text-[0.95rem] font-semibold text-slate-900">{point.title}</p>
            <p>{point.detail}</p>
          </motion.div>
        );
      })}
    </div>
  );
};
