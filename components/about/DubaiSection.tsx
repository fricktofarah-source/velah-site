// components/about/DubaiSection.tsx
"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type AboutCopy } from "@/lib/aboutCopy";

gsap.registerPlugin(ScrollTrigger);

export default function DubaiSection({ copy }: { copy: AboutCopy["dubai"] }) {
    const container = useRef<HTMLElement | null>(null);

    useGSAP(() => {
        gsap.from(".dubai-title", {
            opacity: 0,
            y: 40,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: container.current,
                start: "top 80%",
            }
        });

        gsap.from(".dubai-heading", {
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

        gsap.from(".dubai-body", {
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

        gsap.from(".dubai-image", {
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
        <section ref={container} className="relative isolate overflow-hidden bg-gradient-to-b from-white via-[#f4f7fb] to-white py-24 sm:py-32">
            <div className="absolute inset-0">
                <Image
                    src="/about/Desertbg.png"
                    alt="Velah Dubai desert background"
                    fill
                    sizes="100vw"
                    priority={false}
                    className="object-cover opacity-95"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
            </div>
            <div className="section-shell relative z-10">
                <div className="grid gap-12 lg:grid-cols-[1fr_0.8fr] lg:items-center">
                    <div className="text-center lg:text-left">
                        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 dubai-title">
                            {copy.label}
                        </p>
                        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl dubai-heading">
                            {copy.heading}
                        </h2>
                        <p className="mt-6 text-lg leading-relaxed text-slate-600 dubai-body">{copy.body}</p>
                    </div>
                    <div className="relative dubai-image">
                        <div className="relative aspect-[5/3] w-full overflow-hidden rounded-[2.5rem] border border-white/70 bg-slate-50 shadow-[0_35px_80px_rgba(15,23,42,0.12)]">
                            <Image
                                src="/about/velah_bottle_desert.png"
                                alt="Velah bottle in the Dubai desert"
                                fill
                                sizes="(min-width: 1024px) 560px, 90vw"
                                className="object-cover"
                                priority={false}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-white/15 via-transparent to-transparent" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
