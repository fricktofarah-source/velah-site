import { supabase } from "@/lib/supabaseClient";
import type { Session } from "@supabase/supabase-js";

export async function getSessionWithRetry(timeoutMs = 10000): Promise<Session | null> {
  const initial = await supabase.auth.getSession();
  if (initial.data.session) return initial.data.session;

  try {
    const refreshed = await supabase.auth.refreshSession();
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
