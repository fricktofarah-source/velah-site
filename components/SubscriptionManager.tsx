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
import { useLanguage } from "./LanguageProvider";

const deliveryDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;
const frequencyOptions = ["weekly", "biweekly"] as const;

type SessionUser = { id: string; email?: string | null } | null;

export default function SubscriptionManager() {
  const { t } = useLanguage();
  const copy = t.subscriptionManager;
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
        setError(copy.errors.load);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  }, [copy.errors.load]);

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
      setSubscription(record);
    } catch (err) {
      setError(copy.errors.save);
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
      setSubscription(record);
    } catch (err) {
      setError(copy.errors.status);
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
      setSubscription(record);
    } catch (err) {
      setError(copy.errors.skip);
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const summary = useMemo(() => {
    if (!subscription) return null;
    return [
      `${subscription.bottles_5g} × ${copy.bottles.fiveG}`,
      `${subscription.bottles_1l} × ${copy.bottles.oneL}`,
      `${subscription.bottles_500ml} × ${copy.bottles.fiveHund}`,
    ].join(" · ");
  }, [copy, subscription]);

  return (
    <section className="section">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="card p-6 space-y-6">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-[0.2em] text-slate-500">{copy.badge}</span>
            <h2 className="text-2xl font-semibold tracking-tight">{copy.title}</h2>
            <p className="text-sm text-slate-600">{copy.description}</p>
          </div>

          {!sessionUser && (
            <div className="rounded-2xl border border-dashed border-slate-300 p-5 text-sm text-slate-600">
              <p>{copy.signInPrompt}</p>
            </div>
          )}

          {sessionUser && (
            <>
          {subscription && (
                <div className="rounded-2xl border bg-slate-50 p-4 text-sm text-slate-600">
                  <div className="font-semibold text-slate-900">{copy.currentPlan}</div>
                  <div className="mt-1">{summary}</div>
                  <div className="mt-1">
                    {copy.frequencyLabel}: {copy.frequencyOptions[subscription.frequency as (typeof frequencyOptions)[number]]}
                  </div>
                  <div>
                    {copy.deliveryDayLabel}: {copy.weekdays[subscription.delivery_day as (typeof deliveryDays)[number]]}
                  </div>
                  {subscription.next_delivery && (
                    <div>
                      {copy.nextDeliveryLabel}: {new Date(subscription.next_delivery).toLocaleDateString()}
                    </div>
                  )}
                  <div>
                    {copy.statusLabel}:{" "}
                    <span className={subscription.status === "active" ? "text-emerald-600" : "text-amber-600"}>
                      {subscription.status === "active" ? copy.statusActive : copy.statusPaused}
                    </span>
                  </div>
                </div>
              )}

          {error && <div className="text-sm text-red-600" role="alert">{error}</div>}

              <div className="grid gap-4 sm:grid-cols-3">
                <label className="text-sm">
                  {copy.bottles.fiveG}
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
                  {copy.bottles.oneL}
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
                  {copy.bottles.fiveHund}
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
                  {copy.frequencyField}
                  <select
                    className="mt-1 w-full border rounded-2xl px-3 py-2 bg-white"
                    value={form.frequency}
                    onChange={(e) => handleChange("frequency", e.target.value)}
                  >
                    {frequencyOptions.map((value) => (
                      <option key={value} value={value}>
                        {copy.frequencyOptions[value]}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="text-sm">
                  {copy.deliveryDayField}
                  <select
                    className="mt-1 w-full border rounded-2xl px-3 py-2 bg-white"
                    value={form.delivery_day}
                    onChange={(e) => handleChange("delivery_day", e.target.value)}
                  >
                    {deliveryDays.map((day) => (
                      <option key={day} value={day}>
                        {copy.weekdays[day]}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="text-sm">
                {copy.notesLabel}
                <textarea
                  className="mt-1 w-full border rounded-2xl px-3 py-2"
                  rows={3}
                  value={form.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  placeholder={copy.notesPlaceholder}
                />
              </label>

              <div className="flex flex-wrap gap-2">
                <button type="button" className="btn btn-primary h-10 px-5 rounded-full" disabled={saving} onClick={handleSave}>
                  {saving ? copy.savingLabel : subscription ? copy.saveButton : copy.createButton}
                </button>
                {subscription && (
                  <>
                    <button
                      type="button"
                      className="btn btn-ghost h-10 px-5 rounded-full"
                      disabled={saving}
                      onClick={() => handleStatusChange(subscription.status === "active" ? "paused" : "active")}
                    >
                      {subscription.status === "active" ? copy.pauseButton : copy.resumeButton}
                    </button>
                    <button type="button" className="btn btn-ghost h-10 px-5 rounded-full" disabled={saving} onClick={handleSkip}>
                      {copy.skipButton}
                    </button>
                  </>
                )}
              </div>
            </>
          )}

          {!loading && !sessionUser && (
            <div className="text-sm text-slate-500">
              {copy.signInCta}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
