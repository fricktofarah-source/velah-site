'use client';

import { useState } from "react";
import Link from "next/link";

type Bundle = {
  id: string;
  name: string;
  description: string;
  mix: Array<{ label: string; amount: string }>;
  servings: string;
  price: string;
};

const bundles: Bundle[] = [
  {
    id: "balanced",
    name: "Balanced Home",
    description: "Family kitchen, daily hydration, weekend hosting.",
    mix: [
      { label: "5 Gallon", amount: "1" },
      { label: "1 Litre", amount: "6" },
      { label: "500 mL", amount: "6" },
    ],
    servings: "20–24 glasses per day",
    price: "AED 78 + refundable deposit",
  },
  {
    id: "studio",
    name: "Studio & Office",
    description: "Creative studios, boutique gyms, meeting rooms.",
    mix: [
      { label: "5 Gallon", amount: "2" },
      { label: "1 Litre", amount: "8" },
      { label: "500 mL", amount: "0" },
    ],
    servings: "30 glasses per day",
    price: "AED 96 + refundable deposit",
  },
  {
    id: "on-the-go",
    name: "On the Go",
    description: "Personal hydration, gym, and weekend adventures.",
    mix: [
      { label: "5 Gallon", amount: "0" },
      { label: "1 Litre", amount: "4" },
      { label: "500 mL", amount: "12" },
    ],
    servings: "14–16 bottles per week",
    price: "AED 64 + refundable deposit",
  },
];

export default function SubscriptionPeek() {
  const [activeId, setActiveId] = useState(bundles[0].id);
  const active = bundles.find((bundle) => bundle.id === activeId) ?? bundles[0];

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
              Subscription Preview
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
              Choose a starting mix, then tailor every week.
            </h2>
            <p className="mt-2 text-slate-600 max-w-2xl">
              Pick the bundle closest to your routine. Once you’re on the waitlist you can confirm, tweak, or skip each delivery in seconds.
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
                  isActive ? "bg-slate-900 text-white hover:bg-slate-800" : "bg-white text-slate-700 hover:bg-slate-100",
                ].join(" ")}
              >
                {bundle.name}
              </button>
            );
          })}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_.9fr]">
          <div key={active.id} className="card p-6 sm:p-7 space-y-5 transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)]">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">{active.name}</h3>
              <p className="mt-1 text-sm text-slate-600">{active.description}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {active.mix.map((item) => (
                <div key={item.label} className="rounded-2xl border bg-white/70 backdrop-blur p-4 transition-all duration-300 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-1">
                  <div className="text-xs uppercase tracking-wide text-slate-500">{item.label}</div>
                  <div className="mt-2 text-2xl font-semibold text-slate-900">{item.amount}×</div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border bg-[var(--velah)]/15 p-4 text-sm text-slate-700">
              <div className="font-semibold text-slate-900">Servings & coverage</div>
              <p className="mt-1">{active.servings}</p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
              <span className="font-semibold text-slate-900">{active.price}</span>
              <span>Confirm, edit, or skip before every delivery.</span>
            </div>
          </div>

          <div className="card p-6 sm:p-7 space-y-4">
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-500">In every delivery</div>
              <ul className="mt-2 space-y-2 text-sm text-slate-600">
                <li>• Chilled glass bottles sealed with stainless caps</li>
                <li>• Deposit automatically refunded when glass returns</li>
                <li>• Route reminder 24 hours before arrival</li>
              </ul>
            </div>

            <div className="rounded-2xl border bg-white/70 backdrop-blur p-4 text-sm text-slate-600">
              <div className="font-semibold text-slate-900">Next steps</div>
              <p className="mt-1">
                Join the waitlist, pick your areas, and we’ll notify you when service opens. Swaps and extras are managed in one dashboard.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="btn btn-primary h-11 px-6 rounded-full"
                onClick={() => window.dispatchEvent(new Event("velah:open-waitlist"))}
              >
                Join the waitlist
              </button>
              <Link href="/subscription" className="link-underline text-sm font-medium text-slate-700">
                Explore full subscription →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
