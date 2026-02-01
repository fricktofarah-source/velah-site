// components/Profile/UpdateEmail.tsx
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function UpdateEmail() {
  const [emailStatus, setEmailStatus] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState("");

  const handleEmailChange = async () => {
    const nextEmail = newEmail.trim().toLowerCase();
    setEmailStatus(null);
    if (!nextEmail) {
      setEmailStatus("Enter a valid email.");
      return;
    }
    const { error } = await supabase.auth.updateUser({ email: nextEmail });
    if (error) {
      setEmailStatus(error.message);
      return;
    }
    setEmailStatus("Check your inbox to confirm the new email.");
    setNewEmail("");
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Email</p>
      <label className="block">
        <span className="sr-only">New email</span>
        <input
          className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
          placeholder="new@email.com"
          value={newEmail}
          onChange={(event) => setNewEmail(event.target.value)}
          autoComplete="email"
        />
      </label>
      <button onClick={handleEmailChange} className="btn btn-ghost h-10 rounded-full px-4">
        Update email
      </button>
      {emailStatus ? <p className="text-sm text-slate-500">{emailStatus}</p> : null}
    </div>
  );
}
