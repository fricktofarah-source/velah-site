"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function SavingsCalculator() {
    const [bottlesPerDay, setBottlesPerDay] = useState(3);

    // 1 plastic bottle approx 20g (0.02kg)
    // CO2 approx 82.8g per 500ml bottle
    const annualPlastic = Math.round(bottlesPerDay * 365 * 0.02);
    const annualBottles = bottlesPerDay * 365;

    return (
        <section className="py-24 bg-white">
            <div className="section-shell max-w-4xl mx-auto">

                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl font-semibold text-slate-900">Calculate Your Impact</h2>
                    <p className="text-slate-500">See what happens when you switch to Velah.</p>
                </div>

                <div className="bg-slate-50 rounded-[2.5rem] p-8 sm:p-12 md:p-16">
                    <div className="space-y-12">
                        {/* Input Slider */}
                        <div className="space-y-6">
                            <div className="flex justify-between items-end">
                                <label className="text-sm font-bold uppercase tracking-widest text-slate-400">
                                    I drink
                                </label>
                                <div className="text-5xl font-light text-slate-900">
                                    {bottlesPerDay} <span className="text-lg text-slate-400 font-normal">bottles/day</span>
                                </div>
                            </div>

                            <input
                                type="range"
                                min="1"
                                max="10"
                                step="1"
                                value={bottlesPerDay}
                                onChange={(e) => setBottlesPerDay(Number(e.target.value))}
                                className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400 transition-all"
                            />
                            <div className="flex justify-between text-xs text-slate-400 font-medium tracking-wider uppercase">
                                <span>1 Bottle</span>
                                <span>10 Bottles</span>
                            </div>
                        </div>

                        {/* Results Grid - Interactive and Dynamic */}
                        <div className="grid sm:grid-cols-2 gap-8 border-t border-slate-200 pt-12">
                            <motion.div
                                key={annualBottles}
                                initial={{ scale: 0.95, opacity: 0.5 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="space-y-2"
                            >
                                <div className="text-sm font-bold uppercase tracking-widest text-emerald-600">
                                    You Will Save
                                </div>
                                <div className="text-6xl font-semibold text-slate-900 tracking-tight">
                                    {annualBottles.toLocaleString()}
                                </div>
                                <div className="text-slate-500">plastic bottles every year</div>
                            </motion.div>

                            <motion.div
                                key={annualPlastic}
                                initial={{ scale: 0.95, opacity: 0.5 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="space-y-2"
                            >
                                <div className="text-sm font-bold uppercase tracking-widest text-emerald-600">
                                    Plastic Waste
                                </div>
                                <div className="text-6xl font-semibold text-slate-900 tracking-tight">
                                    {annualPlastic} <span className="text-2xl">kg</span>
                                </div>
                                <div className="text-slate-500">eliminated from the environment</div>
                            </motion.div>
                        </div>
                    </div>

                    <p className="mt-8 text-center text-xs text-slate-400">
                        *Estimations based on average 500ml PET bottle weight of 20g.
                    </p>
                </div>

            </div>
        </section>
    );
}
