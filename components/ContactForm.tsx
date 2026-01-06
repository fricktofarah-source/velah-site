"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useLanguage } from "./LanguageProvider";

export default function ContactForm() {
  const { t } = useLanguage();
  const copy = t.contactForm;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState("");
  const [startedAt] = useState(() => Date.now());
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [useAccount, setUseAccount] = useState(false);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      const user = data.session?.user;
      if (!user?.email) return;
      const fullName = (user.user_metadata?.full_name as string) || "";
      setEmail(user.email);
      setName(fullName);
      setUseAccount(true);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <form
      className="mt-4 space-y-4"
      onSubmit={async (event) => {
        event.preventDefault();
        const submitEmail = useAccount ? email : email;
        const submitName = useAccount ? name : name;
        if (!submitEmail || !message) return;
        setStatus("sending");
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: submitName, email: submitEmail, message, company, startedAt }),
        });
        if (res.ok) {
          setStatus("success");
          if (!useAccount) {
            setName("");
            setEmail("");
          }
          setMessage("");
        } else {
          setStatus("error");
        }
      }}
    >
      {useAccount ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          {copy.sendingAs(name || copy.memberFallback, email)}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{copy.nameLabel}</span>
            <input
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus-ring"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{copy.emailLabel}</span>
            <input
              type="email"
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus-ring"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </label>
        </div>
      )}
      <label className="sr-only" aria-hidden="true">
        Company
        <input
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          value={company}
          onChange={(event) => setCompany(event.target.value)}
        />
      </label>
      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{copy.messageLabel}</span>
        <textarea
          className="mt-2 w-full min-h-[160px] rounded-2xl border border-slate-200 px-4 py-3 text-sm focus-ring"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          required
        />
      </label>
      <button
        type="submit"
        className="btn btn-primary h-12 w-full rounded-full"
        disabled={status === "sending"}
      >
        {status === "sending" ? copy.sending : copy.send}
      </button>
      {status === "success" ? (
        <p className="text-sm text-slate-600">{copy.success}</p>
      ) : null}
      {status === "error" ? (
        <p className="text-sm text-red-500">{copy.error}</p>
      ) : null}
    </form>
  );
}
