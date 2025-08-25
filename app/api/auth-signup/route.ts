// app/api/auth-signup/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const RESEND_API_KEY = process.env.RESEND_API_KEY!;
const REDIRECT_TO = process.env.AUTH_EMAIL_REDIRECT_TO || "https://drinkvelah.com/auth/callback";

export async function POST(req: Request) {
    try {
        const ct = req.headers.get("content-type") || "";
        const isJson = ct.includes("application/json");
        let payload: any = {};
        if (isJson) payload = await req.json();
        else {
            const form = await req.formData().catch(() => null);
            if (form) {
                payload.email = form.get("email");
                payload.password = form.get("password");
                payload.name = form.get("name");
                payload.joinList = form.get("joinList") === "on" || form.get("joinList") === "true";
            }
        }

        const email = String(payload.email || "").trim().toLowerCase();
        const password = String(payload.password || "");
        const name = String(payload.name || "").trim();
        const joinList = Boolean(payload.joinList);

        if (!/\S+@\S+\.\S+/.test(email)) {
            return NextResponse.json({ ok: false, error: "Invalid email." }, { status: 400 });
        }
        if (!password || password.length < 6) {
            return NextResponse.json({ ok: false, error: "Password must be at least 6 characters." }, { status: 400 });
        }
        if (!name) {
            return NextResponse.json({ ok: false, error: "Please enter your name." }, { status: 400 });
        }

        const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
            auth: { persistSession: false },
        });

        // 1) Create unconfirmed user
        const { data: created, error: createErr } = await admin.auth.admin.createUser({
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
                return NextResponse.json({ ok: false, error: "Password must be at least 6 characters." }, { status: 400 });
            }
            return NextResponse.json({ ok: false, error: "Couldn’t create the account. Please try again." }, { status: 400 });
        }

        // 2) If they opted into the newsletter, record it as pending (no email)
        // Inside app/api/auth-signup/route.ts, after user creation & before returning:

        if (joinList) {
            try {
                await fetch(new URL("/api/join-waitlist", process.env.WAITLIST_CONFIRM_BASE_URL || "https://drinkvelah.com"), {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    // noEmail: true → write to DB only, NO extra email (we already send the account confirmation)
                    body: JSON.stringify({ email, noEmail: true, name }),
                });
            } catch {
                // ignore — account creation succeeded; waitlist is best-effort
            }
        }

        // 3) Generate one Supabase signup confirmation link
        const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
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
                "— Velah Team",
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
