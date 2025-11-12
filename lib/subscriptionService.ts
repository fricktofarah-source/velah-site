import { supabase } from "./supabaseClient";

type DeliveryFrequency = "weekly" | "biweekly";
type DeliveryDay = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
type SubscriptionStatus = "active" | "paused";

export type UserSubscription = {
  id: string;
  user_id: string;
  bottles_5g: number;
  bottles_1l: number;
  bottles_500ml: number;
  frequency: DeliveryFrequency;
  delivery_day: DeliveryDay;
  next_delivery: string | null;
  notes: string | null;
  status: SubscriptionStatus;
  updated_at: string;
  created_at: string;
};

export type SubscriptionPayload = {
  bottles_5g: number;
  bottles_1l: number;
  bottles_500ml: number;
  frequency: DeliveryFrequency;
  delivery_day: DeliveryDay;
  notes?: string;
};

const TABLE = "user_subscriptions";

export async function fetchUserSubscription(userId: string) {
  const { data, error } = await supabase.from<UserSubscription>(TABLE).select("*").eq("user_id", userId).maybeSingle();
  if (error) throw error;
  return data;
}

export async function upsertSubscription(userId: string, payload: SubscriptionPayload) {
  const { data, error } = await supabase
    .from<UserSubscription>(TABLE)
    .upsert(
      {
        user_id: userId,
        bottles_5g: payload.bottles_5g,
        bottles_1l: payload.bottles_1l,
        bottles_500ml: payload.bottles_500ml,
        frequency: payload.frequency,
        delivery_day: payload.delivery_day,
        notes: payload.notes ?? null,
      },
      { onConflict: "user_id" }
    )
    .select<UserSubscription>()
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function updateSubscriptionStatus(userId: string, status: SubscriptionStatus) {
  const { data, error } = await supabase
    .from<UserSubscription>(TABLE)
    .update({ status })
    .eq("user_id", userId)
    .select<UserSubscription>()
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function skipNextDelivery(userId: string, days = 7) {
  const { data, error } = await supabase
    .from<{ next_delivery: string | null }>(TABLE)
    .select("next_delivery")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  const baseDate = data?.next_delivery ? new Date(data.next_delivery) : new Date();
  baseDate.setDate(baseDate.getDate() + days);
  const next_delivery = baseDate.toISOString();
  const { data: updated, error: updateError } = await supabase
    .from<UserSubscription>(TABLE)
    .update({ next_delivery })
    .eq("user_id", userId)
    .select<UserSubscription>()
    .maybeSingle();
  if (updateError) throw updateError;
  return updated;
}
