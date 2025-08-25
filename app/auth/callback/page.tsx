"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export const dynamic = "force-dynamic";

export default function Page() {
  const [state, setState] = useState<"working" | "ok" | "noop" | "error">("working");
  const [msg, setMsg] = useState<string>("Finishing up…");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // Give Supabase a moment to process the confirm URL
        await new Promise((r) => setTimeout(r, 350));

        const { data: sess } = await supabase.auth.getSession();
        const token = sess?.session?.access_token;

        if (!token) {
          if (!cancelled) {
            setState("noop");
            setMsg("Your email was confirmed. You can close this tab.");
          }
          return;
        }

        // Best-effort: confirm newsletter (if user opted in during signup)
        await fetch("/api/newsletter/confirm-self", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => {});

        if (!cancelled) {
          setState("ok");
          setMsg("All set. Your email is confirmed.");
        }
      } catch (e: any) {
        if (!cancelled) {
          setState("error");
          setMsg("Something went wrong while finalizing your sign-in.");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="container mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-2xl font-semibold">
        {state === "ok" ? "Welcome to Velah" : "One moment"}
      </h1>
      <p className="mt-2 text-slate-600">{msg}</p>

      <a href="/" className="mt-6 inline-block rounded-full px-5 py-3 border">
        Back to home
      </a>
    </main>
  );
}
