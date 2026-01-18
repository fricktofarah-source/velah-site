"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

const STORAGE_PREFIX = "velah:timezone:";

export default function TimezoneSync() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    let active = true;

    const sync = async (userId?: string) => {
      if (!userId || typeof window === "undefined") return;
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
      const storageKey = `${STORAGE_PREFIX}${userId}`;
      try {
        const cached = window.localStorage.getItem(storageKey);
        if (cached === timeZone) return;
        await supabase.from("profiles").upsert({ user_id: userId, time_zone: timeZone }, { onConflict: "user_id" });
        window.localStorage.setItem(storageKey, timeZone);
      } catch (error) {
        console.warn("Failed to sync timezone", error);
      }
    };

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      sync(data.session?.user.id);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      sync(session?.user?.id);
    });
    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return null;
}
