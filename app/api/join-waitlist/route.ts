// app/api/join-waitlist/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const RESEND_API_KEY = process.env.RESEND_API_KEY!;
const CONFIRM_BASE = process.env.WAITLIST_CONFIRM_BASE_URL || "https://drinkvelah.com";

export async function POST(req: Request) {
  try {
    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    const ct = req.headers.get("content-type") || "";
    const isJson = ct.includes("application/json");
    const body = isJson ? await req.json().catch(() => ({})) : {};
    const email = String(body.email || "").trim().toLowerCase();
    const zone = (body.zone || "").toString().slice(0, 120) || null;
    const noEmail = Boolean(body.noEmail);                // ← NEW: silent mode
    const name = (body.name || "").toString().slice(0, 120) || null;

    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json({ ok: false, error: "Invalid email." }, { status: 400 });
    }

    // Best-effort context
    const ua = req.headers.get("user-agent") || null;
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;

    // Insert row tolerant to schema (only send columns that likely exist)
    // Try the richest shape first; fall back to minimal if needed.
    let inserted = null;
    let errorMsg: string | null = null;

    // Attempt 1: common extended schema
    {
      const { data, error } = await admin
        .from("newsletter")
        .insert([{ email, email_lc: email, zone, user_agent: ua, ip, status: noEmail ? "pending" : "pending" }])
        .select()
        .single();
      if (!error) inserted = data;
      else errorMsg = error.message;
    }

    // Attempt 2: basic schema (email + created_at only)
    if (!inserted) {
      const { data, error } = await admin.from("newsletter").insert([{ email }]).select().single();
      if (!error) inserted = data;
      else errorMsg = error.message;
    }

    if (!inserted) {
      return NextResponse.json({ ok: false, error: `Couldn’t add to waitlist: ${errorMsg || "unknown error"}` }, { status: 400 });
    }

    // Silent path: skip email entirely (used by signup flow to avoid double emails)
    if (noEmail) {
      return NextResponse.json({ ok: true, id: inserted.id || null, silent: true });
    }

    // Normal path: send confirmation email via Resend (if you still want double opt-in here)
    const resend = new Resend(RESEND_API_KEY);
    const confirmUrl = `${CONFIRM_BASE}/confirm/success`; // adjust if you have a tokenized link
    await resend.emails.send({
      from: "Velah <no-reply@drinkvelah.com>",
      to: email,
      subject: "You’re on the Velah waitlist",
      text: [
        `Hi${name ? " " + name : ""},`,
        "",
        "You’re on the Velah waitlist. We’ll reach out when your area opens.",
        "",
        "If you didn’t request this, you can ignore this message.",
        "",
        "— Velah Team",
        "This is an automated message. Please do not reply.",
      ].join("\n"),
      html: `
        <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;line-height:1.6;color:#111">
          <p>Hi${name ? " " + name : ""},</p>
          <p>You’re on the <strong>Velah</strong> waitlist. We’ll email you when your area opens.</p>
          <p style="color:#777;font-size:12px;margin-top:24px">This is an automated message. Please do not reply.</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true, id: inserted.id || null });
  } catch {
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
