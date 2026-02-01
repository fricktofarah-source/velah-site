// components/WaitlistModal.tsx
"use client";
import { useEffect, useRef, useState } from "react";

export default function WaitlistModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [phase, setPhase] = useState<"form" | "sending" | "done">("form");
  const [error, setError] = useState<string | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);

  // IDs for a11y bindings
  const titleId = "waitlist-title";
  const descId = "waitlist-desc";

  useEffect(() => {
    if (open) {
      setPhase("form");
      setError(null);
      setTimeout(() => emailRef.current?.focus(), 80);
    } else {
      setEmail("");
    }
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const validEmail = (v: string) => /\S+@\S+\.\S+/.test(v.trim());

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const em = email.trim().toLowerCase();
    if (!validEmail(em)) return setError("Please enter a valid email.");

    try {
      setPhase("sending");
      const res = await fetch("/api/join-waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: em }),
      });
      const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!res.ok || !data?.ok) throw new Error(data?.error || "Couldn’t join the waitlist.");
      setPhase("done");
    } catch (err: unknown) {
      setPhase("form");
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
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
            Join the Velah Waitlist
          </div>
          <button className="btn btn-ghost btn-no-arrow h-9 focus-ring" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="relative">
          <p id={descId} className="sr-only">
            Join the waitlist to be the first to know when Velah is available.
          </p>

          <div className="p-5 md:p-6 max-h-[85vh] overflow-auto">
            {/* FORM */}
            <div
              className={`space-y-4 transition-opacity duration-300 ${phase === "form" ? "opacity-100" : "opacity-0 pointer-events-none absolute inset-0"
                }`}
              aria-hidden={phase !== "form"}
            >
              <form onSubmit={submit} noValidate className="space-y-4" aria-busy={phase === "sending"}>
                <div className="space-y-2">
                  <label htmlFor="waitlist-email" className="text-sm">
                    Email
                  </label>
                  <input
                    id="waitlist-email"
                    name="email"
                    ref={emailRef}
                    type="email"
                    autoComplete="email"
                    enterKeyHint="go"
                    value={email}
                    disabled={disabled}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border rounded-2xl px-3 py-2 w-full focus-ring"
                    placeholder="you@company.com"
                    aria-invalid={!!error}
                  />
                </div>

                {error && (
                  <div className="text-sm text-red-600 animate-soft-shake text-center" role="alert" aria-live="polite">
                    {error}
                  </div>
                )}

                <button type="submit" className="btn btn-primary h-10 w-full" disabled={disabled} aria-busy={disabled}>
                  {phase === "sending" ? "Joining…" : "Join the waitlist"}
                </button>
              </form>
            </div>

            {/* SENDING */}
            <div
              className={`p-6 flex items-center justify-center gap-3 transition-opacity duration-300 ${phase === "sending" ? "opacity-100" : "opacity-0 pointer-events-none absolute inset-0"
                }`}
              aria-hidden={phase !== "sending"}
            >
              <div className="loader" aria-hidden />
              <div className="text-sm text-slate-600">
                Joining the waitlist…
              </div>
            </div>

            {/* DONE */}
            <div
              className={`p-6 flex flex-col items-center justify-center gap-3 transition-opacity duration-300 ${phase === "done" ? "opacity-100" : "opacity-0 pointer-events-none absolute inset-0"
                }`}
              aria-hidden={phase !== "done"}
            >
              <div className="success-check" aria-hidden />
              <div className="text-emerald-700 text-sm text-center">
                You're on the list! We'll be in touch.
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
