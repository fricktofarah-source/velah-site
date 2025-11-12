// components/Subscription.tsx
"use client";
import { useMemo, useState, useEffect, type Dispatch, type SetStateAction } from "react";

type MixSize = "500mL" | "1L" | "5G";
type MixItem = { size: MixSize; qty: number };
type Suggestion = {
  weeklyLiters: number;
  mix: MixItem[];
  text: string;
};

const GLASS_ML = 250;          // avg glass in ml
const FIVE_GAL_LITERS = 18.9;  // 5 gallon in liters
const L_TO_ML = 1000;

const PRICE = {
  "500mL": 4,   // placeholder
  "1L": 7,
  "5G": 28,
  deposit500mL: 4, // placeholder
  deposit1L: 8,
  deposit5G: 40,
} as const;

/** Greedy + threshold rule:
 *  - ≥20 L -> use floor(need/5G), then 1L, then 500mL (ceil on smallest to cover remainder)
 *  - 10–19.9 L -> start with 1×5G, then 1L, then 500mL
 *  - <10 L -> 1L then 500mL
 */
function suggestMix(weeklyLiters: number): MixItem[] {
  let need = Math.max(0, Math.round(weeklyLiters * L_TO_ML)); // in mL
  const mix: Record<MixSize, number> = { "5G": 0, "1L": 0, "500mL": 0 };

  const fiveGml = Math.round(FIVE_GAL_LITERS * L_TO_ML); // 18900 mL

  if (weeklyLiters >= 20) {
    mix["5G"] = Math.floor(need / fiveGml);
    need -= mix["5G"] * fiveGml;
  } else if (weeklyLiters >= 10) {
    mix["5G"] = 1;
    need = Math.max(0, need - fiveGml);
  }

  // use 1L greedily next
  if (need > 0) {
    mix["1L"] = Math.floor(need / 1000);
    need -= mix["1L"] * 1000;
  }

  // finish with 500 mL (ceil to cover remainder)
  if (need > 0) {
    mix["500mL"] = Math.ceil(need / 500);
    need = 0;
  }

  // pack into list, dropping zeros
  return (Object.entries(mix) as [MixSize, number][])
    .filter(([, q]) => q > 0)
    .map(([size, qty]) => ({ size, qty }));
}

export default function Subscription({ compact = false }: { compact?: boolean }) {
  // Inputs
  const [people, setPeople] = useState(2);
  const [glassesPerPerson, setGlassesPerPerson] = useState(8); // per day
  const [cooking, setCooking] = useState(false);
  const [sparkling, setSparkling] = useState(false);

  // Pricing (AED) — placeholders

  // AI suggestion
  const suggestion: Suggestion = useMemo(() => {
    let dailyLiters = people * glassesPerPerson * (GLASS_ML / 1000);
    if (cooking) dailyLiters += people * 0.3;
    if (sparkling) dailyLiters += people * 0.2;

    const weeklyLiters = Math.ceil(dailyLiters * 7 * 10) / 10;

    const mix = suggestMix(weeklyLiters);

    const text =
      weeklyLiters >= 20
        ? "High usage household. Mostly 5 gallon with 1L and 500 mL top-ups."
        : weeklyLiters >= 10
        ? "Balanced usage. One 5 gallon plus some 1L/500 mL feels right."
        : "Light usage. 1L with 500 mL top-ups keeps things flexible.";

    return { weeklyLiters, mix, text };
  }, [people, glassesPerPerson, cooking, sparkling]);

  // Edit mode
  const [mode, setMode] = useState<"ai" | "custom">("ai");
  const [fiveG, setFiveG] = useState(0);
  const [oneL, setOneL] = useState(0);
  const [fiveHund, setFiveHund] = useState(0); // 500 mL count

  // When switching to custom, initialize counters from AI suggestion
  useEffect(() => {
    if (mode === "custom") {
      const s1 = suggestion.mix.find((m) => m.size === "1L")?.qty ?? 0;
      const s5 = suggestion.mix.find((m) => m.size === "5G")?.qty ?? 0;
      const sH = suggestion.mix.find((m) => m.size === "500mL")?.qty ?? 0;
      setOneL(s1);
      setFiveG(s5);
      setFiveHund(sH);
    }
  }, [mode, suggestion]);

  // Optional: read a preselected bottle from Bottles ("velah:preselect")
  // Supports keys: "5g", "1l", "500ml"
  useEffect(() => {
    try {
      const raw = localStorage.getItem("velah:preselect") as "5g" | "1l" | "500ml" | null;
      if (!raw) return;
      localStorage.removeItem("velah:preselect");
      setMode("custom");
      setTimeout(() => {
        if (raw === "5g") setFiveG((v) => Math.max(1, v));
        else if (raw === "500ml") setFiveHund((v) => Math.max(1, v));
        else setOneL((v) => Math.max(1, v));
      }, 0);
    } catch {}
  }, []);

  const mixForPricing: MixItem[] = useMemo(() => {
    if (mode === "ai") return suggestion.mix;
    const rows: MixItem[] = [];
    if (fiveG > 0) rows.push({ size: "5G", qty: fiveG });
    if (oneL > 0) rows.push({ size: "1L", qty: oneL });
    if (fiveHund > 0) rows.push({ size: "500mL", qty: fiveHund });
    if (rows.length === 0) rows.push({ size: "1L", qty: 0 }); // keep UI stable
    return rows;
  }, [mode, suggestion.mix, oneL, fiveG, fiveHund]);

  const weeklyCost = useMemo(
    () =>
      mixForPricing.reduce((sum, m) => {
        if (m.size === "5G") return sum + PRICE["5G"] * m.qty;
        if (m.size === "1L") return sum + PRICE["1L"] * m.qty;
        return sum + PRICE["500mL"] * m.qty;
      }, 0),
    [mixForPricing]
  );

  const depositTotal = useMemo(
    () =>
      mixForPricing.reduce((sum, m) => {
        if (m.size === "5G") return sum + PRICE.deposit5G * m.qty;
        if (m.size === "1L") return sum + PRICE.deposit1L * m.qty;
        return sum + PRICE.deposit500mL * m.qty;
      }, 0),
    [mixForPricing]
  );

  

  // helpers
  const clamp = (n: number) => Math.max(0, Math.min(99, Math.floor(n || 0)));
  const step = (setter: Dispatch<SetStateAction<number>>, dir: 1 | -1) =>
    setter((prev: number) => clamp(prev + dir));

  return (
    <div className={compact ? "grid gap-6" : "grid gap-8 md:grid-cols-2 items-start"}>
      {/* Inputs */}
      <div className={`card ${compact ? "p-4" : "p-6"}`}>
        {/* Slim step header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Tell us about your week</h3>
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-semibold uppercase tracking-[0.2em]">
            <span>1 · Choose</span>
            <span>2 · Plan</span>
            <span>3 · Join</span>
          </div>
        </div>

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
              I use Velah for cooking or tea
            </label>
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={sparkling} onChange={(e) => setSparkling(e.target.checked)} />
              I also buy sparkling
            </label>
          </div>

          <div className="text-xs text-slate-500">Change or skip any week. This just sizes your starting plan.</div>
        </div>
      </div>

      {/* Plan + Edit */}
      <div className={`card ${compact ? "p-4" : "p-6"}`}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Your weekly plan</h3>

          {/* Mode switch */}
          <div className="flex items-center gap-2">
            <button
              className={[
                "btn btn-no-arrow h-8 px-3 text-sm border",
                mode === "ai"
                  ? "bg-[var(--velah)] text-slate-900 border-[var(--velah)] hover:bg-[#68bac8]"
                  : "bg-white text-slate-700 hover:bg-slate-100"
              ].join(" ")}
              onClick={() => setMode("ai")}
            >
              AI
            </button>
            <button
              className={[
                "btn btn-no-arrow h-8 px-3 text-sm border",
                mode === "custom"
                  ? "bg-[var(--velah)] text-slate-900 border-[var(--velah)] hover:bg-[#68bac8]"
                  : "bg-white text-slate-700 hover:bg-slate-100"
              ].join(" ")}
              onClick={() => setMode("custom")}
            >
              Edit
            </button>
          </div>
        </div>

        {mode === "ai" ? (
          <>
            <p className="mt-2 text-slate-600">{suggestion.text}</p>

            <div className="mt-4 rounded-2xl border">
              <div className="grid grid-cols-1 sm:grid-cols-3 text-sm">
                <div className="p-4 border-b sm:border-b-0 sm:border-r">
                  <div className="text-slate-500">Estimated need</div>
                  <div className="mt-1 font-semibold">{suggestion.weeklyLiters.toFixed(1)} L per week</div>
                </div>
                <div className="p-4 border-b sm:border-b-0 sm:border-r">
                  <div className="text-slate-500">Mix</div>
                  <div className="mt-1 font-semibold">
                    {suggestion.mix.map((m, i) => (
                      <span key={i} className="inline-block mr-2">
                        {m.qty}× {m.size === "500mL" ? "500 mL" : m.size}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-slate-500">Weekly total</div>
                  <div className="mt-1 font-semibold">AED {weeklyCost}</div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <p className="mt-2 text-slate-600">Set exactly how many bottles you want this week.</p>

            {/* Editable counters */}
            <div className="mt-4 grid sm:grid-cols-3 gap-3">
              {/* 5G */}
              <CounterRow
                label="5 gallon (18.9L)"
                value={fiveG}
                onDec={() => step(setFiveG, -1)}
                onInc={() => step(setFiveG, +1)}
                onInput={(n) => setFiveG(clamp(n))}
              />
              {/* 1L */}
              <CounterRow
                label="1 liter"
                value={oneL}
                onDec={() => step(setOneL, -1)}
                onInc={() => step(setOneL, +1)}
                onInput={(n) => setOneL(clamp(n))}
              />
              {/* 500 mL */}
              <CounterRow
                label="500 mL"
                value={fiveHund}
                onDec={() => step(setFiveHund, -1)}
                onInc={() => step(setFiveHund, +1)}
                onInput={(n) => setFiveHund(clamp(n))}
              />
            </div>

            {/* Totals */}
            <div className="mt-4 rounded-2xl border">
              <div className="grid grid-cols-1 sm:grid-cols-3 text-sm">
                <div className="p-4 border-b sm:border-b-0 sm:border-r">
                  <div className="text-slate-500">Your mix</div>
                  <div className="mt-1 font-semibold">
                    {[
                      fiveG ? `${fiveG}× 5G` : "",
                      oneL ? `${oneL}× 1L` : "",
                      fiveHund ? `${fiveHund}× 500 mL` : "",
                    ]
                      .filter(Boolean)
                      .join(" • ") || "0 bottles"}
                  </div>
                </div>
                <div className="p-4 border-b sm:border-b-0 sm:border-r">
                  <div className="text-slate-500">Weekly total</div>
                  <div className="mt-1 font-semibold">AED {weeklyCost}</div>
                </div>
                <div className="p-4">
                  <div className="text-slate-500">Deposit</div>
                  <div className="mt-1 font-semibold">AED {depositTotal}</div>
                </div>
              </div>
            </div>

            {/* Reset to AI */}
            <div className="mt-3">
              <button type="button" className="btn btn-ghost btn-no-arrow h-9 px-3 rounded-full" onClick={() => setMode("ai")}>
                Reset to AI suggestion
              </button>
            </div>
          </>
        )}

        {/* Actions */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            className="btn btn-primary h-11 px-5 rounded-full"
            onClick={() => window.dispatchEvent(new CustomEvent("subscription:apply", { detail: {
              bottles_5g: suggestion.mix.find((m) => m.size === "5G")?.qty || 0,
              bottles_1l: suggestion.mix.find((m) => m.size === "1L")?.qty || 0,
              bottles_500ml: suggestion.mix.find((m) => m.size === "500mL")?.qty || 0,
            }}))}
          >
            Add to current plan
          </button>
          <a href="/about" className="link-underline text-sm font-medium">
            Learn more
          </a>
        </div>

        <div className="mt-4 text-xs text-slate-500">
          Prices are placeholders for demo. Actual pricing and deposit are confirmed at checkout.
        </div>
      </div>
    </div>
  );
}

/* ------------ small subcomponent for counters ------------ */
function CounterRow({
  label,
  value,
  onDec,
  onInc,
  onInput,
}: {
  label: string;
  value: number;
  onDec: () => void;
  onInc: () => void;
  onInput: (n: number) => void;
}) {
  return (
    <div className="rounded-2xl border p-4">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-2 flex items-center gap-3">
        <button type="button" className="h-9 w-9 rounded-full border hover:bg-slate-50" onClick={onDec} aria-label={`Decrease ${label}`}>
          −
        </button>
        <input
          type="number"
          min={0}
          max={99}
          className="w-16 text-center border rounded-2xl px-2 py-1"
          value={value}
          onChange={(e) => onInput(Number(e.target.value))}
        />
        <button type="button" className="h-9 w-9 rounded-full border hover:bg-slate-50" onClick={onInc} aria-label={`Increase ${label}`}>
          +
        </button>
      </div>
    </div>
  );
}
