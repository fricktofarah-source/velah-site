"use client";

import { useEffect, useMemo, useState } from "react";
import AppHeader from "@/components/app/AppHeader";
import RequireAuth from "@/components/app/RequireAuth";
import { supabase } from "@/lib/supabaseClient";
import { dayKey, enqueueEntry, loadQueue, removeQueued, saveQueue, type QueuedEntry } from "@/lib/app/hydration";

const quickAdds = [250, 500, 750, 1000];

type HydrationEntry = {
  id: string;
  amount_ml: number;
  logged_at: string;
  day: string;
  source?: string | null;
  pending?: boolean;
};

export default function HydrationPage() {
  return (
    <RequireAuth>
      <HydrationContent />
    </RequireAuth>
  );
}

function HydrationContent() {
  const today = dayKey();
  const [goal, setGoal] = useState(2000);
  const [goalInput, setGoalInput] = useState("2000");
  const [customAmount, setCustomAmount] = useState("350");
  const [entries, setEntries] = useState<HydrationEntry[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [online, setOnline] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState("");

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
    if (profile?.goal_ml) {
      setGoal(profile.goal_ml);
      setGoalInput(String(profile.goal_ml));
    }

    const start = new Date();
    start.setDate(start.getDate() - 6);
    const { data: rows, error } = await supabase
      .from("hydration_entries")
      .select("id,amount_ml,logged_at,day,source")
      .eq("user_id", userId)
      .gte("day", dayKey(start))
      .lte("day", today)
      .order("logged_at", { ascending: false });

    if (!mounted.current) return;
    if (error) setStatus("Could not refresh hydration. Pull to retry.");

    const queue = loadQueue().filter((item) => item.user_id === userId);
    const queuedEntries: HydrationEntry[] = queue.map((item) => ({
      id: item.local_id,
      amount_ml: item.amount_ml,
      logged_at: item.logged_at,
      day: item.day,
      source: item.source,
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

  const todayEntries = useMemo(() => {
    return entries
      .filter((entry) => entry.day === today)
      .sort((a, b) => new Date(b.logged_at).getTime() - new Date(a.logged_at).getTime());
  }, [entries, today]);

  const todayTotal = useMemo(() => {
    return todayEntries.reduce((sum, entry) => sum + entry.amount_ml, 0);
  }, [todayEntries]);

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

  const addEntry = async (amount: number, source = "manual") => {
    if (!Number.isFinite(amount) || amount <= 0) return;
    const { data } = await supabase.auth.getSession();
    const userId = data.session?.user.id;
    if (!userId) return;

    const payload = {
      user_id: userId,
      amount_ml: amount,
      logged_at: new Date().toISOString(),
      day: today,
      source,
    };

    if (!navigator.onLine) {
      const queued: QueuedEntry = { ...payload, local_id: crypto.randomUUID() };
      enqueueEntry(queued);
      setEntries((prev) => [{ ...payload, id: queued.local_id, pending: true }, ...prev]);
      setStatus("Offline — added to queue. We will sync once you are back online.");
      return;
    }

    const { error, data: inserted } = await supabase.from("hydration_entries").insert(payload).select("id,amount_ml,logged_at,day,source").single();
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

  const saveGoal = async () => {
    const nextGoal = Math.max(0, Number(goalInput || 0));
    if (!nextGoal) return;

    setGoal(nextGoal);
    const { data } = await supabase.auth.getSession();
    const userId = data.session?.user.id;
    if (!userId) return;

    if (!navigator.onLine) {
      window.localStorage.setItem("velah:hydration:pendingGoal", String(nextGoal));
      setStatus("Offline — goal saved locally and will sync later.");
      return;
    }

    const { error } = await supabase
      .from("hydration_profiles")
      .upsert({ user_id: userId, goal_ml: nextGoal }, { onConflict: "user_id" });

    if (error) {
      setStatus("Could not save goal. Try again soon.");
      return;
    }

    setStatus("Goal updated.");
  };

  useEffect(() => {
    const syncGoal = async () => {
      if (!navigator.onLine) return;
      const stored = window.localStorage.getItem("velah:hydration:pendingGoal");
      if (!stored) return;
      const nextGoal = Number(stored || 0);
      if (!nextGoal) return;
      const { data } = await supabase.auth.getSession();
      const userId = data.session?.user.id;
      if (!userId) return;

      const { error } = await supabase
        .from("hydration_profiles")
        .upsert({ user_id: userId, goal_ml: nextGoal }, { onConflict: "user_id" });

      if (!error) {
        window.localStorage.removeItem("velah:hydration:pendingGoal");
        setStatus("Goal synced.");
      }
    };

    syncGoal().catch(() => setStatus("Goal will sync once online."));
  }, [online]);

  const startEdit = (entry: HydrationEntry) => {
    setEditingId(entry.id);
    setEditAmount(String(entry.amount_ml));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditAmount("");
  };

  const saveEdit = async (entry: HydrationEntry) => {
    const nextValue = Math.max(0, Number(editAmount || 0));
    if (!nextValue) return;

    if (entry.pending) {
      const queue = loadQueue();
      const updated = queue.map((item) =>
        item.local_id === entry.id ? { ...item, amount_ml: nextValue } : item
      );
      saveQueue(updated);
      setEntries((prev) => prev.map((item) => (item.id === entry.id ? { ...item, amount_ml: nextValue } : item)));
      cancelEdit();
      return;
    }

    if (!navigator.onLine) {
      setStatus("Reconnect to edit this entry.");
      return;
    }

    const { error } = await supabase.from("hydration_entries").update({ amount_ml: nextValue }).eq("id", entry.id);
    if (error) {
      setStatus("Could not update entry.");
      return;
    }

    setEntries((prev) => prev.map((item) => (item.id === entry.id ? { ...item, amount_ml: nextValue } : item)));
    cancelEdit();
  };

  const deleteEntry = async (entry: HydrationEntry) => {
    if (entry.pending) {
      removeQueued(entry.id);
      setEntries((prev) => prev.filter((item) => item.id !== entry.id));
      return;
    }

    if (!navigator.onLine) {
      setStatus("Reconnect to delete this entry.");
      return;
    }

    const { error } = await supabase.from("hydration_entries").delete().eq("id", entry.id);
    if (error) {
      setStatus("Could not delete entry.");
      return;
    }

    setEntries((prev) => prev.filter((item) => item.id !== entry.id));
  };

  return (
    <div className="space-y-6">
      <AppHeader title="Hydration" subtitle="Log water as you go. We'll keep it tidy." />

      {status ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          {status}
        </div>
      ) : null}

      <div className="app-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Today</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">{todayTotal} ml</h2>
            <p className="mt-1 text-sm text-slate-500">Goal {goal} ml</p>
          </div>
          <div className="text-right text-xs text-slate-400">
            {online ? "Online" : "Offline"}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {quickAdds.map((amount) => (
            <button key={amount} onClick={() => addEntry(amount, "quick-add") } className="btn btn-ghost h-10 rounded-full">
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
              onClick={() => addEntry(Number(customAmount || 0), "custom")}
              className="btn btn-primary h-10 rounded-full"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      <div className="app-card p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Goal</p>
        <div className="mt-3 flex items-center gap-2">
          <input
            value={goalInput}
            onChange={(event) => setGoalInput(event.target.value)}
            inputMode="numeric"
            className="h-11 w-28 rounded-full border border-slate-200 px-3 text-sm"
          />
          <button onClick={saveGoal} className="btn btn-primary h-11 rounded-full">Save goal</button>
        </div>
      </div>

      <div className="app-card p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Today log</p>
        <div className="mt-4 space-y-3">
          {todayEntries.length === 0 ? (
            <p className="text-sm text-slate-500">No entries yet. Tap a quick add to start.</p>
          ) : (
            todayEntries.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 last:border-0">
                <div>
                  <div className="text-base font-semibold text-slate-900">{entry.amount_ml} ml</div>
                  <div className="text-xs text-slate-400">
                    {new Date(entry.logged_at).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
                    {entry.pending ? " · queued" : ""}
                  </div>
                </div>
                {editingId === entry.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      value={editAmount}
                      onChange={(event) => setEditAmount(event.target.value)}
                      inputMode="numeric"
                      className="h-9 w-20 rounded-full border border-slate-200 px-3 text-sm"
                    />
                    <button onClick={() => saveEdit(entry)} className="btn btn-primary h-9 rounded-full">Save</button>
                    <button onClick={cancelEdit} className="btn btn-ghost h-9 rounded-full">Cancel</button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button onClick={() => startEdit(entry)} className="btn btn-ghost h-9 rounded-full">Edit</button>
                    <button onClick={() => deleteEntry(entry)} className="btn btn-ghost h-9 rounded-full text-red-500">Delete</button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="app-card p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Weekly view</p>
        <div className="mt-4 grid grid-cols-7 gap-2">
          {weekList.map((item) => {
            const percent = goal ? Math.min(100, Math.round((item.total / goal) * 100)) : 0;
            return (
              <div key={item.day} className="flex flex-col items-center gap-2">
                <div className="relative h-28 w-6 rounded-full bg-slate-100">
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
    </div>
  );
}
