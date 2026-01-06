"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

const CART_KEY = "velah:order-cart";

type BottleSize = "5G" | "1L" | "500mL";

type CartItem = {
  size: BottleSize;
  qty: number;
};

const bottleMeta: Record<BottleSize, { label: string; note: string }> = {
  "5G": { label: "5G bottle", note: "Single bottle" },
  "1L": { label: "1L bottle", note: "Single bottle" },
  "500mL": { label: "500 mL (6-pack)", note: "Sold in packs of 6" },
};

function loadLocalCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(CART_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveLocalCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export default function CartPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setUserId(data.session?.user.id ?? null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setUserId(session?.user?.id ?? null);
    });
    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      if (userId) {
        const { data } = await supabase.from("order_carts").select("items").eq("user_id", userId).maybeSingle();
        const remoteItems = (data?.items as CartItem[] | null) || [];
        const localItems = loadLocalCart();
        if (remoteItems.length === 0 && localItems.length > 0) {
          await supabase.from("order_carts").upsert({ user_id: userId, items: localItems }, { onConflict: "user_id" });
          saveLocalCart([]);
          if (active) setCart(localItems);
        } else if (active) {
          setCart(remoteItems);
        }
      } else if (active) {
        setCart(loadLocalCart());
      }
      if (active) setLoading(false);
    };

    load().catch(() => setLoading(false));
    return () => {
      active = false;
    };
  }, [userId]);

  const persistCart = async (items: CartItem[]) => {
    setCart(items);
    if (userId) {
      await supabase.from("order_carts").upsert({ user_id: userId, items }, { onConflict: "user_id" });
    } else {
      saveLocalCart(items);
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("cart:updated", { detail: items }));
    }
  };

  const updateItem = (size: BottleSize, delta: number) => {
    const next = cart.map((item) => {
      if (item.size !== size) return item;
      return { ...item, qty: Math.max(0, item.qty + delta) };
    });
    const exists = next.find((item) => item.size === size);
    if (!exists) {
      next.push({ size, qty: Math.max(0, delta) });
    }
    persistCart(next.filter((item) => item.qty > 0));
  };

  const removeItem = (size: BottleSize) => {
    persistCart(cart.filter((item) => item.size !== size));
  };

  const totalItems = useMemo(() => cart.reduce((sum, item) => sum + item.qty, 0), [cart]);

  return (
    <main className="container mx-auto max-w-4xl px-4 py-16">
      <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Cart</div>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Your cart</h1>
      <p className="mt-2 text-sm text-slate-600">Pricing is coming soon. You can build your order now.</p>

      <div className="mt-10 grid gap-6 md:grid-cols-[1.2fr_.8fr]">
        <div className="space-y-4">
          {loading ? (
            <div className="text-sm text-slate-500">Loading cart…</div>
          ) : cart.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 p-6 text-sm text-slate-600">
              Your cart is empty. Build an AI plan or add bottles.
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.size} className="rounded-2xl border border-slate-200 p-5 flex items-center justify-between gap-4">
                <div>
                  <div className="text-base font-semibold text-slate-900">{bottleMeta[item.size].label}</div>
                  <div className="text-xs text-slate-500">{bottleMeta[item.size].note}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="btn btn-ghost h-9 w-9 rounded-full" onClick={() => updateItem(item.size, -1)}>
                    −
                  </button>
                  <span className="text-sm font-semibold text-slate-900 min-w-[1.5rem] text-center">{item.qty}</span>
                  <button className="btn btn-ghost h-9 w-9 rounded-full" onClick={() => updateItem(item.size, 1)}>
                    +
                  </button>
                  <button className="btn btn-ghost h-9 rounded-full px-3" onClick={() => removeItem(item.size)}>
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 p-6 h-fit">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Items</span>
            <span className="text-sm font-semibold text-slate-900">{totalItems}</span>
          </div>
          <div className="mt-4 text-xs text-slate-500">Pricing will appear once orders open.</div>
          <button className="btn btn-primary h-11 w-full rounded-full mt-6" disabled>
            Checkout (coming soon)
          </button>
          <button
            className="btn btn-ghost h-10 w-full rounded-full mt-3"
            onClick={() => persistCart([])}
            disabled={cart.length === 0}
          >
            Clear cart
          </button>
          <Link href="/subscription" className="mt-4 inline-flex text-sm font-medium text-slate-600 underline">
            Build AI plan →
          </Link>
        </div>
      </div>
    </main>
  );
}
