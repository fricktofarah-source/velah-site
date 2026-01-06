"use client";

import { useLanguage } from "@/components/LanguageProvider";

export default function PrivacyPage() {
  const { t } = useLanguage();
  const copy = t.privacy;
  return (
    <main className="container mx-auto max-w-3xl px-4 py-16">
      <div className="contact-reveal contact-reveal--1">
        <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">{copy.label}</div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{copy.title}</h1>
        <p className="mt-2 text-sm text-slate-600">{copy.subtitle}</p>
      </div>

      <div className="contact-reveal contact-reveal--2">
        <div className="mt-10 space-y-6 text-sm text-slate-600">
          {copy.sections.map((section) => (
            <section key={section.title} className="space-y-2">
              <h2 className="text-base font-semibold text-slate-900">{section.title}</h2>
              <p>{section.body}</p>
            </section>
          ))}
        </div>
      </div>

      <div className="contact-reveal contact-reveal--3">
        <div className="mt-10 text-sm text-slate-500">{copy.updatedLabel}</div>
      </div>
    </main>
  );
}
