"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

/** ---------- tiny utils ---------- */
function cn(...xs: Array<string | false | undefined>) {
  return xs.filter(Boolean).join(" ");
}

const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

/** ---------- Scroll reveal hook ---------- */
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
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return { ref, visible };
}

/** ---------- Parallax hook (hero only) ---------- */
function useParallax(max = 50) {
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

/** ---------- Simple Section (no boxes, just rhythm) ---------- */
function Section({
  className,
  children,
  bleed = false,
}: {
  className?: string;
  children: React.ReactNode;
  bleed?: boolean;
}) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const wrap = (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-[cubic-bezier(.22,1,.36,1)]",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
        className
      )}
    >
      {children}
    </div>
  );

  if (bleed) {
    return <section className="py-10 md:py-16">{wrap}</section>;
  }
  return <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 md:py-24">{wrap}</section>;
}

/** ---------- Page ---------- */
export default function AboutPage() {
  const parallaxY = useParallax(56);
  const isiOS = useMemo(
    () => typeof navigator !== "undefined" && /iphone|ipad|ipod/i.test(navigator.userAgent),
    []
  );

  return (
    <>
      {/* HERO — full-bleed, readable, harmonious buttons */}
      <header className="relative isolate overflow-hidden">
        <Image
          src="/assets/glass-in-stream.jpg"
          alt=""
          fill
          priority
          className="object-cover object-center opacity-50"
          sizes="100vw"
        />
        {/* soft gradient for contrast so buttons/text always sit nicely */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/40 to-white/80" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-16 md:pt-24 pb-24 md:pb-32">
          <div
            className="max-w-3xl"
            style={{ transform: `translateY(${prefersReducedMotion ? 0 : parallaxY}px)` }}
          >
            <h1 className="text-[40px] leading-[1.05] md:text-[56px] font-semibold tracking-tight text-slate-900">
              The story behind{" "}
              <span
                className={cn(
                  "bg-clip-text text-transparent",
                  "bg-[url('/assets/leaf-texture.jpg')] bg-center bg-cover"
                )}
              >
                Velah
              </span>
            </h1>

            <p className="mt-5 text-slate-700 md:text-lg md:leading-8">
              Eco-luxury hydration. Glass over plastic. Ritual over routine. Purity without
              compromise.
            </p>

            <div className="mt-8 flex items-center gap-3">
              {/* button style that always fits on imagery: white pill with subtle border */}
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

      {/* STATEMENT — image-filled type (no box) */}
      <Section bleed>
        <div className="flex items-center justify-center">
          <h2
            className={cn(
              "text-center font-semibold tracking-tight",
              "text-[34px] sm:text-[46px] md:text-[64px] leading-[1.05]",
              "bg-clip-text text-transparent",
              "bg-[url('/assets/water-texture.jpg')] bg-cover bg-center"
            )}
          >
            Purity • Ritual • Refill
          </h2>
        </div>
      </Section>

      {/* ORIGIN — single flow, image bleeds, copy breathes */}
      <Section bleed>
        <div className="relative w-full h-[80vh]">
          <Image
            src="/assets/about-origin.png"
            alt="Velah origin"
            fill
            className="object-contain md:object-cover"
            sizes="100vw"
          />
        </div>
      </Section>

      <Section>
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-semibold">Origin</h2>
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

      {/* SUSTAINABILITY — no cards; just a bold word + a flowing line of points */}
      <Section>
        <div className="text-center">
          <div
            className={cn(
              "mx-auto max-w-5xl text-[32px] sm:text-[44px] md:text-[60px] font-semibold tracking-tight leading-[1.05]",
              "bg-clip-text text-transparent bg-[url('/assets/leaf-texture.jpg')] bg-center bg-cover"
            )}
          >
            Sustainability
          </div>
          <p className="mt-3 text-slate-600 md:text-lg">
            A refillable loop that feels good to use—and good to the planet.
          </p>
        </div>

        {/* flowing points — no borders/boxes */}
        <div className="mt-8 mx-auto max-w-4xl text-slate-700 md:text-lg">
          <ul className="space-y-3">
            <li>• Refill, not landfill — our glass gallons circulate in a durable loop.</li>
            <li>• Materials that last — glass preserves taste and cleans beautifully.</li>
            <li>• Smarter local routes — fresher water, lighter footprint.</li>
          </ul>
        </div>

        {/* soft nature strip behind the points, still no boxes */}
        <div className="mt-10 relative overflow-hidden">
          <div className="relative w-full h-[56vh]">
            <Image
              src="/assets/nature-detail.jpg"
              alt=""
              fill
              className="object-cover opacity-30"
              sizes="100vw"
            />
          </div>
        </div>
      </Section>

      {/* PROCESS — clean, typographic timeline (no cards) */}
      <Section>
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-semibold">Clarity, step by step</h2>
          <ol className="mt-6 space-y-5 text-slate-700 md:text-lg">
            <li>
              <span className="font-semibold">1.</span> Source & purify for pristine taste.
            </li>
            <li>
              <span className="font-semibold">2.</span> Fill glass gallons; sanitize, seal, and
              batch-track.
            </li>
            <li>
              <span className="font-semibold">3.</span> Deliver to your door. Empty bottles
              collected, cleaned, and returned to the loop.
            </li>
          </ol>
        </div>
      </Section>

      {/* COMMUNITY — single image + copy, no borders */}
      <Section bleed>
        <div className="relative w-full h-[70vh]">
          <Image
            src="/assets/about-community.jpg"
            alt="Community initiatives"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
      </Section>
      <Section>
        <div className="mx-auto max-w-3xl text-slate-700 md:text-lg">
          <h2 className="text-2xl md:text-3xl font-semibold">Community & impact</h2>
          <p className="mt-4">
            We partner with local organizations to support responsible water use and material
            recovery. As we grow, so does our capacity to give back.
          </p>
        </div>
      </Section>

      {/* CTA — keep it calm & harmonious with the hero buttons */}
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
