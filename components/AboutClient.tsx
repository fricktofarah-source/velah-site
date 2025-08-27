// components/AboutClient.tsx
"use client";

import Image from "next/image";
import Methodology from "./Methodology";
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

function useParallax(max = 56) {
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

/** Count-up that restarts when target changes (quick) */
function useCountUp(target: number, durationMs = 700) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (prefersReducedMotion) {
      setValue(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / durationMs);
      const eased = (1 - Math.cos(p * Math.PI)) / 2; // ease-in-out
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
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
      <section className={cn("py-20 md:py-28", className)}>
        <div ref={ref} className={base}>{children}</div>
      </section>
    );
  }
  return (
    <section className={cn("mx-auto max-w-6xl px-4 sm:px-6 py-20 md:py-28", className)}>
      <div ref={ref} className={base}>{children}</div>
    </section>
  );
}

/* --------- fade wrapper for tall visuals --------- */
function FadeEdges({
  children,
  top = true,
  bottom = true,
  className,
  size = "h-24 md:h-40 lg:h-48",
}: {
  children: React.ReactNode;
  top?: boolean;
  bottom?: boolean;
  className?: string;
  size?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      {children}
      {top && (
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0",
            "bg-gradient-to-b from-white to-transparent",
            size
          )}
        />
      )}
      {bottom && (
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-0",
            "bg-gradient-to-t from-white to-transparent",
            size
          )}
        />
      )}
    </div>
  );
}

/* --------- simple preloader (locks scroll until ready) --------- */
function usePageReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const done = () => setReady(true);
    if (document.readyState === "complete") done();
    else {
      window.addEventListener("load", done, { once: true });
      setTimeout(done, 1200); // fallback, a bit faster
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("load", done);
    };
  }, []);
  useEffect(() => {
    if (ready) document.body.style.overflow = "";
  }, [ready]);
  return ready;
}

/* ---------------- mini components ---------------- */
function StoryBubble({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-white/80 backdrop-blur shadow-soft p-4",
        "max-w-xs text-[13px] leading-5"
      )}
      role="note"
      aria-live="polite"
    >
      <div className="font-medium">{title}</div>
      <p className="mt-1 text-slate-600">{body}</p>
    </div>
  );
}

/* ---------------- page (client) ---------------- */
export default function AboutClient() {
  const ready = usePageReady();
  const parallaxY = useParallax(56);

  // counters become "planned" and animate when in view
  const { ref: impactRef, visible: impactVisible } = useReveal<HTMLDivElement>();
  const plannedBottles = useCountUp(impactVisible ? 947000 : 0, 700);
  const plannedCO2 = useCountUp(impactVisible ? 78411 : 0, 700);

  const isiOS = useMemo(
    () => typeof navigator !== "undefined" && /iphone|ipad|ipod/i.test(navigator.userAgent),
    []
  );

  // follow-on-scroll position for the hero story bubble (gentle, no layout shift)
  const [bubbleY, setBubbleY] = useState(0);
  useEffect(() => {
    if (prefersReducedMotion) return;
    const onScroll = () => setBubbleY(Math.min(32, window.scrollY * 0.08));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* PRELOADER */}
      {!ready && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center">
          <div className="animate-pulse text-xl tracking-wide">Velah</div>
          <div className="mt-3 h-1 w-32 overflow-hidden rounded bg-slate-200">
            <div className="h-full w-1/2 animate-[loading_0.9s_ease-in-out_infinite_alternate] bg-slate-400" />
          </div>
          <style jsx global>{`
            @keyframes loading {
              from { transform: translateX(-10%); }
              to { transform: translateX(60%); }
            }
          `}</style>
        </div>
      )}

      {/* HERO — full-bleed texture wash with subtle parallax */}
      <header className="relative isolate overflow-hidden">
        <Image
          src="/assets/water-texture.jpg"
          alt="Water background texture"
          fill
          priority
          className="object-cover object-center opacity-70"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/10 to-white/40" />

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

            {/* Sticky story bubble */}
            <div
              className="mt-6 relative"
              style={{ transform: `translateY(${bubbleY}px)` }}
            >
              <StoryBubble
                title="Reusable by design"
                body="We circulate bottles, not waste—glass that stays pristine, week after week."
              />
            </div>

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

      {/* BIG STATEMENT LINE */}
      <Section bleed className="pt-10 md:pt-14">
        <div className="flex items-center justify-center">
          <h2
            className={cn(
              "text-center font-semibold tracking-tight",
              "text-[36px] sm:text-[48px] md:text-[70px] leading-[1.04]",
              "bg-clip-text text-transparent bg-[url('/assets/glass-in-stream.jpg')] bg-cover bg-center"
            )}
          >
            GLASS NOT PLASTIC
          </h2>
        </div>
      </Section>

      {/* BOTTLE MOMENT — single strong visual */}
      <Section bleed className="pt-0">
        <FadeEdges top bottom size="h-24 md:h-40 lg:h-48">
          <div className="relative w-full h-[76vh] md:h-[86vh] flex items-center justify-center bg-white">
            <Image
              src="/assets/about-origin.png"
              alt="Velah bottle in nature"
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>
        </FadeEdges>
      </Section>

      {/* ORIGIN COPY */}
      <Section>
        <div className="mx-auto max-w-3xl">
          <h3 className="text-2xl md:text-3xl font-semibold">Origin</h3>
          <p className="mt-4 text-slate-700 md:text-lg">
            Velah began with a simple question: why accept plastic as the default? We set out to
            bring back the clarity of glass and the calm of a considered ritual delivered weekly,
            designed to be refilled and reused.
          </p>
          <p className="mt-4 text-slate-700 md:text-lg">
            From Dubai, we’re building a closed-loop system that reduces waste and elevates everyday
            hydration into something quietly special.
          </p>
        </div>
      </Section>

      {/* LOOP PILLARS — clean, tactile chips (not green-themed) */}
      <Section>
        <div className="text-center">
          <div className="mx-auto max-w-5xl text-[32px] sm:text-[44px] md:text-[60px] font-semibold tracking-tight leading-[1.05]">
            A refillable loop that’s effortless
          </div>
          <p className="mt-3 text-slate-600 md:text-lg">
            Minimal effort for you, maximal reuse for the planet.
          </p>
        </div>
        <div className="mt-8 mx-auto max-w-4xl">
          <ul className="grid sm:grid-cols-3 gap-3 sm:gap-4 text-sm">
            {[
              ["Refill", "Bottles sanitized & returned looking new."],
              ["Ritual", "Weekly rhythm, skip or change anytime."],
              ["Taste", "Glass + stainless keeps water pristine."],
            ].map(([title, body]) => (
              <li key={title} className="rounded-2xl border bg-white/80 backdrop-blur p-5">
                <div className="font-medium">{title}</div>
                <p className="mt-1 text-slate-600">{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* IMPACT COUNTERS — planned values; fast count-up */}
      <Section bleed>
        <div ref={impactRef} className="relative w-full">
          <div className="absolute inset-0 -z-10">
            <Image
              src="/assets/nature-detail.jpg"
              alt=""
              fill
              className="object-cover opacity-30"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/20 to-white/60" />
          </div>

          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 md:py-24">
            <div className="grid gap-10 md:grid-cols-2">
              <div>
                <div className="text-xs uppercase tracking-wide text-slate-600">
                  Planned bottles eliminated (500 mL)
                </div>
                <div className="mt-2 text-5xl md:text-6xl font-semibold tabular-nums">
                  {plannedBottles.toLocaleString()}+
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-slate-600">
                  Planned CO₂ emissions reduced
                </div>
                <div className="mt-2 text-5xl md:text-6xl font-semibold tabular-nums">
                  {plannedCO2.toLocaleString()} kg
                </div>
              </div>
            </div>
            <div className="mt-6 text-slate-600">Dubai, UAE</div>
          </div>
        </div>
      </Section>

      {/* PARTNERS */}
      <Section>
        <div className="text-slate-800/80 text-xs uppercase tracking-wide">Our Partners</div>
        <h3 className="mt-2 text-2xl md:text-3xl font-semibold">Trusted by leading groups</h3>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 opacity-90">
          {[
            "Partner One","Partner Two","Partner Three","Partner Four",
            "Partner Five","Partner Six","Partner Seven","Partner Eight",
          ].map((name) => (
            <div
              key={name}
              className="aspect-[3/2] flex items-center justify-center bg-white/70 backdrop-blur border border-slate-200"
            >
              <span className="text-slate-600">{name}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
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

      {/* Methodology / assumptions */}
      <Section className="pt-0">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Methodology />
        </div>
      </Section>
    </>
  );
}
