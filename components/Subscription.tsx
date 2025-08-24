"use client";
import { useMemo, useState, useEffect, type Dispatch, type SetStateAction } from "react";

type MixItem = { size: "1L" | "5G"; qty: number };
type Suggestion = {
    weeklyLiters: number;
    mix: MixItem[];
    text: string;
};

const GLASS_ML = 250;          // avg glass in ml
const FIVE_GAL_LITERS = 18.9;  // 5 gallon in liters

export default function Subscription() {
    // Inputs
    const [people, setPeople] = useState(2);
    const [glassesPerPerson, setGlassesPerPerson] = useState(8); // per day
    const [cooking, setCooking] = useState(false);
    const [sparkling, setSparkling] = useState(false);

    // Pricing (AED) — placeholders
    const price = { "1L": 7, "5G": 28, deposit1L: 8, deposit5G: 40 };

    // AI suggestion
    const suggestion: Suggestion = useMemo(() => {
        let dailyLiters = people * glassesPerPerson * (GLASS_ML / 1000);
        if (cooking) dailyLiters += people * 0.3;
        if (sparkling) dailyLiters += people * 0.2;

        const weeklyLiters = Math.ceil(dailyLiters * 7 * 10) / 10;
        const mix: MixItem[] = [];

        if (weeklyLiters >= 20) {
            const fiveG = Math.max(1, Math.round(weeklyLiters / FIVE_GAL_LITERS));
            mix.push({ size: "5G", qty: fiveG });
            const remaining = Math.max(0, Math.ceil(weeklyLiters - fiveG * FIVE_GAL_LITERS));
            if (remaining > 0) mix.push({ size: "1L", qty: Math.ceil(remaining) });
        } else if (weeklyLiters >= 10) {
            const fiveG = 1;
            mix.push({ size: "5G", qty: fiveG });
            const remaining = Math.max(0, Math.ceil(weeklyLiters - FIVE_GAL_LITERS));
            if (remaining > 0) mix.push({ size: "1L", qty: Math.ceil(remaining) });
        } else {
            mix.push({ size: "1L", qty: Math.ceil(weeklyLiters) });
        }

        const text =
            weeklyLiters >= 20
                ? "High usage household. Mostly 5 gallon with 1L top ups."
                : weeklyLiters >= 10
                    ? "Balanced usage. One 5 gallon plus a few 1L bottles feels right."
                    : "Light usage. 1L bottles keep things flexible and fresh.";

        return { weeklyLiters, mix, text };
    }, [people, glassesPerPerson, cooking, sparkling]);

    // Edit mode
    const [mode, setMode] = useState<"ai" | "custom">("ai");
    const [oneL, setOneL] = useState(0);
    const [fiveG, setFiveG] = useState(0);

    // When switching to custom, initialize counters from AI suggestion
    useEffect(() => {
        if (mode === "custom") {
            const s1 = suggestion.mix.find(m => m.size === "1L")?.qty ?? 0;
            const s5 = suggestion.mix.find(m => m.size === "5G")?.qty ?? 0;
            setOneL(s1);
            setFiveG(s5);
        }
    }, [mode, suggestion]);

    // Mix used for pricing
    const mixForPricing: MixItem[] = useMemo(() => {
        if (mode === "ai") return suggestion.mix;
        const rows: MixItem[] = [];
        if (fiveG > 0) rows.push({ size: "5G", qty: fiveG });
        if (oneL > 0) rows.push({ size: "1L", qty: oneL });
        if (rows.length === 0) rows.push({ size: "1L", qty: 0 }); // keep UI stable
        return rows;
    }, [mode, suggestion.mix, oneL, fiveG]);

    const weeklyCost = useMemo(
        () => mixForPricing.reduce(
            (sum, m) => sum + (m.size === "5G" ? price["5G"] * m.qty : price["1L"] * m.qty),
            0
        ),
        [mixForPricing]
    );

    const depositTotal = useMemo(
        () => mixForPricing.reduce(
            (sum, m) => sum + (m.size === "5G" ? price.deposit5G * m.qty : price.deposit1L * m.qty),
            0
        ),
        [mixForPricing]
    );

    function openWaitlist() {
        window.dispatchEvent(new CustomEvent("velah:open-waitlist"));
    }

    // helpers
    const clamp = (n: number) => Math.max(0, Math.min(99, Math.floor(n || 0)));
    const step = (setter: Dispatch<SetStateAction<number>>, dir: 1 | -1) =>
        setter((prev: number) => clamp(prev + dir));

    return (
        <div className="grid gap-8 md:grid-cols-2 items-start">
            {/* Inputs */}
            <div className="card p-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Tell us about your week</h3>
                    <div className="text-xs text-slate-500">AI suggests a starting plan</div>
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
                            <input
                                type="checkbox"
                                checked={cooking}
                                onChange={(e) => setCooking(e.target.checked)}
                            />
                            I use Velah for cooking or tea
                        </label>
                        <label className="inline-flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={sparkling}
                                onChange={(e) => setSparkling(e.target.checked)}
                            />
                            I also buy sparkling
                        </label>
                    </div>

                    <div className="text-xs text-slate-500">
                        Change or skip any week. This just sizes your starting plan.
                    </div>
                </div>
            </div>

            {/* Plan + Edit */}
            <div className="card p-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Your weekly plan</h3>

                    {/* Mode switch */}
                    <div className="flex items-center gap-2">
                        <button
                            className={`h-8 px-3 rounded-full text-sm ${mode === "ai" ? "bg-black text-white" : "btn btn-ghost"}`}
                            onClick={() => setMode("ai")}
                        >
                            Use AI
                        </button>
                        <button
                            className={`h-8 px-3 rounded-full text-sm ${mode === "custom" ? "bg-black text-white" : "btn btn-ghost"}`}
                            onClick={() => setMode("custom")}
                        >
                            Edit quantities
                        </button>
                    </div>
                </div>

                {mode === "ai" ? (
                    <>
                        <p className="mt-2 text-slate-600">{suggestion.text}</p>

                        <div className="mt-4 rounded-2xl border">
                            <div className="grid grid-cols-3 text-sm">
                                <div className="p-4 border-b md:border-b-0 md:border-r">
                                    <div className="text-slate-500">Estimated need</div>
                                    <div className="mt-1 font-semibold">
                                        {suggestion.weeklyLiters.toFixed(1)} L per week
                                    </div>
                                </div>
                                <div className="p-4 border-b md:border-b-0 md:border-r">
                                    <div className="text-slate-500">Mix</div>
                                    <div className="mt-1 font-semibold">
                                        {suggestion.mix.map((m, i) => (
                                            <span key={i} className="inline-block mr-2">
                                                {m.qty}× {m.size}
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
                        <div className="mt-4 grid sm:grid-cols-2 gap-3">
                            <div className="rounded-2xl border p-4">
                                <div className="text-sm text-slate-500">5 gallon (18.9L)</div>
                                <div className="mt-2 flex items-center gap-3">
                                    <button
                                        type="button"
                                        className="h-9 w-9 rounded-full border hover:bg-slate-50"
                                        onClick={() => step(setFiveG, -1)}
                                        aria-label="Decrease 5 gallon"
                                    >
                                        −
                                    </button>
                                    <input
                                        type="number"
                                        min={0}
                                        max={99}
                                        className="w-16 text-center border rounded-2xl px-2 py-1"
                                        value={fiveG}
                                        onChange={(e) => setFiveG(clamp(Number(e.target.value)))}
                                    />
                                    <button
                                        type="button"
                                        className="h-9 w-9 rounded-full border hover:bg-slate-50"
                                        onClick={() => step(setFiveG, +1)}
                                        aria-label="Increase 5 gallon"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="rounded-2xl border p-4">
                                <div className="text-sm text-slate-500">1 liter</div>
                                <div className="mt-2 flex items-center gap-3">
                                    <button
                                        type="button"
                                        className="h-9 w-9 rounded-full border hover:bg-slate-50"
                                        onClick={() => step(setOneL, -1)}
                                        aria-label="Decrease 1 liter"
                                    >
                                        −
                                    </button>
                                    <input
                                        type="number"
                                        min={0}
                                        max={99}
                                        className="w-16 text-center border rounded-2xl px-2 py-1"
                                        value={oneL}
                                        onChange={(e) => setOneL(clamp(Number(e.target.value)))}
                                    />
                                    <button
                                        type="button"
                                        className="h-9 w-9 rounded-full border hover:bg-slate-50"
                                        onClick={() => step(setOneL, +1)}
                                        aria-label="Increase 1 liter"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Totals */}
                        <div className="mt-4 rounded-2xl border">
                            <div className="grid grid-cols-3 text-sm">
                                <div className="p-4 border-b md:border-b-0 md:border-r">
                                    <div className="text-slate-500">Your mix</div>
                                    <div className="mt-1 font-semibold">
                                        {fiveG}× 5G{fiveG > 0 && oneL > 0 ? " • " : ""}
                                        {oneL > 0 ? `${oneL}× 1L` : ""}
                                        {fiveG === 0 && oneL === 0 ? "0 bottles" : ""}
                                    </div>
                                </div>
                                <div className="p-4 border-b md:border-b-0 md:border-r">
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
                            <button
                                type="button"
                                className="btn btn-ghost h-9 px-3 rounded-full"
                                onClick={() => setMode("ai")}
                            >
                                Reset to AI suggestion
                            </button>
                        </div>
                    </>
                )}

                {/* Actions */}
                <div className="mt-6 flex flex-wrap gap-3">
                    <button onClick={openWaitlist} className="btn btn-primary h-11 px-5 rounded-full">
                        Join the waitlist
                    </button>
                    <a href="/about" className="btn btn-ghost h-11 px-5 rounded-full">
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
