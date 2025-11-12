import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { PushPayload, StoredPushSubscription, sendPush } from "@/lib/pushService";

const dayKey = (value: Date) => value.toISOString().slice(0, 10);
const formatMl = (value: number) => new Intl.NumberFormat("en-US").format(Math.max(0, Math.round(value)));
const MAX_ZERO_REMINDERS = Number(process.env.PUSH_MAX_ZERO_REMINDERS ?? 4);

type NotificationKind = "reminder" | "congrats";

export async function GET(request: Request) {
  return processRequest(request);
}

export async function POST(request: Request) {
  return processRequest(request);
}

async function processRequest(request: Request) {
  const secret = process.env.PUSH_CRON_SECRET;
  const allowSensitive = process.env.ALLOW_NON_SENSITIVE_CRON_SECRET === "1";
  if (secret && (allowSensitive || request.headers.get("x-cron-secret"))) {
    const authHeader = request.headers.get("authorization");
    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (bearerToken !== secret && request.headers.get("x-cron-secret") !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }
  const result = await dispatchNotifications();
  return NextResponse.json(result);
}

async function dispatchNotifications() {
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
    return { sentCongratulated: 0, sentReminded: 0, skipped: 0, removed: 0, errors: 0 };
  }

  const userIds = [...new Set(subscriptions.map((sub) => sub.user_id))];
  const subsByUser = new Map<string, StoredPushSubscription[]>();
  subscriptions.forEach((sub) => {
    if (!subsByUser.has(sub.user_id)) subsByUser.set(sub.user_id, []);
    subsByUser.get(sub.user_id)!.push(sub);
  });

  const { data: profiles, error: profileError } = await supabaseAdmin
    .from("hydration_profiles")
    .select("user_id, goal_ml")
    .in("user_id", userIds);
  if (profileError) throw profileError;

  const goals = new Map<string, number>();
  profiles?.forEach((profile) => {
    goals.set(profile.user_id, profile.goal_ml || 0);
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

  const stats = { sentCongratulated: 0, sentReminded: 0, skipped: 0, removed: 0, errors: 0 };

  for (const userId of userIds) {
    const goal = goals.get(userId) || 0;
    if (!goal) {
      stats.skipped += 1;
      continue;
    }

    const todayIntake = entryMap.get(`${userId}:${todayKey}`) ?? 0;
    const history = buildHistory(entryMap, userId, today);
    const streak = computeStreak(history, goal);
    const remaining = Math.max(goal - todayIntake, 0);
    const zeroIntake = todayIntake === 0;
    const zeroIntakeStreak = computeZeroIntakeStreak(history);
    if (zeroIntakeStreak >= MAX_ZERO_REMINDERS) {
      stats.skipped += 1;
      continue;
    }

    let payload: PushPayload | null = null;
    let kind: NotificationKind | null = null;

    if (todayIntake >= goal) {
      payload = makeCongratsPayload(streak);
      kind = "congrats";
    } else {
      payload = makeReminderPayload({ remaining, zeroIntake, streak });
      kind = "reminder";
    }

    if (!payload || !kind) {
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
          if (kind === "congrats") stats.sentCongratulated += 1;
          if (kind === "reminder") stats.sentReminded += 1;
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

function computeZeroIntakeStreak(history: Array<{ day: string; intake_ml: number }>) {
  let count = 0;
  for (let i = history.length - 1; i >= 0; i--) {
    const entry = history[i];
    if (entry.intake_ml === 0) {
      count += 1;
    } else {
      break;
    }
  }
  return count;
}

function makeReminderPayload(params: { remaining: number; zeroIntake: boolean; streak: number }): PushPayload {
  if (params.zeroIntake) {
    return {
      title: "Begin the ritual",
      body: "Your ledger is quiet. Pour a chilled glass and let today’s calm begin.",
      url: "/hydration",
    };
  }
  return {
    title: "One glass from calm",
    body: `Only ${formatMl(params.remaining)} ml stand between you and today's serene finish. Take an unhurried sip for day ${params.streak + 1}.`,
    url: "/hydration",
  };
}

function makeCongratsPayload(streak: number): PushPayload {
  return {
    title: "Glass settled, ritual kept",
    body:
      streak > 1
        ? `That's ${streak} days in velvet rhythm. Stay with the loop and let tomorrow taste just as clean.`
        : "Today's goal is yours. Exhale, reset the bottles, and carry the clarity forward.",
    url: "/hydration",
  };
}
