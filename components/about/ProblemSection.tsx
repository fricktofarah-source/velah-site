// components/about/ProblemSection.tsx
"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type AboutCopy } from "@/lib/aboutCopy";
import AnimatedCounter from "./AnimatedCounter";

gsap.registerPlugin(ScrollTrigger);

export default function ProblemSection({ copy }: { copy: AboutCopy["problem"] }) {
    const container = useRef<HTMLElement | null>(null);

    useGSAP(() => {
        gsap.from(".problem-title", {
            opacity: 0,
            y: 40,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: container.current,
                start: "top 80%",
            }
        });

        gsap.from(".problem-heading", {
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

        gsap.from(".problem-body", {
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

        gsap.from(".problem-stats > *", {
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: "power2.out",
            stagger: 0.1,
            delay: 0.6,
            scrollTrigger: {
                trigger: container.current,
                start: "top 80%",
            }
        });

        gsap.from(".problem-image", {
            opacity: 0,
            scale: 0.9,
            duration: 1,
            ease: "power2.out",
            delay: 0.2,
            scrollTrigger: {
                trigger: container.current,
                start: "top 80%",
            }
        });
    }, { scope: container });

    return (
        <section ref={container} className="section-shell py-24 sm:py-32">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                <div className="text-center lg:text-left">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 problem-title">{copy.label}</p>
                    <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl problem-heading">
                        {copy.heading}
                    </h2>
                    <p className="mt-6 text-lg leading-relaxed text-slate-600 problem-body">{copy.body}</p>
                    <div className="mt-10 grid gap-8 text-center sm:grid-cols-3 sm:text-left problem-stats">
                        {copy.stats.map((stat) => (
                            <div key={stat.label} className="relative space-y-2">
                                <span className="absolute -left-3 top-2 hidden h-2 w-2 rounded-full bg-[var(--velah)]/70 sm:block" />
                                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                                <p className="text-sm text-slate-500">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="relative problem-image">
                    <div className="relative mx-auto w-full max-w-[440px] overflow-hidden rounded-[2.5rem] aspect-[4/5] lg:aspect-[3/4] lg:min-h-[480px]">
                        <Image
                            src="/about/Dirty_plastic_bottle.jpg"
                            alt="Discarded plastic bottle"
                            fill
                            sizes="(min-width: 1024px) 520px, 90vw"
                            className="object-cover object-top"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};
