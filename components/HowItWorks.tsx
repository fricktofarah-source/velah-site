// components/HowItWorks.tsx
"use client";

import { useState } from "react";
import Link from "next/link";

type Step = { id: number; title: string; body: string; icon: React.ReactNode };

const STEPS: Step[] = [
  { id: 1, title: "Choose", body: "Tell us about your week. We suggest a mix of 5G + 1L + 500 mL top-ups. Edit any quantities and skip any week.", icon: <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden><path fill="currentColor" d="M7 4h10v2H7zM4 9h16v2H4zM7 14h10v2H7zM10 19h4v2h-4z"/></svg> },
  { id: 2, title: "Delivery", body: "Weekly routes. We text before arrival; you can confirm, change, or skip.", icon: <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden><path fill="currentColor" d="M3 7h11v10H3zM14 10h3l4 4v3h-7zM7 20a2 2 0 1 0 0-4a2 2 0 0 0 0 4m10 0a2 2 0 1 0 0-4a2 2 0 0 0 0 4"/></svg> },
  { id: 3, title: "Enjoy", body: "Glass bottles on your counter, stainless caps, clean taste.", icon: <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden><path fill="currentColor" d="M12 2a5 5 0 0 1 5 5v2H7V7a5 5 0 0 1 5-5m-2 20v-8h4v8z"/></svg> },
  { id: 4, title: "Return", body: "We collect empties on your next delivery. Deposits refunded when bottles come home.", icon: <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden><path fill="currentColor" d="M12 6V3l5 5l-5 5V9a5 5 0 1 0 5 5h2a7 7 0 1 1-7-7"/></svg> },
];

export default function HowItWorks() {
  const [active, setActive] = useState(1);
  const step = STEPS.find((s) => s.id === active)!;

  return (
    <section
      id="how"
      className="section section-decor scroll-mt-24 sm:scroll-mt-32"
      data-tone="ink"
      aria-labelledby="how-title"
    >
      <div className="section-shell">
        <header className="flex items-end justify-between gap-4">
          <div>
            <h2 id="how-title" className="text-3xl font-semibold tracking-tight">How Velah works</h2>
            <p className="text-slate-600 mt-1">A clean refillable loop, made simple.</p>
          </div>
          <Link href="/subscription" className="link-underline hidden sm:inline-flex text-sm font-medium">
            See subscription
          </Link>
        </header>

        <div className="mt-6 grid lg:grid-cols-[1.1fr_.9fr] gap-6">
          {/* Left: tabs + content */}
          <div className="card p-4 sm:p-5">
            <div className="flex flex-wrap gap-2">
              {STEPS.map((s) => {
                const isActive = s.id === active;
                return (
                  <button
                    key={s.id}
                    onClick={() => setActive(s.id)}
                    className={[
                      "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition",
                      isActive
                        ? "bg-[var(--velah)] text-slate-900 border-[var(--velah)] hover:bg-[#68bac8]"
                        : "bg-white text-slate-700 hover:bg-slate-100"
                    ].join(" ")}
                    aria-current={isActive ? "step" : undefined}
                  >
                    <span className="opacity-80">{s.icon}</span>
                    <span>{s.title}</span>
                  </button>
                );
              })}
            </div>

            <div key={active} className="mt-4 animate-pop-in">
              <p className="text-slate-700">{step.body}</p>

              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                {active === 1 && (<><span className="chip">AI suggestion</span><span className="chip">Edit any week</span><span className="chip">Skip anytime</span></>)}
                {active === 2 && (<><span className="chip">Route notifications</span><span className="chip">Confirm or change</span><span className="chip">Doorstep drop</span></>)}
                {active === 3 && (<><span className="chip">Glass taste</span><span className="chip">Stainless cap</span><span className="chip">Counter-ready</span></>)}
                {active === 4 && (<><span className="chip">Easy returns</span><span className="chip">Sanitized & reused</span><span className="chip">Deposit refunded</span></>)}
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  className="link-underline text-sm"
                  onClick={() => setActive((active % STEPS.length) + 1)}
                >
                  Next →
                </button>
              </div>
            </div>
          </div>

          {/* Right: visual & progress */}
          <div className="card-glass p-5 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(60%_40%_at_50%_0%,rgba(127,203,216,0.10),transparent_65%)]" />
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 grid place-items-center rounded-full border bg-white/80 backdrop-blur">
                {step.icon}
              </div>
              <div className="font-medium">{step.title}</div>
            </div>

            <div key={active} className="mt-4 animate-pop-in text-slate-700">
              {active === 1 && <MockPlan />}
              {active === 2 && <MockDelivery />}
              {active === 3 && <MockEnjoy />}
              {active === 4 && <MockReturn />}
            </div>
            <div className="mt-5 h-1 w-full rounded bg-slate-200 overflow-hidden">
              <div
                className="h-full bg-[var(--velah)] transition-all duration-700 ease-[cubic-bezier(.22,1,.36,1)]"
                style={{ width: `${(active / STEPS.length) * 100}%` }}
              />
            </div>
            <div className="mt-4 text-xs text-slate-500">Step {active} of {STEPS.length}</div>
          </div>
        </div>

        <div className="sm:hidden mt-4">
          <Link href="/subscription" className="btn btn-primary h-11 w-full rounded-full">Explore subscription</Link>
        </div>
      </div>
    </section>
  );
}

/* tiny visuals */
function Box({ children }: { children: React.ReactNode }) {
  return <div className="rounded-xl border bg-white/70 backdrop-blur p-3">{children}</div>;
}
function MockPlan() { return (<div className="grid grid-cols-2 gap-3"><Box><div className="text-xs text-slate-500">5 Gallon</div><div className="font-semibold">× 1</div></Box><Box><div className="text-xs text-slate-500">1 Litre</div><div className="font-semibold">× 4</div></Box><Box><div className="text-xs text-slate-500">500 mL</div><div className="font-semibold">× 4</div></Box><Box><div className="text-xs text-slate-500">Weekly total</div><div className="font-semibold">AED 56</div></Box></div>); }
function MockDelivery() { return (<div className="grid gap-3"><Box><div>Scheduled: Wed 10–1</div></Box><Box><div>Confirmed request: leave by door</div></Box><Box><div>Route status: out for delivery</div></Box></div>); }
function MockEnjoy() { return (<div className="grid grid-cols-3 gap-3"><Box><div className="text-center">1 L</div></Box><Box><div className="text-center">1 L</div></Box><Box><div className="text-center">5 G</div></Box></div>); }
function MockReturn() { return (<div className="grid gap-3"><Box><div>Empties collected</div></Box><Box><div>Sanitised & refilled</div></Box><Box><div>Deposit refunded</div></Box></div>); }
