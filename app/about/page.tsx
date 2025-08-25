"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

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
function useParallax(max = 40) {
  const [y, setY] = useState(0);
  useEffect(() => {
    if (prefersReducedMotion) return;
    const onScroll = () => {
      const s = window.scrollY || 0;
      setY(Math.min(max, s * 0.25)); // gentle
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [max]);
  return y;
}

/** ---------- Section wrapper with reveal ---------- */
function Section({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <section
      ref={ref}
      className={cn(
        "mx-auto max-w-6xl px-4 sm:px-6 py-16 md:py-24",
        "transition-all duration-700 ease-[cubic-bezier(.22,1,.36,1)]",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
        className
      )}
    >
      {children}
    </section>
  );
}

/** ---------- Page ---------- */
export default function AboutPage() {
  const parallaxY = useParallax(48);

  return (
    <>
      {/* HERO */}
      <header className="relative isolate overflow-hidden bg-white">
        {/* Background image (swap to your asset path if you want a photo hero) */}
        <div
          className="absolute inset-0 -z-10"
          aria-hidden
        >
          {/* Soft gradient base (keeps luxe look if no photo present) */}
          <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_80%_-10%,#E6F5F8_0%,#FFFFFF_55%)]" />
          {/* Optional hero photo overlay */}
          <Image
            src="/assets/about-hero.jpg" // <-- put your hero image here; or remove if not available
            alt=""
            fill
            priority
            className="object-cover object-center opacity-50"
            sizes="100vw"
          />
          {/* White veil for readability */}
          <div className="absolute inset-0 bg-white/35" />
        </div>

        <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-14 md:pt-20 pb-20 md:pb-28">
          <div
            className="max-w-2xl"
            style={{ transform: `translateY(${prefersReducedMotion ? 0 : parallaxY}px)` }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-slate-600 bg-white/70 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Refillable Glass • Dubai & GCC
            </div>
            <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight text-slate-900">
              The story behind <span className="text-slate-800">Velah</span>
            </h1>
            <p className="mt-4 text-slate-600 leading-7 md:text-lg md:leading-8">
              Eco-luxury hydration, designed for modern homes. Glass over plastic.
              Ritual over routine. Purity without compromise.
            </p>

            <div className="mt-8 flex items-center gap-3">
              <a
                href="/hydration"
                className="btn btn-primary h-11 rounded-full px-6"
              >
                Explore your hydration
              </a>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("velah:open-waitlist"))}
                className="btn btn-ghost h-11 rounded-full px-6"
              >
                Join waitlist
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ORIGIN */}
      <Section>
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-2xl md:text-3xl font-semibold">Origin</h2>
            <p className="mt-4 text-slate-600 leading-7">
              Velah began with a simple question: why accept plastic as the default?
              We set out to bring back the clarity of glass and the calm of a
              considered ritual—delivered weekly, designed to be refilled and reused.
            </p>
            <p className="mt-3 text-slate-600 leading-7">
              From Dubai, we’re building a closed-loop system that reduces waste and
              elevates everyday hydration into something quietly special.
            </p>
          </div>
          <div className="order-1 md:order-2 relative aspect-[4/3] rounded-2xl overflow-hidden border">
            <Image
              src="/assets/about-origin.jpg" // swap to your actual asset name
              alt="Velah glass bottles"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </Section>

      {/* SUSTAINABILITY */}
      <Section className="bg-white">
        <div className="rounded-2xl border p-6 md:p-10">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold">Refill, not landfill</h3>
              <p className="mt-2 text-slate-600">
                Our glass gallons circulate in a closed loop. Every return saves plastic,
                energy, and visual noise at home.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Fewer miles, fresher water</h3>
              <p className="mt-2 text-slate-600">
                Local routes in Dubai mean shorter journeys and fresher bottles.
                Efficient routing reduces our footprint.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Designed to last</h3>
              <p className="mt-2 text-slate-600">
                Glass cleans beautifully and preserves taste. Durable hardware,
                minimal branding, maximal calm.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* PROCESS / CRAFT */}
      <Section>
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border">
            <Image
              src="/assets/about-process.jpg" // swap to your actual asset name
              alt="Filling process"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold">Clarity, step by step</h2>
            <ol className="mt-4 space-y-3 text-slate-700">
              <li className="flex gap-3">
                <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full border">1</span>
                Source & purify for pristine taste.
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full border">2</span>
                Fill glass gallons; sanitize, seal, and batch-track.
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full border">3</span>
                Deliver to your door. Empty bottles collected, cleaned, and returned to the loop.
              </li>
            </ol>
          </div>
        </div>
      </Section>

      {/* COMMUNITY */}
      <Section>
        <div className="rounded-2xl border p-6 md:p-10">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold">Community & impact</h2>
              <p className="mt-4 text-slate-600 leading-7">
                We partner with local organizations to support responsible water use and
                material recovery. As we grow, so does our capacity to give back.
              </p>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border">
              <Image
                src="/assets/about-community.jpg" // swap to your actual asset name
                alt="Community initiatives"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section className="pt-0">
        <div className="rounded-2xl border p-6 md:p-10 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold">Join the refillable future</h2>
          <p className="mt-3 text-slate-600 md:text-lg">
            Select your plan in minutes. Change or skip any week.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a href="/hydration" className="btn btn-primary h-11 rounded-full px-6">
              Start your hydration
            </a>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("velah:open-waitlist"))}
              className="btn btn-ghost h-11 rounded-full px-6"
            >
              Join waitlist
            </button>
          </div>
        </div>
      </Section>
    </>
  );
}
