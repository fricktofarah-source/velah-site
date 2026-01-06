"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import AppHeader from "@/components/app/AppHeader";
import { useLanguage } from "@/components/LanguageProvider";

const modes = ["sign-in", "sign-up", "magic"] as const;

type Mode = (typeof modes)[number];

type Status = { kind: "idle" | "loading" | "success" | "error"; message?: string };

export default function AuthPage() {
  const { t } = useLanguage();
  const copy = t.app.auth;
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("sign-in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/app");
    });
  }, [router]);

  const isBusy = status.kind === "loading";

  const helper = useMemo(() => {
    if (mode === "magic") return copy.helperMagic;
    if (mode === "sign-up") return copy.helperSignUp;
    return copy.helperSignIn;
  }, [mode, copy]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus({ kind: "loading" });

    try {
      if (mode === "sign-in") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setStatus({ kind: "success", message: copy.statusWelcome });
        router.replace("/app");
        return;
      }

      if (mode === "magic") {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        });
        if (error) throw error;
        setStatus({ kind: "success", message: copy.statusMagic });
        return;
      }

      const res = await fetch("/api/auth-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      const json = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!res.ok || !json?.ok) throw new Error(json?.error || copy.statusError);
      setStatus({ kind: "success", message: copy.statusConfirm });
    } catch (error) {
      const message = error instanceof Error ? error.message : copy.statusError;
      setStatus({ kind: "error", message });
    }
  };

  return (
    <div className="space-y-6">
      <AppHeader title={copy.title} subtitle={helper} />

      <div className="app-card p-4">
        <div className="grid grid-cols-3 gap-2">
          {modes.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setMode(item);
                setStatus({ kind: "idle" });
              }}
              className={`rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
                mode === item ? "bg-slate-900 text-white" : "border border-slate-200 text-slate-500"
              }`}
            >
              {item === "sign-in" ? copy.tabSignIn : item === "sign-up" ? copy.tabSignUp : copy.tabMagic}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="app-card p-5 space-y-4">
        {mode === "sign-up" ? (
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{copy.nameLabel}</span>
            <input
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus-ring"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </label>
        ) : null}
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{copy.emailLabel}</span>
          <input
            type="email"
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus-ring"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        {mode !== "magic" ? (
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{copy.passwordLabel}</span>
            <input
              type="password"
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus-ring"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
        ) : null}
        <button
          type="submit"
          disabled={isBusy}
          className="btn btn-primary h-12 w-full rounded-full text-base disabled:opacity-60"
        >
          {isBusy
            ? copy.submitLoading
            : mode === "sign-in"
            ? copy.submitSignIn
            : mode === "magic"
            ? copy.submitMagic
            : copy.submitSignUp}
        </button>
        {status.kind !== "idle" ? (
          <p className={`text-sm ${status.kind === "error" ? "text-red-500" : "text-slate-600"}`}>
            {status.message}
          </p>
        ) : null}
      </form>

      <div className="text-center text-xs text-slate-400">
        {copy.termsPrefix}
        <Link href="/" className="ml-1 underline">{copy.termsLink}</Link>.
      </div>
    </div>
  );
}
