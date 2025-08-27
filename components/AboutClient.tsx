// components/AboutClient.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/** -----------------------------------------------------------
 *  GOAL
 *  - “Cloud over a waterfall” feeling: weightless, fluid, calm.
 *  - No stock photos. Pure gradients, blur, and SVG noise.
 *  - Story-led sections with sticky reveals (no auto-advance).
 *  - Subtle parallax & cursor glow. Respects reduced motion.
 *  - Minimal aesthetic; immersive without being “greenwashed”.
 * ---------------------------------------------------------- */

// Utilities
const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

// Hooks
function useReveal<T extends HTMLElement>(threshold = 0.18) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) { setVisible(true); return; }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ents => ents.forEach(e => e.isIntersecting && setVisible(true)),
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, visible };
}

function useParallax(scale = 1) {
  const [y, setY] = useState(0);
  useEffect(() => {
    if (prefersReducedMotion) return;
    const onScroll = () => setY((window.scrollY || 0) * 0.12 * scale);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [scale]);
  return y;
}

function useMouseLight() {
  const [pos, setPos] = useState({ x: -9999, y: -9999 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return pos;
}

// Tiny components
function Section({
  children,
  className,
  bleed = false,
}: { children: React.ReactNode; className?: string; bleed?: boolean; }) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const base = cn(
    "transition-all duration-700 ease-[cubic-bezier(.22,1,.36,1)]",
    visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
  );
  if (bleed) {
    return (
      <section className={cn("py-20 md:py-28", className)}>
        <div ref={ref} className={base}>{children}</div>
      </section>
    );
  }
  return (
    <section className={cn("max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-28", className)}>
      <div ref={ref} className={base}>{children}</div>
    </section>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-3 py-1 rounded-full border text-xs text-slate-600 bg-white/70 backdrop-blur">
      {children}
    </span>
  );
}

/** BACKGROUND FX
 *  Layered gradient sheets + SVG noise mask + cursor glow.
 *  No images; everything procedural.
 */
function AmbientBackdrop() {
  const y1 = useParallax(1);
  const y2 = useParallax(1.6);
  const { x, y } = useMouseLight();

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* soft vertical “falls” */}
      <div
        className="absolute -inset-20 blur-2xl"
        style={{
          background:
            "conic-gradient(from 180deg at 50% 20%, rgba(128,209,222,0.30), rgba(255,255,255,0.0) 30%, rgba(128,209,222,0.25) 60%, rgba(255,255,255,0.0) 90%)",
          transform: `translateY(${prefersReducedMotion ? 0 : y1}px)`,
        }}
      />
      <div
        className="absolute -inset-24 blur-3xl"
        style={{
          background:
            "radial-gradient(60% 80% at 50% 0%, rgba(127,203,216,0.25), rgba(255,255,255,0))",
          transform: `translateY(${prefersReducedMotion ? 0 : -y2}px)`,
        }}
      />
      {/* subtle noise veil */}
      <div
        className="absolute inset-0 opacity-[0.06] mix-blend-multiply"
        style={{
          backgroundImage:
            `url("data:image/svg+xml;utf8,${encodeURIComponent(
              `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/><feComponentTransfer><feFuncA type='table' tableValues='0 0.35'/></feComponentTransfer></filter><rect width='120' height='120' filter='url(%23n)'/></svg>`
            )}")`,
        }}
      />
      {/* cursor glow */}
      <div
        className="absolute size-[40vmax] rounded-full"
        style={{
          left: x - window.innerWidth * 0.2,
          top: y - window.innerHeight * 0.2,
          background: "radial-gradient(closest-side, rgba(127,203,216,0.18), transparent 60%)",
          transition: "transform 200ms linear",
        }}
      />
    </div>
  );
}

/** PINNED STORY
 *  A sticky container that lets cards fade/slide as you scroll.
 *  No snapping; no layout jumps; just whisper-smooth reveals.
 */
function PinnedStory() {
  const steps = [
    {
      k: "refill",
      title: "Refill over replace",
      body: "A weekly rhythm that keeps glass in motion—freshly sanitized, looking new, tasting clean.",
    },
    {
      k: "ritual",
      title: "Ritual over routine",
      body: "Counter-ready bottles that elevate the everyday. Stainless caps; zero plastic taste.",
    },
    {
      k: "respect",
      title: "Respect for pace",
      body: "Confirm, change, or skip with a tap. The loop flows around your week, not the other way around.",
    },
  ] as const;

  // Observe each row separately
  const [active, setActive] = useState(0);
  const refs = Array.from({ length: steps.length }, () => useRef<HTMLDivElement | null>(null));

  useEffect(() => {
    const io = new IntersectionObserver(
      (ents) => {
        ents.forEach((e) => {
          const idx = Number((e.target as HTMLElement).dataset.index || 0);
          if (e.isIntersecting) setActive((prev) => (idx > prev ? idx : prev));
        });
      },
      { threshold: 0.4, rootMargin: "-10% 0px -10% 0px" }
    );
    refs.forEach(r => r.current && io.observe(r.current));
    return () => io.disconnect();
  }, []);

  return (
    <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 items-start">
      {/* Sticky text column */}
      <div className="lg:sticky lg:top-24">
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          Hydration that feels weightless
        </h2>
        <p className="mt-3 text-slate-600">
          We designed Velah to disappear into your week—quietly reliable, beautifully simple.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Pill>Glass & stainless</Pill>
          <Pill>Reusable loop</Pill>
          <Pill>Skip anytime</Pill>
        </div>
      </div>

      {/* Flowing cards */}
      <div className="space-y-4">
        {steps.map((s, i) => {
          const on = active >= i;
          return (
            <div
              key={s.k}
              ref={refs[i]}
              data-index={i}
              className={cn(
                "rounded-3xl border p-5 sm:p-6 bg-white/70 backdrop-blur shadow-soft",
                "transition-all duration-700",
                on ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              <div className="text-xs uppercase tracking-wide text-slate-600">{String(i + 1).padStart(2, "0")}</div>
              <div className="mt-1 text-xl font-medium">{s.title}</div>
              <p className="mt-2 text-slate-700">{s.body}</p>

              {/* Ambient progress line */}
              <div className="mt-4 h-1 rounded bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-[var(--velah,black)] transition-all duration-700 ease-[cubic-bezier(.22,1,.36,1)]"
                  style={{ width: `${on ? 100 : 0}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** COUNTERS (planned/illustrative) */
function Impact() {
  const { ref, visible } = useReveal<HTMLDivElement>(0.3);
  const [a, b] = useCountPair(visible, [947000, 78411]);
  return (
    <div ref={ref} className="rounded-3xl border bg-white/70 backdrop-blur p-6 sm:p-8">
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <div className="text-xs uppercase tracking-wide text-slate-600">Planned bottles eliminated</div>
          <div className="mt-2 text-5xl md:text-6xl font-semibold tabular-nums">{a.toLocaleString()}+</div>
          <p className="mt-2 text-slate-600">By keeping glass in circulation.</p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-slate-600">Planned CO₂ reduced</div>
          <div className="mt-2 text-5xl md:text-6xl font-semibold tabular-nums">{b.toLocaleString()} kg</div>
          <p className="mt-2 text-slate-600">Optimized routes; fewer single-use shipments.</p>
        </div>
      </div>
    </div>
  );
}
function useCountPair(run: boolean, targets: [number, number]) {
  const [v1, setV1] = useState(0);
  const [v2, setV2] = useState(0);
  useEffect(() => {
    if (!run) return;
    if (prefersReducedMotion) { setV1(targets[0]); setV2(targets[1]); return; }
    const start = performance.now();
    let raf = 0;
    const dur = 800;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const e = (1 - Math.cos(Math.PI * p)) / 2;
      setV1(Math.round(targets[0] * e));
      setV2(Math.round(targets[1] * e));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, targets]);
  return [v1, v2] as const;
}

/** CTA button (magnetic-ish hover) */
function FloatButton({
  children,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  const [dx, setDx] = useState(0);
  const [dy, setDy] = useState(0);
  return (
    <button
      onMouseMove={(e) => {
        if (prefersReducedMotion) return;
        const r = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        setDx((e.clientX - cx) * 0.06);
        setDy((e.clientY - cy) * 0.06);
      }}
      onMouseLeave={() => { setDx(0); setDy(0); }}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center rounded-full h-11 px-6 border border-black/10",
        "bg-white/80 backdrop-blur shadow-soft transition-transform",
        className
      )}
      style={{ transform: `translate(${dx}px, ${dy}px)` }}
    >
      {children}
    </button>
  );
}

// PAGE
export default function AboutClient() {
  // Scroll progress (thin top bar)
  const [prog, setProg] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const b = document.body;
      const e = document.documentElement;
      const scrolled = (e.scrollTop || b.scrollTop);
      const height = (e.scrollHeight - e.clientHeight) || 1;
      setProg(scrolled / height);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <AmbientBackdrop />

      {/* Top progress */}
      <div
        aria-hidden
        className="fixed left-0 top-0 h-[3px] bg-[var(--velah,black)] z-40 transition-[width]"
        style={{ width: `${Math.round(prog * 100)}%` }}
      />

      {/* HERO */}
      <section className="relative overflow-hidden pt-24 md:pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h1 className="text-[40px] md:text-[56px] leading-[1.05] font-semibold tracking-tight text-slate-900">
            Hydration, made weightless
          </h1>
          <p className="mt-4 text-slate-700 md:text-lg max-w-2xl">
            Velah is a refillable loop built for calm. Minimal effort, pristine taste, and a weekly
            rhythm that simply flows.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <FloatButton onClick={() => (window.location.href = "/hydration")}>Explore hydration</FloatButton>
            <FloatButton onClick={() => window.dispatchEvent(new CustomEvent("velah:open-waitlist"))}>
              Join waitlist
            </FloatButton>
          </div>
        </div>

        {/* Gentle foreground sheets */}
        <div className="absolute inset-x-0 bottom-0 h-48 md:h-64 [mask-image:linear-gradient(to_bottom,transparent,black_30%,black)]">
          <div className="absolute inset-0 blur-2xl bg-[radial-gradient(60%_60%_at_50%_0%,rgba(127,203,216,0.25),transparent_70%)]" />
        </div>
      </section>

      {/* PINNED STORY */}
      <Section className="pt-6">
        <PinnedStory />
      </Section>

      {/* INTERACTIVE RIPPLE FIELD */}
      <Section bleed>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="rounded-3xl border bg-white/70 backdrop-blur p-6 sm:p-8 overflow-hidden relative group">
            <h3 className="text-2xl font-semibold">Feel the flow</h3>
            <p className="mt-2 text-slate-600 max-w-2xl">
              Move your cursor (or tap) to see how the loop responds—lightweight and responsive by design.
            </p>
            <RippleField />
            <div className="mt-4 text-xs text-slate-500">No plastic taste. No heavy effort.</div>
          </div>
        </div>
      </Section>

      {/* IMPACT */}
      <Section>
        <Impact />
      </Section>

      {/* CLOSER */}
      <Section>
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-semibold tracking-tight">
            Quiet luxury. Clear taste. A loop that just works.
          </div>
          <p className="mt-3 text-slate-600">Glass and stainless, delivered on rhythm—change or skip any week.</p>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <FloatButton onClick={() => (window.location.href = "/subscription")}>See subscription</FloatButton>
            <FloatButton onClick={() => (window.location.href = "/about#story")}>Our story</FloatButton>
          </div>
        </div>
      </Section>
    </>
  );
}

/** Ripple canvas (DOM-only, no <canvas> needed) */
function RippleField() {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [p, setP] = useState({ x: 50, y: 50 });
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    setP({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };
  const onTouch = (e: React.TouchEvent<HTMLDivElement>) => {
    const t = e.touches[0];
    const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    setP({ x: ((t.clientX - r.left) / r.width) * 100, y: ((t.clientY - r.top) / r.height) * 100 });
  };

  return (
    <div
      ref={boxRef}
      onMouseMove={prefersReducedMotion ? undefined : onMove}
      onTouchMove={prefersReducedMotion ? undefined : onTouch}
      className="mt-5 h-56 sm:h-64 rounded-2xl border overflow-hidden relative"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.7), rgba(255,255,255,0.9)), radial-gradient(60% 100% at 50% 0%, rgba(127,203,216,0.20), transparent 70%)",
      }}
    >
      <div
        className="absolute inset-0 transition-[background] duration-150"
        style={{
          background: `radial-gradient(300px 220px at ${p.x}% ${p.y}%, rgba(127,203,216,0.25), transparent 60%)`,
        }}
      />
      {/* flowing lines */}
      <div className="absolute inset-0 opacity-50 mix-blend-multiply">
        <svg viewBox="0 0 800 240" className="w-full h-full">
          <defs>
            <linearGradient id="lg" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="rgba(127,203,216,0.35)" />
              <stop offset="1" stopColor="rgba(127,203,216,0.05)" />
            </linearGradient>
          </defs>
          {Array.from({ length: 8 }).map((_, i) => (
            <path
              key={i}
              d={wavePath(i)}
              fill="none"
              stroke="url(#lg)"
              strokeWidth={1.5}
              opacity={0.7 - i * 0.06}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}
function wavePath(i: number) {
  // deterministic “liquid” path
  const amp = 10 + i * 2.2;
  const y = 30 + i * 22;
  const seg = 8;
  const w = 800 / seg;
  let d = `M 0 ${y}`;
  for (let s = 1; s <= seg; s++) {
    const x = w * s;
    const cp1x = w * (s - 0.5);
    const cp2x = w * (s - 0.5);
    const dir = s % 2 === 0 ? -1 : 1;
    d += ` C ${cp1x} ${y + amp * dir}, ${cp2x} ${y - amp * dir}, ${x} ${y}`;
  }
  return d;
}
