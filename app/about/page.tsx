"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

/* ---------------- utils ---------------- */
function cn(...xs: Array<string | false | undefined>) {
  return xs.filter(Boolean).join(" ");
}

const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

/* ---------------- hooks ---------------- */
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (ents) => ents.forEach((e) => e.isIntersecting && setVisible(true)),
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return { ref, visible };
}

function useParallax(max = 60) {
  const [y, setY] = useState(0);
  useEffect(() => {
    if (prefersReducedMotion) return;
    const onScroll = () => setY(Math.min(max, (window.scrollY || 0) * 0.25));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [max]);
  return y;
}

function useCountUp(target: number, durationMs = 1600) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (prefersReducedMotion) {
      setValue(target);
      return;
    }
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / durationMs);
      setValue(Math.round(target * (1 - Math.cos(p * Math.PI)) / 2)); // ease-in-out
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, durationMs]);
  return value;
}

/* --------------- layout helpers --------------- */
function Section({
  children,
  className,
  bleed = false,
}: {
  children: React.ReactNode;
  className?: string;
  bleed?: boolean;
}) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const base =
    "transition-all duration-700 ease-[cubic-bezier(.22,1,.36,1)] " +
    (visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6");

  if (bleed) {
    return (
      <section className={cn("py-14 md:py-20", className)}>
        <div ref={ref} className={base}>{children}</div>
      </section>
    );
  }
  return (
    <section className={cn("mx-auto max-w-6xl px-4 sm:px-6 py-16 md:py-24", className)}>
      <div ref={ref} className={base}>{children}</div>
    </section>
  );
}

/* ---------------- page ---------------- */
export default function AboutPage() {
  const parallaxY = useParallax(56);
  const bottlesEliminated = useCountUp(947000); // adjust
  const co2Reduced = useCountUp(78411); // kg — adjust

  const isiOS = useMemo(
    () => typeof navigator !== "undefined" && /iphone|ipad|ipod/i.test(navigator.userAgent),
    []
  );

  return (
    <>
      {/* HERO — full-bleed, calm, buttons always harmonious */}
      <header className="relative isolate overflow-hidden">
        <Image
          src="/assets/Glaciar-water.jpg" // wide, serene water/glacier/lake
          alt=""
          fill
          priority
          className="object-cover object-center opacity-50"
          sizes="100vw"
        />
        {/* soft wash for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/40 to-white/80" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-20 md:pt-28 pb-28 md:pb-36">
          <div
            className="max-w-3xl"
            style={{ transform: `translateY(${prefersReducedMotion ? 0 : parallaxY}px)` }}
          >
            <h1 className="text-[40px] md:text-[56px] leading-[1.05] font-semibold tracking-tight text-slate-900">
              The story behind{" "}
              <span className="bg-clip-text text-transparent bg-[url('/assets/leaf-texture.jpg')] bg-cover bg-center">
                Velah
              </span>
            </h1>
            <p className="mt-5 text-slate-700 md:text-lg md:leading-8">
              Eco-luxury hydration. Glass over plastic. Ritual over routine. Purity without
              compromise.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <a
                href="/hydration"
                className="inline-flex h-11 items-center justify-center rounded-full px-6 border border-black/10 bg-white/90 backdrop-blur text-slate-900 hover:bg-white"
              >
                Explore your hydration
              </a>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("velah:open-waitlist"))}
                className="inline-flex h-11 items-center justify-center rounded-full px-6 border border-black/10 bg-white/60 backdrop-blur text-slate-900 hover:bg-white"
              >
                Join waitlist
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* BIG NARRATIVE LINE — image-filled type like your ref */}
      <Section bleed>
        <div className="flex items-center justify-center">
          <h2
            className={cn(
              "text-center font-semibold tracking-tight",
              "text-[36px] sm:text-[48px] md:text-[70px] leading-[1.04]",
              "bg-clip-text text-transparent bg-[url('/assets/glass-in-stream.jpg')] bg-cover bg-center"
            )}
          >
            THE FUTURE OF HYDRATION IS LOCAL
          </h2>
        </div>
      </Section>

      {/* ABSTRACT WATER LINES / DROP — clean visual divider */}
      <Section bleed className="pt-0">
        <div className="relative w-full h-[65vh]">
          <Image
            src="/assets/nature-detail.jpg" // swap to abstract water lines art if you have it
            alt=""
            fill
            className="object-cover opacity-30"
            sizes="100vw"
          />
        </div>
      </Section>

      {/* BOTTLE MOMENT — product in nature, full width */}
      <Section bleed className="pt-0">
        <div className="relative w-full h-[90vh]">
          <Image
            src="/assets/about-origin.png" // your bottle or brand shot
            alt="Velah bottle in nature"
            fill
            className="object-contain md:object-cover"
            sizes="100vw"
          />
        </div>
      </Section>

      {/* ORIGIN COPY — presentation tone */}
      <Section>
        <div className="mx-auto max-w-3xl">
          <h3 className="text-2xl md:text-3xl font-semibold">Origin</h3>
          <p className="mt-4 text-slate-700 md:text-lg">
            Velah began with a simple question: why accept plastic as the default? We set out to
            bring back the clarity of glass and the calm of a considered ritual—delivered weekly,
            designed to be refilled and reused.
          </p>
          <p className="mt-4 text-slate-700 md:text-lg">
            From Dubai, we’re building a closed-loop system that reduces waste and elevates everyday
            hydration into something quietly special.
          </p>
        </div>
      </Section>

      {/* SUSTAINABILITY LINE — no cards, just flowing points */}
      <Section>
        <div className="text-center">
          <div className="mx-auto max-w-5xl text-[32px] sm:text-[44px] md:text-[60px] font-semibold tracking-tight leading-[1.05] bg-clip-text text-transparent bg-[url('/assets/leaf-texture.jpg')] bg-center bg-cover">
            Sustainability
          </div>
          <p className="mt-3 text-slate-600 md:text-lg">
            A refillable loop that feels good to use—and good to the planet.
          </p>
        </div>
        <div className="mt-8 mx-auto max-w-4xl text-slate-700 md:text-lg">
          <ul className="space-y-3">
            <li>• Refill, not landfill — durable glass in continuous circulation.</li>
            <li>• Materials that last — pristine taste, effortless cleaning.</li>
            <li>• Smarter local routes — fresher water, lighter footprint.</li>
          </ul>
        </div>
      </Section>

      {/* IMPACT COUNTERS — like the ref site */}
      <Section bleed>
        <div className="relative w-full">
          <div className="absolute inset-0 -z-10">
            <Image
              src="/assets/Glaciar-water.jpg"
              alt=""
              fill
              className="object-cover opacity-40"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/30 to-white/80" />
          </div>

          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 md:py-24">
            <div className="grid gap-10 md:grid-cols-2">
              <div>
                <div className="text-sm uppercase tracking-wide text-slate-600">Bottles Eliminated (500mL)</div>
                <div className="mt-2 text-5xl md:text-6xl font-semibold tabular-nums">
                  {bottlesEliminated.toLocaleString()}+
                </div>
              </div>
              <div>
                <div className="text-sm uppercase tracking-wide text-slate-600">CO₂ Emissions Reduced</div>
                <div className="mt-2 text-5xl md:text-6xl font-semibold tabular-nums">
                  {co2Reduced.toLocaleString()} kg
                </div>
              </div>
            </div>
            <div className="mt-6 text-slate-600">Dubai, UAE</div>
          </div>
        </div>
      </Section>

      {/* CERTIFICATIONS — minimalist badges (no heavy boxes) */}
      <Section>
        <div className="text-slate-800/80 text-sm uppercase tracking-wide">Certified Standards</div>
        <h3 className="mt-2 text-2xl md:text-3xl font-semibold">Supplier Certifications</h3>

        <ul className="mt-6 flex flex-wrap items-center gap-4 md:gap-6">
          {/* Replace text with small SVGs/logos when you have them */}
          <li className="px-4 py-2 rounded-full border border-slate-200 bg-white/70 backdrop-blur">
            NSF
          </li>
          <li className="px-4 py-2 rounded-full border border-slate-200 bg-white/70 backdrop-blur">
            ISO
          </li>
          <li className="px-4 py-2 rounded-full border border-slate-200 bg-white/70 backdrop-blur">
            CE
          </li>
          <li className="px-4 py-2 rounded-full border border-slate-200 bg-white/70 backdrop-blur">
            WRAS
          </li>
          <li className="px-4 py-2 rounded-full border border-slate-200 bg-white/70 backdrop-blur">
            WQA
          </li>
        </ul>
      </Section>

      {/* PARTNERS — simple, elegant logo rail (no cards) */}
      <Section>
        <div className="text-slate-800/80 text-sm uppercase tracking-wide">Our Partners</div>
        <h3 className="mt-2 text-2xl md:text-3xl font-semibold">Trusted by leading groups</h3>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 opacity-90">
          {/* Replace with real logo images as they come in */}
          {["Partner One","Partner Two","Partner Three","Partner Four","Partner Five","Partner Six","Partner Seven","Partner Eight"].map((name) => (
            <div key={name} className="aspect-[3/2] flex items-center justify-center bg-white/70 backdrop-blur border border-slate-200">
              <span className="text-slate-600">{name}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA — mirrors hero buttons for harmony */}
      <Section>
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-semibold">Join the refillable future</h2>
          <p className="mt-3 text-slate-600 md:text-lg">
            Select your plan in minutes. Change or skip any week.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href="/hydration"
              className="inline-flex h-11 items-center justify-center rounded-full px-6 border border-black/10 bg-white/90 backdrop-blur text-slate-900 hover:bg-white"
            >
              Start your hydration
            </a>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("velah:open-waitlist"))}
              className="inline-flex h-11 items-center justify-center rounded-full px-6 border border-black/10 bg-white/60 backdrop-blur text-slate-900 hover:bg-white"
            >
              Join waitlist
            </button>
          </div>
        </div>
      </Section>
    </>
  );
}
