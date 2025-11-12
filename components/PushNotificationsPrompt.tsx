"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type PushNotificationsPromptProps = {
  title?: string;
  description?: string;
  buttonLabel?: string;
};

const isPushSupported = () =>
  typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function PushNotificationsPrompt({
  title = "Get delivery reminders",
  description = "Enable push notifications on your Velah app to know when your route is scheduled or when it's time to hydrate.",
  buttonLabel = "Enable notifications",
}: PushNotificationsPromptProps) {
  const [status, setStatus] = useState<"idle" | "blocked" | "granted" | "loading" | "unsupported">("idle");
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSessionToken(data.session?.access_token ?? null);
    });
  }, []);

  useEffect(() => {
    if (!isPushSupported()) {
      setStatus("unsupported");
      return;
    }
    if (Notification.permission === "granted") {
      setStatus("granted");
    }
    if (Notification.permission === "denied") {
      setStatus("blocked");
    }
  }, []);

  const enablePush = async () => {
    if (!isPushSupported()) {
      setStatus("unsupported");
      return;
    }
    if (!sessionToken) {
      setStatus("blocked");
      return;
    }

    setStatus("loading");
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus(permission === "denied" ? "blocked" : "idle");
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidKey) {
        console.warn("Missing NEXT_PUBLIC_VAPID_PUBLIC_KEY");
        setStatus("blocked");
        return;
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });

      const response = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription, token: sessionToken }),
      });

      if (!response.ok) throw new Error("Unable to save subscription");

      setStatus("granted");
    } catch (error) {
      console.error(error);
      setStatus("blocked");
    }
  };

  if (status === "unsupported" || !sessionToken || status === "granted") return null;

  return (
    <div className="rounded-2xl border border-dashed border-slate-300 p-4 flex flex-col gap-2 text-sm text-slate-600">
      <div className="font-semibold text-slate-900">{title}</div>
      <p>{description}</p>
      <button type="button" className="btn btn-primary h-9 px-4 rounded-full w-fit" onClick={enablePush} disabled={status === "loading"}>
        {status === "loading" ? "Enabling…" : buttonLabel}
      </button>
      {status === "blocked" && <p className="text-xs text-red-600">Please allow notifications in your browser settings.</p>}
    </div>
  );
}
