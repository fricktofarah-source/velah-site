// app/api/auth-signup/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

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

    // Admin client (service role) — server-only
    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    // Create user (do NOT auto-confirm; Supabase will email confirm if enabled)
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      user_metadata: { full_name: name },
      email_confirm: false,
    });

    if (error) {
      // Normalize a few common messages
      const m = (error.message || "").toLowerCase();
      if (m.includes("user already registered") || m.includes("already exists")) {
        return NextResponse.json({ ok: false, error: "An account with this email already exists. Try signing in." }, { status: 400 });
      }
      if (m.includes("password")) {
        return NextResponse.json({ ok: false, error: "Password must be at least 6 characters." }, { status: 400 });
      }
      return NextResponse.json({ ok: false, error: "Couldn’t create the account. Please try again." }, { status: 400 });
    }

    // Optional: also add to newsletter (best-effort, ignore errors)
    if (joinList) {
      try {
        await fetch(new URL("/api/join-waitlist", process.env.WAITLIST_CONFIRM_BASE_URL || "https://drinkvelah.com"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
      } catch {}
    }

    return NextResponse.json({ ok: true, userId: data.user?.id ?? null });
  } catch {
    return NextResponse.json({ ok: false, error: "Server error. Please try again." }, { status: 500 });
  }
}
