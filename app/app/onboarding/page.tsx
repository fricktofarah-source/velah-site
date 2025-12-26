"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";

const screens = [
  {
    title: "Track your hydration",
    body: "Log every pour in seconds and see how today compares to your goal.",
  },
  {
    title: "Keep the loop flowing",
    body: "Glass bottles return on your schedule with Dubai-wide pickup windows.",
  },
  {
    title: "Stay gently on track",
    body: "Smart nudges help you keep a steady rhythm without the noise.",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const onboarded = window.localStorage.getItem("velah:onboarded") === "1";
    if (onboarded) router.replace("/app");
  }, [router]);

  const progress = useMemo(() => ((index + 1) / screens.length) * 100, [index]);

  const handleNext = () => {
    if (index < screens.length - 1) {
      setIndex((i) => i + 1);
    } else {
      window.localStorage.setItem("velah:onboarded", "1");
      router.push("/app/auth");
    }
  };

  return (
    <div className="flex min-h-[70vh] flex-col justify-between gap-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Velah</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Welcome to your daily ritual.</h1>
        <p className="mt-2 text-sm text-slate-500">A focused app for hydration, delivery, and returns.</p>
      </div>

      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {screens.map((screen, i) => (
            <motion.div
              key={screen.title}
              className="min-w-full pr-2"
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={reduceMotion ? undefined : { opacity: i === index ? 1 : 0.4, y: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div className="app-card p-6">
                <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Step {i + 1}</div>
                <h2 className="mt-3 text-xl font-semibold text-slate-900">{screen.title}</h2>
                <p className="mt-2 text-sm text-slate-600">{screen.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="h-[2px] w-full rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-[var(--velah)] transition-all" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex flex-col gap-3">
          <button onClick={handleNext} className="btn btn-primary h-12 rounded-full text-base">
            {index === screens.length - 1 ? "Create account / Sign in" : "Next"}
          </button>
          <Link
            href="/app/auth"
            className="btn btn-ghost h-12 rounded-full text-base"
            onClick={() => window.localStorage.setItem("velah:onboarded", "1")}
          >
            Skip for now
          </Link>
        </div>
      </div>
    </div>
  );
}
