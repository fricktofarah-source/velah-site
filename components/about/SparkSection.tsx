// components/about/SparkSection.tsx
"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type AboutCopy } from "@/lib/aboutCopy";
import ImageCompare from "./ImageCompare";

gsap.registerPlugin(ScrollTrigger);

export default function SparkSection({ copy }: { copy: AboutCopy["spark"] }) {
    const container = useRef<HTMLElement | null>(null);

    useGSAP(() => {
        gsap.from(".spark-title", {
            opacity: 0,
            y: 40,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: container.current,
                start: "top 80%",
            }
        });

        gsap.from(".spark-heading", {
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

        gsap.from(".spark-body", {
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

        gsap.from(".spark-image", {
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
            <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                <div className="text-center lg:text-left">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 spark-title">
                        {copy.label}
                    </p>
                    <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-[2.6rem] spark-heading">
                        {copy.heading}
                    </h2>
                    <p className="mt-6 text-lg leading-relaxed text-slate-600 spark-body">{copy.body}</p>
                </div>
                <div className="relative spark-image">
                    <ImageCompare
                        before="/about/room_with_glass.png"
                        after="/about/room_with_plastic.png"
                        beforeLabel="Plastic"
                        afterLabel="Glass"
                    />
                    {copy.note ? <p className="mt-5 text-sm text-slate-500">{copy.note}</p> : null}
                </div>
            </div>
        </section>
    );
};
