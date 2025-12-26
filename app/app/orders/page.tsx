"use client";

import AppHeader from "@/components/app/AppHeader";
import RequireAuth from "@/components/app/RequireAuth";

export default function OrdersPage() {
  return (
    <RequireAuth>
      <div className="space-y-6">
        <AppHeader title="Orders" subtitle="Your deliveries and past orders." />

        <div className="app-card p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Current plan</p>
          <h2 className="mt-2 text-lg font-semibold text-slate-900">Weekly delivery · 12L</h2>
          <p className="mt-1 text-sm text-slate-500">Placeholder — connect to subscription data when ready.</p>
          <a href="/subscription" className="btn btn-primary mt-4 h-10 rounded-full w-full">Manage plan</a>
        </div>

        <div className="app-card p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Upcoming</p>
          <div className="mt-3 space-y-3">
            {[
              { day: "Thursday", window: "9–11am", status: "Scheduled" },
              { day: "Monday", window: "2–4pm", status: "Planned" },
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
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Past orders</p>
          <p className="mt-3 text-sm text-slate-500">No orders yet. Your history will appear here.</p>
        </div>
      </div>
    </RequireAuth>
  );
}
