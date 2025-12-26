"use client";

import { useEffect, useMemo, useState } from "react";
import AppHeader from "@/components/app/AppHeader";
import ProgressRing from "@/components/app/ProgressRing";
import RequireAuth from "@/components/app/RequireAuth";
import { supabase } from "@/lib/supabaseClient";
import { dayKey, enqueueEntry, loadQueue, removeQueued, type QueuedEntry } from "@/lib/app/hydration";

const quickAdds = [250, 500, 1000];

type HydrationEntry = {
  id: string;
  amount_ml: number;
  logged_at: string;
  day: string;
  pending?: boolean;
};

export default function AppHome() {
  return (
    <RequireAuth>
      <HomeContent />
    </RequireAuth>
  );
}

function HomeContent() {
  const today = dayKey();
  const [goal, setGoal] = useState(2000);
  const [entries, setEntries] = useState<HydrationEntry[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [online, setOnline] = useState(true);
  const [customAmount, setCustomAmount] = useState("350");

  useEffect(() => {
    setOnline(navigator.onLine);
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  const refresh = async (mounted: { current: boolean }) => {
    const { data } = await supabase.auth.getSession();
    const userId = data.session?.user.id;
    if (!userId) return;

    const { data: profile } = await supabase
      .from("hydration_profiles")
      .select("goal_ml")
      .eq("user_id", userId)
      .maybeSingle();

    if (!mounted.current) return;
    if (profile?.goal_ml) setGoal(profile.goal_ml);

    const start = new Date();
    start.setDate(start.getDate() - 6);
    const { data: rows, error } = await supabase
      .from("hydration_entries")
      .select("id,amount_ml,logged_at,day")
      .eq("user_id", userId)
      .gte("day", dayKey(start))
      .lte("day", today)
      .order("logged_at", { ascending: false });

    if (!mounted.current) return;
    if (error) {
      setStatus("Could not refresh hydration. Pull to retry.");
    }

    const queue = loadQueue().filter((item) => item.user_id === userId);
    const queuedEntries: HydrationEntry[] = queue.map((item) => ({
      id: item.local_id,
      amount_ml: item.amount_ml,
      logged_at: item.logged_at,
      day: item.day,
      pending: true,
    }));

    setEntries([...(rows || []), ...queuedEntries]);
  };

  useEffect(() => {
    const mounted = { current: true };
    refresh(mounted).catch(() => setStatus("Could not load hydration right now."));
    return () => {
      mounted.current = false;
    };
  }, [today]);

  const todayTotal = useMemo(() => {
    return entries.filter((entry) => entry.day === today).reduce((sum, entry) => sum + entry.amount_ml, 0);
  }, [entries, today]);

  const weeklyTotals = useMemo(() => {
    const totals = new Map<string, number>();
    entries.forEach((entry) => {
      totals.set(entry.day, (totals.get(entry.day) || 0) + entry.amount_ml);
    });
    return totals;
  }, [entries]);

  const streak = useMemo(() => {
    if (!goal) return 0;
    let count = 0;
    const cursor = new Date();
    for (let i = 0; i < 7; i++) {
      const key = dayKey(cursor);
      const total = weeklyTotals.get(key) || 0;
      if (total >= goal) {
        count += 1;
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
    }
    return count;
  }, [goal, weeklyTotals]);

  const addEntry = async (amount: number) => {
    if (!Number.isFinite(amount) || amount <= 0) return;
    const { data } = await supabase.auth.getSession();
    const userId = data.session?.user.id;
    if (!userId) return;

    const payload = {
      user_id: userId,
      amount_ml: amount,
      logged_at: new Date().toISOString(),
      day: today,
      source: "quick-add",
    };

    if (!navigator.onLine) {
      const queued: QueuedEntry = { ...payload, local_id: crypto.randomUUID() };
      enqueueEntry(queued);
      setEntries((prev) => [{ ...payload, id: queued.local_id, pending: true }, ...prev]);
      setStatus("Offline — added to queue. We will sync once you are back online.");
      return;
    }

    const { error, data: inserted } = await supabase.from("hydration_entries").insert(payload).select("id,amount_ml,logged_at,day").single();
    if (error || !inserted) {
      const queued: QueuedEntry = { ...payload, local_id: crypto.randomUUID() };
      enqueueEntry(queued);
      setEntries((prev) => [{ ...payload, id: queued.local_id, pending: true }, ...prev]);
      setStatus("Could not reach Supabase. Entry queued for sync.");
      return;
    }

    setEntries((prev) => [inserted, ...prev]);
    setStatus(null);
  };

  useEffect(() => {
    const syncQueue = async () => {
      if (!navigator.onLine) return;
      const { data } = await supabase.auth.getSession();
      const userId = data.session?.user.id;
      if (!userId) return;
      const queue = loadQueue().filter((item) => item.user_id === userId);
      if (queue.length === 0) return;

      const { error } = await supabase
        .from("hydration_entries")
        .insert(queue.map(({ local_id, ...rest }) => rest));

      if (error) {
        setStatus("Still offline. Entries will sync automatically.");
        return;
      }

      queue.forEach((item) => removeQueued(item.local_id));
      await refresh({ current: true });
      setStatus("Queued hydration synced.");
    };

    syncQueue().catch(() => setStatus("Queued hydration will sync once online."));
  }, [online]);

  return (
    <div className="space-y-6">
      <AppHeader title="Today" subtitle={new Date().toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })} />

      {status ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          {status}
        </div>
      ) : null}

      <div className="app-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Hydration</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">{todayTotal} ml</h2>
            <p className="mt-1 text-sm text-slate-500">Goal {goal} ml</p>
          </div>
          <ProgressRing value={todayTotal} total={goal} />
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {quickAdds.map((amount) => (
            <button key={amount} onClick={() => addEntry(amount)} className="btn btn-ghost h-10 rounded-full">
              +{amount} ml
            </button>
          ))}
          <div className="flex items-center gap-2">
            <input
              value={customAmount}
              onChange={(event) => setCustomAmount(event.target.value)}
              inputMode="numeric"
              className="h-10 w-24 rounded-full border border-slate-200 px-3 text-sm"
              placeholder="Custom"
            />
            <button
              onClick={() => addEntry(Number(customAmount || 0))}
              className="btn btn-primary h-10 rounded-full"
            >
              Add
            </button>
          </div>
        </div>
        <div className="mt-4 text-xs text-slate-400">Streak: {streak} day{streak === 1 ? "" : "s"}</div>
      </div>

      <div className="app-card p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Upcoming delivery</p>
        <h3 className="mt-2 text-lg font-semibold text-slate-900">Thursday · 9–11am</h3>
        <p className="mt-1 text-sm text-slate-500">We will message you when your driver is en route.</p>
      </div>
    </div>
  );
}
