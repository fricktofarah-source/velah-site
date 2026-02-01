// lib/waitlist.ts
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;

if (!RESEND_API_KEY) {
  throw new Error("Missing RESEND_API_KEY");
}

type JoinWaitlistOptions = {
  email: string;
  zone?: string | null;
  noEmail?: boolean;
  name?: string | null;
  userAgent?: string | null;
  ip?: string | null;
};

export async function joinWaitlist({ email, zone, noEmail, name, userAgent, ip }: JoinWaitlistOptions) {
  if (!/\S+@\S+\.\S+/.test(email)) {
    throw new Error("Invalid email.");
  }

  let inserted = null;
  let errorMsg: string | null = null;

  // Attempt 1: common extended schema
  {
    const { data, error } = await supabaseAdmin
      .from("newsletter")
      .insert([{ email, email_lc: email, zone, user_agent: userAgent, ip, status: noEmail ? "pending" : "pending" }])
      .select()
      .single();
    if (!error) inserted = data;
    else errorMsg = error.message;
  }

  // Attempt 2: basic schema (email + created_at only)
  if (!inserted) {
    const { data, error } = await supabaseAdmin.from("newsletter").insert([{ email }]).select().single();
    if (!error) inserted = data;
    else errorMsg = error.message;
  }

  if (!inserted) {
    throw new Error(`Couldn’t add to waitlist: ${errorMsg || "unknown error"}`);
  }

  if (noEmail) {
    return { id: inserted.id || null, silent: true };
  }

  const resend = new Resend(RESEND_API_KEY);
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
      "Velah Team",
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

  return { id: inserted.id || null };
}
