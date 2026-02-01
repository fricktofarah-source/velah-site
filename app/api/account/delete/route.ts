export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  const auth = req.headers.get("authorization") || "";
  const token = auth.replace("Bearer ", "").trim();

  if (!token) {
    return NextResponse.json({ ok: false, error: "Missing auth token." }, { status: 401 });
  }

  const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
  if (userError || !userData?.user) {
    return NextResponse.json({ ok: false, error: "Invalid session." }, { status: 401 });
  }

  const { error } = await supabaseAdmin.auth.admin.deleteUser(userData.user.id);
  if (error) {
    return NextResponse.json({ ok: false, error: "Could not delete account." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
