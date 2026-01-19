"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    setError(null);
    setStatus("idle");
  }, []);

  useEffect(() => {
    if (status !== "success") return;
    setRedirecting(true);
    const id = setTimeout(() => {
      router.replace("/");
    }, 1600);
    return () => clearTimeout(id);
  }, [status, router]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (password.length < 8 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password)) {
      setError("Password must be at least 8 characters and include uppercase, lowercase, and a number.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setStatus("saving");
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      setStatus("error");
      setError("Reset link is missing or expired. Please request a new one.");
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setStatus("error");
      setError(updateError.message);
      return;
    }

    setStatus("success");
  };

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Set a new password</h1>
        <p className="mt-2 text-sm text-slate-600">
          Choose a new password for your Velah account.
        </p>

        <form className="mt-6 space-y-4" onSubmit={submit} noValidate>
          <label className="block">
            <span className="text-sm text-slate-700">New password</span>
            <input
              type="password"
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus-ring"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              required
              disabled={status === "success"}
            />
          </label>

          <label className="block">
            <span className="text-sm text-slate-700">Confirm password</span>
            <input
              type="password"
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus-ring"
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
              autoComplete="new-password"
              required
              disabled={status === "success"}
            />
          </label>

          {error ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            className="btn btn-primary h-11 w-full rounded-full"
            disabled={status === "saving" || status === "success"}
          >
            {status === "saving" ? "Updating…" : status === "success" ? "Updated" : "Update password"}
          </button>
        </form>

        {redirecting ? (
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 flex items-center gap-2">
            <span className="loader" aria-hidden />
            Redirecting you to the site…
          </div>
        ) : status === "success" ? (
          <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
            Password updated.
          </div>
        ) : null}
      </div>
    </main>
  );
}
