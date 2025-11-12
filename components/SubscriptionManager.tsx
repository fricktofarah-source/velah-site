"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  fetchUserSubscription,
  skipNextDelivery,
  SubscriptionPayload,
  updateSubscriptionStatus,
  upsertSubscription,
  type UserSubscription,
} from "@/lib/subscriptionService";
import PushNotificationsPrompt from "@/components/PushNotificationsPrompt";

const deliveryDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;
const frequencyOptions = [
  { value: "weekly", label: "Every week" },
  { value: "biweekly", label: "Every other week" },
] as const;

type SessionUser = { id: string; email?: string | null } | null;

export default function SubscriptionManager() {
  const [sessionUser, setSessionUser] = useState<SessionUser>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<SubscriptionPayload>({
    bottles_5g: 0,
    bottles_1l: 6,
    bottles_500ml: 6,
    frequency: "weekly",
    delivery_day: "wednesday",
    notes: "",
  });

  const loadSubscription = useRef<((userId: string) => Promise<void>) | null>(null);

  const applyRecommendation = (event: CustomEvent<{ bottles_5g: number; bottles_1l: number; bottles_500ml: number }>) => {
    const { detail } = event;
    setForm((prev) => ({ ...prev, ...detail }));
  };

  useEffect(() => {
    window.addEventListener("subscription:apply", applyRecommendation as EventListener);
    return () => window.removeEventListener("subscription:apply", applyRecommendation as EventListener);
  }, []);


  useEffect(() => {
    loadSubscription.current = async (userId: string) => {
      try {
        setError(null);
        const data = await fetchUserSubscription(userId);
        if (data) {
          setSubscription(data);
          setForm({
            bottles_5g: data.bottles_5g,
            bottles_1l: data.bottles_1l,
            bottles_500ml: data.bottles_500ml,
            frequency: data.frequency,
            delivery_day: data.delivery_day,
            notes: data.notes ?? "",
          });
        } else {
          setSubscription(null);
        }
      } catch (err) {
        setError("Unable to load subscription. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user;
      setSessionUser(user ? { id: user.id, email: user.email } : null);
      if (user) {
        loadSubscription.current?.(user.id);
      } else {
        setLoading(false);
      }
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user;
      setSessionUser(user ? { id: user.id, email: user.email } : null);
      if (user) loadSubscription.current?.(user.id);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleChange = (field: keyof SubscriptionPayload, value: number | string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!sessionUser) return;
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...form,
        bottles_5g: Math.max(0, Math.min(12, form.bottles_5g)),
        bottles_1l: Math.max(0, Math.min(48, form.bottles_1l)),
        bottles_500ml: Math.max(0, Math.min(48, form.bottles_500ml)),
      };
      const record = await upsertSubscription(sessionUser.id, payload);
      if (record) setSubscription(record);
    } catch (err) {
      setError("Could not save subscription. Please try again.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (status: "active" | "paused") => {
    if (!sessionUser) return;
    setSaving(true);
    setError(null);
    try {
      const record = await updateSubscriptionStatus(sessionUser.id, status);
      if (record) setSubscription(record);
    } catch (err) {
      setError("Unable to update status.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = async () => {
    if (!sessionUser) return;
    setSaving(true);
    setError(null);
    try {
      const record = await skipNextDelivery(sessionUser.id);
      if (record) setSubscription(record);
    } catch (err) {
      setError("Unable to skip the next delivery.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const summary = useMemo(() => {
    if (!subscription) return null;
    return [
      `${subscription.bottles_5g} × 5G`,
      `${subscription.bottles_1l} × 1L`,
      `${subscription.bottles_500ml} × 500mL`,
    ].join(" · ");
  }, [subscription]);

  return (
    <section className="section">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="card p-6 space-y-6">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Manage</span>
            <h2 className="text-2xl font-semibold tracking-tight">Your Velah subscription</h2>
            <p className="text-sm text-slate-600">
              Adjust deliveries, pause when you travel, or tweak bottle counts at any time.
            </p>
          </div>

          {!sessionUser && (
            <div className="rounded-2xl border border-dashed border-slate-300 p-5 text-sm text-slate-600">
              <p>Sign in from the top navigation to create or edit your subscription.</p>
            </div>
          )}

          {sessionUser && (
            <>
          {subscription && (
            <div className="rounded-2xl border bg-slate-50 p-4 text-sm text-slate-600">
              <div className="font-semibold text-slate-900">Current plan</div>
              <div className="mt-1">{summary}</div>
              <div className="mt-1 capitalize">Frequency: {subscription.frequency.replace("biweekly", "every 2 weeks")}</div>
                  <div className="capitalize">Delivery day: {subscription.delivery_day}</div>
                  {subscription.next_delivery && (
                    <div>Next delivery: {new Date(subscription.next_delivery).toLocaleDateString()}</div>
                  )}
                  <div>Status: <span className={subscription.status === "active" ? "text-emerald-600" : "text-amber-600"}>{subscription.status}</span></div>
                </div>
              )}

          {error && <div className="text-sm text-red-600" role="alert">{error}</div>}
          {sessionUser && <PushNotificationsPrompt />}

              <div className="grid gap-4 sm:grid-cols-3">
                <label className="text-sm">
                  5G bottles
                  <input
                    type="number"
                    className="mt-1 w-full border rounded-2xl px-3 py-2"
                    min={0}
                    max={12}
                    value={form.bottles_5g}
                    onChange={(e) => handleChange("bottles_5g", Number(e.target.value))}
                  />
                </label>
                <label className="text-sm">
                  1L bottles
                  <input
                    type="number"
                    className="mt-1 w-full border rounded-2xl px-3 py-2"
                    min={0}
                    max={48}
                    value={form.bottles_1l}
                    onChange={(e) => handleChange("bottles_1l", Number(e.target.value))}
                  />
                </label>
                <label className="text-sm">
                  500 mL bottles
                  <input
                    type="number"
                    className="mt-1 w-full border rounded-2xl px-3 py-2"
                    min={0}
                    max={48}
                    value={form.bottles_500ml}
                    onChange={(e) => handleChange("bottles_500ml", Number(e.target.value))}
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm">
                  Delivery frequency
                  <select
                    className="mt-1 w-full border rounded-2xl px-3 py-2 bg-white"
                    value={form.frequency}
                    onChange={(e) => handleChange("frequency", e.target.value)}
                  >
                    {frequencyOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="text-sm">
                  Delivery day
                  <select
                    className="mt-1 w-full border rounded-2xl px-3 py-2 bg-white capitalize"
                    value={form.delivery_day}
                    onChange={(e) => handleChange("delivery_day", e.target.value)}
                  >
                    {deliveryDays.map((day) => (
                      <option key={day} value={day} className="capitalize">
                        {day}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="text-sm">
                Notes for the driver
                <textarea
                  className="mt-1 w-full border rounded-2xl px-3 py-2"
                  rows={3}
                  value={form.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  placeholder="e.g., call when arriving, leave with concierge"
                />
              </label>

              <div className="flex flex-wrap gap-2">
                <button type="button" className="btn btn-primary h-10 px-5 rounded-full" disabled={saving} onClick={handleSave}>
                  {saving ? "Saving…" : subscription ? "Update plan" : "Create plan"}
                </button>
                {subscription && (
                  <>
                    <button
                      type="button"
                      className="btn btn-ghost h-10 px-5 rounded-full"
                      disabled={saving}
                      onClick={() => handleStatusChange(subscription.status === "active" ? "paused" : "active")}
                    >
                      {subscription.status === "active" ? "Pause" : "Resume"}
                    </button>
                    <button type="button" className="btn btn-ghost h-10 px-5 rounded-full" disabled={saving} onClick={handleSkip}>
                      Skip next delivery
                    </button>
                  </>
                )}
              </div>
            </>
          )}

          {!loading && !sessionUser && (
            <div className="text-sm text-slate-500">
              Need an account? Join the waitlist and we’ll invite you once service opens.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
