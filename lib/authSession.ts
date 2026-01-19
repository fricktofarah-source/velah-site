import { supabase } from "@/lib/supabaseClient";
import type { Session } from "@supabase/supabase-js";

type StoredSession = {
  access_token?: string;
  refresh_token?: string;
};

type RuntimeEnv = {
  supabaseUrl?: string | null;
};

function getRuntimeEnv(): RuntimeEnv | null {
  if (typeof window === "undefined") return null;
  return (window as { __VELAH_ENV__?: RuntimeEnv }).__VELAH_ENV__ || null;
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

function findStorageKey() {
  if (typeof window === "undefined") return null;
  const ref = getProjectRef();
  if (ref) return `sb-${ref}-auth-token`;
  const keys = Object.keys(window.localStorage || {}).filter((key) => key.endsWith("-auth-token") && key.startsWith("sb-"));
  if (keys.length === 1) return keys[0];
  return null;
}

function readStoredSession(): StoredSession | null {
  if (typeof window === "undefined") return null;
  const key = findStorageKey();
  if (!key) return null;
  const raw = window.localStorage.getItem(key);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as StoredSession | null;
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

export async function getSessionWithRetry(timeoutMs = 10000): Promise<Session | null> {
  const withTimeout = async <T,>(promise: PromiseLike<T>, ms: number): Promise<T> => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => reject(new Error("Auth timeout")), ms);
    });
    try {
      return await Promise.race([promise, timeoutPromise]);
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }
  };

  const initial = await withTimeout(supabase.auth.getSession(), timeoutMs);
  if (initial.data.session) return initial.data.session;

  const stored = readStoredSession();
  if (stored?.access_token && stored?.refresh_token) {
    try {
      const restored = await withTimeout(
        supabase.auth.setSession({
          access_token: stored.access_token,
          refresh_token: stored.refresh_token,
        }),
        timeoutMs
      );
      if (restored.data.session) return restored.data.session;
    } catch {
      // ignore and continue
    }
  }

  try {
    const refreshed = await withTimeout(supabase.auth.refreshSession(), timeoutMs);
    if (refreshed.data.session) return refreshed.data.session;
  } catch {
    // ignore and fall through
  }

  return await new Promise<Session | null>((resolve) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "INITIAL_SESSION" || event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        clearTimeout(timeoutId);
        listener.subscription.unsubscribe();
        resolve(session ?? null);
      }
    });

    timeoutId = setTimeout(() => {
      listener.subscription.unsubscribe();
      resolve(null);
    }, timeoutMs);
  });
}
