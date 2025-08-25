"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export const dynamic = "force-static";

export default function Page() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      // Give Supabase a moment to establish the session from the URL
      await new Promise((r) => setTimeout(r, 300));

      const { data: sessionRes } = await supabase.auth.getSession();
      const token = sessionRes?.session?.access_token;

      if (token) {
        // Best-effort: confirm newsletter for this user (if they opted in)
        await fetch("/api/newsletter/confirm-self", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => {});
      }

      if (!cancelled) setDone(true);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="container mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-2xl font-semibold">Check complete</h1>
      <p className="mt-2 text-slate-600">
        {done
          ? "Your email has been confirmed. You can close this tab and continue using Velah."
          : "Finishing up…"}
      </p>

      <a href="/" className="mt-6 inline-block rounded-full px-5 py-3 border">
        Back to home
      </a>
    </main>
  );
}
