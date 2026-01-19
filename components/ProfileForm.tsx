"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createAuthedClient, supabase } from "@/lib/supabaseClient";
import { getSessionWithRetry, getStoredAuth } from "@/lib/authSession";
import AppLoader from "@/components/AppLoader";
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

  async function withTimeout<T>(promise: PromiseLike<T>, ms: number): Promise<T> {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => reject(new Error("Profile load timeout")), ms);
    });
    try {
      return await Promise.race([promise, timeoutPromise]);
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }
  }

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const stored = getStoredAuth();
        const session = await withTimeout(getSessionWithRetry(10000), 12000);
        const user = session?.user ?? null;
        const fallbackUser =
          stored.accessToken && stored.userId
            ? { id: stored.userId, email: stored.email || null, full_name: stored.fullName || null }
            : null;

        if (!user && !fallbackUser) {
          setStatus(copy.statusLoadFail);
          return;
        }

        setHasSession(true);
        if (!mounted) return;
        const defaultEmail = user?.email || fallbackUser?.email || "";
        const defaultName =
          (user?.user_metadata?.full_name as string) || fallbackUser?.full_name || "";
        setEmail(defaultEmail);
        setName(defaultName);

        try {
          const client = user
            ? supabase
            : stored.accessToken
            ? createAuthedClient(stored.accessToken)
            : supabase;
          await withTimeout(
            client.from("profiles").upsert(
              {
                user_id: user?.id || fallbackUser?.id,
                email: defaultEmail || null,
                full_name: defaultName || null,
              },
              { onConflict: "user_id" }
            ),
            6000
          );
        } catch {
          // best-effort: continue even if the upsert fails
        }

        try {
          const client = user
            ? supabase
            : stored.accessToken
            ? createAuthedClient(stored.accessToken)
            : supabase;
          const { data: profile } = await withTimeout(
            client
              .from("profiles")
              .select("full_name,phone,address_line1,address_line2,city,pref_hydration_reminders,pref_delivery_reminders")
              .eq("user_id", user?.id || fallbackUser?.id)
              .maybeSingle(),
            6000
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
        } catch {
          if (mounted) setStatus(copy.statusLoadFail);
        }
      } finally {
        if (mounted) setLoading(false);
      }
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
    const stored = getStoredAuth();
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user;
    const fallbackUserId = stored.userId;
    if (!user && !fallbackUserId) return;

    setStatus(copy.statusSaving);
    const client = user
      ? supabase
      : stored.accessToken
      ? createAuthedClient(stored.accessToken)
      : supabase;
    const { error } = await client.from("profiles").upsert(
      {
        user_id: user?.id || fallbackUserId,
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
    router.replace("/");
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
    router.replace("/");
  };

  if (loading) return <AppLoader label={copy.loadingLabel} />;
  if (!hasSession) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
        {status || copy.statusLoadFail}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
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

      <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
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

      <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
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

      <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
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
