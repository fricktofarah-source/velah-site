"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/* ---------- helpers ---------- */
const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function useRevealOnce<T extends HTMLElement>(threshold = 0.18) {
  const ref = useRef<T | null>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (prefersReducedMotion) { setShown(true); return; }
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(
      (ents) => ents.forEach((e) => e.isIntersecting && setShown(true)),
      { threshold, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, shown };
}

function Band({
  children,
  bleed = false,
  className,
  pad = "py-20 md:py-28",
}: {
  children: React.ReactNode;
  bleed?: boolean;
  className?: string;
  pad?: string;
}) {
  const { ref, shown } = useRevealOnce<HTMLDivElement>();
  const anim = cn(
    "transition-all duration-700 ease-[cubic-bezier(.22,1,.36,1)]",
    shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
  );

  if (bleed) {
    return (
      <section className={cn(pad, className)}>
        <div ref={ref} className={anim}>{children}</div>
      </section>
    );
  }
  return (
    <section className={cn("max-w-6xl mx-auto px-4 sm:px-6", pad, className)}>
      <div ref={ref} className={anim}>{children}</div>
    </section>
  );
}

/* ---------- page ---------- */
export default function AboutClient() {
  // thin top progress bar
  const [prog, setProg] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const e = document.documentElement;
      const scrolled = e.scrollTop;
      const height = e.scrollHeight - e.clientHeight || 1;
      setProg(scrolled / height);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div
        aria-hidden
        className="fixed left-0 top-0 h-[2px] bg-[var(--velah,black)] z-40 transition-[width]"
        style={{ width: `${Math.round(prog * 100)}%` }}
      />

      {/* 0) HERO — centered type, airy veil */}
      <Band bleed className="relative overflow-hidden pt-24 md:pt-32 pb-16 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-24 -z-10 blur-3xl"
          style={{
            background:
              "radial-gradient(60% 40% at 50% 0%, rgba(127,203,216,0.18), transparent 60%)",
          }}
        />
        <h1 className="text-[40px] md:text-[56px] leading-[1.04] font-semibold tracking-tight">
          Hydration, made weightless
        </h1>
        <p className="mt-4 text-slate-700 md:text-lg max-w-3xl mx-auto">
          Velah is a refillable hydration loop in reusable glass. A calm, seamless experience:
          clean taste, simple rhythm, no fuss.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <a
            href="/hydration"
            className="inline-flex h-11 items-center rounded-full px-6 border border-black/10 bg-white/80 backdrop-blur hover:bg-white"
          >
            Explore hydration
          </a>
          <button
            className="inline-flex h-11 items-center rounded-full px-6 border border-black/10 bg-white/60 backdrop-blur hover:bg-white"
            onClick={() => window.dispatchEvent(new CustomEvent("velah:open-waitlist"))}
          >
            Join waitlist
          </button>
        </div>
      </Band>

      {/* 1) MEDIA BAND — blended, centered, with safe framing (no awkward crop) */}
      <Band bleed pad="py-8 md:py-12" className="relative">
        <div className="relative mx-auto w-[min(1100px,92vw)] aspect-[16/9] rounded-[28px] overflow-hidden">
          {/* If the top is getting cropped, nudge the position: object-[50%_35%] */}
          <Image
            src="/assets/velah-nature-1.jpg"
            alt="Velah bottles in airy waterfall light"
            fill
            sizes="100vw"
            priority
            className="object-cover object-[50%_40%]" 
          />
          {/* veil + mask to melt into page */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/35 via-white/10 to-white/70 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]" />
        </div>
      </Band>

      {/* 2) BIG TYPE WITH IMAGE-FILL — distinct look */}
      <Band className="text-center">
        <p className="text-xs uppercase tracking-wide text-slate-600">Why we exist</p>
        <h2
          className={cn(
            "mx-auto max-w-5xl font-semibold tracking-tight leading-[1.02]",
            "text-[36px] sm:text-[48px] md:text-[64px]"
          )}
          style={{
            // image-as-text color (blended), still readable
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            backgroundImage: "url('/assets/about/velah-nature-2.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "50% 35%",
          }}
        >
          GLASS OVER PLASTIC, RITUAL OVER ROUTINE
        </h2>
        <p className="mt-4 text-slate-700 md:text-lg max-w-3xl mx-auto">
          Most water delivery treats hydration like cargo. We think it should feel better than that.
          Velah keeps glass in motion, tasting clean, fitting your pace.
        </p>
      </Band>

      {/* 3) NARRATIVE — centered, no boxes */}
      <Band className="text-center">
        <h3 className="text-3xl sm:text-4xl font-semibold tracking-tight">How the loop flows</h3>
        <div className="mt-5 max-w-3xl mx-auto text-slate-700 md:text-lg space-y-4">
          <p>
            Pick your mix of 5G, 1L, and 500 mL. We suggest a starting plan—you edit freely or skip
            any week.
          </p>
          <p>
            We text before delivery. Confirm, change, or pause with a tap. On the next visit, empties
            go out and fresh bottles come in.
          </p>
          <p>
            Glass and stainless don’t carry flavor. Water stays water—clean, bright, the way it
            should be. Counter-ready by design.
          </p>
        </div>
      </Band>

      {/* 4) NATURE PULL QUOTE BAND — blended background, centered text overlay */}
      <Band bleed pad="py-6 md:py-10" className="relative">
        <div className="relative mx-auto w-[min(1100px,92vw)] aspect-[21/9] rounded-[28px] overflow-hidden">
          <Image
            src="/assets/velah-nature-2.jpg"
            alt="Airy waterfall light"
            fill
            sizes="100vw"
            className="object-cover object-[50%_35%]"
          />
          <div className="absolute inset-0 bg-white/40 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]" />
          <div className="absolute inset-0 flex items-center justify-center px-6">
            <blockquote className="max-w-3xl text-center text-xl md:text-2xl font-medium leading-relaxed text-slate-800 drop-shadow-[0_1px_8px_rgba(255,255,255,0.65)]">
              “Water should taste like nothing — and feel like calm.”
            </blockquote>
          </div>
        </div>
      </Band>

      {/* 5) SIZES — distinct look: slim centered row of captions (no boxes) */}
      <Band className="text-center">
        <h3 className="text-3xl sm:text-4xl font-semibold tracking-tight">Three rhythms</h3>
        <p className="mt-3 text-slate-700 md:text-lg max-w-3xl mx-auto">
          Home base gets 5G. Daily carry gets 1L. On-the-go gets 500 mL. One loop—your pace.
        </p>
        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-slate-600">
          <li>5 Gallon</li>
          <li>1 Litre</li>
          <li>500 mL</li>
        </ul>
      </Band>

      {/* 6) RETURNS — minimal band with soft divider */}
      <Band className="text-center">
        <h3 className="text-3xl sm:text-4xl font-semibold tracking-tight">Returns, simplified</h3>
        <p className="mt-4 text-slate-700 md:text-lg max-w-3xl mx-auto">
          Leave empties by the door; we collect on your next drop. Bottles are sanitized and
          returned looking new. Deposits are refunded when bottles come home.
        </p>
      </Band>

      {/* 7) CTA — distinct look: small type + centered buttons */}
      <Band className="text-center">
        <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Quiet luxury, every week
        </h3>
        <p className="mt-3 text-slate-700 md:text-lg max-w-3xl mx-auto">
          If it ever feels heavy or complicated, we missed the point. Tell us, and we’ll fix it.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <a
            href="/subscription"
            className="inline-flex h-11 items-center rounded-full px-6 border border-black/10 bg-white/80 backdrop-blur hover:bg-white"
          >
            See subscription
          </a>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("velah:open-waitlist"))}
            className="inline-flex h-11 items-center rounded-full px-6 border border-black/10 bg-white/60 backdrop-blur hover:bg-white"
          >
            Join waitlist
          </button>
        </div>
      </Band>
    </>
  );
}
