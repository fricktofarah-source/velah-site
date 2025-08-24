"use client";
import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type Mode = "signup" | "signin";

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
  const [joinList, setJoinList] = useState(true); // default checked
  const [name, setName] = useState("");
  const emailRef = useRef<HTMLInputElement | null>(null);

  // Reset to initial mode each time modal opens
  useEffect(() => {
    if (open) {
      setMode(initialMode);
      setPhase("form");
      setError(null);
      setTimeout(() => emailRef.current?.focus(), 80);
    } else {
      setEmail("");
      setPw("");
    }
  }, [open, initialMode]);

  // ESC to close
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  function validEmail(v: string) {
    return /\S+@\S+\.\S+/.test(v.trim());
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const em = email.trim().toLowerCase();
    if (!validEmail(em)) {
      setError("Please enter a valid email.");
      return;
    }
    if (!pw || pw.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (mode === "signup" && !name.trim()) {
  setError("Please enter your name.");
  return;
}

    try {
      setPhase("sending");

      if (mode === "signup") {
  const { error } = await supabase.auth.signUp({
    email: em,
    password: pw,
    options: {
      data: { full_name: name.trim() }   // <— store name in user_metadata
    }
  });
  if (error) throw error;

        if (joinList) {
    try {
      await fetch("/api/join-waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: em }),
      });
    } catch {
      // ignore errors here, since auth already succeeded
    }
  }

      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: em, password: pw });
        if (error) throw error;
      }

      await new Promise((r) => setTimeout(r, 350));
      setPhase("done");
    } catch (err: any) {
      setPhase("form");
      setError(err?.message ?? "Something went wrong. Try again.");
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="card w-full max-w-md overflow-hidden animate-pop-in">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <div className="font-semibold">
            {mode === "signup" ? "Create your account" : "Sign in"}
          </div>
          <button
            className="btn btn-ghost h-9 focus-visible:outline-none focus-visible:ring-0"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Body (scroll-safe, padded) */}
        <div className="relative">
          <div className="p-5 md:p-6 max-h-[85vh] overflow-auto">
            {/* FORM */}
            <div
              className={`space-y-4 transition-opacity duration-300 ease-[cubic-bezier(.22,1,.36,1)] ${
                phase === "form" ? "opacity-100" : "opacity-0 pointer-events-none absolute inset-0"
              }`}
            >
              <form onSubmit={submit} noValidate className="space-y-4">

                {mode === "signup" && (
                  <div className="space-y-2">
                    <label htmlFor="auth-name" className="text-sm">
                      Name
                    </label>
                    <input
                      id="auth-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="border rounded-2xl px-3 py-2 w-full focus:outline-none focus:ring-0"
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
                    ref={emailRef}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border rounded-2xl px-3 py-2 w-full focus:outline-none focus:ring-0"
                    placeholder="you@company.com"
                    aria-invalid={!!error}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="auth-pw" className="text-sm">
                    Password
                  </label>
                  <input
                    id="auth-pw"
                    type="password"
                    value={pw}
                    onChange={(e) => setPw(e.target.value)}
                    className="border rounded-2xl px-3 py-2 w-full focus:outline-none focus:ring-0"
                    placeholder="••••••••"
                  />
                </div>

                {error && (
                  <div className="text-sm text-red-600 animate-soft-shake">{error}</div>
                )}

                {mode === "signup" && (
  <label className="flex items-center gap-2 text-sm text-slate-700 select-none">
    <input
      type="checkbox"
      className="accent-black"
      checked={joinList}
      onChange={(e) => setJoinList(e.target.checked)}
    />
    Also join the Velah newsletter
  </label>
)}


                {/* Primary submit button (no outline) */}
                <button
                  type="submit"
                  className="btn btn-primary h-10 w-full focus-visible:outline-none focus-visible:ring-0"
                >
                  {mode === "signup" ? "Sign up" : "Sign in"}
                </button>

                {/* Single toggle link under the button */}
                <div className="pt-2 text-center text-sm text-slate-600">
                  {mode === "signup" ? (
                    <button
                      type="button"
                      onClick={() => {
                        setMode("signin");
                        setError(null);
                      }}
                      className="underline underline-offset-4 decoration-slate-400 hover:decoration-velah focus-visible:outline-none focus-visible:ring-0"
                    >
                      Have an account? Sign in
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setMode("signup");
                        setError(null);
                      }}
                      className="underline underline-offset-4 decoration-slate-400 hover:decoration-velah focus-visible:outline-none focus-visible:ring-0"
                    >
                      New here? Create an account
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* SENDING */}
            <div
              className={`p-6 flex items-center justify-center gap-3 transition-opacity duration-300 ease-[cubic-bezier(.22,1,.36,1)] ${
                phase === "sending" ? "opacity-100" : "opacity-0 pointer-events-none absolute inset-0"
              }`}
            >
              <div className="loader" aria-hidden />
              <div className="text-sm text-slate-600">
                {mode === "signup" ? "Creating your account…" : "Signing you in…"}
              </div>
            </div>

            {/* DONE */}
            <div
              className={`p-6 flex flex-col items-center justify-center gap-3 transition-opacity duration-300 ease-[cubic-bezier(.22,1,.36,1)] ${
                phase === "done" ? "opacity-100" : "opacity-0 pointer-events-none absolute inset-0"
              }`}
            >
              <div className="success-check" aria-hidden />
              <div className="text-emerald-700 text-sm">
                {mode === "signup"
                  ? "Account created. Check your email if verification is required."
                  : "Signed in successfully."}
              </div>
              <button
                className="btn btn-ghost h-9 focus-visible:outline-none focus-visible:ring-0"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
