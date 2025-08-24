// app/api/join-waitlist/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import crypto from "crypto";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const HASH_SECRET = process.env.HASH_SECRET!;
const RESEND_API_KEY = process.env.RESEND_API_KEY!;
const BASE_URL = process.env.WAITLIST_CONFIRM_BASE_URL || "https://drinkvelah.com";
const EXP_HOURS = Number(process.env.WAITLIST_CONFIRM_EXP_HOURS || 24);

const isEmail = (v: string) => /\S+@\S+\.\S+/.test(v.trim());
const sha256 = (s: string) => crypto.createHash("sha256").update(s, "utf8").digest("hex");
const ipFrom = (req: Request) => {
  const xf = req.headers.get("x-forwarded-for") || "";
  const parts = xf.split(",").map(s => s.trim()).filter(Boolean);
  return parts[0] || req.headers.get("cf-connecting-ip") || req.headers.get("x-real-ip") || "";
};

export async function POST(req: Request) {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
  const resend = new Resend(RESEND_API_KEY);

  try {
    // Accept JSON or HTML form
    const ct = req.headers.get("content-type") || "";
    const isJson = ct.includes("application/json");
    const isForm = ct.includes("application/x-www-form-urlencoded") || ct.includes("multipart/form-data");

    let email: string | null = null;
    let zone: string | null = null;

    if (isJson) {
      const body = await req.json().catch(() => ({}));
      if (typeof body?.email === "string") email = body.email.trim();
      if (typeof body?.zone === "string") zone = body.zone.trim();
    } else if (isForm) {
      const form = await req.formData();
      const e = form.get("email");
      const z = form.get("zone");
      if (typeof e === "string") email = e.trim();
      if (typeof z === "string") zone = z.trim();
    } else {
      // best-effort fallback
      try {
        const body = await req.json();
        if (typeof body?.email === "string") email = body.email.trim();
        if (typeof body?.zone === "string") zone = body.zone.trim();
      } catch {
        const form = await req.formData().catch(() => null);
        const e = form?.get("email");
        const z = form?.get("zone");
        if (typeof e === "string") email = e.trim();
        if (typeof z === "string") zone = z.trim();
      }
    }

    if (!email || !isEmail(email)) {
      return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
    }

    const ua = req.headers.get("user-agent") || "";
    const ip = ipFrom(req) || "";
    const ip_hash = ip ? sha256(`${ip}:${HASH_SECRET}`) : null;

    // Upsert by email_lc (unique index)
    const { data: row } = await supabase
      .from("newsletter")
      .upsert(
        { email, zone: zone || null, user_agent: ua || null, ip_hash },
        { onConflict: "email_lc", ignoreDuplicates: false }
      )
      .select()
      .single();

    // If already confirmed: return success (no email)
    if (row?.status === "confirmed") {
      return NextResponse.json({ ok: true });
    }

    // Issue/refresh token and send confirmation
    const token = crypto.randomUUID();
    await supabase
      .from("newsletter")
      .update({ confirmation_token: token, confirmation_sent_at: new Date().toISOString(), status: "pending" })
      .eq("email_lc", email.toLowerCase());

    const confirmUrl = `${BASE_URL}/api/confirm?token=${encodeURIComponent(token)}`;

    await resend.emails.send({
      from: "Velah <no-reply@drinkvelah.com>",
      to: email,
      subject: "Confirm your Velah waitlist",
      text: `Thanks for joining Velah!\nConfirm here: ${confirmUrl}\n\nThis link expires in ${EXP_HOURS} hours.\n\n— Velah Team\nThis is an automated message. Please do not reply.`,
      html: `
        <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;line-height:1.6;color:#111">
          <p>Thanks for joining <strong>Velah</strong>!</p>
          <p><a href="${confirmUrl}" style="display:inline-block;padding:12px 18px;border-radius:999px;background:#000;color:#fff;text-decoration:none;font-weight:600">Confirm my email</a></p>
          <p style="color:#555">This link expires in ${EXP_HOURS} hours.</p>
          <hr style="border:none;border-top:1px solid #eee;margin:16px 0" />
          <p style="color:#777;font-size:12px">This is an automated message. Please do not reply.</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    // Never leak internals to the client; always return a JSON response
    console.error("join-waitlist error:", err);
    return NextResponse.json({ ok: true });
  }
}
