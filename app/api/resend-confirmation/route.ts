// app/api/resend-confirmation/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import crypto from "crypto";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const RESEND_API_KEY = process.env.RESEND_API_KEY!;
const BASE_URL = process.env.WAITLIST_CONFIRM_BASE_URL || "https://drinkvelah.com";
const EXP_HOURS = Number(process.env.WAITLIST_CONFIRM_EXP_HOURS || 24);
const COOLDOWN_MIN = 15;

export async function POST(req: Request) {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
  const resend = new Resend(RESEND_API_KEY);

  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const { data: rows } = await supabase
      .from("newsletter")
      .select("id, status, confirmation_sent_at")
      .eq("email_lc", email.toLowerCase())
      .limit(1);

    const row = rows?.[0];
    if (!row) return NextResponse.json({ ok: true }); // no leak

    if (row.status === "confirmed") return NextResponse.json({ ok: true });

    const now = new Date();
    const last = row.confirmation_sent_at ? new Date(row.confirmation_sent_at) : null;
    if (last && now.getTime() - last.getTime() < COOLDOWN_MIN * 60_000) {
      return NextResponse.json({ ok: true }); // still hide specifics
    }

    const token = crypto.randomUUID();
    await supabase
      .from("newsletter")
      .update({ confirmation_token: token, confirmation_sent_at: now.toISOString(), status: "pending" })
      .eq("id", row.id);

    const confirmUrl = `${BASE_URL}/api/confirm?token=${encodeURIComponent(token)}`;

    await resend.emails.send({
      from: "Velah <no-reply@drinkvelah.com>",
      to: email,
      subject: "Confirm your Velah waitlist",
      text: [
        "Click the link below to confirm your email:",
        confirmUrl,
        "",
        `This link will expire in ${EXP_HOURS} hours.`,
        "",
        "— Velah Team",
        "This is an automated message. Please do not reply.",
      ].join("\n"),
      html: `
        <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;line-height:1.6;color:#111">
          <p>Please confirm your email by clicking the button below:</p>
          <p>
            <a href="${confirmUrl}" style="display:inline-block;padding:12px 18px;border-radius:999px;background:#000;color:#fff;text-decoration:none;font-weight:600">
              Confirm my email
            </a>
          </p>
          <p style="color:#555">This link will expire in ${EXP_HOURS} hours.</p>
          <hr style="border:none;border-top:1px solid #eee;margin:16px 0" />
          <p style="color:#777;font-size:12px">This is an automated message from Velah. Please do not reply.</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
