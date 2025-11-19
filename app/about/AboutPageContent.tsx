// app/about/AboutPageContent.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { animate, motion, useInView, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { ABOUT_COPY, type AboutCopy } from "@/lib/aboutCopy";
import BottleCarouselStage from "@/components/BottleCarouselStage";

const ease = [0.22, 1, 0.36, 1] as const;

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
            <BottleCarouselStage
              shots={copy.carouselShots}
              heightClass="h-[70vh] sm:h-[80vh]"
              showBackground={false}
              className="w-full"
            />
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

const ProblemSection = ({ copy }: { copy: AboutCopy["problem"] }) => (
  <section className="section-shell py-24 sm:py-32">
    <div className="grid gap-12 lg:grid-cols-2">
      <motion.div {...revealProps()} className="text-center lg:text-left">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">{copy.label}</p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          {copy.heading}
        </h2>
        <p className="mt-6 text-lg leading-relaxed text-slate-600">{copy.body}</p>
        <div className="mt-8 grid gap-6 text-center sm:grid-cols-3 sm:text-left">
          {copy.stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-slate-200/70 p-4">
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              <p className="mt-2 text-sm text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
      <motion.div
        {...revealProps(0.1)}
        className="relative rounded-[2rem] border border-slate-200 bg-slate-50/70 p-6"
      >
        {/* PROBLEM COLLAGE IMAGE HERE */}
        <div className="flex h-full flex-col gap-4 text-sm text-slate-500">
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 text-center">{copy.collage[0]}</div>
          <div className="grid flex-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white/70 p-6 text-center">
              {copy.collage[1]}
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/70 p-6 text-center">
              {copy.collage[2]}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

const SparkSection = ({ copy }: { copy: AboutCopy["spark"] }) => (
  <section className="section-shell py-24 sm:py-32">
    <div className="rounded-[2.5rem] border border-slate-200 bg-white/80 p-8 sm:p-12 lg:p-16">
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
        <motion.div
          {...revealProps(0.1)}
          className="relative rounded-[2rem] border border-slate-200 bg-slate-50/70 p-6"
        >
          {/* POUR PHOTO OR SHORT LOOP HERE */}
          <PlaceholderBlock
            label="POUR PHOTO"
            className="aspect-[4/3] w-full bg-gradient-to-br from-white to-slate-100/40"
          />
          <p className="mt-4 text-sm text-slate-500">
            {copy.note}
          </p>
        </motion.div>
      </div>
    </div>
  </section>
);

const FlowSection = ({ copy }: { copy: AboutCopy["flow"] }) => (
  <section className="section-shell py-24 sm:py-32">
    <div className="rounded-[2.5rem] border border-slate-200 bg-slate-50/70 p-8 sm:p-12">
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
          className="pointer-events-none absolute top-16 hidden h-0.5 w-full bg-gradient-to-r from-transparent via-[var(--velah)] to-transparent lg:block"
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
            className="relative rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-[0_25px_60px_rgba(15,23,42,0.06)] lg:text-left"
          >
            {/* FLOW ICON / ILLUSTRATION HERE */}
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--velah)]/10 text-base font-semibold text-[var(--velah)]">
              {step.icon}
            </div>
            <h3 className="mt-6 text-xl font-semibold text-slate-900">{step.title}</h3>
            <p className="mt-3 text-base text-slate-600">{step.body}</p>
          </motion.div>
        ))}
      </div>
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
          <motion.div
            {...revealProps(0.15)}
            className="mt-8 grid w-full gap-4 text-center text-sm text-slate-600 lg:hidden"
          >
            {copy.loopPoints.map((point) => (
              <div
                key={point.title}
                className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.05)]"
              >
                <p className="text-base font-semibold text-slate-900">{point.title}</p>
                <p className="mt-1">{point.detail}</p>
              </div>
            ))}
          </motion.div>
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
