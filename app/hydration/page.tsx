// app/hydration/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { dayKey } from "@/lib/app/hydration";
import { useLanguage } from "@/components/LanguageProvider";
import TimezoneSync from "@/components/TimezoneSync";

/* ---------- helpers ---------- */
const clamp = (n: number, lo = 0, hi = 1_000_000) => Math.min(hi, Math.max(lo, n));
const fmt = (n: number) => new Intl.NumberFormat().format(n);

 type SessionLike = { user: { id: string; email?: string | null } } | null;

 type HistoryItem = { day: string; intake_ml: number };

export default function HydrationPage() {
   const { t } = useLanguage();
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

  const streak = useMemo(() => {
    if (!goal || goal <= 0 || history.length === 0) return 0;
    let count = 0;
    const cursor = new Date(today);
    for (let i = history.length - 1; i >= 0; i--) {
      const entry = history[i];
      const expected = dayKey(cursor);
      if (entry.day !== expected) break;
      if (entry.intake_ml >= goal) {
        count += 1;
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
    }
    return count;
  }, [goal, history, today]);

   /* session listen */
   useEffect(() => {
     let isMounted = true;

     async function init() {
       try {
         const withTimeout = async <T,>(promise: PromiseLike<T>, ms: number): Promise<T> => {
           let timeoutId: ReturnType<typeof setTimeout> | null = null;
           const timeoutPromise = new Promise<never>((_, reject) => {
             timeoutId = setTimeout(() => reject(new Error("Auth timeout")), ms);
           });
           try {
             return await Promise.race([promise, timeoutPromise]);
           } finally {
             if (timeoutId) clearTimeout(timeoutId);
           }
         };

         const { data } = await withTimeout(supabase.auth.getSession(), 8000);
         if (!isMounted) return;
         setSession(data.session ? { user: { id: data.session.user.id, email: data.session.user.email } } : null);
       } catch (error) {
         console.warn("supabase.auth.getSession failed, falling back to guest mode", error);
         if (isMounted) setSession(null);
       } finally {
         if (isMounted) setLoading(false);
       }
     }

     const sub = supabase.auth.onAuthStateChange((_e, s) => {
       setSession(s ? { user: { id: s.user.id, email: s.user.email } } : null);
     });

     init();

     return () => {
       isMounted = false;
       sub.data?.subscription.unsubscribe();
     };
   }, []);

   /* load state */
   useEffect(() => {
     if (loading) return;

     async function loadAuthed(uid: string) {
       if (typeof navigator !== "undefined" && !navigator.onLine) {
         loadGuest();
         return;
       }

       async function withTimeout<T>(promise: PromiseLike<T>, ms: number): Promise<T> {
         let timeoutId: ReturnType<typeof setTimeout> | null = null;
         const timeoutPromise = new Promise<never>((_, reject) => {
           timeoutId = setTimeout(() => reject(new Error("Hydration load timeout")), ms);
         });
         try {
           return await Promise.race([promise, timeoutPromise]);
         } finally {
           if (timeoutId) clearTimeout(timeoutId);
         }
       }

       // goal
       const { data: prof } = await withTimeout(
         supabase
           .from("profiles")
           .select("hydration_goal_ml")
           .eq("user_id", uid)
           .maybeSingle(),
         8000
       );
       if (prof?.hydration_goal_ml) {
         setGoal(prof.hydration_goal_ml);
         setGoalInput(String(prof.hydration_goal_ml));
       } else {
         setGoal(null);
         setGoalInput("");
       }

       // today
       const { data: todayRow } = await withTimeout(
         supabase
           .from("hydration_daily_totals")
           .select("total_ml")
           .eq("user_id", uid)
           .eq("day", today)
           .maybeSingle(),
         8000
       );
       setIntake(todayRow?.total_ml || 0);
       setAdjustInput(todayRow?.total_ml ? String(todayRow.total_ml) : "");

       // last 7 days
       const start = new Date();
       start.setDate(start.getDate() - 6);
       const { data: rows } = await withTimeout(
         supabase
           .from("hydration_daily_totals")
           .select("day,total_ml")
           .eq("user_id", uid)
           .gte("day", dayKey(start))
           .lte("day", today)
           .order("day", { ascending: true }),
         8000
       );

       const byDay = new Map<string, number>();
       rows?.forEach((r) => byDay.set(r.day, r.total_ml));
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

     if (session?.user.id) {
       loadAuthed(session.user.id).catch((error) => {
         console.warn("Failed to load hydration data for user, falling back to guest mode", error);
         loadGuest();
       });
     } else {
       loadGuest();
     }
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
         .from("profiles")
         .upsert({ user_id: session.user.id, hydration_goal_ml: ml }, { onConflict: "user_id" });
     }
   }

   async function setTotal(ml: number) {
     const v = clamp(ml);
     setIntake(v);
     setAdjustInput(String(v));
     if (!session) {
       localStorage.setItem(`hydration:intake:${today}`, String(v));
     } else {
       const delta = v - intake;
       if (delta !== 0) {
         await supabase.from("hydration_events").insert({
           user_id: session.user.id,
           day: today,
           amount_ml: delta,
           logged_at: new Date().toISOString(),
           source: "hydration_page",
           client_event_id: crypto.randomUUID(),
         });
       }
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
      <TimezoneSync />
       <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
         <header className="flex items-center justify-between gap-4">
           <h1 className="text-3xl font-semibold tracking-tight">{t.hydration.title}</h1>
           <div className="text-sm text-slate-500">
             {session
               ? session.user.email
                 ? t.hydration.statusSignedInAs(session.user.email)
                 : t.hydration.statusSignedIn
               : t.hydration.statusGuest}
           </div>
         </header>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/80 p-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold">{t.hydration.streakLabel}</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{t.hydration.streakValue(streak)}</p>
            <p className="mt-1 text-sm text-slate-600">{streak > 0 ? t.hydration.streakKeepGoing : t.hydration.streakStart}</p>
          </div>
          <div className="h-14 w-14 shrink-0 rounded-2xl bg-white border border-slate-200 shadow-inner flex items-center justify-center text-[var(--velah)] text-2xl font-semibold">
            {streak}
          </div>
        </div>

        {/* PROGRESS RING */}
         <section className="mt-8 grid lg:grid-cols-[1.1fr_.9fr] gap-10 items-center">
           <ProgressRing
             percent={percent}
             numerator={intake}
             denominator={goal || 0}
           />

           {/* Goal + Quick actions */}
           <div className="card p-6">
             <h2 className="text-xl font-semibold">{t.hydration.todayHeading}</h2>
             <p className="text-slate-600 mt-1">
               {fmt(intake)} {t.hydration.unitMl} {goal ? <>/ {fmt(goal)} {t.hydration.unitMl}</> : null}
             </p>

             {/* Set goal */}
             <div className="mt-5">
               <label className="text-sm text-slate-600" htmlFor="daily-goal">
                 {t.hydration.dailyGoalLabel}
               </label>
               <div className="mt-2 flex items-center gap-2">
                 <input
                   id="daily-goal"
                   type="number"
                   inputMode="numeric"
                   className="border rounded-2xl px-3 py-2 w-36 focus-ring"
                   placeholder={t.hydration.dailyGoalPlaceholder}
                   value={goalInput}
                   onChange={(e) => setGoalInput(e.target.value)}
                 />
                 <button onClick={saveGoal} className="btn btn-primary h-10 px-4 rounded-full">
                   {t.hydration.saveGoal}
                 </button>
               </div>
             </div>

             {/* Quick add */}
             <div className="mt-6">
               <div className="text-sm text-slate-600 mb-2">{t.hydration.quickAdd}</div>
               <div className="flex flex-wrap items-center gap-2">
                 {[250, 330, 500, 750].map((n) => (
                   <button key={n} onClick={() => add(n)} className="btn btn-ghost h-10 px-4 rounded-full">
                     +{n} ml
                   </button>
                 ))}
                 <div className="flex items-center gap-2">
                   <label className="sr-only" htmlFor="custom-add">
                     {t.hydration.customAmountLabel}
                   </label>
                   <input
                     id="custom-add"
                     type="number"
                     inputMode="numeric"
                     className="border rounded-2xl px-3 py-2 w-28 focus-ring"
                     placeholder={t.hydration.customAmountPlaceholder}
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
                     {t.hydration.customAmountCta}
                   </button>
                 </div>
               </div>
             </div>

             {/* Set exact / reset */}
             <div className="mt-6">
               <div className="text-sm text-slate-600 mb-2">{t.hydration.adjustTotalLabel}</div>
               <div className="flex items-center gap-2">
                 <label className="sr-only" htmlFor="set-total">
                   {t.hydration.setTotalLabel}
                 </label>
                 <input
                   id="set-total"
                   type="number"
                   inputMode="numeric"
                   className="border rounded-2xl px-3 py-2 w-32 focus-ring"
                   placeholder={t.hydration.setTotalPlaceholder}
                   value={adjustInput}
                   onChange={(e) => setAdjustInput(e.target.value)}
                 />
                 <button
                   onClick={() => setTotal(Number(adjustInput || 0))}
                   className="btn btn-ghost h-10 px-4 rounded-full"
                 >
                   {t.hydration.setTotalCta}
                 </button>
                 <button onClick={() => setTotal(0)} className="btn btn-ghost h-10 px-4 rounded-full">
                   {t.hydration.resetToday}
                 </button>
               </div>
             </div>
           </div>
         </section>

         {/* HISTORY */}
         <section className="mt-10 card p-6">
           <h3 className="text-lg font-semibold">{t.hydration.historyHeading}</h3>
           <div className="mt-4 grid grid-cols-7 gap-3">
             {history.map((d) => {
               const p = goal ? Math.min(100, Math.round((d.intake_ml / goal) * 100)) : 0;
               return (
                 <div key={d.day} className="flex flex-col items-center">
                   <div className="relative h-40 w-7 rounded-full bg-slate-200 overflow-hidden">
                     <div
                       className="absolute inset-x-0 bottom-0 rounded-t-full bg-[var(--velah)] transition-all duration-700 ease-[cubic-bezier(.22,1,.36,1)]"
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
   const size = 300; // viewBox size; actual rendered size is responsive via CSS
   const stroke = 16;
   const r = (size - stroke) / 2;
   const c = 2 * Math.PI * r;
   const dash = (percent / 100) * c;

   return (
     <div className="relative flex items-center justify-center">
       <svg
         viewBox={`0 0 ${size} ${size}`}
         className="drop-shadow-sm w-64 sm:w-72 lg:w-[300px] h-auto"
         aria-hidden
       >
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

       <div className="absolute text-center" aria-live="polite">
         <div className="text-5xl font-semibold tabular-nums">{percent}%</div>
         <div className="mt-1 text-slate-600">
           {fmt(numerator)} {denominator ? <>/ {fmt(denominator)}</> : null} ml
         </div>
       </div>
     </div>
   );
 }
