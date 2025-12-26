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

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      const s = data.session;
      setSession(s ? { user: { id: s.user.id, email: s.user.email } } : null);
      setReady(true);
      if (!s) router.replace("/app/auth");
    });

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
