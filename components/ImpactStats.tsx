'use client';

import Link from "next/link";
import Counter from "./Counter";

const stats = [
  {
    value: 90,
    suffix: "%",
    label: "Target bottle reuse rate",
    description: "Measured across 5G, 1L, and 500 mL formats.",
  },
  {
    value: 60,
    suffix: "%",
    label: "Less single-use plastic",
    description: "Compared with a typical household buying cases.",
  },
  {
    value: 30,
    suffix: "%",
    label: "Lower CO₂ per litre",
    description: "Optimised routing and pooled returns across districts.",
  },
  {
    value: 18,
    suffix: "×",
    label: "Glass cycles per year",
    description: "Average reuse target for bottles in circulation.",
  },
];

export default function ImpactStats() {
  return (
    <section
      id="sustainability"
      className="section section-decor scroll-mt-24 sm:scroll-mt-32"
      data-tone="frost"
    >
      <div className="section-shell">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] text-slate-500 font-medium">
              Impact
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
              Designed to close the loop.
            </h2>
            <p className="mt-2 text-slate-600 max-w-2xl">
              Every bottle stays in circulation, each route is pooled, and deposits return when glass comes home.
              It is a calmer way to serve premium water while cutting waste.
            </p>
          </div>
          <Link href="/sustainability" className="btn btn-primary h-11 rounded-full px-6">
            Explore sustainability
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div key={item.label} className="card p-5 space-y-3 text-center">
              <Counter to={item.value} suffix={item.suffix} duration={1200} className="text-4xl" />
              <div className="text-sm font-semibold text-slate-900">{item.label}</div>
              <p className="text-sm text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
