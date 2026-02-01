// app/api/confirm/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const BASE_URL = process.env.WAITLIST_CONFIRM_BASE_URL;
const EXP_HOURS = process.env.WAITLIST_CONFIRM_EXP_HOURS;

if (!BASE_URL || !EXP_HOURS) {
  throw new Error("Missing WAITLIST_CONFIRM_BASE_URL or WAITLIST_CONFIRM_EXP_HOURS");
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  if (!token) {
    return NextResponse.redirect(`${BASE_URL}/confirm/invalid`);
  }

  // Find pending row with matching token that is not expired
  const { data: rows, error } = await supabaseAdmin
    .from("newsletter")
    .select("id, confirmation_sent_at, status")
    .eq("confirmation_token", token)
    .limit(1);

  if (error || !rows || rows.length === 0) {
    return NextResponse.redirect(`${BASE_URL}/confirm/invalid`);
  }

  const row = rows[0];
  const sentAt = row.confirmation_sent_at ? new Date(row.confirmation_sent_at) : null;
  const expiresAt = sentAt ? new Date(sentAt.getTime() + Number(EXP_HOURS) * 3600_000) : null;
  const now = new Date();

  if (!sentAt || !expiresAt || now > expiresAt) {
    return NextResponse.redirect(`${BASE_URL}/confirm/invalid?reason=expired`);
  }

  // If already confirmed, still send success
  if (row.status === "confirmed") {
    return NextResponse.redirect(`${BASE_URL}/confirm/success`);
  }

  // Flip to confirmed and clear token
  await supabaseAdmin
    .from("newsletter")
    .update({ status: "confirmed", confirmation_token: null })
    .eq("id", row.id);

  return NextResponse.redirect(`${BASE_URL}/confirm/success`);
}
