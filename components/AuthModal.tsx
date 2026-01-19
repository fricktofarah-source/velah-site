// components/AuthModal.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type Mode = "signup" | "signin" | "reset";

export default function AuthModal({
  open,
  onClose,
  initialMode = "signup",
}: {
  open: boolean;
  onClose: () => void;
  initialMode?: Mode;
}) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [phase, setPhase] = useState<"form" | "sending" | "done">("form");
  const [error, setError] = useState<string | null>(null);
  const [joinList, setJoinList] = useState(true);
  const [name, setName] = useState("");
  const emailRef = useRef<HTMLInputElement | null>(null);

  // IDs for a11y bindings
  const titleId = "auth-title";
  const descId = "auth-desc";

  useEffect(() => {
    if (open) {
      setMode(initialMode);
      setPhase("form");
      setError(null);
      setTimeout(() => emailRef.current?.focus(), 80);
    } else {
      setEmail("");
      setPw("");
      setName("");
    }
  }, [open, initialMode]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const validEmail = (v: string) => /\S+@\S+\.\S+/.test(v.trim());

  function normalizeErr(msg?: string): string {
    if (!msg) return "Something went wrong. Please try again.";
    const m = msg.toLowerCase();
    if (m.includes("invalid login credentials")) return "Incorrect email or password.";
    if (m.includes("email not confirmed")) return "Please confirm your email, then sign in.";
    if (m.includes("already exists") || m.includes("already registered"))
      return "An account with this email already exists. Try signing in.";
    if (m.includes("password")) return "Password must be at least 6 characters.";
    return msg;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const em = email.trim().toLowerCase();
    if (!validEmail(em)) return setError("Please enter a valid email.");
    if (mode !== "reset" && (!pw || pw.length < 6)) {
      return setError("Password must be at least 6 characters.");
    }
    if (mode === "signup" && !name.trim()) return setError("Please enter your name.");

    try {
      setPhase("sending");

      if (mode === "signup") {
        // UI-only change: keep your endpoint exactly the same
        const res = await fetch("/api/auth-signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: em, password: pw, name, joinList }),
        });
        const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
        if (!res.ok || !data?.ok) throw new Error(data?.error || "Couldn’t create the account.");
        setPhase("done");
      } else if (mode === "signin") {
        const { error: signInErr } = await supabase.auth.signInWithPassword({
          email: em,
          password: pw,
        });
        if (signInErr) throw signInErr;
        setPhase("done");
      } else {
        const redirectTo = `${window.location.origin}/auth/reset`;
        const { error: resetErr } = await supabase.auth.resetPasswordForEmail(em, { redirectTo });
        if (resetErr) throw resetErr;
        setPhase("done");
      }
    } catch (err: unknown) {
      setPhase("form");
      const message = err instanceof Error ? err.message : String(err);
      setError(normalizeErr(message));
    }
  }

  if (!open) return null;

  const disabled = phase !== "form";

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descId}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="card w-full max-w-md overflow-hidden animate-pop-in">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <div id={titleId} className="font-semibold">
            {mode === "signup" ? "Create your account" : mode === "signin" ? "Sign in" : "Reset password"}
          </div>
          <button className="btn btn-ghost btn-no-arrow h-9 focus-ring" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="relative">
          <p id={descId} className="sr-only">
            {mode === "signup"
              ? "Create a new account with your name, email, and password."
              : mode === "signin"
              ? "Sign in with your email and password."
              : "Request a password reset link by email."}
          </p>

          <div className="p-5 md:p-6 max-h-[85vh] overflow-auto">
            {/* FORM */}
            <div
              className={`space-y-4 transition-opacity duration-300 ${
                phase === "form" ? "opacity-100" : "opacity-0 pointer-events-none absolute inset-0"
              }`}
              aria-hidden={phase !== "form"}
            >
              <form onSubmit={submit} noValidate className="space-y-4" aria-busy={phase === "sending"}>
                {mode === "signup" && (
                  <div className="space-y-2">
                    <label htmlFor="auth-name" className="text-sm">
                      Name
                    </label>
                    <input
                      id="auth-name"
                      name="name"
                      autoComplete="given-name"
                      type="text"
                      value={name}
                      disabled={disabled}
                      onChange={(e) => setName(e.target.value)}
                      className="border rounded-2xl px-3 py-2 w-full focus-ring"
                      placeholder="Your Name"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="auth-email" className="text-sm">
                    Email
                  </label>
                  <input
                    id="auth-email"
                    name="email"
                    ref={emailRef}
                    type="email"
                    autoComplete="email"
                    enterKeyHint="next"
                    value={email}
                    disabled={disabled}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border rounded-2xl px-3 py-2 w-full focus-ring"
                    placeholder="you@company.com"
                    aria-invalid={!!error}
                  />
                </div>

                {mode !== "reset" ? (
                  <div className="space-y-2">
                    <label htmlFor="auth-pw" className="text-sm">
                      Password
                    </label>
                    <input
                      id="auth-pw"
                      name="password"
                      type="password"
                      autoComplete={mode === "signup" ? "new-password" : "current-password"}
                      enterKeyHint="go"
                      value={pw}
                      disabled={disabled}
                      onChange={(e) => setPw(e.target.value)}
                      className="border rounded-2xl px-3 py-2 w-full focus-ring"
                      placeholder="••••••••"
                    />
                  </div>
                ) : null}

                {error && (
                  <div className="text-sm text-red-600 animate-soft-shake" role="alert" aria-live="polite">
                    {error}
                  </div>
                )}

                {mode === "signup" && (
                  <label className="flex items-center gap-2 text-sm text-slate-700 select-none">
                    <input
                      type="checkbox"
                      className="accent-black"
                      checked={joinList}
                      disabled={disabled}
                      onChange={(e) => setJoinList(e.target.checked)}
                    />
                    Also join the Velah newsletter
                  </label>
                )}

                <button type="submit" className="btn btn-primary h-10 w-full" disabled={disabled} aria-busy={disabled}>
                  {phase === "sending"
                    ? mode === "signup"
                      ? "Creating…"
                      : mode === "signin"
                      ? "Signing in…"
                      : "Sending reset…"
                    : mode === "signup"
                    ? "Sign up"
                    : mode === "signin"
                    ? "Sign in"
                    : "Send reset link"}
                </button>

                <div className="pt-2 text-center text-sm text-slate-600">
                  {mode === "signup" ? (
                    <button
                      type="button"
                      onClick={() => {
                        setMode("signin");
                        setError(null);
                      }}
                      className="underline underline-offset-4 decoration-slate-400 hover:decoration-[var(--velah)] focus-ring rounded"
                    >
                      Have an account? Sign in
                    </button>
                  ) : mode === "signin" ? (
                    <button
                      type="button"
                      onClick={() => {
                        setMode("signup");
                        setError(null);
                      }}
                      className="underline underline-offset-4 decoration-slate-400 hover:decoration-[var(--velah)] focus-ring rounded"
                    >
                      New here? Create an account
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setMode("signin");
                        setError(null);
                      }}
                      className="underline underline-offset-4 decoration-slate-400 hover:decoration-[var(--velah)] focus-ring rounded"
                    >
                      Back to sign in
                    </button>
                  )}
                </div>

                {mode === "signin" ? (
                  <div className="text-center text-sm text-slate-600">
                    <button
                      type="button"
                      onClick={() => {
                        setMode("reset");
                        setError(null);
                      }}
                      className="underline underline-offset-4 decoration-slate-400 hover:decoration-[var(--velah)] focus-ring rounded"
                    >
                      Forgot password?
                    </button>
                  </div>
                ) : null}
              </form>
            </div>

            {/* SENDING */}
            <div
              className={`p-6 flex items-center justify-center gap-3 transition-opacity duration-300 ${
                phase === "sending" ? "opacity-100" : "opacity-0 pointer-events-none absolute inset-0"
              }`}
              aria-hidden={phase !== "sending"}
            >
              <div className="loader" aria-hidden />
              <div className="text-sm text-slate-600">
                {mode === "signup"
                  ? "Creating your account…"
                  : mode === "signin"
                  ? "Signing you in…"
                  : "Sending reset email…"}
              </div>
            </div>

            {/* DONE */}
            <div
              className={`p-6 flex flex-col items-center justify-center gap-3 transition-opacity duration-300 ${
                phase === "done" ? "opacity-100" : "opacity-0 pointer-events-none absolute inset-0"
              }`}
              aria-hidden={phase !== "done"}
            >
              <div className="success-check" aria-hidden />
              <div className="text-emerald-700 text-sm text-center">
                {mode === "signup"
                  ? "Account created. Check your email if verification is required."
                  : mode === "signin"
                  ? "Signed in successfully."
                  : "Reset link sent. Check your inbox to set a new password."}
              </div>
              <button className="btn btn-ghost btn-no-arrow h-9 focus-ring" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
