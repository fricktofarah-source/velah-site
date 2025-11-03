// components/HowItWorks.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "./LanguageProvider";

const STEP_ICONS: Record<number, JSX.Element> = {
  1: <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden><path fill="currentColor" d="M7 4h10v2H7zM4 9h16v2H4zM7 14h10v2H7zM10 19h4v2h-4z"/></svg>,
  2: <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden><path fill="currentColor" d="M3 7h11v10H3zM14 10h3l4 4v3h-7zM7 20a2 2 0 1 0 0-4a2 2 0 0 0 0 4m10 0a2 2 0 1 0 0-4a2 2 0 0 0 0 4"/></svg>,
  3: <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden><path fill="currentColor" d="M12 2a5 5 0 0 1 5 5v2H7V7a5 5 0 0 1 5-5m-2 20v-8h4v8z"/></svg>,
  4: <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden><path fill="currentColor" d="M12 6V3l5 5l-5 5V9a5 5 0 1 0 5 5h2a7 7 0 1 1-7-7"/></svg>,
};

export default function HowItWorks() {
  const { language, t } = useLanguage();
  const copy = t.howItWorks;
  const steps = copy.steps;
  const visuals = copy.visuals;
  const [active, setActive] = useState(1);
  const step = steps.find((s) => s.id === active) ?? steps[0];
  const stepCounterLabel = language === "AR"
    ? `الخطوة ${active} من ${steps.length}`
    : `Step ${active} of ${steps.length}`;

  useEffect(() => {
    if (!steps.some((s) => s.id === active)) {
      setActive(steps[0]?.id ?? 1);
    }
  }, [steps, active]);

  useEffect(() => {
    setActive(steps[0]?.id ?? 1);
  }, [language, steps]);

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
            <h2 id="how-title" className="text-3xl font-semibold tracking-tight">{copy.heading}</h2>
            <p className="text-slate-600 mt-1">{copy.tagline}</p>
          </div>
          <Link href="/subscription" className="link-underline hidden sm:inline-flex text-sm font-medium">
            {copy.subscriptionCta}
          </Link>
        </header>

        <div className="mt-6 grid lg:grid-cols-[1.1fr_.9fr] gap-6">
          {/* Left: tabs + content */}
          <div className="card p-4 sm:p-5">
            <div className="flex flex-wrap gap-2">
              {steps.map((s) => {
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
                    <span className="opacity-80">{STEP_ICONS[s.id]}</span>
                    <span>{s.title}</span>
                  </button>
                );
              })}
            </div>

            <div key={active} className="mt-4 animate-pop-in">
              <p className="text-slate-700">{step.body}</p>

              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                {step.chips.map((chip) => (
                  <span key={chip} className="chip">{chip}</span>
                ))}
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  className="link-underline text-sm"
                  onClick={() => setActive((active % steps.length) + 1)}
                >
                  {copy.next}
                </button>
              </div>
            </div>
          </div>

          {/* Right: visual & progress */}
          <div className="card-glass p-5 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(60%_40%_at_50%_0%,rgba(127,203,216,0.10),transparent_65%)]" />
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 grid place-items-center rounded-full border bg-white/80 backdrop-blur">
                {STEP_ICONS[step.id]}
              </div>
              <div className="font-medium">{step.title}</div>
            </div>

            <div key={active} className="mt-4 animate-pop-in text-slate-700">
              {active === 1 && <MockPlan items={visuals.plan} />}
              {active === 2 && <MockDelivery items={visuals.delivery} />}
              {active === 3 && <MockEnjoy items={visuals.enjoy} />}
              {active === 4 && <MockReturn items={visuals.return} />}
            </div>
            <div className="mt-5 h-1 w-full rounded bg-slate-200 overflow-hidden">
              <div
                className="h-full bg-[var(--velah)] transition-all duration-700 ease-[cubic-bezier(.22,1,.36,1)]"
                style={{ width: `${(active / steps.length) * 100}%` }}
              />
            </div>
            <div className="mt-4 text-xs text-slate-500">{stepCounterLabel}</div>
          </div>
        </div>

        <div className="sm:hidden mt-4">
          <Link href="/subscription" className="btn btn-primary h-11 w-full rounded-full">{copy.subscriptionCta}</Link>
        </div>
      </div>
    </section>
  );
}

/* tiny visuals */
function Box({ children }: { children: React.ReactNode }) {
  return <div className="rounded-xl border bg-white/70 backdrop-blur p-3">{children}</div>;
}
function MockPlan({ items }: { items: Array<{ label: string; value: string }> }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map((item) => (
        <Box key={item.label}>
          <div className="text-xs text-slate-500">{item.label}</div>
          <div className="font-semibold">{item.value}</div>
        </Box>
      ))}
    </div>
  );
}

function MockDelivery({ items }: { items: string[] }) {
  return (
    <div className="grid gap-3">
      {items.map((text, idx) => (
        <Box key={`${text}-${idx}`}>
          <div>{text}</div>
        </Box>
      ))}
    </div>
  );
}

function MockEnjoy({ items }: { items: string[] }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {items.map((text, idx) => (
        <Box key={`${text}-${idx}`}>
          <div className="text-center">{text}</div>
        </Box>
      ))}
    </div>
  );
}

function MockReturn({ items }: { items: string[] }) {
  return (
    <div className="grid gap-3">
      {items.map((text, idx) => (
        <Box key={`${text}-${idx}`}>
          <div>{text}</div>
        </Box>
      ))}
    </div>
  );
}
