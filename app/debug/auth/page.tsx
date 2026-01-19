"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { getSessionWithRetry } from "@/lib/authSession";

type DebugState = {
  status: "idle" | "loading" | "ready" | "error";
  session: unknown;
  user: unknown;
  error?: string;
};

export default function AuthDebugPage() {
  const [state, setState] = useState<DebugState>({
    status: "idle",
    session: null,
    user: null,
  });

  const load = async () => {
    setState({ status: "loading", session: null, user: null });
    try {
      const session = await getSessionWithRetry(10000);
      const userRes = await supabase.auth.getUser();
      setState({
        status: "ready",
        session: session ?? null,
        user: userRes?.data?.user ?? null,
      });
    } catch (error) {
      setState({
        status: "error",
        session: null,
        user: null,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <main className="container mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Auth Debug</h1>
      <p className="mt-2 text-sm text-slate-600">
        This page shows the client-side Supabase auth state.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <button onClick={load} className="btn btn-primary h-10 rounded-full px-4">
          Refresh
        </button>
        <div className="text-sm text-slate-500 self-center">
          Status: {state.status}
        </div>
      </div>

      {state.error ? (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      ) : null}

      <div className="mt-6 space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Env</div>
          <pre className="mt-2 whitespace-pre-wrap break-all text-xs text-slate-700">
{JSON.stringify(
  { NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || null },
  null,
  2
)}
          </pre>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Session</div>
          <pre className="mt-2 whitespace-pre-wrap break-all text-xs text-slate-700">
{JSON.stringify(state.session, null, 2)}
          </pre>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">User</div>
          <pre className="mt-2 whitespace-pre-wrap break-all text-xs text-slate-700">
{JSON.stringify(state.user, null, 2)}
          </pre>
        </div>
      </div>
    </main>
  );
}
