"use client";

import AppHeader from "@/components/app/AppHeader";
import RequireAuth from "@/components/app/RequireAuth";
import { useLanguage } from "@/components/LanguageProvider";

export default function LoopPage() {
  const { t } = useLanguage();
  const copy = t.app.loop;
  return (
    <RequireAuth>
      <div className="space-y-6">
        <AppHeader title={copy.title} subtitle={copy.subtitle} />

        <div className="grid grid-cols-2 gap-4">
          <div className="app-card p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{copy.bottlesOut}</p>
            <div className="mt-3 text-3xl font-semibold text-slate-900">8</div>
          </div>
          <div className="app-card p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{copy.returned}</p>
            <div className="mt-3 text-3xl font-semibold text-slate-900">5</div>
          </div>
        </div>

        <div className="app-card p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{copy.instructionsLabel}</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {copy.instructions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="app-card p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{copy.pickupLabel}</p>
          <p className="mt-3 text-sm text-slate-500">{copy.pickupNote}</p>
        </div>
      </div>
    </RequireAuth>
  );
}
