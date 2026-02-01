"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useRef } from "react";

export default function SustainabilityHero() {
    const ref = useRef<HTMLElement>(null);
    return (
        <section
            ref={ref}
            className="relative h-screen w-full overflow-hidden bg-white"
            data-section="hero-sustainability"
        >
            {/* Immersive Background - High Key Nature */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/assets/hero-v12.png"
                    alt="Velah Glass in pure light"
                    fill
                    className="object-cover"
                    style={{ objectPosition: "50% 68%" }}
                    priority
                    sizes="100vw"
                />
                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white via-white/60 to-transparent" />
            </div>

            {/* Content Overlay - Aligned LEFT */}
            <div className="section-shell relative z-10 h-full flex flex-col justify-center items-start text-left pt-20">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    className="space-y-6 max-w-2xl"
                >
                    <h1 className="text-6xl sm:text-7xl lg:text-[6rem] font-bold tracking-tight text-slate-900 leading-[0.95]">
                        Pure Glass. <br />
                        <span className="text-emerald-700">Pure Future.</span>
                    </h1>

                    <p className="text-xl sm:text-2xl text-slate-700 font-medium max-w-lg leading-relaxed">
                        Experience water as nature intended. Zero plastic, zero waste, infinite purity.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
