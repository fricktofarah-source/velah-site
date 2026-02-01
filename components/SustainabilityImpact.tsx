"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Counter from "@/components/Counter";

const STATS = [
    { value: 50, suffix: "+", label: "Bottles You Will Save", description: "Every single time you refill." },
    { value: 92, suffix: "%", label: "Less CO₂", description: "Reduced carbon footprint from day one." },
    { value: 0, suffix: "", label: "Microplastics", description: "Guaranteed purity in every drop." },
    { value: 100, suffix: "%", label: "Recyclable", description: "Glass is infinitely recyclable forever." },
];

export default function SustainabilityImpact() {
    const sectionRef = useRef<HTMLElement | null>(null);

    return (
        <section
            ref={sectionRef}
            id="sustainability-impact"
            className="relative isolate overflow-hidden py-24 sm:py-32 bg-white"
        >
            {/* Clean White - No Tint or Borders */}

            <div className="section-shell relative z-10 text-slate-900">

                <div className="flex flex-col gap-6 items-center text-center mb-20">
                    <span className="text-xs uppercase tracking-[0.2em] text-emerald-500 font-bold">
                        Measurable Impact
                    </span>
                    <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-slate-900 leading-tight">
                        Real Numbers. <br />
                        <span className="text-emerald-600">Real Change.</span>
                    </h2>
                    <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto font-light leading-relaxed">
                        Sustainability isn&apos;t just about what we&apos;ve done. It&apos;s about what <em className="not-italic text-slate-900 font-medium">you will do</em>.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
                    {STATS.map((item, idx) => (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, duration: 0.8 }}
                            className="text-center group cursor-default"
                        >
                            <div className="text-5xl lg:text-6xl font-extralight text-slate-900 mb-4 transition-all duration-300 group-hover:text-emerald-500 group-hover:scale-110">
                                <Counter to={item.value} suffix={item.suffix} duration={1500} />
                            </div>
                            <div className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-2">{item.label}</div>
                            <p className="text-sm text-slate-500 leading-relaxed max-w-[200px] mx-auto group-hover:text-emerald-700 transition-colors">{item.description}</p>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}
