"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient"; // adjust if your path differs

export const dynamic = "force-dynamic";

export default function Page() {
  const [message, setMessage] = useState("Finishing up…");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // Give Supabase time to read the URL and set the session
        await new Promise((r) => setTimeout(r, 350));

        const { data: sess } = await supabase.auth.getSession();
        const token = sess?.session?.access_token;

        // If there is a session token, confirm newsletter (if opted-in)
        if (token) {
          await fetch("/api/newsletter/confirm-self", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          }).catch(() => {});
          if (!cancelled) setMessage("All set. Your email is confirmed.");
        } else {
          if (!cancelled) setMessage("Your email was confirmed. You can close this tab.");
        }
      } catch {
        if (!cancelled) setMessage("Done. You can close this tab.");
      }
    })();

    return () => { cancelled = true; };
  }, []);

  return (
    <main className="container mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-2xl font-semibold">Welcome to Velah</h1>
      <p className="mt-2 text-slate-600">{message}</p>
      <a href="/" className="mt-6 inline-block rounded-full px-5 py-3 border">Back to home</a>
    </main>
  );
}
