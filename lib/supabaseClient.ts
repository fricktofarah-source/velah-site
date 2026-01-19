// lib/supabaseClient.ts
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type RuntimeEnv = {
  supabaseUrl?: string | null;
  supabaseAnonKey?: string | null;
};

function getRuntimeEnv(): RuntimeEnv | null {
  if (typeof window === "undefined") return null;
  return (window as { __VELAH_ENV__?: RuntimeEnv }).__VELAH_ENV__ || null;
}

function getSupabaseConfig() {
  const runtimeEnv = getRuntimeEnv();
  const url = runtimeEnv?.supabaseUrl || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = runtimeEnv?.supabaseAnonKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) {
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

  return { url, anon, storageKey, localStorageAdapter };
}

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient() {
  if (!supabaseClient) {
    const { url, anon, storageKey, localStorageAdapter } = getSupabaseConfig();
    supabaseClient = createClient(url, anon, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: localStorageAdapter,
        storageKey,
      },
    });
  }
  return supabaseClient;
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseClient() as SupabaseClient & Record<string, unknown>;
    const value = client[prop as keyof SupabaseClient];
    return typeof value === "function" ? value.bind(client) : value;
  },
});

export function createAuthedClient(accessToken: string) {
  const { url, anon } = getSupabaseConfig();
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
