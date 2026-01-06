export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 6;
const rateBucket = new Map<string, { count: number; since: number }>();

function isValidEmail(value: string) {
  return /\S+@\S+\.\S+/.test(value.trim());
}

export async function POST(req: Request) {
  if (!RESEND_API_KEY) {
    return NextResponse.json({ ok: false, error: "Missing RESEND_API_KEY" }, { status: 500 });
  }

  const body = (await req.json().catch(() => null)) as {
    name?: string;
    email?: string;
    message?: string;
    company?: string;
    startedAt?: number;
  } | null;

  const name = (body?.name || "").trim();
  const email = (body?.email || "").trim();
  const message = (body?.message || "").trim();
  const company = (body?.company || "").trim();
  const startedAt = Number(body?.startedAt || 0);

  if (company) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }
  if (!startedAt || Date.now() - startedAt < 2000) {
    return NextResponse.json({ ok: false, error: "Too fast." }, { status: 429 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const record = rateBucket.get(ip);
  if (!record || now - record.since > RATE_WINDOW_MS) {
    rateBucket.set(ip, { count: 1, since: now });
  } else {
    record.count += 1;
    if (record.count > RATE_LIMIT) {
      return NextResponse.json({ ok: false, error: "Rate limit." }, { status: 429 });
    }
  }

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: "Invalid email." }, { status: 400 });
  }
  if (!message || message.length < 5) {
    return NextResponse.json({ ok: false, error: "Message too short." }, { status: 400 });
  }

  try {
    const resend = new Resend(RESEND_API_KEY);
    await resend.emails.send({
      from: "Velah <no-reply@drinkvelah.com>",
      to: ["founder@drinkvelah.com"],
      replyTo: email,
      subject: `Velah contact${name ? `: ${name}` : ""}`,
      text: [
        `From: ${name || "Anonymous"}`,
        `Email: ${email}`,
        "",
        message,
      ].join("\n"),
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Send failed." }, { status: 500 });
  }
}
