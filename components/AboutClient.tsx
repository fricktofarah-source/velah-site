// components/AboutClient.tsx
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

function useCountUpOnce(run: boolean, target: number, ms = 900) {
  const [val, setVal] = useState(0);
  const doneRef = useRef(false);
  useEffect(() => {
    if (!run || doneRef.current) return;
    if (prefersReducedMotion) { setVal(target); doneRef.current = true; return; }
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / ms);
      const e = (1 - Math.cos(p * Math.PI)) / 2;
      setVal(Math.round(target * e));
      if (p < 1) raf = requestAnimationFrame(tick);
      else doneRef.current = true;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, target, ms]);
  return val;
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
  // hairline scroll progress
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

      {/* 0) INTRO — centered hero, airy veil (type only) */}
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
          Velah is a refillable hydration loop in reusable glass. Clean taste, simple rhythm—no fuss.
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

      {/* 1) BIG STATEMENT — last word with image fill */}
      <Band className="text-center">
        <div className="mx-auto max-w-5xl">
          <div className="text-xs uppercase tracking-wide text-slate-600">Our view</div>
          <h2
            className={cn(
              "font-semibold tracking-tight leading-[1.02]",
              "text-[36px] sm:text-[48px] md:text-[64px]"
            )}
          >
            THE FUTURE OF WATER IS{" "}
            <span
              className="inline-block align-baseline"
              style={{
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                backgroundImage: "url('/assets/statement-text-fill.png')",
                backgroundSize: "cover",
                backgroundPosition: "50% 55%",
              }}
            >
              LOCAL
            </span>
          </h2>
          <p className="mt-4 text-slate-700 md:text-lg max-w-2xl mx-auto">
            Built close to where it’s enjoyed. Refilled, not shipped. Calm by design.
          </p>
        </div>
      </Band>

      {/* 2) CENTERED MEDIA BAND — bottles + mist, blended, safe framing */}
      <Band bleed pad="py-8 md:py-12" className="relative">
        <div className="relative mx-auto w-[min(1100px,92vw)] aspect-[16/9] rounded-[28px] overflow-hidden">
          <Image
            src="/assets/velah-nature-1.png"
            alt="Velah bottles in airy waterfall light"
            fill
            sizes="100vw"
            priority
            className="object-cover object-[50%_40%]" /* nudge to avoid awkward crop */
          />
          {/* melt image into page */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/35 via-white/10 to-white/70 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]" />
        </div>
      </Band>

      {/* 3) DROPLET ILLUSTRATION — minimal art section */}
      <Band className="text-center">
        <div className="mx-auto max-w-4xl">
          <DropletIllustration />
          <div className="mt-6 grid grid-cols-2 gap-6 text-slate-700 text-sm sm:text-base">
            <div className="text-right pr-3 opacity-80">
              Elevating water<br />Purified. Mineralized. Sustainable.
            </div>
            <div className="text-left pl-3 opacity-80">
              Alkaline &amp; balanced<br />Built for the world
            </div>
          </div>
        </div>
      </Band>

      {/* 4) NARRATIVE BAND — long copy over blended background */}
      <Band bleed pad="py-10 md:py-14" className="relative">
        <div className="relative mx-auto w-[min(1100px,92vw)] rounded-[28px] overflow-hidden">
          <div className="relative w-full aspect-[21/9]">
            <Image
              src="/assets/narrative-waterfall.png"
              alt="Soft distant waterfall"
              fill
              sizes="100vw"
              className="object-cover object-[50%_45%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/45 to-transparent" />
          </div>
          <div className="absolute inset-0 flex items-end justify-center p-6 sm:p-10">
            <div className="max-w-3xl text-center text-slate-800">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">
                Leading the GCC’s shift to sustainable hydration.
              </h3>
              <p className="mt-3 md:text-lg">
                Velah keeps glass in motion, tasting clean, fitting your pace. Confirm, change, or
                skip with a tap. Empties out, fresh bottles in — week after week.
              </p>
            </div>
          </div>
        </div>
      </Band>

      {/* 5) TIMELINE — vertical steps over light bay image */}
      <Band className="text-center">
        <h3 className="text-3xl sm:text-4xl font-semibold tracking-tight">How the loop flows</h3>
        <div className="mt-8 relative mx-auto max-w-3xl">
          <div className="absolute inset-0 -z-10 rounded-[28px] overflow-hidden">
            <Image
              src="/assets/timeline-bay.png"
              alt="Calm bay"
              fill
              sizes="100vw"
              className="object-cover object-[50%_35%] opacity-60"
            />
            <div className="absolute inset-0 bg-white/60" />
          </div>
          <Timeline />
        </div>
      </Band>

      {/* 6) IMPACT — counters over slightly blurred oasis */}
      <ImpactBand />

      {/* 7) PARTNERS — soft paper texture grid */}
      <Band className="text-center">
        <h3 className="text-3xl sm:text-4xl font-semibold tracking-tight">Trusted by partners</h3>
        <p className="mt-3 text-slate-700 max-w-2xl mx-auto">
          Selected venues and groups who share our standard.
        </p>
        <div className="relative mt-6 rounded-[24px] overflow-hidden">
          <Image
            src="/assets/partners-paper.png"
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-white/70" />
          <div className="relative grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 sm:p-6">
            {["Partner One","Partner Two","Partner Three","Partner Four","Partner Five","Partner Six","Partner Seven","Partner Eight"].map((name) => (
              <div
                key={name}
                className="aspect-[4/3] rounded-[20px] bg-white/80 backdrop-blur border border-slate-200/80 flex items-center justify-center text-slate-500"
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </Band>

      {/* 8) CTA — centered close */}
      <Band className="text-center">
        <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">Quiet luxury, every week</h3>
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

/* ---------- distinctive pieces ---------- */

function DropletIllustration() {
  // Elegant stroked “pour into a drop” using only SVG strokes
  return (
    <svg
      viewBox="0 0 500 420"
      className="mx-auto w-full max-w-[520px] opacity-70"
      aria-hidden
    >
      <defs>
        <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="rgba(0,0,0,0.35)" />
          <stop offset="1" stopColor="rgba(0,0,0,0.08)" />
        </linearGradient>
      </defs>
      {Array.from({ length: 28 }).map((_, i) => {
        const t = i / 27;
        const off = i * 2.4;
        const w = 180 + i * 4.5;
        const topY = 20 + off * 0.3;
        const botY = 300 + off * 0.18;
        return (
          <path
            key={i}
            d={`M ${250 - w/2} ${topY} C 250 ${topY+40}, 250 ${botY-30}, 250 ${botY} 
               C 250 ${botY+80}, ${250 - 70 * (1 - t)} 380, 250 400
               C ${250 + 70 * (1 - t)} 380, 250 ${botY+80}, 250 ${botY}
               C 250 ${botY-30}, 250 ${topY+40}, ${250 + w/2} ${topY}`}
            fill="none"
            stroke="url(#g)"
            strokeWidth={1}
          />
        );
      })}
    </svg>
  );
}

function Timeline() {
  const steps = [
    {
      t: "Advanced Filtration Installation",
      d: "Premium still and sparkling water, purified and mineralized.",
    },
    {
      t: "Bottling with Sustainability",
      d: "Filled at source into reusable glass; sanitized and reset for reuse.",
    },
    {
      t: "Continuous Quality Control",
      d: "Regular lab testing and strict checks for purity and consistency.",
    },
    {
      t: "Redefining Water Standards",
      d: "Refillable by default. Minimal waste, maximal taste.",
    },
  ];
  return (
    <div className="relative mx-auto max-w-3xl py-8">
      {/* vertical track */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-slate-200" />
      <ul className="space-y-10">
        {steps.map((s) => (
          <li key={s.t} className="relative">
            <div className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-slate-400" />
            <div className="pt-6 px-4">
              <h4 className="text-xl font-medium">{s.t}</h4>
              <p className="mt-2 text-slate-700">{s.d}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ImpactBand() {
  const { ref, shown } = useRevealOnce<HTMLDivElement>(0.3);
  const bottles = useCountUpOnce(shown, 947000, 900);
  const co2 = useCountUpOnce(shown, 78411, 900);

  return (
    <Band bleed pad="py-10 md:py-14" className="relative">
      <div className="relative mx-auto w-[min(1100px,92vw)] rounded-[28px] overflow-hidden">
        <div className="relative w-full aspect-[21/10]">
          <Image
            src="/assets/impact-oasis.png"
            alt="Soft oasis background"
            fill
            sizes="100vw"
            className="object-cover object-[50%_50%] blur-[1px]" // slight blur so numbers pop
          />
          <div className="absolute inset-0 bg-white/40 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]" />
        </div>

        {/* overlay content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 py-8 text-center">
          <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.35)]">
            Sustainability Impact in the UAE
          </h3>
          <p className="mt-1 max-w-3xl text-white/90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)]">
            Each Velah bottle replaces a single-use alternative and cuts emissions at the source.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-6 w-full max-w-3xl">
            <div className="rounded-[18px] bg-white/70 backdrop-blur border border-white/60 p-5">
              <div className="text-xs uppercase tracking-wide text-slate-700">Bottles Eliminated (500 mL)</div>
              <div className="mt-1 text-4xl md:text-5xl font-semibold tabular-nums text-slate-900">
                {bottles.toLocaleString()}+
              </div>
            </div>
            <div className="rounded-[18px] bg-white/70 backdrop-blur border border-white/60 p-5">
              <div className="text-xs uppercase tracking-wide text-slate-700">CO₂ Emissions Reduced</div>
              <div className="mt-1 text-4xl md:text-5xl font-semibold tabular-nums text-slate-900">
                {co2.toLocaleString()} kg
              </div>
            </div>
          </div>

          <div className="mt-3 text-xs text-white/80 drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)]">
            Fujairah, UAE
          </div>
        </div>
      </div>
    </Band>
  );
}
