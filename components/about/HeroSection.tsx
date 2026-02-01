// components/about/HeroSection.tsx
"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { type AboutCopy } from "@/lib/aboutCopy";
import AnimatedVelahLogo from "./AnimatedVelahLogo";

export default function HeroSection({ copy }: { copy: AboutCopy["hero"] }) {
    const container = useRef<HTMLElement | null>(null);

    useGSAP(() => {
        gsap.from(".hero-bg", {
            scale: 1.1,
            duration: 2,
            ease: "power2.inOut",
        });

        gsap.from(".hero-title", {
            opacity: 0,
            y: 40,
            duration: 1,
            ease: "power2.out",
            delay: 0.2,
        });

        gsap.from(".hero-heading", {
            opacity: 0,
            y: 40,
            duration: 1,
            ease: "power2.out",
            delay: 0.4,
        });

        gsap.from(".hero-body", {
            opacity: 0,
            y: 40,
            duration: 1,
            ease: "power2.out",
            delay: 0.6,
        });

        gsap.from(".hero-bullets > *", {
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: "power2.out",
            stagger: 0.1,
            delay: 0.8,
        });

        gsap.from(".hero-logo", {
            opacity: 0,
            y: 50,
            scale: 0.92,
            duration: 1,
            ease: "power2.out",
            delay: 0.3,
        });

        gsap.to(".hero-scroll-hint", {
            y: 8,
            duration: 1.4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
        });

    }, { scope: container });

    return (
        <section ref={container} className="relative isolate overflow-hidden bg-gradient-to-b from-white via-[#f6fbfb] to-white pb-12 pt-0 sm:pb-24 sm:pt-8">
            <div className="absolute inset-0">
                <div className="absolute inset-0 hero-bg">
                    <Image
                        src="/about/About_hero_bg.png"
                        alt="Velah hero desert background"
                        fill
                        sizes="100vw"
                        priority
                        className="object-cover"
                    />
                </div>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-white" />
                <div className="absolute inset-x-0 top-0 flex justify-center opacity-70">
                    <div className="mt-8 h-32 w-[70%] rounded-full bg-white/40 blur-3xl" />
                </div>
            </div>
            <div className="section-shell relative z-10">
                <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,1.5fr)]">
                    <div
                        className="space-y-6 text-center lg:text-left"
                    >
                        <div className="text-xs font-semibold uppercase tracking-[0.45em] text-slate-500 hero-title">
                            {copy.badge}
                        </div>
                        <h1 className="text-4xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-[3.4rem] hero-heading">
                            {copy.heading}
                        </h1>
                        <p className="text-lg leading-relaxed text-slate-600 sm:text-xl hero-body">
                            {copy.body}
                        </p>
                        <div className="flex flex-wrap justify-center gap-3 text-sm text-slate-500 lg:justify-start hero-bullets">
                            {copy.bullets.map((bullet, idx) => (
                                <span key={bullet} className="inline-flex items-center gap-2">
                                    <span
                                        className={`h-1.5 w-1.5 rounded-full ${idx === 0 ? "bg-[var(--velah)]" : "bg-slate-300"}`}
                                    />
                                    {bullet}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div
                        className="relative mx-auto flex w-full max-w-3xl flex-col items-center_gap-6 hero-logo"
                    >
                        <div className="relative flex h-[65vh] w-full items-center justify-center">
                            <div
                                className="absolute inset-x-10 top-1/2 h-28 -translate-y-1/2 rounded-full bg-white/35 blur-3xl"
                            />
                            <div
                                className="absolute inset-8 flex items-center justify-center"
                            />
                            <AnimatedVelahLogo />
                        </div>
                        <div className="text-center text-sm text-slate-500">
                            {copy.scrollHint}
                            <span
                                className="mt-3 block text-lg text-slate-400 hero-scroll-hint"
                            >
                                ↓
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};