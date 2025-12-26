"use client";

import AppHeader from "@/components/app/AppHeader";
import RequireAuth from "@/components/app/RequireAuth";

export default function LoopPage() {
  return (
    <RequireAuth>
      <div className="space-y-6">
        <AppHeader title="Loop" subtitle="Track returns and keep glass in circulation." />

        <div className="grid grid-cols-2 gap-4">
          <div className="app-card p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Bottles out</p>
            <div className="mt-3 text-3xl font-semibold text-slate-900">8</div>
          </div>
          <div className="app-card p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Returned</p>
            <div className="mt-3 text-3xl font-semibold text-slate-900">5</div>
          </div>
        </div>

        <div className="app-card p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Return instructions</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>Rinse bottles and cap them firmly.</li>
            <li>Place them by your entryway before the pickup window.</li>
            <li>We will confirm pickup completion in the Orders tab.</li>
          </ul>
        </div>

        <div className="app-card p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Pickup scheduling</p>
          <p className="mt-3 text-sm text-slate-500">QR check-in and scheduling are coming soon.</p>
        </div>
      </div>
    </RequireAuth>
  );
}
