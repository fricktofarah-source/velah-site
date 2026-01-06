"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { useLanguage } from "@/components/LanguageProvider";

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

function toPacks(qty: number) {
  return Math.max(0, Math.ceil(qty / 6));
}

function suggestMix(weeklyLiters: number, allowedSizes: BottleSize[]): CartItem[] {
  let need = Math.max(0, Math.round(weeklyLiters * L_TO_ML));
  const mix: Record<BottleSize, number> = { "5G": 0, "1L": 0, "500mL": 0 };
  const fiveGml = Math.round(FIVE_GAL_LITERS * L_TO_ML);
  const allow = new Set(allowedSizes.length ? allowedSizes : (["5G", "1L", "500mL"] as BottleSize[]));

  if (allow.has("5G") && weeklyLiters >= 10) {
    const base = weeklyLiters >= 20 ? Math.floor(need / fiveGml) : 1;
    mix["5G"] = Math.max(allow.size === 1 ? 1 : 0, base);
    need = Math.max(0, need - mix["5G"] * fiveGml);
  } else if (allow.size === 1 && allow.has("5G")) {
    mix["5G"] = Math.max(1, Math.ceil(need / fiveGml));
    need = 0;
  }

  if (need > 0 && allow.has("1L")) {
    if (allow.size === 1) {
      mix["1L"] = Math.max(1, Math.ceil(need / 1000));
      need = 0;
    } else {
      mix["1L"] = Math.floor(need / 1000);
      need -= mix["1L"] * 1000;
    }
  }

  if (need > 0 && allow.has("500mL")) {
    const bottles = Math.max(1, Math.ceil(need / 500));
    mix["500mL"] = toPacks(bottles);
    need = 0;
  }

  if (need > 0 && allow.has("1L")) {
    mix["1L"] = Math.max(mix["1L"], Math.ceil(need / 1000));
    need = 0;
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
  const { t } = useLanguage();
  const copy = t.orderBuilder;
  const bottleMeta: Record<BottleSize, { label: string; note: string; packSize: number }> = {
    "5G": { label: copy.preferenceOptions.fiveG, note: copy.singleNote, packSize: 1 },
    "1L": { label: copy.preferenceOptions.oneL, note: copy.singleNote, packSize: 1 },
    "500mL": { label: copy.preferenceOptions.fiveHund, note: copy.packNote, packSize: 6 },
  };
  const formatSizeLabel = (size: BottleSize) => bottleMeta[size]?.label ?? size;
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
  const [preferredSizes, setPreferredSizes] = useState<BottleSize[]>(["5G", "1L", "500mL"]);
  const [selection, setSelection] = useState<Record<BottleSize, number>>({
    "5G": 0,
    "1L": 0,
    "500mL": 0,
  });
  const [cartNotice, setCartNotice] = useState<CartItem[] | null>(null);

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

  const updateSelection = (size: BottleSize, delta: number) => {
    setSelection((prev) => ({ ...prev, [size]: Math.max(0, prev[size] + delta) }));
  };

  const mergeIntoCart = (items: CartItem[]) => {
    const next = new Map<BottleSize, number>();
    cart.forEach((item) => next.set(item.size, (next.get(item.size) ?? 0) + item.qty));
    items.forEach((item) => next.set(item.size, (next.get(item.size) ?? 0) + item.qty));
    return Array.from(next.entries()).map(([size, qty]) => ({ size, qty }));
  };

  const applyRecommendation = (mix: CartItem[]) => {
    persistCart(mergeIntoCart(mix));
    setCartNotice(mix);
  };

  const addSelectionToCart = () => {
    const additions = (Object.entries(selection) as [BottleSize, number][])
      .filter(([, qty]) => qty > 0)
      .map(([size, qty]) => ({ size, qty }));
    if (additions.length === 0) return;
    persistCart(mergeIntoCart(additions));
    setSelection({ "5G": 0, "1L": 0, "500mL": 0 });
    setCartNotice(additions);
  };

  const suggestion: Suggestion = useMemo(() => {
    let dailyLiters = people * glassesPerPerson * (GLASS_ML / 1000);
    if (cooking) dailyLiters += people * 0.3;

    const weeklyLiters = Math.ceil(dailyLiters * 7 * 10) / 10;
    const mix = suggestMix(weeklyLiters, preferredSizes);

    const text =
      weeklyLiters >= 20
        ? copy.suggestionHigh
        : weeklyLiters >= 10
        ? copy.suggestionMid
        : copy.suggestionLow;

    return { weeklyLiters, mix, text };
  }, [people, glassesPerPerson, cooking, preferredSizes, copy]);

  const weeklyLitersLabel = useMemo(() => {
    const rounded = Number.isInteger(suggestion.weeklyLiters)
      ? suggestion.weeklyLiters.toFixed(0)
      : suggestion.weeklyLiters.toFixed(1);
    return rounded;
  }, [suggestion.weeklyLiters]);

  const selectedCount = useMemo(
    () => Object.values(selection).reduce((sum, qty) => sum + qty, 0),
    [selection]
  );

  return (
    <div className="space-y-10">
      <motion.section {...fadeUp} className="grid gap-6 md:grid-cols-[1.1fr_.9fr]">
        <div className="card p-6">
          <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{copy.aiTitle}</h2>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{copy.aiBadge}</span>
          </div>
          <p className="mt-2 text-sm text-slate-600">{copy.aiIntro}</p>

          <div className="mt-4 grid gap-4">
            <label className="text-sm">
              {copy.householdLabel}
              <input
                type="number"
                min={1}
                className="mt-1 w-full border rounded-2xl px-3 py-2"
                value={people}
                onChange={(e) => setPeople(Math.max(1, Number(e.target.value)))}
              />
            </label>

            <label className="text-sm">
              {copy.glassesLabel}
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
                {copy.cookingLabel}
              </label>
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{copy.preferenceLabel}</div>
              <div className="mt-2 grid gap-2 text-sm">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={preferredSizes.includes("5G")}
                    onChange={(e) => {
                      const next = (e.target.checked
                        ? [...preferredSizes, "5G"]
                        : preferredSizes.filter((size) => size !== "5G")) as BottleSize[];
                      if (next.length === 0) return;
                      setPreferredSizes(next);
                    }}
                  />
                  {copy.preferenceOptions.fiveG}
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={preferredSizes.includes("1L")}
                    onChange={(e) => {
                      const next = (e.target.checked
                        ? [...preferredSizes, "1L"]
                        : preferredSizes.filter((size) => size !== "1L")) as BottleSize[];
                      if (next.length === 0) return;
                      setPreferredSizes(next);
                    }}
                  />
                  {copy.preferenceOptions.oneL}
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={preferredSizes.includes("500mL")}
                    onChange={(e) => {
                      const next = (e.target.checked
                        ? [...preferredSizes, "500mL"]
                        : preferredSizes.filter((size) => size !== "500mL")) as BottleSize[];
                      if (next.length === 0) return;
                      setPreferredSizes(next);
                    }}
                  />
                  {copy.preferenceOptions.fiveHund}
                </label>
              </div>
            </div>

            <p className="text-xs text-slate-500">{copy.pricingNote}</p>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold">{copy.suggestedTitle}</h3>
          <p className="mt-2 text-sm text-slate-600">{suggestion.text}</p>

          <div className="mt-4 space-y-3">
            {suggestion.mix.map((item) => (
              <div key={item.size} className="flex items-center justify-between">
                <span className="text-sm text-slate-700">{formatSizeLabel(item.size)}</span>
                <span className="text-sm font-semibold text-slate-900">{item.qty}</span>
              </div>
            ))}
            <div className="text-xs text-slate-500">
              {copy.weeklyTotalLabel}: {weeklyLitersLabel} L
            </div>
          </div>

          <div className="mt-6 grid gap-3">
            <button
              type="button"
              onClick={() => applyRecommendation(suggestion.mix)}
              className="btn btn-primary h-11 w-full rounded-full"
            >
              {copy.addPlanCta}
            </button>
          </div>
        </div>
      </motion.section>

      {cartNotice && (
        <div className="fixed right-6 bottom-6 z-40 w-[18rem] rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.18)] backdrop-blur">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-slate-900">{copy.toastTitle}</div>
              <div className="mt-1 space-y-1 text-xs text-slate-500">
                {cartNotice.map((item) => (
                  <div key={item.size}>
                    {formatSizeLabel(item.size)} × {item.qty}
                  </div>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setCartNotice(null)}
              className="text-slate-400 hover:text-slate-700"
              aria-label="Close"
            >
              ×
            </button>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <button
              type="button"
              className="text-xs font-semibold text-slate-500 hover:text-slate-700"
              onClick={() => setCartNotice(null)}
            >
              {copy.toastContinue}
            </button>
            <a href="/cart" className="text-xs font-semibold text-slate-700 underline">
              {copy.toastViewCart}
            </a>
          </div>
        </div>
      )}

      <motion.section {...fadeUp} transition={{ ...fadeUp.transition, delay: reduceMotion ? 0 : 0.05 }}>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{copy.individualTitle}</h3>
            <span className="text-xs uppercase tracking-[0.2em] text-slate-400">{copy.individualBadge}</span>
          </div>
          <div className="mt-4 grid gap-3">
            {(["5G", "1L", "500mL"] as BottleSize[]).map((size) => (
              <div key={size} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900">{bottleMeta[size].label}</div>
                  <div className="text-xs text-slate-500">
                    {bottleMeta[size].note}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="btn btn-ghost h-9 w-9 rounded-full"
                    onClick={() => updateSelection(size, -1)}
                  >
                    −
                  </button>
                  <span className="text-sm font-semibold text-slate-900">
                    {selection[size]}
                  </span>
                  <button
                    type="button"
                    className="btn btn-ghost h-9 w-9 rounded-full"
                    onClick={() => updateSelection(size, 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              {copy.selectedLabel}: <span className="text-slate-900 font-semibold">{selectedCount}</span>
            </div>
            <button
              type="button"
              className="btn btn-primary h-11 rounded-full px-6"
              onClick={addSelectionToCart}
              disabled={selectedCount === 0}
            >
              {copy.addBottlesCta}
            </button>
          </div>
          {loadingCart ? <div className="mt-3 text-xs text-slate-400">{copy.syncingLabel}</div> : null}
        </div>
      </motion.section>
    </div>
  );
}
