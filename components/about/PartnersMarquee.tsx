// components/about/PartnersMarquee.tsx
"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type AboutCopy } from "@/lib/aboutCopy";

gsap.registerPlugin(ScrollTrigger);

export default function PartnersMarquee({ copy }: { copy: AboutCopy["partners"] }) {
    const container = useRef<HTMLElement | null>(null);

    useGSAP(() => {
        gsap.from(".partners-title", {
            opacity: 0,
            y: 40,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: container.current,
                start: "top 80%",
            }
        });

        gsap.from(".partners-marquee", {
            opacity: 0,
            y: 24,
            duration: 0.8,
            ease: "power2.out",
            delay: 0.2,
            scrollTrigger: {
                trigger: container.current,
                start: "top 80%",
            }
        });
    }, { scope: container });

    return (
        <section ref={container} className="section-shell pt-0 pb-16">
            <div className="space-y-6">
                <p className="text-center text-sm font-semibold uppercase tracking-[0.3em] text-slate-400 partners-title">
                    {copy.label}
                </p>
                <div
                    className="relative -mx-6 overflow-hidden sm:mx-0 partners-marquee"
                >
                    <div className="flex animate-[marquee_22s_linear_infinite] gap-8 whitespace-nowrap text-base font-semibold text-slate-500">
                        {[...Array(2)].map((_, loopIdx) => (
                            <span key={loopIdx} className="flex gap-8">
                                {copy.items.map((item) => (
                                    <span key={`${item}-${loopIdx}`} className="tracking-tight">
                                        {item}
                                    </span>
                                ))}
                            </span>
                        ))}
                    </div>
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent" />
                </div>
            </div>
        </section>
    );
};
