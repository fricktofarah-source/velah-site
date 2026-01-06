"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";

const GLASS_ML = 250;
const FIVE_GAL_LITERS = 18.9;
const L_TO_ML = 1000;

const CART_KEY = "velah:order-cart";

type BottleSize = "5G" | "1L" | "500mL";

type CartItem = {
  size: BottleSize;
  qty: number; // 500mL is packs of 6
};

type Suggestion = {
  weeklyLiters: number;
  mix: CartItem[];
  text: string;
};

type Preference = "any" | "only-5g" | "only-1l" | "only-500";

const bottleMeta: Record<BottleSize, { label: string; packSize: number }> = {
  "5G": { label: "5G bottle", packSize: 1 },
  "1L": { label: "1L bottle", packSize: 1 },
  "500mL": { label: "500 mL (6-pack)", packSize: 6 },
};

function formatSizeLabel(size: BottleSize) {
  return size === "500mL" ? "500 mL (6-pack)" : size;
}

function toPacks(qty: number) {
  return Math.max(0, Math.ceil(qty / 6));
}

function suggestMix(weeklyLiters: number, preference: Preference): CartItem[] {
  let need = Math.max(0, Math.round(weeklyLiters * L_TO_ML));
  const mix: Record<BottleSize, number> = { "5G": 0, "1L": 0, "500mL": 0 };
  const fiveGml = Math.round(FIVE_GAL_LITERS * L_TO_ML);

  if (preference === "only-5g") {
    mix["5G"] = Math.max(1, Math.ceil(need / fiveGml));
  } else if (preference === "only-1l") {
    mix["1L"] = Math.max(1, Math.ceil(need / 1000));
  } else if (preference === "only-500") {
    const bottles = Math.max(1, Math.ceil(need / 500));
    mix["500mL"] = toPacks(bottles);
  } else {
    if (weeklyLiters >= 20) {
      mix["5G"] = Math.floor(need / fiveGml);
      need -= mix["5G"] * fiveGml;
    } else if (weeklyLiters >= 10) {
      mix["5G"] = 1;
      need = Math.max(0, need - fiveGml);
    }

    if (need > 0) {
      mix["1L"] = Math.floor(need / 1000);
      need -= mix["1L"] * 1000;
    }

    if (need > 0) {
      const bottles = Math.ceil(need / 500);
      mix["500mL"] = toPacks(bottles);
      need = 0;
    }
  }

  return (Object.entries(mix) as [BottleSize, number][])
    .filter(([, q]) => q > 0)
    .map(([size, qty]) => ({ size, qty }));
}

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

export default function OrderBuilder() {
  const reduceMotion = useReducedMotion();
  const fadeUp = {
    initial: reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduceMotion ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  };
  const [userId, setUserId] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loadingCart, setLoadingCart] = useState(true);

  // AI inputs
  const [people, setPeople] = useState(2);
  const [glassesPerPerson, setGlassesPerPerson] = useState(8);
  const [cooking, setCooking] = useState(false);
  const [sparkling, setSparkling] = useState(false);
  const [preference, setPreference] = useState<Preference>("any");

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
    const loadCart = async () => {
      setLoadingCart(true);
      if (userId) {
        const { data } = await supabase
          .from("order_carts")
          .select("items")
          .eq("user_id", userId)
          .maybeSingle();
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
      if (active) setLoadingCart(false);
    };

    loadCart().catch(() => setLoadingCart(false));
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
      const nextQty = Math.max(0, item.qty + delta);
      return { ...item, qty: nextQty };
    });
    const existing = next.find((item) => item.size === size);
    if (!existing) {
      next.push({ size, qty: Math.max(0, delta) });
    }
    const cleaned = next.filter((item) => item.qty > 0);
    persistCart(cleaned.map((item) => ({ ...item, qty: Math.max(0, item.qty) })));
  };

  const applyRecommendation = (mix: CartItem[]) => {
    persistCart(mix);
  };

  const suggestion: Suggestion = useMemo(() => {
    let dailyLiters = people * glassesPerPerson * (GLASS_ML / 1000);
    if (cooking) dailyLiters += people * 0.3;
    if (sparkling) dailyLiters += people * 0.2;

    const weeklyLiters = Math.ceil(dailyLiters * 7 * 10) / 10;
    const mix = suggestMix(weeklyLiters, preference);

    const text =
      weeklyLiters >= 20
        ? "High usage household. Mostly 5G with top-ups."
        : weeklyLiters >= 10
        ? "Balanced usage. One 5G plus smaller bottles."
        : "Light usage. Smaller bottles keep it flexible.";

    return { weeklyLiters, mix, text };
  }, [people, glassesPerPerson, cooking, sparkling, preference]);

  const weeklyLitersLabel = useMemo(() => {
    const rounded = Number.isInteger(suggestion.weeklyLiters)
      ? suggestion.weeklyLiters.toFixed(0)
      : suggestion.weeklyLiters.toFixed(1);
    return rounded;
  }, [suggestion.weeklyLiters]);

  const cartSummary = useMemo(() => {
    const totalLiters = cart.reduce((sum, item) => {
      if (item.size === "5G") return sum + item.qty * FIVE_GAL_LITERS;
      if (item.size === "1L") return sum + item.qty * 1;
      return sum + item.qty * 6 * 0.5;
    }, 0);
    return { totalLiters };
  }, [cart]);

  return (
    <div className="space-y-10">
      <motion.section {...fadeUp} className="grid gap-6 md:grid-cols-[1.1fr_.9fr]">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">AI weekly recommendation</h2>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Weekly</span>
          </div>
          <p className="mt-2 text-sm text-slate-600">Tell us about your routine and we’ll suggest a weekly order.</p>

          <div className="mt-4 grid gap-4">
            <label className="text-sm">
              Household size
              <input
                type="number"
                min={1}
                className="mt-1 w-full border rounded-2xl px-3 py-2"
                value={people}
                onChange={(e) => setPeople(Math.max(1, Number(e.target.value)))}
              />
            </label>

            <label className="text-sm">
              Glasses per person per day
              <input
                type="number"
                min={1}
                className="mt-1 w-full border rounded-2xl px-3 py-2"
                value={glassesPerPerson}
                onChange={(e) => setGlassesPerPerson(Math.max(1, Number(e.target.value)))}
              />
            </label>

            <div className="flex flex-wrap items-center gap-4">
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" checked={cooking} onChange={(e) => setCooking(e.target.checked)} />
                Cooking or tea
              </label>
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" checked={sparkling} onChange={(e) => setSparkling(e.target.checked)} />
                Also sparkling
              </label>
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Bottle preference</div>
              <div className="mt-2 grid gap-2 text-sm">
                <label className="inline-flex items-center gap-2">
                  <input type="radio" name="pref" checked={preference === "any"} onChange={() => setPreference("any")} />
                  No preference (mix all)
                </label>
                <label className="inline-flex items-center gap-2">
                  <input type="radio" name="pref" checked={preference === "only-5g"} onChange={() => setPreference("only-5g")} />
                  Only 5G bottles
                </label>
                <label className="inline-flex items-center gap-2">
                  <input type="radio" name="pref" checked={preference === "only-1l"} onChange={() => setPreference("only-1l")} />
                  Only 1L bottles
                </label>
                <label className="inline-flex items-center gap-2">
                  <input type="radio" name="pref" checked={preference === "only-500"} onChange={() => setPreference("only-500")} />
                  Only 500 mL (6-packs)
                </label>
              </div>
            </div>

            <p className="text-xs text-slate-500">Pricing is coming soon. You can still build your cart today.</p>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold">Suggested weekly mix</h3>
          <p className="mt-2 text-sm text-slate-600">{suggestion.text}</p>

          <div className="mt-4 space-y-3">
            {suggestion.mix.map((item) => (
              <div key={item.size} className="flex items-center justify-between">
                <span className="text-sm text-slate-700">{formatSizeLabel(item.size)}</span>
                <span className="text-sm font-semibold text-slate-900">{item.qty}</span>
              </div>
            ))}
            <div className="text-xs text-slate-500">Weekly total: {weeklyLitersLabel} L</div>
          </div>

          <button
            type="button"
            onClick={() => applyRecommendation(suggestion.mix)}
            className="btn btn-primary mt-6 h-11 w-full rounded-full"
          >
            Add recommendation to cart
          </button>
        </div>
      </motion.section>

      <motion.section {...fadeUp} transition={{ ...fadeUp.transition, delay: reduceMotion ? 0 : 0.05 }} className="grid gap-6 md:grid-cols-[1.1fr_.9fr]">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Individual bottles</h3>
            <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Order based</span>
          </div>
          <div className="mt-4 grid gap-3">
            {(["5G", "1L", "500mL"] as BottleSize[]).map((size) => (
              <div key={size} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900">{bottleMeta[size].label}</div>
                  <div className="text-xs text-slate-500">
                    {size === "500mL" ? "Sold in packs of 6" : "Single bottle"}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="btn btn-ghost h-9 w-9 rounded-full"
                    onClick={() => updateItem(size, -1)}
                  >
                    −
                  </button>
                  <span className="text-sm font-semibold text-slate-900">
                    {cart.find((item) => item.size === size)?.qty ?? 0}
                  </span>
                  <button
                    type="button"
                    className="btn btn-ghost h-9 w-9 rounded-full"
                    onClick={() => updateItem(size, 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Your cart</h3>
            {loadingCart ? <span className="text-xs text-slate-400">Loading</span> : null}
          </div>
          <div className="mt-4 space-y-3">
            {cart.length === 0 ? (
              <p className="text-sm text-slate-500">Your cart is empty. Add a recommendation or bottles.</p>
            ) : (
              cart.map((item) => (
                <div key={item.size} className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">{formatSizeLabel(item.size)}</span>
                  <span className="text-sm font-semibold text-slate-900">{item.qty}</span>
                </div>
              ))
            )}
          </div>
          <div className="mt-5 border-t border-slate-100 pt-4 text-sm text-slate-600">
            Estimated volume: {cartSummary.totalLiters.toFixed(1)} L
          </div>
          <button type="button" className="btn btn-primary mt-4 h-11 w-full rounded-full" disabled={cart.length === 0}>
            Add to cart
          </button>
          <button
            type="button"
            className="btn btn-ghost mt-3 h-10 w-full rounded-full"
            onClick={() => persistCart([])}
            disabled={cart.length === 0}
          >
            Clear cart
          </button>
        </div>
      </motion.section>
    </div>
  );
}
