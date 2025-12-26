"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import AppLoader from "./AppLoader";

export default function ProfileForm() {
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

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;
      if (!user) {
        setStatus("Sign in to manage your profile.");
        setLoading(false);
        return;
      }

      setHasSession(true);
      if (!mounted) return;
      setEmail(user.email || "");
      const defaultName = (user.user_metadata?.full_name as string) || "";
      setName(defaultName);

      const { data: profile } = await supabase
        .from("user_profiles")
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

      setLoading(false);
    };

    load().catch(() => {
      if (mounted) {
        setStatus("Could not load profile.");
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

    setStatus("Saving…");
    const { error } = await supabase.from("user_profiles").upsert(
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
      setStatus("Could not save profile.");
      return;
    }

    setStatus("Profile updated.");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/app/auth");
  };

  const handleDelete = async () => {
    const sure = window.confirm("Delete your account? This cannot be undone.");
    if (!sure) return;

    setStatus("Deleting account…");
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    const res = await fetch("/api/account/delete", {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    if (!res.ok) {
      setStatus("Could not delete account.");
      return;
    }

    await supabase.auth.signOut();
    router.replace("/app/auth");
  };

  if (loading) return <AppLoader label="Loading profile" />;
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
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Name</span>
          <input
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Email</span>
          <input
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-400"
            value={email}
            readOnly
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Phone</span>
          <input
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
        </label>
      </div>

      <div className="app-card p-5 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Address</p>
        <label className="block">
          <span className="sr-only">Address line 1</span>
          <input
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
            placeholder="Street, building"
            value={addressLine1}
            onChange={(event) => setAddressLine1(event.target.value)}
          />
        </label>
        <label className="block">
          <span className="sr-only">Address line 2</span>
          <input
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
            placeholder="Apartment, floor"
            value={addressLine2}
            onChange={(event) => setAddressLine2(event.target.value)}
          />
        </label>
        <label className="block">
          <span className="sr-only">City</span>
          <input
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
            value={city}
            onChange={(event) => setCity(event.target.value)}
          />
        </label>
      </div>

      <div className="app-card p-5 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Notifications</p>
        <label className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Hydration reminders</span>
          <input
            type="checkbox"
            checked={hydrationReminders}
            onChange={(event) => setHydrationReminders(event.target.checked)}
          />
        </label>
        <label className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Delivery reminders</span>
          <input
            type="checkbox"
            checked={deliveryReminders}
            onChange={(event) => setDeliveryReminders(event.target.checked)}
          />
        </label>
      </div>

      <button onClick={saveProfile} className="btn btn-primary h-12 w-full rounded-full">Save changes</button>

      {status ? <p className="text-sm text-slate-500">{status}</p> : null}

      <div className="app-card p-5 space-y-3">
        <button onClick={handleLogout} className="btn btn-ghost h-11 w-full rounded-full">
          Log out
        </button>
        <button onClick={handleDelete} className="btn btn-ghost h-11 w-full rounded-full text-red-500">
          Delete account
        </button>
      </div>
    </div>
  );
}
