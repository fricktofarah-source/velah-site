'use client';

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useLanguage } from "./LanguageProvider";

export default function SubscriptionPeek() {
  const { language, t } = useLanguage();
  const copy = t.subscriptionPeek;
  const bundles = copy.bundles;
  const initialId = bundles[0]?.id ?? "";
  const [activeId, setActiveId] = useState(initialId);

  useEffect(() => {
    if (!bundles.some((bundle) => bundle.id === activeId)) {
      setActiveId(initialId);
    }
  }, [bundles, activeId, initialId]);

  useEffect(() => {
    setActiveId(initialId);
  }, [language, initialId]);

  const current = useMemo(() => bundles.find((bundle) => bundle.id === activeId) ?? bundles[0], [bundles, activeId]);

  if (!current) {
    return null;
  }

  return (
    <section
      id="subscription"
      className="section section-decor scroll-mt-24 sm:scroll-mt-32"
      data-tone="oasis"
    >
      <div className="section-shell">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] text-slate-500 font-medium">
              {copy.badge}
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
              {copy.heading}
            </h2>
            <p className="mt-2 text-slate-600 max-w-2xl">
              {copy.body}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {bundles.map((bundle) => {
            const isActive = bundle.id === activeId;
            return (
              <button
                key={bundle.id}
                type="button"
                onClick={() => setActiveId(bundle.id)}
                className={[
                  "btn btn-ghost h-9 px-4 rounded-full text-sm transition-transform duration-200 ease-[cubic-bezier(.22,1,.36,1)]",
                  "flex-1 min-w-[120px] sm:flex-none",
                  isActive ? "bg-slate-900 text-white hover:bg-slate-800" : "bg-white text-slate-700 hover:bg-slate-100",
                ].join(" ")}
              >
                {bundle.name}
              </button>
            );
          })}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_.9fr]">
          <div key={current.id} className="card p-6 sm:p-7 space-y-5 transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)]">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">{current.name}</h3>
              <p className="mt-1 text-sm text-slate-600">{current.description}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {current.mix.map((item) => (
                <div key={item.label} className="rounded-2xl border bg-white/70 backdrop-blur p-4 transition-all duration-300 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-1">
                  <div className="text-xs uppercase tracking-wide text-slate-500">{item.label}</div>
                  <div className="mt-2 text-2xl font-semibold text-slate-900">{item.amount}</div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border bg-[var(--velah)]/15 p-4 text-sm text-slate-700">
              <div className="font-semibold text-slate-900">{copy.servingsTitle}</div>
              <p className="mt-1">{current.servings}</p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
              <span className="font-semibold text-slate-900">{current.price}</span>
              <span>{copy.priceNote}</span>
            </div>
          </div>

          <div className="card p-6 sm:p-7 space-y-4">
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-500">{copy.deliveryHeadline}</div>
              <ul className="mt-2 space-y-2 text-sm text-slate-600">
                {copy.deliveryItems.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border bg-white/70 backdrop-blur p-4 text-sm text-slate-600">
              <div className="font-semibold text-slate-900">{copy.nextStepsHeadline}</div>
              <p className="mt-1">
                {copy.nextStepsBody}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="btn btn-primary h-11 px-6 rounded-full"
                onClick={() => window.dispatchEvent(new Event("velah:open-waitlist"))}
              >
                {copy.joinWaitlist}
              </button>
              <Link href="/subscription" className="link-underline text-sm font-medium text-slate-700">
                {copy.exploreLink}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
