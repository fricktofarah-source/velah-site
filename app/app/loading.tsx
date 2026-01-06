"use client";

import { useLanguage } from "@/components/LanguageProvider";

export default function Loading() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="h-16 w-16 rounded-full border border-slate-200 bg-white shadow-soft flex items-center justify-center">
          <div className="h-8 w-8 rounded-full bg-[var(--velah)]/70 animate-pulse" />
        </div>
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Velah</p>
          <p className="mt-2 text-sm text-slate-500">{t.app.loading.label}</p>
        </div>
      </div>
    </div>
  );
}
