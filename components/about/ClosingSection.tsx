// components/about/ClosingSection.tsx
"use client";

import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type AboutCopy } from "@/lib/aboutCopy";

gsap.registerPlugin(ScrollTrigger);

export default function ClosingSection({ copy }: { copy: AboutCopy["closing"] }) {
    const container = useRef<HTMLElement | null>(null);

    useGSAP(() => {
        gsap.from(container.current, {
            opacity: 0,
            y: 50,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: container.current,
                start: "top 80%",
            }
        });
    }, { scope: container });

    return (
        <section ref={container} className="section-shell pb-24 pt-16 sm:pb-32">
            <div
                className="rounded-[2.5rem] border border-slate-200 bg-white px-8 py-12 text-center shadow-[0_40px_120px_rgba(15,23,42,0.12)] sm:px-12"
            >
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/60 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--velah)]" />
                    {copy.brandLabel}
                </div>
                <h2 className="mt-6 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                    {copy.heading}
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">{copy.body}</p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                    <Link href="/hydration" className="btn btn-primary min-w-[11rem] rounded-full px-6 py-3">
                        {copy.primaryCta}
                    </Link>
                    <Link href="/subscription" className="btn btn-ghost min-w-[11rem] rounded-full px-6 py-3">
                        {copy.secondaryCta}
                    </Link>
                </div>
            </div>
        </section>
    );
};
