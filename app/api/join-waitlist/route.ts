// app/api/join-waitlist/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const HASH_SECRET = process.env.HASH_SECRET!; // <-- add this to your env

// Server-only client (service role bypasses RLS)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

function getClientIP(req: Request) {
  // Works on Vercel/most proxies
  const xfwd = req.headers.get("x-forwarded-for") || "";
  const parts = xfwd.split(",").map(s => s.trim()).filter(Boolean);
  // Fall back to Cloudflare-Connecting-IP or remote addr-ish headers if needed
  return parts[0] || req.headers.get("cf-connecting-ip") || req.headers.get("x-real-ip") || "";
}

function sha256(input: string) {
  return crypto.createHash("sha256").update(input, "utf8").digest("hex");
}

export async function POST(req: Request) {
  try {
    const ua = req.headers.get("user-agent") || "";
    const ip = getClientIP(req) || ""; // we will NOT store raw IP anymore
    const body = await req.json().catch(() => ({}));

    // Expecting { email, zone, ... } — ignore unknown fields
    const emailRaw = (body?.email ?? "").toString().trim();
    const zone = (body?.zone ?? "").toString().trim();

    if (!emailRaw) {
      return NextResponse.json({ ok: false, error: "Email required" }, { status: 400 });
    }

    // Normalize email for dedupe (db has email_lc generated + unique index)
    const emailNorm = emailRaw.toLowerCase();

    // Hash IP for privacy (schema now has ip_hash)
    const ip_hash = ip ? sha256(`${ip}:${HASH_SECRET}`) : null;

    // Optional: capture future attribution (safe if you add columns later)
    // const { searchParams } = new URL(req.url);
    // const utm_source = searchParams.get("utm_source");
    // const utm_medium = searchParams.get("utm_medium");
    // const utm_campaign = searchParams.get("utm_campaign");
    // const referrer = req.headers.get("referer") || "";

    // Idempotent upsert: use onConflict on email_lc (unique)
    const { error } = await supabase
      .from("newsletter")
      .upsert(
        {
          // Keep original email as provided (display), db also stores email_lc generated from it
          email: emailRaw,
          zone: zone || null,
          user_agent: ua || null,
          ip_hash, // <-- write hash only; stop writing raw `ip`

          // If you later add attribution columns, pass them here:
          // utm_source, utm_medium, utm_campaign, referrer,

          // Step 2 scaffolding: default status is 'pending' at insert time via DB default.
          // For duplicates, updated_at is auto-managed by trigger.
        },
        {
          onConflict: "email_lc", // matches the unique index we created
          ignoreDuplicates: false,
        }
      );

    if (error) {
      // Return generic success to avoid leaking whether an email exists
      // but log server-side if you have logging
      return NextResponse.json({ ok: true });
    }

    // Always return the same success payload (idempotent UX)
    return NextResponse.json({ ok: true });
  } catch (e) {
    // Still return generic success so bots can't enumerate
    return NextResponse.json({ ok: true });
  }
}
