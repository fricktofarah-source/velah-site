"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { getSessionWithRetry } from "@/lib/authSession";

type DebugState = {
  status: "idle" | "loading" | "ready" | "error";
  session: unknown;
  user: unknown;
  storage: unknown;
  storageKeys: string[];
  refresh: unknown;
  anonKey: string | null;
  storageTest: { ok: boolean; error?: string } | null;
  authHealth: { ok: boolean; status?: number; error?: string } | null;
  errors?: { session?: string; user?: string; refresh?: string };
  error?: string;
};

function mask(value: string | null | undefined) {
  if (!value) return null;
  if (value.length <= 12) return value;
  return `${value.slice(0, 6)}…${value.slice(-6)}`;
}

function getRuntimeEnv() {
  if (typeof window === "undefined") return null;
  return (window as { __VELAH_ENV__?: { supabaseUrl?: string | null; supabaseAnonKey?: string | null } }).__VELAH_ENV__ || null;
}

function getProjectRef() {
  const runtime = getRuntimeEnv();
  const url = runtime?.supabaseUrl || process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return null;
  try {
    const host = new URL(url).hostname;
    return host.split(".")[0] || null;
  } catch {
    return null;
  }
}

export default function AuthDebugPage() {
  const [state, setState] = useState<DebugState>({
    status: "idle",
    session: null,
    user: null,
    storage: null,
    storageKeys: [],
    refresh: null,
    anonKey: null,
    storageTest: null,
    authHealth: null,
  });

  const load = async () => {
    setState({
      status: "loading",
      session: null,
      user: null,
      storage: null,
      storageKeys: [],
      refresh: null,
      anonKey: null,
      storageTest: null,
      authHealth: null,
    });
    try {
      const runtime = getRuntimeEnv();
      const anon = runtime?.supabaseAnonKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || null;
      const withTimeout = async <T,>(promise: PromiseLike<T>, ms: number): Promise<T> => {
        let timeoutId: ReturnType<typeof setTimeout> | null = null;
        const timeoutPromise = new Promise<never>((_, reject) => {
          timeoutId = setTimeout(() => reject(new Error("Request timeout")), ms);
        });
        try {
          return await Promise.race([promise, timeoutPromise]);
        } finally {
          if (timeoutId) clearTimeout(timeoutId);
        }
      };

      const ref = getProjectRef();
      const storageKey = ref ? `sb-${ref}-auth-token` : null;
      const storageKeys = Object.keys(window.localStorage || {}).filter((key) => key.startsWith("sb-"));
      const storedRaw = storageKey ? window.localStorage.getItem(storageKey) : null;
      let stored: unknown = null;
      if (storedRaw) {
        try {
          const parsed = JSON.parse(storedRaw) as Record<string, unknown>;
          stored = {
            storageKey,
            access_token: mask(typeof parsed.access_token === "string" ? parsed.access_token : null),
            refresh_token: mask(typeof parsed.refresh_token === "string" ? parsed.refresh_token : null),
            expires_at: parsed.expires_at ?? null,
          };
        } catch {
          stored = { storageKey, parseError: true };
        }
      }

      let storageTest: { ok: boolean; error?: string } | null = null;
      try {
        const testKey = "velah:storage:test";
        window.localStorage.setItem(testKey, "1");
        const got = window.localStorage.getItem(testKey);
        window.localStorage.removeItem(testKey);
        storageTest = { ok: got === "1" };
      } catch (error) {
        storageTest = { ok: false, error: error instanceof Error ? error.message : "Unknown error" };
      }

      let authHealth: { ok: boolean; status?: number; error?: string } | null = null;
      try {
        const healthUrl = runtime?.supabaseUrl || process.env.NEXT_PUBLIC_SUPABASE_URL;
        if (anon && healthUrl) {
          const health = await withTimeout(
            fetch(`${healthUrl}/auth/v1/health`, {
              headers: { apikey: anon },
            }),
            8000
          );
          authHealth = { ok: health.ok, status: health.status };
        }
      } catch (error) {
        authHealth = { ok: false, error: error instanceof Error ? error.message : "Unknown error" };
      }

      let session: unknown = null;
      try {
        session = await getSessionWithRetry(10000);
      } catch {
        session = null;
      }

      let sessionRes: Awaited<ReturnType<typeof supabase.auth.getSession>> | null = null;
      let userRes: Awaited<ReturnType<typeof supabase.auth.getUser>> | null = null;
      let refreshRes: Awaited<ReturnType<typeof supabase.auth.refreshSession>> | null = null;
      try {
        sessionRes = await withTimeout(supabase.auth.getSession(), 8000);
      } catch {
        sessionRes = null;
      }
      try {
        userRes = await withTimeout(supabase.auth.getUser(), 8000);
      } catch {
        userRes = null;
      }
      try {
        refreshRes = await withTimeout(supabase.auth.refreshSession(), 8000);
      } catch {
        refreshRes = null;
      }
      setState({
        status: "ready",
        session: session ?? null,
        user: userRes?.data?.user ?? null,
        storage: stored,
        storageKeys,
        refresh: refreshRes?.data?.session ?? null,
        anonKey: anon ? mask(anon) : null,
        storageTest,
        authHealth,
        errors: {
          session: sessionRes?.error?.message,
          user: userRes?.error?.message,
          refresh: refreshRes?.error?.message,
        },
      });
    } catch (error) {
      setState({
        status: "error",
        session: null,
        user: null,
        storage: null,
        storageKeys: [],
        refresh: null,
        anonKey: null,
        storageTest: null,
        authHealth: null,
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
  {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || null,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: state.anonKey,
    RUNTIME_SUPABASE_URL: getRuntimeEnv()?.supabaseUrl || null,
    RUNTIME_SUPABASE_ANON_KEY: state.anonKey,
  },
  null,
  2
)}
          </pre>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Storage</div>
          <pre className="mt-2 whitespace-pre-wrap break-all text-xs text-slate-700">
{JSON.stringify(state.storage, null, 2)}
          </pre>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Storage Test</div>
          <pre className="mt-2 whitespace-pre-wrap break-all text-xs text-slate-700">
{JSON.stringify(state.storageTest, null, 2)}
          </pre>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Storage Keys</div>
          <pre className="mt-2 whitespace-pre-wrap break-all text-xs text-slate-700">
{JSON.stringify(state.storageKeys, null, 2)}
          </pre>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Errors</div>
          <pre className="mt-2 whitespace-pre-wrap break-all text-xs text-slate-700">
{JSON.stringify(state.errors ?? null, null, 2)}
          </pre>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Auth Health</div>
          <pre className="mt-2 whitespace-pre-wrap break-all text-xs text-slate-700">
{JSON.stringify(state.authHealth, null, 2)}
          </pre>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Session</div>
          <pre className="mt-2 whitespace-pre-wrap break-all text-xs text-slate-700">
{JSON.stringify(state.session, null, 2)}
          </pre>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Refresh Session</div>
          <pre className="mt-2 whitespace-pre-wrap break-all text-xs text-slate-700">
{JSON.stringify(state.refresh, null, 2)}
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
