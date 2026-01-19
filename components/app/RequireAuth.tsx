"use client";

import { type ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import AppLoader from "./AppLoader";

type SessionLike = { user: { id: string; email?: string | null } } | null;

export default function RequireAuth({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<SessionLike>(null);

  useEffect(() => {
    let mounted = true;

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

    const init = async () => {
      try {
        const { data } = await withTimeout(supabase.auth.getSession(), 8000);
        if (!mounted) return;
        const s = data.session;
        setSession(s ? { user: { id: s.user.id, email: s.user.email } } : null);
        setReady(true);
        if (!s) router.replace("/app/auth");
        return;
      } catch {
        try {
          const { data } = await withTimeout(supabase.auth.getUser(), 8000);
          if (!mounted) return;
          const user = data.user;
          setSession(user ? { user: { id: user.id, email: user.email } } : null);
          setReady(true);
          if (!user) router.replace("/app/auth");
        } catch {
          if (!mounted) return;
          setSession(null);
          setReady(true);
          router.replace("/app/auth");
        }
      }
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      if (!mounted) return;
      setSession(s ? { user: { id: s.user.id, email: s.user.email } } : null);
      if (!s) router.replace("/app/auth");
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [router]);

  if (!ready || !session) return <AppLoader label="Checking your account" />;
  return <>{children}</>;
}
