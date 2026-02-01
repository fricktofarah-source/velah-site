// app/api/newsletter/confirm-self/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  try {
    const auth = req.headers.get("authorization") || "";
    const token = auth.toLowerCase().startsWith("bearer ") ? auth.slice(7) : "";

    if (!token) {
      return NextResponse.json({ ok: false, error: "Missing token" }, { status: 401 });
    }

    // Use anon key to validate the JWT and get the user
    const { data: userRes, error: userErr } = await supabaseServer.auth.getUser(token);
    if (userErr || !userRes?.user?.email) {
      return NextResponse.json({ ok: false, error: "Invalid session" }, { status: 401 });
    }

    const email = userRes.user.email.toLowerCase();

    // Promote newsletter -> confirmed
    await supabaseAdmin
      .from("newsletter")
      .upsert(
        { email, email_lc: email, status: "confirmed" },
        { onConflict: "email_lc" }
      );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
