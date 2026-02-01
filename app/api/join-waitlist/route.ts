// app/api/join-waitlist/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { joinWaitlist } from "@/lib/waitlist";

export async function POST(req: Request) {
  try {
    const ct = req.headers.get("content-type") || "";
    const isJson = ct.includes("application/json");
    const body = isJson ? await req.json().catch(() => ({})) : {};
    const email = String(body.email || "").trim().toLowerCase();
    const zone = (body.zone || "").toString().slice(0, 120) || null;
    const noEmail = Boolean(body.noEmail);
    const name = (body.name || "").toString().slice(0, 120) || null;
    const userAgent = req.headers.get("user-agent") || null;
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;

    const result = await joinWaitlist({ email, zone, noEmail, name, userAgent, ip });

    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    }
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
