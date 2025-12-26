"use client";

import { useEffect, useMemo, useState } from "react";
import AppHeader from "@/components/app/AppHeader";
import ProgressRing from "@/components/app/ProgressRing";
import RequireAuth from "@/components/app/RequireAuth";
import { supabase } from "@/lib/supabaseClient";
import { dayKey, enqueueEntry, loadQueue, removeQueued, type QueuedEntry } from "@/lib/app/hydration";

const quickAdds = [250, 500, 1000];

type HydrationEntry = {
  key: string;
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

    if (!navigator.onLine) {
      const queue = loadQueue().filter((item) => item.user_id === userId);
      const queuedEntries: HydrationEntry[] = queue.map((item) => ({
        key: item.local_id,
        amount_ml: item.amount_ml,
        logged_at: item.logged_at,
        day: item.day,
        pending: true,
      }));
      if (!mounted.current) return;
      setEntries(queuedEntries);
      setStatus("Offline — showing queued entries only.");
      return;
    }

    const { data: profile } = await supabase
      .from("hydration_profiles")
      .select("goal_ml")
      .eq("user_id", userId)
      .maybeSingle();

    if (!mounted.current) return;
    if (profile?.goal_ml) setGoal(profile.goal_ml);

    const start = new Date();
    start.setDate(start.getDate() - 6);
    const primaryQuery = supabase
      .from("hydration_entries")
      .select("amount_ml,logged_at,day")
      .eq("user_id", userId)
      .gte("day", dayKey(start))
      .lte("day", today)
      .order("logged_at", { ascending: false });

    let rows: { amount_ml: number; logged_at: string; day: string }[] | null = null;
    let error: { message?: string } | null = null;
    const primary = await primaryQuery;
    if (primary.error) {
      if (primary.error.message?.includes("amount_ml")) {
        const fallback = await supabase
          .from("hydration_entries")
          .select("intake_ml,logged_at,day")
          .eq("user_id", userId)
          .gte("day", dayKey(start))
          .lte("day", today)
          .order("logged_at", { ascending: false });
        if (fallback.error) {
          error = fallback.error;
        } else {
          rows = (fallback.data || []).map((row: { intake_ml: number; logged_at: string; day: string }) => ({
            amount_ml: row.intake_ml,
            logged_at: row.logged_at,
            day: row.day,
          }));
        }
      } else {
        error = primary.error;
      }
    } else {
      rows = (primary.data || []).map((row) => ({
        amount_ml: row.amount_ml,
        logged_at: row.logged_at,
        day: row.day,
      }));
    }

    if (!mounted.current) return;
    if (error) {
      setStatus(error.message || "Could not refresh hydration. Pull to retry.");
    }

    const queue = loadQueue().filter((item) => item.user_id === userId);
    const queuedEntries: HydrationEntry[] = queue.map((item) => ({
      key: item.local_id,
      amount_ml: item.amount_ml,
      logged_at: item.logged_at,
      day: item.day,
      pending: true,
    }));

    const hydratedRows: HydrationEntry[] = (rows || []).map((row) => ({
      key: `${row.day}-${row.logged_at}-${row.amount_ml}`,
      amount_ml: row.amount_ml,
      logged_at: row.logged_at,
      day: row.day,
    }));

    setEntries([...hydratedRows, ...queuedEntries]);
    if (!error) setStatus(null);
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

  const recentEntries = useMemo(() => {
    return [...entries].sort((a, b) => new Date(b.logged_at).getTime() - new Date(a.logged_at).getTime()).slice(0, 3);
  }, [entries]);

  const weeklyTotals = useMemo(() => {
    const totals = new Map<string, number>();
    entries.forEach((entry) => {
      totals.set(entry.day, (totals.get(entry.day) || 0) + entry.amount_ml);
    });
    return totals;
  }, [entries]);

  const weekList = useMemo(() => {
    const list: { day: string; total: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const key = dayKey(date);
      list.push({ day: key, total: weeklyTotals.get(key) || 0 });
    }
    return list;
  }, [weeklyTotals]);

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
      setEntries((prev) => [{ ...payload, key: queued.local_id, pending: true }, ...prev]);
      setStatus("Offline — added to queue. We will sync once you are back online.");
      return;
    }

    const primaryInsert = await supabase
      .from("hydration_entries")
      .insert(payload)
      .select("amount_ml,logged_at,day")
      .single();

    let inserted = primaryInsert.data
      ? { amount_ml: primaryInsert.data.amount_ml, logged_at: primaryInsert.data.logged_at, day: primaryInsert.data.day }
      : null;
    let insertError = primaryInsert.error;

    if (insertError?.message?.includes("amount_ml")) {
      const fallbackInsert = await supabase
        .from("hydration_entries")
        .insert({ ...payload, intake_ml: payload.amount_ml })
        .select("intake_ml,logged_at,day")
        .single();
      if (fallbackInsert.error) {
        insertError = fallbackInsert.error;
      } else if (fallbackInsert.data) {
        inserted = {
          amount_ml: fallbackInsert.data.intake_ml,
          logged_at: fallbackInsert.data.logged_at,
          day: fallbackInsert.data.day,
        };
        insertError = null;
      }
    }

    if (insertError || !inserted) {
      const queued: QueuedEntry = { ...payload, local_id: crypto.randomUUID() };
      enqueueEntry(queued);
      setEntries((prev) => [{ ...payload, key: queued.local_id, pending: true }, ...prev]);
      setStatus("Could not reach Supabase. Entry queued for sync.");
      return;
    }

    setEntries((prev) => [
      {
        key: `${inserted.day}-${inserted.logged_at}-${inserted.amount_ml}`,
        amount_ml: inserted.amount_ml,
        logged_at: inserted.logged_at,
        day: inserted.day,
      },
      ...prev,
    ]);
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

      const payload = queue.map(({ local_id, ...rest }) => rest);
      let syncError = null as { message?: string } | null;

      const primarySync = await supabase.from("hydration_entries").insert(payload);
      if (primarySync.error) {
        if (primarySync.error.message?.includes("amount_ml")) {
          const fallbackPayload = payload.map((item) => ({ ...item, intake_ml: item.amount_ml }));
          const fallbackSync = await supabase.from("hydration_entries").insert(fallbackPayload);
          if (fallbackSync.error) syncError = fallbackSync.error;
        } else {
          syncError = primarySync.error;
        }
      }

      if (syncError) {
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
        <div className="flex items-center justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Hydration</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">{todayTotal} ml</h2>
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
            <button onClick={() => addEntry(Number(customAmount || 0))} className="btn btn-primary h-10 rounded-full">
              Add
            </button>
          </div>
        </div>
        <div className="mt-4 text-xs text-slate-400">Streak: {streak} day{streak === 1 ? "" : "s"}</div>
      </div>

      <div className="app-card p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Weekly rhythm</p>
        <div className="mt-4 grid grid-cols-7 gap-2">
          {weekList.map((item) => {
            const percent = goal ? Math.min(100, Math.round((item.total / goal) * 100)) : 0;
            return (
              <div key={item.day} className="flex flex-col items-center gap-2">
                <div className="relative h-20 w-5 rounded-full bg-slate-100">
                  <div
                    className="absolute inset-x-0 bottom-0 rounded-full bg-[var(--velah)] transition-all"
                    style={{ height: `${percent}%` }}
                  />
                </div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                  {new Date(item.day).toLocaleDateString(undefined, { weekday: "short" })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="app-card p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Upcoming delivery</p>
        <h3 className="mt-2 text-lg font-semibold text-slate-900">Thursday · 9–11am</h3>
        <p className="mt-1 text-sm text-slate-500">We will message you when your driver is en route.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="app-card p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Loop status</p>
          <div className="mt-3 text-2xl font-semibold text-slate-900">8 out</div>
          <div className="text-sm text-slate-500">5 returned</div>
        </div>
        <div className="app-card p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Next route</p>
          <div className="mt-3 text-2xl font-semibold text-slate-900">Marina</div>
          <div className="text-sm text-slate-500">Thu · 9–11am</div>
        </div>
      </div>

      <div className="app-card p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Recent log</p>
        <div className="mt-4 space-y-3">
          {recentEntries.map((entry) => (
            <div key={entry.key} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0">
              <div>
                <div className="text-base font-semibold text-slate-900">{entry.amount_ml} ml</div>
                <div className="text-xs text-slate-400">
                  {new Date(entry.logged_at).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
                  {entry.pending ? " · queued" : ""}
                </div>
              </div>
              <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                {new Date(entry.day).toLocaleDateString(undefined, { weekday: "short" })}
              </span>
            </div>
          ))}
          {entries.length === 0 ? <p className="text-sm text-slate-500">No entries yet.</p> : null}
        </div>
      </div>
    </div>
  );
}
