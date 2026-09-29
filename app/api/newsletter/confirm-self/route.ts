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

    // Confirm an existing opt-in only; never create a subscription the user didn't ask for.
    // email_lc is a generated column (lower(email)), so it can be filtered on but not written.
    const { error } = await supabaseAdmin
      .from("newsletter")
      .update({ status: "confirmed" })
      .eq("email_lc", email)
      .eq("status", "pending");
    if (error) {
      console.error("confirm-self: update failed", error);
      return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
