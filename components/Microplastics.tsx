"use client";

import { useRef } from "react";

export default function Microplastics() {
    const ref = useRef<HTMLElement>(null);

    return (
        <section ref={ref} className="relative overflow-hidden py-32 sm:py-48 text-center text-slate-900 border-b border-slate-100/50">


            <div className="section-shell relative z-10 max-w-4xl mx-auto">
                <div className="space-y-10">
                    <div className="space-y-4">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Pure Science</h2>
                        <h3 className="text-4xl sm:text-6xl font-bold leading-tight text-slate-900">
                            <span className="text-emerald-600">5 grams</span> a week.
                        </h3>
                    </div>

                    <p className="text-xl sm:text-2xl leading-relaxed text-slate-600 font-light max-w-2xl mx-auto">
                        That’s how much plastic the average person consumes. We use <strong className="text-slate-900 font-medium">pure glass</strong> to ensure your water stays exactly as nature intended.
                    </p>

                    <div className="grid grid-cols-2 gap-12 pt-12">
                        <div className="space-y-1">
                            <div className="text-6xl font-light text-slate-900">93%</div>
                            <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">Plastic Contamination</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-6xl font-light text-emerald-600">0%</div>
                            <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">Toxins in Velah</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
