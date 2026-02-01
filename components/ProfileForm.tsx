"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import AppLoader from "@/components/AppLoader";
import { useLanguage } from "@/components/LanguageProvider";
import UpdateEmail from "./Profile/UpdateEmail";
import AccountActions from "./Profile/AccountActions";

type ProfileUser = {
  id: string;
  email?: string | null;
  full_name?: string | null;
};

export default function ProfileForm({ user }: { user: ProfileUser }) {
  const { t } = useLanguage();
  const copy = t.app.profile;
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
  }, [user.id, user.full_name, user.email, copy.statusLoadFail]);

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

      <UpdateEmail />

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

      <AccountActions />
    </div>
  );
}
