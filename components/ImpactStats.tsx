'use client';

import Link from "next/link";
import Counter from "./Counter";
import { useLanguage } from "./LanguageProvider";

export default function ImpactStats() {
  const { t } = useLanguage();
  const copy = t.impact;
  const stats = copy.stats;

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
              {copy.badge}
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
              {copy.heading}
            </h2>
            <p className="mt-2 text-slate-600 max-w-2xl">
              {copy.body}
            </p>
          </div>
          <Link href="/sustainability" className="btn btn-primary h-11 rounded-full px-6">
            {copy.cta}
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
