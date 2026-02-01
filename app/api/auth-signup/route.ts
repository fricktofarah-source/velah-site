// app/api/auth-signup/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { Resend } from "resend";
import { joinWaitlist } from "@/lib/waitlist";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const REDIRECT_TO = process.env.AUTH_EMAIL_REDIRECT_TO;

if (!RESEND_API_KEY || !REDIRECT_TO) {
  throw new Error("Missing RESEND_API_KEY or AUTH_EMAIL_REDIRECT_TO");
}

type SignupPayload = {
    email?: string | null;
    password?: string | null;
    name?: string | null;
    joinList?: boolean | string | null;
};

function coerceString(value: unknown) {
    if (typeof value === "string") return value;
    return typeof value === "number" ? String(value) : "";
}

function coerceBoolean(value: boolean | string | null | undefined) {
    if (typeof value === "boolean") return value;
    if (typeof value === "string") {
        const normalized = value.trim().toLowerCase();
        return normalized === "true" || normalized === "on" || normalized === "1";
    }
    return false;
}

function isStrongPassword(value: string) {
    return value.length >= 8 && /[a-z]/.test(value) && /[A-Z]/.test(value) && /\d/.test(value);
}

export async function POST(req: Request) {
    try {
        const ct = req.headers.get("content-type") || "";
        const isJson = ct.includes("application/json");
        let payload: SignupPayload = {};
        if (isJson) {
            const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
            if (body && typeof body === "object") {
                payload = {
                    email: typeof body.email === "string" ? body.email : null,
                    password: typeof body.password === "string" ? body.password : null,
                    name: typeof body.name === "string" ? body.name : null,
                    joinList: typeof body.joinList === "boolean" || typeof body.joinList === "string" ? body.joinList : null,
                };
            }
        } else {
            const form = await req.formData().catch(() => null);
            if (form) {
                payload = {
                    email: form.get("email")?.toString() ?? null,
                    password: form.get("password")?.toString() ?? null,
                    name: form.get("name")?.toString() ?? null,
                    joinList: form.get("joinList")?.toString() ?? null,
                };
            }
        }

        const email = coerceString(payload.email).trim().toLowerCase();
        const password = coerceString(payload.password);
        const name = coerceString(payload.name).trim();
        const joinList = coerceBoolean(payload.joinList ?? false);

        if (!/\S+@\S+\.\S+/.test(email)) {
            return NextResponse.json({ ok: false, error: "Invalid email." }, { status: 400 });
        }
        if (!isStrongPassword(password)) {
            return NextResponse.json(
                { ok: false, error: "Password must be at least 8 characters and include uppercase, lowercase, and a number." },
                { status: 400 }
            );
        }
        if (!name) {
            return NextResponse.json({ ok: false, error: "Please enter your name." }, { status: 400 });
        }

        // 1) Create unconfirmed user
        const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            user_metadata: { full_name: name },
            email_confirm: false,
        });
        if (createErr) {
            const m = (createErr.message || "").toLowerCase();
            if (m.includes("already") || m.includes("registered")) {
                return NextResponse.json({ ok: false, error: "An account with this email already exists. Try signing in." }, { status: 400 });
            }
            if (m.includes("password")) {
                return NextResponse.json(
                    { ok: false, error: "Password must be at least 8 characters and include uppercase, lowercase, and a number." },
                    { status: 400 }
                );
            }
            return NextResponse.json({ ok: false, error: "Couldn’t create the account. Please try again." }, { status: 400 });
        }

        // 2) If they opted into the newsletter, record it as pending (no email)
        // Inside app/api/auth-signup/route.ts, after user creation & before returning:

        if (joinList) {
            try {
                await joinWaitlist({ email, noEmail: true, name });
            } catch {
                // ignore — account creation succeeded; waitlist is best-effort
            }
        }

        // 3) Generate one Supabase signup confirmation link
        const { data: linkData, error: linkErr } = await supabaseAdmin.auth.admin.generateLink({
            type: "signup",
            email,
            password,
            options: { redirectTo: REDIRECT_TO },
        });
        if (linkErr || !linkData?.properties?.action_link) {
            return NextResponse.json({ ok: false, error: "Couldn’t generate confirmation link." }, { status: 500 });
        }
        const actionLink = linkData.properties.action_link as string;

        // 4) Send that single email via Resend
        const resend = new Resend(RESEND_API_KEY);
        await resend.emails.send({
            from: "Velah <no-reply@drinkvelah.com>",
            to: email,
            subject: "Confirm your Velah account",
            text: [
                `Hi${name ? " " + name : ""},`,
                "",
                "Thanks for creating a Velah account.",
                "Confirm your email using the link below:",
                actionLink,
                "",
                "If you didn’t request this, you can ignore this message.",
                "",
                "Velah Team",
                "This is an automated message. Please do not reply.",
            ].join("\n"),
            html: `
        <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;line-height:1.6;color:#111">
          <p>Hi${name ? " " + name : ""},</p>
          <p>Thanks for creating a <strong>Velah</strong> account. Please confirm your email:</p>
          <p>
            <a href="${actionLink}" style="display:inline-block;padding:12px 18px;border-radius:999px;background:#000;color:#fff;text-decoration:none;font-weight:600">
              Confirm my email
            </a>
          </p>
          <p style="color:#555">If you didn’t request this, you can safely ignore this message.</p>
          <hr style="border:none;border-top:1px solid #eee;margin:16px 0" />
          <p style="color:#777;font-size:12px">This is an automated message from Velah. Please do not reply.</p>
        </div>
      `,
        });

        return NextResponse.json({ ok: true, userId: created.user?.id ?? null });
    } catch {
        return NextResponse.json({ ok: false, error: "Server error. Please try again." }, { status: 500 });
    }
}
