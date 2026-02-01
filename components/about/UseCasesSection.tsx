// components/about/UseCasesSection.tsx
"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type AboutCopy } from "@/lib/aboutCopy";

gsap.registerPlugin(ScrollTrigger);

const PlaceholderBlock = ({
    label,
    className = "",
}: {
    label: string;
    className?: string;
}) => (
    <div
        className={`relative flex items-center justify-center rounded-[2rem] border border-slate-200 bg-white/80 text-[0.65rem] font-semibold uppercase tracking-[0.45em] text-slate-400 shadow-[0_35px_80px_rgba(15,23,42,0.08)] ${className}`}
        aria-hidden="true"
    >
        {label}
    </div>
);

export default function UseCasesSection({ copy }: { copy: AboutCopy["useCases"] }) {
    const container = useRef<HTMLElement | null>(null);

    useGSAP(() => {
        gsap.from(".use-cases-title", {
            opacity: 0,
            y: 40,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: container.current,
                start: "top 80%",
            }
        });

        gsap.from(".use-cases-heading", {
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

        gsap.from(".use-cases-body", {
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

        gsap.from(".use-cases-cards > *", {
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: "power2.out",
            stagger: 0.15,
            delay: 0.6,
            scrollTrigger: {
                trigger: ".use-cases-cards",
                start: "top 80%",
            }
        });
    }, { scope: container });


    return (
        <section ref={container} className="section-shell py-24 sm:py-32">
            <div className="text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 use-cases-title">{copy.label}</p>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl use-cases-heading">
                    {copy.heading}
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-600 use-cases-body">{copy.body}</p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3 use-cases-cards">
                {copy.cards.map((card, idx) => (
                    <div
                        key={card.title}
                        className="flex flex-col gap-4 rounded-[1.75rem] border border-slate-200 bg-white/90 p-6 text-center shadow-[0_30px_70px_rgba(15,23,42,0.07)] lg:text-left"
                    >
                        {card.title === "Residences" ? (
                            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
                                <Image
                                    src="/about/Residences.png"
                                    alt="Residences with Velah"
                                    fill
                                    sizes="(min-width: 1024px) 420px, 90vw"
                                    className="object-cover"
                                />
                            </div>
                        ) : (
                            <PlaceholderBlock
                                label={`${card.title} IMAGE`}
                                className="aspect-[4/3] w-full bg-gradient-to-b from-white to-slate-100/40"
                            />
                        )}
                        <div className="space-y-2 lg:text-left">
                            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                                {card.caption}
                            </p>
                            <p className="text-xl font-semibold text-slate-900">{card.title}</p>
                            <p className="text-base text-slate-600">{card.text}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
