"use client";

import AppHeader from "@/components/app/AppHeader";
import RequireAuth from "@/components/app/RequireAuth";
import { useLanguage } from "@/components/LanguageProvider";

export default function OrdersPage() {
  const { t } = useLanguage();
  const copy = t.app.orders;
  return (
    <RequireAuth>
      <div className="space-y-6">
        <AppHeader title={copy.title} subtitle={copy.subtitle} />

        <div className="app-card p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{copy.cardLabel}</p>
          <h2 className="mt-2 text-lg font-semibold text-slate-900">{copy.cardTitle}</h2>
          <p className="mt-1 text-sm text-slate-500">{copy.cardNote}</p>
          <a href="/subscription" className="btn btn-primary mt-4 h-10 rounded-full w-full">{copy.addToCart}</a>
        </div>

        <div className="app-card p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{copy.upcomingLabel}</p>
          <div className="mt-3 space-y-3">
            {[
              { day: "Thursday", window: "9–11am", status: copy.statusScheduled },
              { day: "Monday", window: "2–4pm", status: copy.statusPlanned },
            ].map((item) => (
              <div key={item.day} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0">
                <div>
                  <div className="text-base font-semibold text-slate-900">{item.day}</div>
                  <div className="text-sm text-slate-500">{item.window}</div>
                </div>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{item.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="app-card p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{copy.pastLabel}</p>
          <p className="mt-3 text-sm text-slate-500">{copy.pastEmpty}</p>
        </div>
      </div>
    </RequireAuth>
  );
}
