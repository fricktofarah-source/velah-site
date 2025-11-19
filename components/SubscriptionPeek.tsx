'use client';

import Link from "next/link";
import { useLanguage } from "./LanguageProvider";

export default function SubscriptionPeek() {
  const { t } = useLanguage();
  const copy = t.subscriptionPeek;
  const highlight = copy.bundles[0];

  if (!highlight) {
    return null;
  }

  return (
    <section id="subscription" className="relative isolate overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-white" />
      <div className="absolute inset-x-0 top-8 mx-auto h-64 w-[70%] rounded-full bg-white/40 blur-[130px]" />
      <div className="absolute inset-x-0 bottom-0 mx-auto h-72 w-[60%] rounded-full bg-white/60 blur-[140px]" />
      <div className="absolute -right-10 top-12 h-64 w-64 rounded-full bg-[radial-gradient(circle,_rgba(127,203,216,0.18),_transparent_65%)] blur-3xl" />
      <div className="absolute -left-12 bottom-12 h-60 w-60 rounded-full bg-[radial-gradient(circle,_rgba(148,163,184,0.18),_transparent_65%)] blur-3xl" />

      <div className="section-shell relative z-10">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">{copy.badge}</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{copy.heading}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600">{copy.aiBody ?? copy.body}</p>
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-10 text-center lg:text-left">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--velah)]">AI Recommended</div>
              <p className="mt-3 text-2xl font-semibold text-slate-900">{highlight.name}</p>
              <p className="mt-2 text-base text-slate-600">{highlight.description}</p>
            </div>

            <div className="space-y-5 text-slate-900">
              {highlight.mix.map((item) => (
                <div
                  key={item.label}
                  className="flex flex-wrap items-baseline justify-between gap-3 border-b border-white/40 pb-3 text-left"
                >
                  <span className="text-sm uppercase tracking-[0.35em] text-slate-500">{item.label}</span>
                  <span className="text-3xl font-semibold">{item.amount}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-start justify-center gap-6 text-sm text-slate-600 lg:justify-start">
              <div className="max-w-xs">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">{copy.servingsTitle}</p>
                <p className="mt-2 text-base text-slate-900">{highlight.servings}</p>
              </div>
              <div className="max-w-xs">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Price</p>
                <p className="mt-2 text-base text-slate-900">{highlight.price}</p>
                <p className="text-xs text-slate-500">{copy.priceNote}</p>
              </div>
            </div>
          </div>

          <div className="space-y-8 text-left text-sm text-slate-600">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">{copy.deliveryHeadline}</p>
              <div className="space-y-3">
                {copy.deliveryItems.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[var(--velah)]" aria-hidden />
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">{copy.nextStepsHeadline}</p>
              <p className="text-base text-slate-900">{copy.nextStepsBody}</p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                className="btn btn-primary h-11 rounded-full px-6"
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
