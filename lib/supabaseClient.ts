// lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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

const cookieStorage =
  typeof document !== "undefined"
    ? {
        getItem: (key: string) => {
          const match = document.cookie.match(new RegExp(`(?:^|; )${encodeURIComponent(key)}=([^;]*)`));
          return match ? decodeURIComponent(match[1]) : null;
        },
        setItem: (key: string, value: string) => {
          const maxAge = 60 * 60 * 24 * 365;
          document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax; Secure`;
        },
        removeItem: (key: string) => {
          document.cookie = `${encodeURIComponent(key)}=; Path=/; Max-Age=0; SameSite=Lax; Secure`;
        },
      }
    : undefined;

export const supabase = createClient(url, anon, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: cookieStorage,
    storageKey,
  },
});
