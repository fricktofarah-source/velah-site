import webPush from "web-push";
import { supabaseAdmin } from "./supabaseAdmin";

export type StoredPushSubscription = {
  user_id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
};

export type PushPayload = {
  title: string;
  body: string;
  url?: string;
};

let configured = false;

function ensureConfigured() {
  if (configured) return;
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (!publicKey || !privateKey) {
    throw new Error("Missing NEXT_PUBLIC_VAPID_PUBLIC_KEY or VAPID_PRIVATE_KEY");
  }
  const subject = process.env.PUSH_VAPID_SUBJECT || "mailto:hello@velahwater.com";
  webPush.setVapidDetails(subject, publicKey, privateKey);
  configured = true;
}

export async function sendPush(sub: StoredPushSubscription, payload: PushPayload) {
  ensureConfigured();
  try {
    await webPush.sendNotification(
      {
        endpoint: sub.endpoint,
        keys: {
          auth: sub.auth,
          p256dh: sub.p256dh,
        },
      },
      JSON.stringify(payload)
    );
    return { ok: true as const };
  } catch (error) {
    const status = typeof error === "object" && error && "statusCode" in error ? (error as { statusCode?: number }).statusCode : null;
    if (status === 410 || status === 404) {
      await supabaseAdmin.from("push_subscriptions").delete().eq("endpoint", sub.endpoint);
      return { ok: false as const, removed: true as const };
    }
    throw error;
  }
}
