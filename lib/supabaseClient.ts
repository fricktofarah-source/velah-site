// lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

type RuntimeEnv = {
  supabaseUrl?: string | null;
  supabaseAnonKey?: string | null;
};

const runtimeEnv: RuntimeEnv | undefined =
  typeof window !== "undefined" ? (window as { __VELAH_ENV__?: RuntimeEnv }).__VELAH_ENV__ : undefined;

const url = runtimeEnv?.supabaseUrl || process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = runtimeEnv?.supabaseAnonKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anon) {
  // This surfaces a clear error in the browser console instead of a vague "failed to fetch"
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

const projectRef = (() => {
  try {
    return new URL(url).hostname.split(".")[0];
  } catch {
    return null;
  }
})();

const storageKey = projectRef ? `sb-${projectRef}-auth-token` : undefined;

const localStorageAdapter =
  typeof window !== "undefined"
    ? {
        getItem: (key: string) => window.localStorage.getItem(key),
        setItem: (key: string, value: string) => window.localStorage.setItem(key, value),
        removeItem: (key: string) => window.localStorage.removeItem(key),
      }
    : undefined;

export const supabase = createClient(url, anon, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: localStorageAdapter,
    storageKey,
  },
});

export function createAuthedClient(accessToken: string) {
  if (!url || !anon) {
    throw new Error("Missing Supabase URL or anon key");
  }
  return createClient(url, anon, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
