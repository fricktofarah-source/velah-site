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

// cooldown to avoid abuse
const COOLDOWN_MIN = 15;

// Simple HTML response for no-JS form submissions
function htmlMessage(title: string, body: string) {
  return `
  <!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <title>${title}</title>
      <style>
        body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;line-height:1.6;margin:40px;color:#111}
        .card{max-width:640px;margin:0 auto;border:1px solid #eee;border-radius:16px;padding:24px}
        a.btn{display:inline-block;padding:10px 16px;border-radius:999px;border:1px solid #111;text-decoration:none;color:#111}
      </style>
    </head>
    <body>
      <div class="card">
        <h1 style="font-size:20px;margin:0 0 8px 0">${title}</h1>
        <p style="color:#444">${body}</p>
        <p><a class="btn" href="/">Back to home</a></p>
      </div>
    </body>
  </html>`;
}

export async function POST(req: Request) {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
  const resend = new Resend(RESEND_API_KEY);

  // detect content type to support JSON and HTML form posts
  const ct = req.headers.get("content-type") || "";
  const isJson = ct.includes("application/json");
  const isForm =
    ct.includes("application/x-www-form-urlencoded") ||
    ct.includes("multipart/form-data");

  let email: string | null = null;

  try {
    if (isJson) {
      const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
      if (body && typeof body.email === "string") email = body.email.trim();
    } else if (isForm) {
      const form = await req.formData();
      const v = form.get("email");
      if (typeof v === "string") email = v.trim();
    } else {
      // fallback try both (some clients omit CT)
      try {
        const fallbackBody = (await req.json().catch(() => null)) as Record<string, unknown> | null;
        if (fallbackBody && typeof fallbackBody.email === "string") email = fallbackBody.email.trim();
      } catch {
        const form = await req.formData().catch(() => null);
        const v = form?.get("email");
        if (typeof v === "string") email = v.trim();
      }
    }

    // If no email provided, respond generically (avoid enumeration)
    if (!email) {
      if (isForm) {
        return new Response(
          htmlMessage(
            "If that email exists, we’ve sent a link",
            "Please check your inbox for a new confirmation email. If it doesn’t arrive, try again in a few minutes."
          ),
          { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } }
        );
      }
      return NextResponse.json({ ok: true });
    }

    // lookup existing row (case-insensitive)
    const { data: rows } = await supabase
      .from("newsletter")
      .select("id, status, confirmation_sent_at, email_lc")
      .eq("email_lc", email.toLowerCase())
      .limit(1);

    const row = rows?.[0];

    // Always respond generically to avoid leaking registration status
    if (!row) {
      if (isForm) {
        return new Response(
          htmlMessage(
            "If that email exists, we’ve sent a link",
            "Please check your inbox for a new confirmation email."
          ),
          { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } }
        );
      }
      return NextResponse.json({ ok: true });
    }

    if (row.status === "confirmed") {
      if (isForm) {
        return new Response(
          htmlMessage(
            "You’re already confirmed",
            "Your email is already confirmed. Thanks for joining Velah!"
          ),
          { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } }
        );
      }
      return NextResponse.json({ ok: true });
    }

    // cooldown check
    const now = new Date();
    const lastSent = row.confirmation_sent_at ? new Date(row.confirmation_sent_at) : null;
    if (lastSent && now.getTime() - lastSent.getTime() < COOLDOWN_MIN * 60_000) {
      if (isForm) {
        return new Response(
          htmlMessage(
            "Please try again shortly",
            `We recently sent a confirmation. You can request another in about ${COOLDOWN_MIN} minutes.`
          ),
          { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } }
        );
      }
      return NextResponse.json({ ok: true });
    }

    // issue new token + timestamp
    const token = crypto.randomUUID();
    await supabase
      .from("newsletter")
      .update({
        confirmation_token: token,
        confirmation_sent_at: now.toISOString(),
        status: "pending",
      })
      .eq("id", row.id);

    const confirmUrl = `${BASE_URL}/api/confirm?token=${encodeURIComponent(token)}`;

    // send the email
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
        "Velah Team",
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

    if (isForm) {
      return new Response(
        htmlMessage(
          "If that email exists, we’ve sent a link",
          "Please check your inbox for a new confirmation email."
        ),
        { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    }
    return NextResponse.json({ ok: true });
  } catch {
    // Always a generic success to avoid leaking anything
    if (isForm) {
      return new Response(
        htmlMessage(
          "If that email exists, we’ve sent a link",
          "Please check your inbox for a new confirmation email."
        ),
        { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    }
    return NextResponse.json({ ok: true });
  }
}
