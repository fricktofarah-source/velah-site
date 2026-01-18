"use client";

import { useEffect, useMemo, useState } from "react";
import AppHeader from "@/components/app/AppHeader";
import ProgressRing from "@/components/app/ProgressRing";
import RequireAuth from "@/components/app/RequireAuth";
import { supabase } from "@/lib/supabaseClient";
import {
  dayKey,
  enqueueEntry,
  loadQueue,
  loadTotals,
  removeQueued,
  saveQueue,
  saveTotals,
  type QueuedEntry,
} from "@/lib/app/hydration";
import { useLanguage } from "@/components/LanguageProvider";

const quickAdds = [250, 500, 1000];

type HydrationEntry = {
  key: string;
  intake_ml: number;
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
  const { t } = useLanguage();
  const copy = t.app.home;
  const today = dayKey();
  const [goal, setGoal] = useState(2000);
  const [entries, setEntries] = useState<HydrationEntry[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [online, setOnline] = useState(true);
  const [customAmount, setCustomAmount] = useState("350");
  const [adjustInput, setAdjustInput] = useState("");

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

    const queue = loadQueue().filter((item) => item.user_id === userId);
    const pendingByDay = new Map<string, number>();
    queue.forEach((item) => {
      pendingByDay.set(item.day, (pendingByDay.get(item.day) || 0) + item.amount_ml);
    });

    if (!navigator.onLine) {
      const cachedTotals = loadTotals(userId);
      const merged = new Map<string, HydrationEntry>();
      Object.entries(cachedTotals).forEach(([day, total]) => {
        const pending = pendingByDay.get(day) || 0;
        merged.set(day, { key: day, intake_ml: total + pending, day, pending: pending !== 0 });
      });
      pendingByDay.forEach((pending, day) => {
        if (merged.has(day)) return;
        merged.set(day, { key: day, intake_ml: pending, day, pending: true });
      });
      if (!mounted.current) return;
      setEntries([...merged.values()]);
      setStatus(copy.statusOfflineOnly);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("hydration_goal_ml")
      .eq("user_id", userId)
      .maybeSingle();

    if (!mounted.current) return;
    if (profile?.hydration_goal_ml) setGoal(profile.hydration_goal_ml);

    const start = new Date();
    start.setDate(start.getDate() - 6);
    const primaryQuery = supabase
      .from("hydration_daily_totals")
      .select("total_ml,day")
      .eq("user_id", userId)
      .gte("day", dayKey(start))
      .lte("day", today)
      .order("day", { ascending: false });

    let rows: { total_ml: number; day: string }[] | null = null;
    let error: { message?: string } | null = null;
    const primary = await primaryQuery;
    if (primary.error) {
      error = primary.error;
    } else {
      rows = (primary.data || []).map((row) => ({
        total_ml: row.total_ml,
        day: row.day,
      }));
    }

    if (!mounted.current) return;
    if (error) {
      setStatus(error.message || copy.statusRefreshFail);
    }

    const hydratedRows: HydrationEntry[] = (rows || []).map((row) => ({
      key: row.day,
      intake_ml: row.total_ml,
      day: row.day,
    }));

    const totalsMap: Record<string, number> = {};
    hydratedRows.forEach((entry) => {
      totalsMap[entry.day] = entry.intake_ml;
    });
    saveTotals(userId, totalsMap);

    const merged = new Map<string, HydrationEntry>();
    hydratedRows.forEach((entry) => {
      const pending = pendingByDay.get(entry.day) || 0;
      merged.set(entry.day, {
        ...entry,
        intake_ml: entry.intake_ml + pending,
        pending: pending !== 0,
      });
    });
    pendingByDay.forEach((pending, day) => {
      if (merged.has(day)) return;
      merged.set(day, { key: day, intake_ml: pending, day, pending: true });
    });
    setEntries([...merged.values()]);
    if (!error) setStatus(null);
  };

  useEffect(() => {
    const mounted = { current: true };
    refresh(mounted).catch(() => setStatus(copy.statusLoadFail));
    return () => {
      mounted.current = false;
    };
  }, [today]);

  const todayTotal = useMemo(() => {
    return entries.filter((entry) => entry.day === today).reduce((sum, entry) => sum + entry.intake_ml, 0);
  }, [entries, today]);

  const recentEntries = useMemo(() => {
    return [...entries]
      .sort((a, b) => new Date(b.day).getTime() - new Date(a.day).getTime())
      .slice(0, 3);
  }, [entries]);

  const weeklyTotals = useMemo(() => {
    const totals = new Map<string, number>();
    entries.forEach((entry) => {
      totals.set(entry.day, entry.intake_ml);
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
      day: today,
      amount_ml: amount,
      logged_at: new Date().toISOString(),
      source: "app_home",
      client_event_id: crypto.randomUUID(),
    };

    if (!navigator.onLine) {
      const queue = loadQueue();
      const queued: QueuedEntry = payload;
      queue.push(queued);
      saveQueue(queue);
      setEntries((prev) => {
        const nextTotal = todayTotal + amount;
        return [
          { key: today, intake_ml: nextTotal, day: today, pending: true },
          ...prev.filter((entry) => entry.day !== today),
        ];
      });
      setStatus(copy.statusOfflineQueued);
      return;
    }

    const { error: insertError } = await supabase.from("hydration_events").insert(payload);

    if (insertError) {
      const queued: QueuedEntry = {
        user_id: userId,
        amount_ml: amount,
        logged_at: payload.logged_at,
        day: today,
        source: payload.source,
        client_event_id: payload.client_event_id,
      };
      enqueueEntry(queued);
      setEntries((prev) => [
        { key: today, intake_ml: todayTotal + amount, day: today, pending: true },
        ...prev.filter((entry) => entry.day !== today),
      ]);
      setStatus(copy.statusSupabaseQueued);
      return;
    }

    setEntries((prev) => [
      { key: today, intake_ml: todayTotal + amount, day: today },
      ...prev.filter((entry) => entry.day !== today),
    ]);
    setStatus(null);
  };

  const setTotal = async (nextTotal: number) => {
    if (!Number.isFinite(nextTotal) || nextTotal < 0) return;
    const { data } = await supabase.auth.getSession();
    const userId = data.session?.user.id;
    if (!userId) return;

    const delta = nextTotal - todayTotal;
    if (delta === 0) return;
    const payload = {
      user_id: userId,
      day: today,
      amount_ml: delta,
      logged_at: new Date().toISOString(),
      source: "app_home",
      client_event_id: crypto.randomUUID(),
    };

    if (!navigator.onLine) {
      const queue = loadQueue();
      const queued: QueuedEntry = payload;
      queue.push(queued);
      saveQueue(queue);
      setEntries((prev) => [
        { key: today, intake_ml: nextTotal, day: today, pending: true },
        ...prev.filter((entry) => entry.day !== today),
      ]);
      setStatus(copy.statusOfflineSaved);
      return;
    }

    const { error: insertError } = await supabase.from("hydration_events").insert(payload);

    if (insertError) {
      setStatus(copy.statusUpdateFail);
      return;
    }

    setEntries((prev) => [{ key: today, intake_ml: nextTotal, day: today }, ...prev.filter((entry) => entry.day !== today)]);
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

      const payload = queue.map((item) => ({
        user_id: item.user_id,
        day: item.day,
        amount_ml: item.amount_ml,
        logged_at: item.logged_at,
        source: item.source,
        client_event_id: item.client_event_id,
      }));

      const { error: syncError } = await supabase
        .from("hydration_events")
        .upsert(payload, { onConflict: "user_id,client_event_id" });

      if (syncError) {
        setStatus(copy.statusStillOffline);
        return;
      }

      queue.forEach((item) => removeQueued(item.client_event_id));
      await refresh({ current: true });
      setStatus(copy.statusSynced);
    };

    syncQueue().catch(() => setStatus(copy.statusSyncQueued));
  }, [online]);

  return (
    <div className="space-y-6">
      <AppHeader
        title={copy.title}
        subtitle={new Date().toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}
      />

      {status ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          {status}
        </div>
      ) : null}

      <div className="app-card p-6">
        <div className="flex items-center justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{copy.hydrationLabel}</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              {todayTotal} {copy.unitMl}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {copy.goalLabel} {goal} {copy.unitMl}
            </p>
          </div>
          <ProgressRing value={todayTotal} total={goal} />
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {quickAdds.map((amount) => (
            <button key={amount} onClick={() => addEntry(amount)} className="btn btn-ghost h-10 rounded-full">
              +{amount} {copy.unitMl}
            </button>
          ))}
          <div className="flex items-center gap-2">
            <input
              value={customAmount}
              onChange={(event) => setCustomAmount(event.target.value)}
              inputMode="numeric"
              className="h-10 w-24 rounded-full border border-slate-200 px-3 text-sm"
              placeholder={copy.customPlaceholder}
            />
            <button onClick={() => addEntry(Number(customAmount || 0))} className="btn btn-primary h-10 rounded-full">
              {copy.addCta}
            </button>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{copy.adjustLabel}</p>
          <div className="mt-3 flex items-center gap-2">
            <input
              value={adjustInput}
              onChange={(event) => setAdjustInput(event.target.value)}
              inputMode="numeric"
              className="h-11 w-28 rounded-full border border-slate-200 px-3 text-sm"
              placeholder={copy.setPlaceholder}
            />
            <button onClick={() => setTotal(Number(adjustInput || 0))} className="btn btn-ghost h-11 rounded-full">
              {copy.setCta}
            </button>
            <button onClick={() => setTotal(0)} className="btn btn-ghost h-11 rounded-full">
              {copy.resetCta}
            </button>
          </div>
        </div>
        <div className="mt-4 text-xs text-slate-400">{copy.streakLabel(streak)}</div>
      </div>

      <div className="app-card p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{copy.weeklyLabel}</p>
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
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{copy.upcomingLabel}</p>
        <h3 className="mt-2 text-lg font-semibold text-slate-900">{copy.upcomingSlot}</h3>
        <p className="mt-1 text-sm text-slate-500">{copy.upcomingNote}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="app-card p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{copy.loopLabel}</p>
          <div className="mt-3 text-2xl font-semibold text-slate-900">{copy.loopOut}</div>
          <div className="text-sm text-slate-500">{copy.loopReturned}</div>
        </div>
        <div className="app-card p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{copy.nextRouteLabel}</p>
          <div className="mt-3 text-2xl font-semibold text-slate-900">{copy.nextRouteName}</div>
          <div className="text-sm text-slate-500">{copy.nextRouteSlot}</div>
        </div>
      </div>

      <div className="app-card p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{copy.recentLabel}</p>
        <div className="mt-4 space-y-3">
          {recentEntries.map((entry) => (
            <div key={entry.key} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0">
              <div>
                <div className="text-base font-semibold text-slate-900">
                  {entry.intake_ml} {copy.unitMl}
                </div>
                <div className="text-xs text-slate-400">
                  {new Date(entry.day).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
                  {entry.pending ? copy.queuedSuffix : ""}
                </div>
              </div>
              <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                {new Date(entry.day).toLocaleDateString(undefined, { weekday: "short" })}
              </span>
            </div>
          ))}
          {entries.length === 0 ? <p className="text-sm text-slate-500">{copy.emptyLog}</p> : null}
        </div>
      </div>
    </div>
  );
}
