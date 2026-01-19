"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

type AuthStatus = "loading" | "ready" | "error";

type AuthContextValue = {
  status: AuthStatus;
  session: Session | null;
  user: User | null;
  error: string | null;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function getProjectRef() {
  if (typeof window === "undefined") return null;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  try {
    const host = new URL(url).host;
    const ref = host.split(".")[0];
    return ref || null;
  } catch {
    return null;
  }
}

function readStoredSession() {
  if (typeof window === "undefined") return null;
  const ref = getProjectRef();
  if (!ref) return null;
  const key = `sb-${ref}-auth-token`;
  const raw = window.localStorage.getItem(key);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as { access_token?: string; refresh_token?: string }) : null;
  } catch {
    return null;
  }
}

async function withTimeout<T>(promise: Promise<T>, ms: number) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error("Auth timeout")), ms);
  });
  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const hydrate = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const sessionRes = await withTimeout(supabase.auth.getSession(), 6000);
      if (sessionRes.data.session) {
        setSession(sessionRes.data.session);
        setUser(sessionRes.data.session.user);
        setStatus("ready");
        return;
      }

      const stored = readStoredSession();
      if (stored?.refresh_token) {
        const refreshRes = await withTimeout(supabase.auth.refreshSession(), 6000);
        if (refreshRes.data.session) {
          setSession(refreshRes.data.session);
          setUser(refreshRes.data.session.user);
          setStatus("ready");
          return;
        }
      }

      setSession(null);
      setUser(null);
      setStatus("ready");
    } catch (err) {
      setSession(null);
      setUser(null);
      setStatus("error");
      setError(err instanceof Error ? err.message : "Auth error");
    }
  }, []);

  useEffect(() => {
    let active = true;
    hydrate();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return;
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setStatus("ready");
      setError(null);
    });
    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [hydrate]);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      session,
      user,
      error,
      refresh: hydrate,
    }),
    [status, session, user, error, hydrate]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
