"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import AppLoader from "@/components/AppLoader";
import { useLanguage } from "@/components/LanguageProvider";
import { useAuth } from "@/components/AuthProvider";

type ProfileUser = {
  id: string;
  email?: string | null;
  full_name?: string | null;
};

export default function ProfileForm({ user }: { user: ProfileUser }) {
  const { t } = useLanguage();
  const copy = t.app.profile;
  const router = useRouter();
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("Dubai");
  const [hydrationReminders, setHydrationReminders] = useState(true);
  const [deliveryReminders, setDeliveryReminders] = useState(true);
  const [status, setStatus] = useState<string | null>(null);
  const [emailStatus, setEmailStatus] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState("");

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        if (!mounted) return;
        const defaultName = user.full_name || "";
        setEmail(user.email || "");
        setName(defaultName);

        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name,phone,address_line1,address_line2,city,pref_hydration_reminders,pref_delivery_reminders")
          .eq("user_id", user.id)
          .maybeSingle();

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
  }, [user.id]);

  const saveProfile = async () => {
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
    router.replace("/");
  };

  const handleLogoutAll = async () => {
    await supabase.auth.signOut({ scope: "global" });
    router.replace("/");
  };

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

  const handleDelete = async () => {
    const sure = window.confirm(copy.deleteConfirm);
    if (!sure) return;

    setStatus(copy.statusDelete);
    const token = session?.access_token;
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
        <button onClick={handleLogoutAll} className="btn btn-ghost h-11 w-full rounded-full">
          Sign out everywhere
        </button>
        <button onClick={handleDelete} className="btn btn-ghost h-11 w-full rounded-full text-red-500">
          {copy.delete}
        </button>
      </div>
    </div>
  );
}
