// components/about/FlowSection.tsx
"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type AboutCopy } from "@/lib/aboutCopy";

gsap.registerPlugin(ScrollTrigger);

export default function FlowSection({ copy }: { copy: AboutCopy["flow"] }) {
    const container = useRef<HTMLElement | null>(null);

    useGSAP(() => {
        gsap.from(".flow-title", {
            opacity: 0,
            y: 40,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: container.current,
                start: "top 80%",
            }
        });

        gsap.from(".flow-heading", {
            opacity: 0,
            y: 40,
            duration: 1,
            ease: "power2.out",
            delay: 0.2,
            scrollTrigger: {
                trigger: container.current,
                start: "top 80%",
            }
        });

        gsap.from(".flow-body", {
            opacity: 0,
            y: 40,
            duration: 1,
            ease: "power2.out",
            delay: 0.4,
            scrollTrigger: {
                trigger: container.current,
                start: "top 80%",
            }
        });

        gsap.from(".flow-steps > *", {
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: "power2.out",
            stagger: 0.15,
            delay: 0.6,
            scrollTrigger: {
                trigger: ".flow-steps",
                start: "top 80%",
            }
        });
    }, { scope: container });

    return (
        <section ref={container} className="section-shell py-24 sm:py-32">
            <div className="text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 flow-title">
                    {copy.label}
                </p>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl flow-heading">
                    {copy.heading}
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-600 flow-body">{copy.body}</p>
            </div>
            <div className="relative mt-12 grid gap-10 lg:grid-cols-3 flow-steps">
                {copy.steps.map((step, idx) => (
                    <div
                        key={step.title}
                        className="group relative z-10 pl-12 text-center lg:text-left"
                    >
                        <div className="absolute left-0 top-0 flex h-9 w-9 items-center justify-center text-sm font-semibold text-[var(--velah)]">
                            {step.icon}
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900">
                            {step.title}
                        </h3>
                        <div className="mt-3 h-[2px] w-10 bg-[var(--velah)]/30 transition-all duration-300 group-hover:w-16 group-hover:bg-[var(--velah)]/70 mx-auto lg:mx-0" />
                        <p className="mt-3 text-base text-slate-600">{step.body}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};
