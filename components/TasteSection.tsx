"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function TasteSection() {
    const sectionRef = useRef<HTMLElement>(null);

    useGSAP(() => {
        gsap.to(".taste-bg", {
            y: -50,
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
            },
        });
    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className="relative py-24 sm:py-32 bg-white overflow-hidden">
            {/* Gentle Water Parallax Background (Moved from Pure Science) */}
            <div
                className="absolute inset-0 z-0 opacity-40 pointer-events-none taste-bg"
            >
                <Image
                    src="/assets/water-bg.png"
                    alt=""
                    fill
                    className="object-cover scale-110"
                />
            </div>
            {/* Top Blend */}
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white via-white/70 to-transparent" />
            {/* Bottom Blend */}
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white via-white/70 to-transparent" />

            <div className="section-shell relative z-10 max-w-4xl mx-auto text-center">
                <div className="space-y-8">
                    <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 leading-tight">
                        Taste the difference. <br />
                        <span className="text-emerald-600">Or rather, don&apos;t.</span>
                    </h2>

                    <div className="grid sm:grid-cols-2 gap-8 text-left max-w-2xl mx-auto pt-8">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <h3 className="text-lg font-bold text-slate-900 mb-2">The Problem</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Plastic and metal containers leach chemicals and metallic flavors into water over time, altering the taste and purity.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 ring-1 ring-emerald-500/20">
                            <h3 className="text-lg font-bold text-emerald-700 mb-2">The Velah Standard</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Glass is non-porous and chemically inert. It preserves the crisp, natural taste of spring water without adding anything.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
