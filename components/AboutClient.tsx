// components/AboutClient.tsx
"use client";

import Image from "next/image";
import { useEffect, useRef, useState, forwardRef } from "react";

/* ---------------- helpers ---------------- */
const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

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

/* ---------------- page ---------------- */
export default function AboutClient() {
  // hairline progress
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

      {/* 0) INTRO */}
      <SectionPad>
        <h1 className="text-center text-[44px] sm:text-[60px] md:text-[72px] leading-[1.03] font-semibold tracking-tight">
          Hydration, made weightless
        </h1>
        <p className="mt-4 text-center text-slate-700 md:text-lg max-w-3xl mx-auto">
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
      </SectionPad>

      {/* 1) BIG STATEMENT */}
      <FullBleed>
        <SoftVeil />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-24 md:py-32 text-center">
          <div className="text-xs uppercase tracking-wide text-slate-600">Our view</div>
          <h2 className="mt-2 font-semibold tracking-tight leading-[0.98] text-[42px] sm:text-[64px] md:text-[90px]">
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
          <p className="mt-4 text-slate-700 md:text-lg max-w-3xl mx-auto">
            Built close to where it’s enjoyed. Refilled, not shipped. Calm by design.
          </p>
        </div>
      </FullBleed>

      {/* 2) HERO MEDIA */}
      <FullBleed height="h-[60vh] sm:h-[70vh]" src="/assets/velah-nature-1.png" alt="Velah bottles in airy light" objectPosition="50% 42%">
        <BlendTopBottom />
      </FullBleed>

      {/* 3) ART SECTION */}
      <SectionPad>
        <DropletIllustration />
        <div className="mt-6 mx-auto max-w-3xl grid gap-4 text-slate-700 text-base text-center">
          <div>Elevating water</div>
          <div>Purified. Mineralized. Sustainable.</div>
          <div>Alkaline &amp; balanced</div>
          <div>Built for the world</div>
        </div>
      </SectionPad>

      {/* 4) DIVIDER */}
      <FullBleed height="h-[36vh]" src="/assets/divider-haze.png" alt="Hazy divider">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="px-6 text-center text-xl sm:text-2xl tracking-[0.2em] text-slate-900/85">
            NO SHIPPING · NO COMPROMISE · NO PLASTIC · NO SHIPPING · NO COMPROMISE · NO PLASTIC
          </div>
        </div>
        <BlendTopBottom />
      </FullBleed>

      {/* 5) NARRATIVE */}
      <FullBleed height="h-[70vh] sm:h-[75vh]" src="/assets/narrative-waterfall.png" alt="Soft distant waterfall" objectPosition="50% 45%">
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <div className="max-w-3xl text-center">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 drop-shadow-[0_1px_8px_rgba(255,255,255,0.85)]">
              Leading the GCC’s shift to sustainable hydration.
            </h3>
            <p className="mt-3 md:text-lg text-slate-800 drop-shadow-[0_1px_8px_rgba(255,255,255,0.75)]">
              Pick your mix of 5G, 1L and 500 mL. Edit freely or skip any week. Empties out, fresh
              bottles in—simple, every time.
            </p>
          </div>
        </div>
        <BlendTopBottom />
      </FullBleed>

      {/* 6) TIMELINE */}
      <FullBleed src="/assets/timeline-bay.png" alt="Calm bay texture" objectPosition="50% 35%">
        <div className="absolute inset-0 bg-white/65" />
        <SectionPad>
          <h3 className="text-center text-3xl sm:text-4xl font-semibold tracking-tight">How the loop flows</h3>
          <Timeline />
        </SectionPad>
      </FullBleed>

      {/* 7) IMPACT */}
      <ImpactBand />

      {/* 8) PARTNERS */}
      <FullBleed src="/assets/partners-paper.png" alt="Subtle paper" objectPosition="50% 50%">
        <div className="absolute inset-0 bg-white/80" />
        <SectionPad>
          <h3 className="text-center text-3xl sm:text-4xl font-semibold tracking-tight">Trusted by partners</h3>
          <p className="mt-3 text-center text-slate-700 max-w-2xl mx-auto">
            Selected venues and groups who share our standard.
          </p>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-6xl mx-auto px-4 sm:px-6">
            {["Rosa’s Thai","MILA","Habib Beirut","AWANI","Partner 5","Partner 6","Partner 7","Partner 8"].map((name) => (
              <div key={name} className="aspect-[4/3] flex items-center justify-center text-slate-500">
                {name}
              </div>
            ))}
          </div>
        </SectionPad>
      </FullBleed>

      {/* 9) CTA */}
      <SectionPad>
        <h3 className="text-center text-2xl md:text-3xl font-semibold tracking-tight">Quiet luxury, every week</h3>
        <p className="mt-3 text-center text-slate-700 md:text-lg max-w-3xl mx-auto">
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
      </SectionPad>
    </>
  );
}

/* ---------------- section building blocks ---------------- */

function SectionPad({ children }: { children: React.ReactNode }) {
  const { ref, shown } = useRevealOnce<HTMLDivElement>();
  return (
    <section className="py-20 md:py-28">
      <div
        ref={ref}
        className={
          "max-w-6xl mx-auto px-4 sm:px-6 transition-all duration-700 " +
          (shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")
        }
      >
        {children}
      </div>
    </section>
  );
}

const FullBleed = forwardRef<HTMLDivElement, {
  children?: React.ReactNode;
  height?: string;
  src?: string;
  alt?: string;
  objectPosition?: string;
  className?: string;
}>(
  (
    { children, height = "h-[52vh] sm:h-[64vh]", src, alt, objectPosition = "50% 50%", className = "" },
    ref
  ) => {
    const { shown } = useRevealOnce<HTMLDivElement>();
    return (
      <section
        ref={ref}
        className={`relative w-screen ${height} overflow-hidden transition-all duration-700 ${
          shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        } ${className}`}
      >
        {src && (
          <Image
            src={src}
            alt={alt || ""}
            fill
            sizes="100vw"
            priority={false}
            className="object-cover"
            style={{ objectPosition }}
          />
        )}
        {children}
      </section>
    );
  }
);

FullBleed.displayName = "FullBleed";

function SoftVeil() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10"
      style={{
        background:
          "radial-gradient(60% 40% at 50% 0%, rgba(127,203,216,0.10), transparent 60%)",
      }}
    />
  );
}

function BlendTopBottom() {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-white/35 via-transparent to-white/70 [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]" />
  );
}

/* ---------------- unique pieces ---------------- */

function DropletIllustration() {
  return (
    <svg viewBox="0 0 500 420" className="mx-auto w-full max-w-[560px] opacity-70" aria-hidden>
      <defs>
        <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="rgba(0,0,0,0.35)" />
          <stop offset="1" stopColor="rgba(0,0,0,0.08)" />
        </linearGradient>
      </defs>
      {Array.from({ length: 28 }).map((_, i) => {
        const t = i / 27;
        const w = 180 + i * 4.5;
        const topY = 20 + i * 0.7;
        const botY = 300 + i * 0.4;
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
    { t: "Advanced Filtration Installation", d: "Premium still and sparkling water, purified and mineralized." },
    { t: "Bottling with Sustainability", d: "Filled at source into reusable glass; sanitized and reset for reuse." },
    { t: "Continuous Quality Control", d: "Regular lab testing and strict checks for purity and consistency." },
    { t: "Redefining Water Standards", d: "Refillable by default. Minimal waste, maximal taste." },
  ];

  return (
    <div className="relative mx-auto max-w-3xl py-10">
      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-slate-300" />
      <ul className="space-y-10">
        {steps.map((s) => (
          <li key={s.t} className="relative">
            <div className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-slate-500 top-0" />
            <div className="pt-6">
              <div className="mx-auto max-w-xl rounded-full bg-white/80 backdrop-blur px-6 py-5 border border-white/60 shadow">
                <h4 className="text-center text-lg sm:text-xl font-medium">{s.t}</h4>
                <p className="mt-1 text-center text-slate-700">{s.d}</p>
              </div>
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
    <FullBleed ref={ref} src="/assets/impact-oasis.png" alt="Oasis" objectPosition="50% 50%" height="h-[62vh] sm:h-[68vh]">
      <div className="absolute inset-0 bg-white/38" />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 drop-shadow">
          Sustainability Impact in the UAE
        </h3>
        <p className="mt-1 max-w-3xl text-slate-800 drop-shadow">
          Each Velah bottle replaces a single-use alternative and cuts emissions at the source.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-10">
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-700">Bottles Eliminated (500 mL)</div>
            <div className="mt-1 text-4xl md:text-5xl font-semibold tabular-nums text-slate-900">
              {bottles.toLocaleString()}+
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-700">CO₂ Reduced (kg)</div>
            <div className="mt-1 text-4xl md:text-5xl font-semibold tabular-nums text-slate-900">
              {co2.toLocaleString()}+
            </div>
          </div>
        </div>
      </div>
    </FullBleed>
  );
}
