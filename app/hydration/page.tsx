"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import AddToHome from "../../components/AddToHome";

/* ---------- helpers ---------- */
const dayKey = (d = new Date()) => d.toISOString().slice(0, 10); // YYYY-MM-DD
const clamp = (n: number, lo = 0, hi = 1_000_000) => Math.min(hi, Math.max(lo, n));
const fmt = (n: number) => new Intl.NumberFormat().format(n);

type SessionLike = { user: { id: string; email?: string | null } } | null;

type HistoryItem = { day: string; intake_ml: number };

export default function HydrationPage() {
  /* auth/session */
  const [session, setSession] = useState<SessionLike>(null);
  const [loading, setLoading] = useState(true);

  /* today + goal */
  const [goal, setGoal] = useState<number | null>(null);
  const [intake, setIntake] = useState(0);
  const [goalInput, setGoalInput] = useState("");
  const [customAdd, setCustomAdd] = useState("250");
  const [adjustInput, setAdjustInput] = useState("");

  /* history (7 days) */
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const today = dayKey();

  const percent = useMemo(() => {
    if (!goal || goal <= 0) return 0;
    return Math.max(0, Math.min(100, Math.round((intake / goal) * 100)));
  }, [intake, goal]);

  /* session listen */
  useEffect(() => {
    async function init() {
      const { data } = await supabase.auth.getSession();
      setSession(data.session ? { user: { id: data.session.user.id, email: data.session.user.email } } : null);
      setLoading(false);
    }
    const sub = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s ? { user: { id: s.user.id, email: s.user.email } } : null);
    });
    init();
    return () => sub.data?.subscription.unsubscribe();
  }, []);

  /* load state */
  useEffect(() => {
    if (loading) return;

    async function loadAuthed(uid: string) {
      // goal
      const { data: prof } = await supabase
        .from("hydration_profiles")
        .select("goal_ml")
        .eq("user_id", uid)
        .maybeSingle();
      if (prof?.goal_ml) {
        setGoal(prof.goal_ml);
        setGoalInput(String(prof.goal_ml));
      } else {
        setGoal(null);
        setGoalInput("");
      }

      // today
      const { data: todayRow } = await supabase
        .from("hydration_entries")
        .select("intake_ml")
        .eq("user_id", uid)
        .eq("day", today)
        .maybeSingle();
      setIntake(todayRow?.intake_ml || 0);
      setAdjustInput(todayRow?.intake_ml ? String(todayRow.intake_ml) : "");

      // last 7 days
      const start = new Date();
      start.setDate(start.getDate() - 6);
      const { data: rows } = await supabase
        .from("hydration_entries")
        .select("day,intake_ml")
        .eq("user_id", uid)
        .gte("day", dayKey(start))
        .lte("day", today)
        .order("day", { ascending: true });

      const byDay = new Map<string, number>();
      rows?.forEach((r) => byDay.set(r.day, r.intake_ml));
      const list: HistoryItem[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const k = dayKey(d);
        list.push({ day: k, intake_ml: byDay.get(k) ?? 0 });
      }
      setHistory(list);
    }

    function loadGuest() {
      const g = Number(localStorage.getItem("hydration:goal") || "") || 0;
      setGoal(g || null);
      setGoalInput(g ? String(g) : "");

      const t = Number(localStorage.getItem(`hydration:intake:${today}`) || "") || 0;
      setIntake(t);
      setAdjustInput(t ? String(t) : "");

      const list: HistoryItem[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const k = dayKey(d);
        const v = Number(localStorage.getItem(`hydration:intake:${k}`) || "") || 0;
        list.push({ day: k, intake_ml: v });
      }
      setHistory(list);
    }

    if (session?.user.id) loadAuthed(session.user.id);
    else loadGuest();
  }, [loading, session?.user.id, today]);

  /* midnight reset (keeps history) */
  useEffect(() => {
    const id = setInterval(() => {
      const d = new Date();
      if (d.getHours() === 0 && d.getMinutes() === 0) {
        setIntake(0);
        setAdjustInput("0");
        if (!session) {
          localStorage.setItem(`hydration:intake:${dayKey()}`, "0");
        } else {
          supabase
            .from("hydration_entries")
            .upsert({ user_id: session.user.id, day: dayKey(), intake_ml: 0 }, { onConflict: "user_id,day" });
        }
      }
    }, 60_000);
    return () => clearInterval(id);
  }, [session]);

  /* actions */
  async function saveGoal() {
    const ml = clamp(Number(goalInput || "0"));
    if (!ml) return;
    setGoal(ml);

    if (!session) {
      localStorage.setItem("hydration:goal", String(ml));
    } else {
      await supabase
        .from("hydration_profiles")
        .upsert({ user_id: session.user.id, goal_ml: ml }, { onConflict: "user_id" });
    }
  }

  async function setTotal(ml: number) {
    const v = clamp(ml);
    setIntake(v);
    setAdjustInput(String(v));
    if (!session) {
      localStorage.setItem(`hydration:intake:${today}`, String(v));
    } else {
      await supabase
        .from("hydration_entries")
        .upsert({ user_id: session.user.id, day: today, intake_ml: v }, { onConflict: "user_id,day" });
    }
    // update history slot for today
    setHistory((h) => h.map((d) => (d.day === today ? { ...d, intake_ml: v } : d)));
  }

  async function add(ml: number) {
    await setTotal(intake + ml);
  }

  /* UI */
  return (
    <main className="min-h-[calc(100vh-80px)] bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        <header className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-semibold tracking-tight">My hydration</h1>
          <div className="text-sm text-slate-500">
            {session ? `Signed in${session.user.email ? ` as ${session.user.email}` : ""}` : "Guest mode"}
          </div>
        </header>

        {/* PROGRESS RING */}
        <section className="mt-8 grid lg:grid-cols-[1.1fr_.9fr] gap-10 items-center">
          <ProgressRing
            percent={percent}
            numerator={intake}
            denominator={goal || 0}
          />

          {/* Goal + Quick actions */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold">Today</h2>
            <p className="text-slate-600 mt-1">
              {fmt(intake)} ml {goal ? <>/ {fmt(goal)} ml</> : null}
            </p>

            {/* Set goal */}
            <div className="mt-5">
              <label className="text-sm text-slate-600">Daily goal (ml)</label>
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="number"
                  inputMode="numeric"
                  className="border rounded-2xl px-3 py-2 w-36"
                  placeholder="e.g., 2000"
                  value={goalInput}
                  onChange={(e) => setGoalInput(e.target.value)}
                />
                <button onClick={saveGoal} className="btn btn-primary h-10 px-4 rounded-full">
                  Save goal
                </button>
              </div>
            </div>

            {/* Quick add */}
            <div className="mt-6">
              <div className="text-sm text-slate-600 mb-2">Quick add</div>
              <div className="flex flex-wrap items-center gap-2">
                {[250, 330, 500, 750].map((n) => (
                  <button key={n} onClick={() => add(n)} className="btn btn-ghost h-10 px-4 rounded-full">
                    +{n} ml
                  </button>
                ))}
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    inputMode="numeric"
                    className="border rounded-2xl px-3 py-2 w-28"
                    placeholder="Custom"
                    value={customAdd}
                    onChange={(e) => setCustomAdd(e.target.value)}
                  />
                  <button
                    onClick={() => {
                      const v = Number(customAdd);
                      if (Number.isFinite(v) && v > 0) add(v);
                    }}
                    className="btn btn-primary h-10 px-4 rounded-full"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Set exact / reset */}
            <div className="mt-6">
              <div className="text-sm text-slate-600 mb-2">Adjust total</div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  inputMode="numeric"
                  className="border rounded-2xl px-3 py-2 w-32"
                  placeholder="Set total"
                  value={adjustInput}
                  onChange={(e) => setAdjustInput(e.target.value)}
                />
                <button
                  onClick={() => setTotal(Number(adjustInput || 0))}
                  className="btn btn-ghost h-10 px-4 rounded-full"
                >
                  Set total
                </button>
                <button onClick={() => setTotal(0)} className="btn btn-ghost h-10 px-4 rounded-full">
                  Reset today
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* HISTORY */}
        <section className="mt-10 card p-6">
          <h3 className="text-lg font-semibold">Last 7 days</h3>
          <div className="mt-4 grid grid-cols-7 gap-3">
            {history.map((d) => {
              const p = goal ? Math.min(100, Math.round((d.intake_ml / goal) * 100)) : 0;
              return (
                <div key={d.day} className="flex flex-col items-center">
                  <div className="h-40 w-7 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="w-full rounded-t-full bg-[var(--velah)] transition-all duration-700 ease-[cubic-bezier(.22,1,.36,1)]"
                      style={{ height: `${p}%` }}
                      title={`${fmt(d.intake_ml)} ml`}
                    />
                  </div>
                  <div className="mt-2 text-[11px] text-slate-500">
                    {new Date(d.day).toLocaleDateString(undefined, { weekday: "short" })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
      <AddToHome />
    </main>
  );
}

/* ---------- Progress Ring (SVG) ---------- */
function ProgressRing({
  percent,
  numerator,
  denominator,
}: {
  percent: number;
  numerator: number;
  denominator: number;
}) {
  const size = 300;
  const stroke = 16;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (percent / 100) * c;

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} className="drop-shadow-sm">
        <defs>
          <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7FCBD8" />
            <stop offset="100%" stopColor="#4CAAB5" />
          </linearGradient>
        </defs>

        {/* track */}
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#e5e7eb" strokeWidth={stroke} fill="none" />
        {/* progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="url(#ring)"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${dash} ${c - dash}`}
          strokeLinecap="round"
          style={{
            transform: `rotate(-90deg)`,
            transformOrigin: "50% 50%",
            transition: "stroke-dasharray 700ms cubic-bezier(.22,1,.36,1)",
          }}
        />
      </svg>

      <div className="absolute text-center">
        <div className="text-5xl font-semibold">{percent}%</div>
        <div className="mt-1 text-slate-600">
          {fmt(numerator)} {denominator ? <>/ {fmt(denominator)}</> : null} ml
        </div>
      </div>
    </div>
  );
}
