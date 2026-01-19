"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    setStatus("idle");
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
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
    <main className="container mx-auto max-w-md px-4 py-16">
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

      {status === "success" ? (
        <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
          Password updated. You can close this tab or return to the site.
        </div>
      ) : null}

      <Link href="/" className="mt-6 inline-flex text-sm font-semibold text-slate-700 underline">
        Back to home
      </Link>
    </main>
  );
}
