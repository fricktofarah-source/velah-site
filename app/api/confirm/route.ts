// app/api/confirm/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const BASE_URL = process.env.WAITLIST_CONFIRM_BASE_URL || "https://drinkvelah.com";
const EXP_HOURS = Number(process.env.WAITLIST_CONFIRM_EXP_HOURS || 24);

export async function GET(req: Request) {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  if (!token) {
    return NextResponse.redirect(`${BASE_URL}/confirm/invalid`);
  }

  // Find pending row with matching token that is not expired
  const { data: rows, error } = await supabase
    .from("newsletter")
    .select("id, confirmation_sent_at, status")
    .eq("confirmation_token", token)
    .limit(1);

  if (error || !rows || rows.length === 0) {
    return NextResponse.redirect(`${BASE_URL}/confirm/invalid`);
  }

  const row = rows[0];
  const sentAt = row.confirmation_sent_at ? new Date(row.confirmation_sent_at) : null;
  const expiresAt = sentAt ? new Date(sentAt.getTime() + EXP_HOURS * 3600_000) : null;
  const now = new Date();

  if (!sentAt || !expiresAt || now > expiresAt) {
    return NextResponse.redirect(`${BASE_URL}/confirm/invalid?reason=expired`);
  }

  // If already confirmed, still send success
  if (row.status === "confirmed") {
    return NextResponse.redirect(`${BASE_URL}/confirm/success`);
  }

  // Flip to confirmed and clear token
  await supabase
    .from("newsletter")
    .update({ status: "confirmed", confirmation_token: null })
    .eq("id", row.id);

  return NextResponse.redirect(`${BASE_URL}/confirm/success`);
}
