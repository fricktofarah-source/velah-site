// components/about/SustainabilitySection.tsx
"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type AboutCopy } from "@/lib/aboutCopy";
import BottleLifecycle from "./BottleLifecycle";

gsap.registerPlugin(ScrollTrigger);

export default function SustainabilitySection({ copy }: { copy: AboutCopy["sustainability"] }) {
    const container = useRef<HTMLElement | null>(null);

    useGSAP(() => {
        gsap.from(".sustainability-title", {
            opacity: 0,
            y: 40,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: container.current,
                start: "top 80%",
            }
        });

        gsap.from(".sustainability-heading", {
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

        gsap.from(".sustainability-body", {
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

        gsap.from(".sustainability-bullets > *", {
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: "power2.out",
            stagger: 0.1,
            delay: 0.6,
            scrollTrigger: {
                trigger: ".sustainability-bullets",
                start: "top 80%",
            }
        });

        gsap.from(".sustainability-diagram", {
            opacity: 0,
            scale: 0.9,
            duration: 1,
            ease: "power2.out",
            delay: 0.2,
            scrollTrigger: {
                trigger: ".sustainability-diagram",
                start: "top 80%",
            }
        });

        gsap.from(".sustainability-list > *", {
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: "power2.out",
            stagger: 0.15,
            delay: 0.2,
            scrollTrigger: {
                trigger: ".sustainability-list",
                start: "top 80%",
            }
        });

    }, { scope: container });

    return (
        <section ref={container} className="relative isolate overflow-hidden py-24 sm:py-32">
            <div className="pointer-events-none absolute inset-0 opacity-80">
                <div className="absolute left-[-10%] top-10 h-64 w-64 rounded-full bg-[radial-gradient(circle,_rgba(127,203,216,0.12),_transparent_60%)] blur-3xl" />
                <div className="absolute bottom-4 right-[-10%] h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(148,163,184,0.15),_transparent_65%)] blur-3xl" />
            </div>
            <div className="section-shell relative z-10">
                <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
                    <div className="space-y-4 text-center lg:text-left">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 sustainability-title">{copy.label}</p>
                            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl sustainability-heading">{copy.heading}</h2>
                            <p className="text-lg leading-relaxed text-slate-600 sustainability-body">{copy.body}</p>
                            <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-slate-500 lg:justify-start sustainability-bullets">
                                {copy.bullets.map((bullet, idx) => (
                                    <span key={bullet} className="inline-flex items-center gap-2">
                                        <span
                                            className={`h-2 w-2 rounded-full ${idx === 0 ? "bg-[var(--velah)]" : "bg-slate-400"}`}
                                        />
                                        {bullet}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="hidden w-full lg:block sustainability-diagram">
                            <BottleLifecycle
                                data={{
                                    points: copy.loopPoints,
                                }}
                            />
                        </div>
                        <ul
                            className="mt-8 w-full space-y-4 text-left text-sm text-slate-600 lg:hidden sustainability-list"
                        >
                            {copy.loopPoints.map((point) => (
                                <li key={point.title} className="flex items-start gap-3">
                                    <span className="mt-1 h-2 w-2 rounded-full bg-[var(--velah)]/60" />
                                    <div>
                                        <p className="text-base font-semibold text-slate-900">{point.title}</p>
                                        <p className="mt-1">{point.detail}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};
