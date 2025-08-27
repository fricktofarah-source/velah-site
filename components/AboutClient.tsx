// components/AboutClient.tsx
"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

/** Goals:
 * - Seamless, cloud-like scroll. No “boxes”, no gimmicks.
 * - Long-form narrative with chapters; a reader learns “what Velah is”.
 * - Counters animate once on reveal, then stop.
 * - A single integrated nature/bottle media band (masked & subtle).
 * - Reduced motion respected; all effects degrade gracefully.
 */

const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

/* ---------- reveal-once ---------- */
function useRevealOnce<T extends HTMLElement>(threshold = 0.2) {
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

/* ---------- count up once ---------- */
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
      const e = (1 - Math.cos(p * Math.PI)) / 2; // ease in-out
      setVal(Math.round(target * e));
      if (p < 1) raf = requestAnimationFrame(tick);
      else doneRef.current = true;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, target, ms]);
  return val;
}

/* ---------- minimal sections (no boxes) ---------- */
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
  // soft entrance once
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
  // tiny top progress (hairline)
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
      {/* top progress */}
      <div
        aria-hidden
        className="fixed left-0 top-0 h-[2px] bg-[var(--velah,black)] z-40 transition-[width]"
        style={{ width: `${Math.round(prog * 100)}%` }}
      />

      {/* HERO — pure type + subtle ambient gradient */}
      <Band bleed className="relative overflow-hidden pt-24 md:pt-32 pb-16">
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-24 -z-10"
          style={{
            background:
              "radial-gradient(60% 40% at 50% 0%, rgba(127,203,216,0.18), transparent 60%)",
            filter: "blur(60px)",
          }}
        />
        <div className="max-w-5xl">
          <h1 className="text-[40px] md:text-[56px] leading-[1.04] font-semibold tracking-tight">
            Hydration, made weightless
          </h1>
          <p className="mt-4 text-slate-700 md:text-lg max-w-3xl">
            Velah is a refillable hydration loop in reusable glass. It’s quiet luxury you feel
            daily: clean taste, simple rhythm, no fuss.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <a href="/hydration" className="inline-flex h-11 items-center rounded-full px-6 border border-black/10 bg-white/80 backdrop-blur hover:bg-white">
              Explore hydration
            </a>
            <button
              className="inline-flex h-11 items-center rounded-full px-6 border border-black/10 bg-white/60 backdrop-blur hover:bg-white"
              onClick={() => window.dispatchEvent(new CustomEvent("velah:open-waitlist"))}
            >
              Join waitlist
            </button>
          </div>
        </div>
      </Band>

      {/* INTEGRATED MEDIA BAND (single tasteful image, masked + blended) */}
      <Band bleed pad="py-4 md:py-10" className="relative">
        {/* Swap the src to whatever image you prefer; keep one hero image only */}
        <div className="relative w-full h-[48vh] md:h-[62vh]">
          <Image
            src="/assets/velah-nature-1.png"
            alt="Soft water and stone — calm, minimal backdrop"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          {/* gentle veil + mask to integrate it */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/10 to-white/70 [mask-image:linear-gradient(to_bottom, transparent, black_30%, black_70%, transparent)]" />
        </div>
      </Band>

      {/* CHAPTERS — long-form narrative (no cards) */}
      <Band>
        <Chapter
          kicker="Why we exist"
          title="Glass over plastic, ritual over routine"
          body={[
            "Most water delivery treats hydration like cargo. We think it should feel better than that.",
            "Velah replaces single-use with a refillable loop: glass that stays pristine, stainless that never flavors, and a weekly rhythm that fits your life.",
          ]}
        />
      </Band>

      <Divider />

      <Band>
        <Chapter
          kicker="How it works"
          title="A clean loop that flows around your week"
          body={[
            "Pick your mix of 5G, 1L, and 500 mL. We suggest a starting plan—you edit freely, or skip any week.",
            "We text before delivery. Confirm, change, or pause with a tap. On the next visit, empties go out and fresh bottles come in.",
          ]}
          pills={["Edit anytime", "Skip weeks", "Refundable deposit"]}
        />
      </Band>

      <Divider />

      <Band>
        <Chapter
          kicker="The taste"
          title="Nothing added, nothing lingering"
          body={[
            "Glass and stainless don’t carry flavor. Water stays water—clean, bright, the way it should be.",
            "The bottles are counter-ready by design. When you glance over, you feel calm—not clutter.",
          ]}
        />
      </Band>

      <NaturePullQuote />

      <Band>
        <Chapter
          kicker="Sizes that fit"
          title="5 Gallon • 1 Litre • 500 mL"
          body={[
            "Home base gets the 5G. Daily carry gets 1L. On-the-go gets 500 mL. One loop, three rhythms—mix as you like.",
          ]}
        />
      </Band>

      <Divider />

      {/* COUNTERS — animate once and stop */}
      <ImpactOnce />

      <Divider />

      <Band>
        <Chapter
          kicker="Returns"
          title="Simple, every time"
          body={[
            "Leave empties by the door; we collect on your next drop. Bottles are sanitized and returned looking new. Deposits are refunded when bottles come home.",
          ]}
        />
      </Band>

      <Band>
        <Chapter
          kicker="The promise"
          title="Quiet luxury, every week"
          body={[
            "If it ever feels heavy or complicated, we missed the point. Tell us, and we’ll fix it.",
            "Velah is meant to disappear into your week—leaving only clear water and a calmer counter.",
          ]}
          cta={[
            { label: "See subscription", href: "/subscription" },
            { label: "Join waitlist", onClick: () => window.dispatchEvent(new CustomEvent("velah:open-waitlist")) },
          ]}
        />
      </Band>
    </>
  );
}

/* ---------- simple chapter (type only) ---------- */
function Chapter({
  kicker,
  title,
  body,
  pills,
  cta,
}: {
  kicker?: string;
  title: string;
  body: string[];
  pills?: string[];
  cta?: Array<{ label: string; href?: string; onClick?: () => void }>;
}) {
  return (
    <div className="max-w-3xl">
      {kicker && (
        <div className="text-xs uppercase tracking-wide text-slate-600">
          {kicker}
        </div>
      )}
      <h2 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight">
        {title}
      </h2>
      {body.map((p, i) => (
        <p key={i} className="mt-4 text-slate-700 md:text-lg">
          {p}
        </p>
      ))}
      {pills && pills.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600">
          {pills.map((x) => (
            <li
              key={x}
              className="rounded-full border px-3 py-1 bg-white/70 backdrop-blur"
            >
              {x}
            </li>
          ))}
        </ul>
      )}
      {cta && cta.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-3">
          {cta.map((b) =>
            b.href ? (
              <a
                key={b.label}
                href={b.href}
                className="inline-flex h-11 items-center rounded-full px-6 border border-black/10 bg-white/80 backdrop-blur hover:bg-white"
              >
                {b.label}
              </a>
            ) : (
              <button
                key={b.label}
                onClick={b.onClick}
                className="inline-flex h-11 items-center rounded-full px-6 border border-black/10 bg-white/60 backdrop-blur hover:bg-white"
              >
                {b.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}

function Divider() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <hr className="border-t border-slate-200/70" />
    </div>
  );
}

/* ---------- nature pull-quote band (soft, no boxes) ---------- */
function NaturePullQuote() {
  return (
    <Band bleed className="relative">
      <div className="relative w-full h-[42vh] md:h-[56vh]">
        <Image
          src="/assets/velah-nature-2.png"
          alt="Soft, airy nature band"
          fill
          className="object-cover"
          sizes="100vw"
          priority={false}
        />
        <div className="absolute inset-0 bg-white/40 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <blockquote className="mx-6 max-w-3xl text-center text-xl md:text-2xl font-medium leading-relaxed text-slate-800 drop-shadow-sm">
            “Water should taste like nothing and feel like calm.”
          </blockquote>
        </div>
      </div>
    </Band>
  );
}

/* ---------- impact (counts once, then freeze) ---------- */
function ImpactOnce() {
  const wrap = useRevealOnce<HTMLDivElement>(0.3);
  const bottles = useCountUpOnce(wrap.shown, 947000, 900);
  const co2 = useCountUpOnce(wrap.shown, 78411, 900);

  return (
    <Band>
      <div ref={wrap.ref as any} className="max-w-5xl">
        <div className="text-xs uppercase tracking-wide text-slate-600">
          Planned impact
        </div>
        <div className="mt-3 grid gap-8 md:grid-cols-2">
          <div>
            <div className="text-5xl md:text-6xl font-semibold tabular-nums">
              {bottles.toLocaleString()}+
            </div>
            <p className="mt-2 text-slate-700">
              single-use bottles kept out of circulation.
            </p>
          </div>
          <div>
            <div className="text-5xl md:text-6xl font-semibold tabular-nums">
              {co2.toLocaleString()} kg
            </div>
            <p className="mt-2 text-slate-700">
              estimated CO₂ avoided via optimized routes.
            </p>
          </div>
        </div>
      </div>
    </Band>
  );
}
