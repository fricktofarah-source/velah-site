'use client';

import { useLanguage } from "./LanguageProvider";

export default function Testimonials() {
  const { t } = useLanguage();
  const copy = t.testimonials;
  const testimonials = copy.entries;

  return (
    <section
      className="section section-decor scroll-mt-24 sm:scroll-mt-32 overflow-hidden"
      data-tone="ink"
      id="voices"
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
            <p className="mt-2 text-slate-600 max-w-lg">
              {copy.body}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <article
              key={item.name}
              className="card p-6 flex flex-col gap-4 transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-1 hover:shadow-soft"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-900 text-white text-sm font-semibold shadow-sm">
                  {item.initials}
                </span>
                <div>
                  <div className="font-semibold text-slate-900">{item.name}</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide">{item.role}</div>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-slate-600">{item.quote}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
