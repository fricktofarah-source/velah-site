import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { PushPayload, StoredPushSubscription, sendPush } from "@/lib/pushService";

type Intent = "goal" | "streak";

const dayKey = (value: Date) => value.toISOString().slice(0, 10);
const formatMl = (value: number) => new Intl.NumberFormat("en-US").format(Math.max(0, Math.round(value)));
const DEFAULT_TIMEZONE = process.env.PUSH_FALLBACK_TIMEZONE || "Asia/Dubai";
const GOAL_HOUR = Number(process.env.PUSH_GOAL_HOUR ?? 18);
const STREAK_HOUR = Number(process.env.PUSH_STREAK_HOUR ?? 23);

export async function GET(request: Request) {
  const intentParam = new URL(request.url).searchParams.get("intent");
  const intent: Intent = intentParam === "streak" ? "streak" : "goal";
  return processRequest(request, intent);
}

export async function POST(request: Request) {
  let intent: Intent = "goal";
  try {
    const body = await request.json();
    if (body?.intent === "streak") {
      intent = "streak";
    }
  } catch {
    /* empty body */
  }
  return processRequest(request, intent);
}

async function processRequest(request: Request, intent: Intent) {
  const secret = process.env.PUSH_CRON_SECRET;
  const allowSensitive = process.env.ALLOW_NON_SENSITIVE_CRON_SECRET === "1";
  if (secret && (allowSensitive || request.headers.get("x-cron-secret"))) {
    const authHeader = request.headers.get("authorization");
    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (bearerToken !== secret && request.headers.get("x-cron-secret") !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }
  const result = await dispatchNotifications(intent);
  return NextResponse.json(result);
}

async function dispatchNotifications(intent: Intent) {
  const today = new Date();
  const todayKey = dayKey(today);
  const start = new Date();
  start.setDate(start.getDate() - 6);
  const startKey = dayKey(start);

  const { data: subscriptions, error: subError } = await supabaseAdmin
    .from("push_subscriptions")
    .select("user_id, endpoint, p256dh, auth");
  if (subError) throw subError;
  if (!subscriptions?.length) {
    return { intent, sent: 0, skipped: 0, removed: 0, errors: 0 };
  }

  const userIds = [...new Set(subscriptions.map((sub) => sub.user_id))];
  const subsByUser = new Map<string, StoredPushSubscription[]>();
  subscriptions.forEach((sub) => {
    if (!subsByUser.has(sub.user_id)) subsByUser.set(sub.user_id, []);
    subsByUser.get(sub.user_id)!.push(sub);
  });

  const { data: profiles, error: profileError } = await supabaseAdmin
    .from("hydration_profiles")
    .select("user_id, goal_ml, time_zone")
    .in("user_id", userIds);
  if (profileError) throw profileError;

  const userSettings = new Map<string, { goal: number; timeZone: string | null }>();
  profiles?.forEach((profile) => {
    userSettings.set(profile.user_id, { goal: profile.goal_ml || 0, timeZone: profile.time_zone });
  });

  const { data: entries, error: entryError } = await supabaseAdmin
    .from("hydration_entries")
    .select("user_id, day, intake_ml")
    .in("user_id", userIds)
    .gte("day", startKey)
    .lte("day", todayKey);
  if (entryError) throw entryError;

  const entryMap = new Map<string, number>();
  entries?.forEach((entry) => {
    entryMap.set(`${entry.user_id}:${entry.day}`, entry.intake_ml || 0);
  });

  const stats = { intent, sent: 0, skipped: 0, removed: 0, errors: 0 };

  for (const userId of userIds) {
    const settings = userSettings.get(userId);
    const goal = settings?.goal || 0;
    if (!goal) {
      stats.skipped += 1;
      continue;
    }
    const timeZone = settings?.timeZone || DEFAULT_TIMEZONE;
    if (!shouldSendForIntent(intent, timeZone, today)) {
      stats.skipped += 1;
      continue;
    }

    const todayIntake = entryMap.get(`${userId}:${todayKey}`) ?? 0;
    const history = buildHistory(entryMap, userId, today);
    const streak = computeStreak(history, goal);
    const remaining = Math.max(goal - todayIntake, 0);

    let payload: PushPayload | null = null;
    if (intent === "goal") {
      if (todayIntake >= goal) {
        stats.skipped += 1;
        continue;
      }
      payload = makeGoalPayload(remaining, goal, todayIntake);
    } else {
      if (streak === 0 || todayIntake >= goal) {
        stats.skipped += 1;
        continue;
      }
      payload = makeStreakPayload(streak, remaining);
    }

    if (!payload) {
      stats.skipped += 1;
      continue;
    }

    const subs = subsByUser.get(userId) || [];
    for (const sub of subs) {
      try {
        const response = await sendPush(sub, payload);
        if (response.removed) {
          stats.removed += 1;
        } else {
          stats.sent += 1;
        }
      } catch (error) {
        console.error("push notification error", error);
        stats.errors += 1;
      }
    }
  }

  return stats;
}

function buildHistory(entryMap: Map<string, number>, userId: string, today: Date) {
  const history: Array<{ day: string; intake_ml: number }> = [];
  for (let i = 6; i >= 0; i--) {
    const cursor = new Date(today);
    cursor.setDate(cursor.getDate() - i);
    const key = dayKey(cursor);
    history.push({ day: key, intake_ml: entryMap.get(`${userId}:${key}`) ?? 0 });
  }
  return history;
}

function computeStreak(history: Array<{ day: string; intake_ml: number }>, goal: number) {
  if (!goal) return 0;
  let count = 0;
  for (let i = history.length - 1; i >= 0; i--) {
    const entry = history[i];
    if (entry.intake_ml >= goal) {
      count += 1;
    } else {
      break;
    }
  }
  return count;
}

function makeGoalPayload(remaining: number, goal: number, intake: number): PushPayload {
  const percent = Math.round((intake / goal) * 100);
  const body =
    percent <= 0
      ? `Your bottles are still quiet today. Pour the first glass and begin the ritual.`
      : `Only ${formatMl(remaining)} ml left to complete today's calm loop. Take a slow sip and stay steady.`;
  return {
    title: "Pause for a pour",
    body,
    url: "/hydration",
  };
}

function makeStreakPayload(streak: number, remaining: number): PushPayload {
  return {
    title: "Keep the streak glowing",
    body: `Your ${streak}-day flow is ${formatMl(remaining)} ml from tomorrow. Pour a final glass before the city sleeps.`,
    url: "/hydration",
  };
}

function shouldSendForIntent(intent: Intent, timeZone: string, reference: Date) {
  const { hour } = getLocalTimeParts(reference, timeZone);
  const targetHour = intent === "goal" ? GOAL_HOUR : STREAK_HOUR;
  return hour === targetHour;
}

function getLocalTimeParts(date: Date, timeZone: string) {
  const formatter = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "numeric", hour12: false, timeZone });
  const parts = formatter.formatToParts(date);
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? "0");
  return { hour, minute };
}
