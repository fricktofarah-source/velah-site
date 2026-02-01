// app/api/auth-reset/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const REDIRECT_TO = process.env.AUTH_PASSWORD_RESET_REDIRECT_TO || process.env.AUTH_EMAIL_REDIRECT_TO;

if (!RESEND_API_KEY || !REDIRECT_TO) {
  throw new Error("Missing RESEND_API_KEY or a redirect URL (AUTH_PASSWORD_RESET_REDIRECT_TO or AUTH_EMAIL_REDIRECT_TO)");
}

type ResetPayload = {
  email?: string | null;
};

function coerceString(value: unknown) {
  if (typeof value === "string") return value;
  return typeof value === "number" ? String(value) : "";
}

export async function POST(req: Request) {
  try {
    const ct = req.headers.get("content-type") || "";
    const isJson = ct.includes("application/json");
    let payload: ResetPayload = {};
    if (isJson) {
      const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
      if (body && typeof body === "object") {
        payload = { email: typeof body.email === "string" ? body.email : null };
      }
    } else {
      const form = await req.formData().catch(() => null);
      if (form) {
        payload = { email: form.get("email")?.toString() ?? null };
      }
    }

    const email = coerceString(payload.email).trim().toLowerCase();
    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json({ ok: false, error: "Invalid email." }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: "recovery",
      email,
      options: { redirectTo: REDIRECT_TO },
    });

    if (error) {
      const msg = (error.message || "").toLowerCase();
      if (msg.includes("user not found")) {
        return NextResponse.json({ ok: true });
      }
      return NextResponse.json({ ok: false, error: "Could not start password reset." }, { status: 500 });
    }

    const actionLink = data?.properties?.action_link as string | undefined;
    if (!actionLink) {
      return NextResponse.json({ ok: true });
    }

    const resend = new Resend(RESEND_API_KEY);
    await resend.emails.send({
      from: "Velah <no-reply@drinkvelah.com>",
      to: email,
      subject: "Reset your Velah password",
      text: [
        "We received a request to reset your password.",
        "Use the link below to set a new one:",
        actionLink,
        "",
        "If you didn’t request this, you can ignore this email.",
      ].join("\n"),
      html: `
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f7f7f5;padding:32px 0;">
          <tr>
            <td align="center">
              <table width="560" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;padding:28px;font-family:Arial,sans-serif;color:#0f172a;">
                <tr>
                  <td style="font-size:20px;font-weight:600;padding-bottom:8px;">Reset your Velah password</td>
                </tr>
                <tr>
                  <td style="font-size:14px;line-height:1.6;color:#334155;padding-bottom:20px;">
                    We received a request to reset your password. Use the button below to set a new one.
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-bottom:20px;">
                    <a href="${actionLink}" style="display:inline-block;background:#7FCBD8;color:#0f172a;text-decoration:none;padding:12px 20px;border-radius:999px;font-size:14px;font-weight:600;">
                      Reset Password
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="font-size:12px;line-height:1.6;color:#64748b;">
                    If you didn’t request this, you can ignore this email.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Server error. Please try again." }, { status: 500 });
  }
}
