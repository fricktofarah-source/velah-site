"use client";

import { useLanguage } from "@/components/LanguageProvider";

export default function FaqPage() {
  const { t } = useLanguage();
  const copy = t.faq;
  return (
    <main className="container mx-auto max-w-3xl px-4 py-16">
      <div className="contact-reveal contact-reveal--1">
        <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">{copy.label}</div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{copy.title}</h1>
        <p className="mt-2 text-sm text-slate-600">{copy.subtitle}</p>
      </div>

      <div className="contact-reveal contact-reveal--2">
        <div className="mt-10 space-y-4">
          {copy.items.map((item) => (
            <details key={item.q} className="border-b border-slate-100 pb-4">
              <summary className="cursor-pointer list-none font-medium flex items-center justify-between">
                <span>{item.q}</span>
                <span className="text-slate-400">+</span>
              </summary>
              <p className="mt-3 text-sm text-slate-600">{item.a}</p>
            </details>
          ))}
        </div>
      </div>

      <div className="contact-reveal contact-reveal--3">
        <div className="mt-10 text-sm text-slate-500">
          {copy.closing}
        </div>
      </div>
    </main>
  );
}
