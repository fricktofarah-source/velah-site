import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type SubscriptionKeys = {
  p256dh: string;
  auth: string;
};

type PushSubscriptionPayload = {
  endpoint: string;
  keys: SubscriptionKeys;
};

export async function POST(request: Request) {
  try {
    const { subscription, token }: { subscription?: PushSubscriptionPayload; token?: string } = await request.json();
    if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
      return NextResponse.json({ error: "Missing subscription" }, { status: 400 });
    }
    if (!token) {
      return NextResponse.json({ error: "Missing session token" }, { status: 401 });
    }

    const { data: userData, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !userData?.user) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const { id: user_id } = userData.user;

    const { error } = await supabaseAdmin
      .from("push_subscriptions")
      .upsert(
        {
          user_id,
          endpoint: subscription.endpoint,
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
        },
        { onConflict: "endpoint" }
      );

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to save subscription" }, { status: 500 });
  }
}
