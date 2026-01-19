"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import AppLoader from "./AppLoader";
import { useLanguage } from "@/components/LanguageProvider";

export default function ProfileForm() {
  const { t } = useLanguage();
  const copy = t.app.profile;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("Dubai");
  const [hydrationReminders, setHydrationReminders] = useState(true);
  const [deliveryReminders, setDeliveryReminders] = useState(true);
  const [status, setStatus] = useState<string | null>(null);

  const withTimeout = async <T,>(promise: Promise<T>, ms: number) => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => reject(new Error("Profile load timeout")), ms);
    });
    try {
      return await Promise.race([promise, timeoutPromise]);
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }
  };

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;
      if (!user) {
        setStatus(copy.signedOut);
        setLoading(false);
        return;
      }

      setHasSession(true);
      if (!mounted) return;
      setEmail(user.email || "");
      const defaultName = (user.user_metadata?.full_name as string) || "";
      setName(defaultName);

      const { data: profile } = await withTimeout(
        supabase
          .from("profiles")
          .select("full_name,phone,address_line1,address_line2,city,pref_hydration_reminders,pref_delivery_reminders")
          .eq("user_id", user.id)
          .maybeSingle(),
        8000
      );

      if (!mounted) return;
      if (profile) {
        setName(profile.full_name || defaultName);
        setPhone(profile.phone || "");
        setAddressLine1(profile.address_line1 || "");
        setAddressLine2(profile.address_line2 || "");
        setCity(profile.city || "Dubai");
        setHydrationReminders(profile.pref_hydration_reminders ?? true);
        setDeliveryReminders(profile.pref_delivery_reminders ?? true);
      }

      setLoading(false);
    };

    load().catch(() => {
      if (mounted) {
        setStatus(copy.statusLoadFail);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  const saveProfile = async () => {
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user;
    if (!user) return;

    setStatus(copy.statusSaving);
    const { error } = await supabase.from("profiles").upsert(
      {
        user_id: user.id,
        full_name: name,
        phone,
        address_line1: addressLine1,
        address_line2: addressLine2,
        city,
        pref_hydration_reminders: hydrationReminders,
        pref_delivery_reminders: deliveryReminders,
      },
      { onConflict: "user_id" }
    );

    if (error) {
      setStatus(copy.statusSaveFail);
      return;
    }

    setStatus(copy.statusSaved);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/app/auth");
  };

  const handleDelete = async () => {
    const sure = window.confirm(copy.deleteConfirm);
    if (!sure) return;

    setStatus(copy.statusDelete);
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    const res = await fetch("/api/account/delete", {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    if (!res.ok) {
      setStatus(copy.statusDeleteFail);
      return;
    }

    await supabase.auth.signOut();
    router.replace("/app/auth");
  };

  if (loading) return <AppLoader label={copy.loadingLabel} />;
  if (!hasSession) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
        {status}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="app-card p-5 space-y-4">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{copy.nameLabel}</span>
          <input
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{copy.emailLabel}</span>
          <input
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-400"
            value={email}
            readOnly
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{copy.phoneLabel}</span>
          <input
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
        </label>
      </div>

      <div className="app-card p-5 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{copy.addressLabel}</p>
        <label className="block">
          <span className="sr-only">{copy.addressLine1}</span>
          <input
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
            placeholder={copy.addressLine1}
            value={addressLine1}
            onChange={(event) => setAddressLine1(event.target.value)}
          />
        </label>
        <label className="block">
          <span className="sr-only">{copy.addressLine2}</span>
          <input
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
            placeholder={copy.addressLine2}
            value={addressLine2}
            onChange={(event) => setAddressLine2(event.target.value)}
          />
        </label>
        <label className="block">
          <span className="sr-only">{copy.cityLabel}</span>
          <input
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
            value={city}
            onChange={(event) => setCity(event.target.value)}
          />
        </label>
      </div>

      <div className="app-card p-5 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{copy.notificationsLabel}</p>
        <label className="flex items-center justify-between">
          <span className="text-sm text-slate-600">{copy.hydrationReminders}</span>
          <input
            type="checkbox"
            checked={hydrationReminders}
            onChange={(event) => setHydrationReminders(event.target.checked)}
          />
        </label>
        <label className="flex items-center justify-between">
          <span className="text-sm text-slate-600">{copy.deliveryReminders}</span>
          <input
            type="checkbox"
            checked={deliveryReminders}
            onChange={(event) => setDeliveryReminders(event.target.checked)}
          />
        </label>
      </div>

      <button onClick={saveProfile} className="btn btn-primary h-12 w-full rounded-full">{copy.saveCta}</button>

      {status ? <p className="text-sm text-slate-500">{status}</p> : null}

      <div className="app-card p-5 space-y-3">
        <button onClick={handleLogout} className="btn btn-ghost h-11 w-full rounded-full">
          {copy.logout}
        </button>
        <button onClick={handleDelete} className="btn btn-ghost h-11 w-full rounded-full text-red-500">
          {copy.delete}
        </button>
      </div>
    </div>
  );
}
