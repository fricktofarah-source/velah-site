"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

/** ---------- tiny utils ---------- */
function cn(...xs: Array<string | false | undefined>) {
    return xs.filter(Boolean).join(" ");
}

const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

/** ---------- Scroll reveal hook ---------- */
function useReveal<T extends HTMLElement>() {
    const ref = useRef<T | null>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (prefersReducedMotion) {
            setVisible(true);
            return;
        }
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(
            (ents) => ents.forEach((e) => e.isIntersecting && setVisible(true)),
            { rootMargin: "0px 0px -10% 0px", threshold: 0.08 }
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    return { ref, visible };
}

/** ---------- Parallax hook (hero only) ---------- */
function useParallax(max = 50) {
    const [y, setY] = useState(0);
    useEffect(() => {
        if (prefersReducedMotion) return;
        const onScroll = () => setY(Math.min(max, (window.scrollY || 0) * 0.25));
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [max]);
    return y;
}

/** ---------- Section wrapper with reveal ---------- */
function Section({
    className,
    children,
    bleed = false,
}: {
    className?: string;
    children: React.ReactNode;
    bleed?: boolean;
}) {
    const { ref, visible } = useReveal<HTMLDivElement>();
    const wrap = (
        <div
            ref={ref}
            className={cn(
                "transition-all duration-700 ease-[cubic-bezier(.22,1,.36,1)]",
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
                className
            )}
        >
            {children}
        </div>
    );

    if (bleed) {
        return (
            <section className="py-12 md:py-20">
                {wrap}
            </section>
        );
    }

    return (
        <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 md:py-24">
            {wrap}
        </section>
    );
}

/** ---------- Page ---------- */
export default function AboutPage() {
    const parallaxY = useParallax(56);
    const isiOS = useMemo(
        () =>
            typeof navigator !== "undefined" &&
            /iphone|ipad|ipod/i.test(navigator.userAgent),
        []
    );

    return (
        <>
            {/* HERO — serene + nature vibe via canopy image, parallax on copy */}
            <header className="relative isolate overflow-hidden bg-white">
                <div className="absolute inset-0 -z-10" aria-hidden>
                    {/* subtle gradient base so text always readable */}
                    <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_80%_-10%,#E6F5F8_0%,#FFFFFF_60%)]" />
                    {/* nature canopy */}
                    <Image
                        src="/assets/Glaciar-water.jpg" /* add this image in /public/assets */
                        alt=""
                        fill
                        priority
                        className="object-cover object-center opacity-55"
                        sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-white/35" />
                </div>

                <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-14 md:pt-20 pb-20 md:pb-28">
                    <div
                        className="max-w-3xl"
                        style={{ transform: `translateY(${prefersReducedMotion ? 0 : parallaxY}px)` }}
                    >

                        {/* BIG headline with image-filled “Velah” for oomf */}
                        <h1 className="mt-4 text-[40px] leading-[1.05] md:text-[56px] font-semibold tracking-tight text-slate-900">
                            The story behind{" "}
                            <span
                                className={cn(
                                    "bg-clip-text text-transparent",
                                    // use a leafy texture to color the text
                                    "bg-[url('/assets/leaf-texture.jpg')] bg-center bg-cover"
                                )}
                            >
                                Velah
                            </span>
                        </h1>

                        <p className="mt-5 text-slate-600 leading-7 md:text-lg md:leading-8">
                            Eco-luxury hydration, designed for modern homes. Glass over plastic.
                            Ritual over routine. Purity without compromise.
                        </p>

                        <div className="mt-8 flex items-center gap-3">
                            <a href="/hydration" className="btn btn-primary h-11 rounded-full px-6">
                                Explore your hydration
                            </a>
                            <button
                                onClick={() => window.dispatchEvent(new CustomEvent("velah:open-waitlist"))}
                                className="btn btn-ghost h-11 rounded-full px-6"
                            >
                                Join waitlist
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* RIBBON — full-bleed statement strip */}
            <Section bleed>
                <div className="relative h-[32vh] min-h-[220px] flex items-center justify-center">
                    <h2
                        className={cn(
                            "text-center font-semibold tracking-tight",
                            "text-[32px] sm:text-[44px] md:text-[60px] leading-[1.1]",
                            "bg-clip-text text-transparent",
                            "bg-[url('/assets/glass-in-stream.jpg')] bg-cover bg-center"
                        )}
                    >
                        Purity • Ritual • Refill
                    </h2>
                </div>
            </Section>

            {/* ORIGIN — story + image */}
            <Section>
                <div className="grid md:grid-cols-2 gap-10 items-center">
                    <div className="order-2 md:order-1">
                        <h2 className="text-2xl md:text-3xl font-semibold">Origin</h2>
                        <p className="mt-4 text-slate-600 leading-7">
                            Velah began with a simple question: why accept plastic as the default?
                            We set out to bring back the clarity of glass and the calm of a
                            considered ritual—delivered weekly, designed to be refilled and reused.
                        </p>
                        <p className="mt-3 text-slate-600 leading-7">
                            From Dubai, we’re building a closed-loop system that reduces waste and
                            elevates everyday hydration into something quietly special.
                        </p>
                    </div>
                    <div className="relative w-full h-[90vh]">
                        <Image
                            src="/assets/about-origin.png"
                            alt="Velah glass bottles"
                            fill
                            className="object-contain md:object-cover"
                            sizes="100vw"
                        />
                    </div>
                </div>
            </Section>

            {/* ——— SUSTAINABILITY (new, bold, nature-forward) ——— */}
            <Section className="bg-white">
                {/* Oversized wordmark strip for oomf */}
                <div className="text-center">
                    <div
                        className={cn(
                            "mx-auto max-w-5xl text-[32px] leading-[1.05] sm:text-[44px] md:text-[60px] font-semibold tracking-tight",
                            "bg-clip-text text-transparent bg-[url('/assets/leaf-texture.jpg')] bg-center bg-cover"
                        )}
                    >
                        Sustainability
                    </div>
                    <p className="mt-3 text-slate-600 md:text-lg">
                        A refillable loop that feels good to use—and good to the planet.
                    </p>
                </div>

                {/* Three pillars */}
                <div className="mt-10 grid md:grid-cols-3 gap-6">
                    <div className="rounded-2xl border p-6">
                        <div className="text-3xl" aria-hidden>♻️</div>
                        <h3 className="mt-3 text-lg font-semibold">Refill, not landfill</h3>
                        <p className="mt-2 text-slate-600">
                            Our glass gallons circulate in a closed loop. Every return saves plastic,
                            energy, and visual noise at home.
                        </p>
                    </div>
                    <div className="rounded-2xl border p-6">
                        <div className="text-3xl" aria-hidden>🌿</div>
                        <h3 className="mt-3 text-lg font-semibold">Materials that last</h3>
                        <p className="mt-2 text-slate-600">
                            Glass preserves taste and cleans beautifully. Fewer replacements, less waste.
                        </p>
                    </div>
                    <div className="rounded-2xl border p-6">
                        <div className="text-3xl" aria-hidden>🗺️</div>
                        <h3 className="mt-3 text-lg font-semibold">Smarter routes</h3>
                        <p className="mt-2 text-slate-600">
                            Local deliveries in Dubai reduce miles traveled and emissions—fresh water,
                            lighter footprint.
                        </p>
                    </div>
                </div>

                {/* Process strip with nature background for green feel */}
                <div className="mt-10 relative overflow-hidden rounded-3xl border">
                    <Image
                        src="/assets/nature-detail.jpg" /* add image */
                        alt=""
                        fill
                        className="object-cover opacity-35"
                        sizes="100vw"
                    />
                    <div className="relative z-10 grid md:grid-cols-3 gap-6 p-6 md:p-10">
                        <div className="rounded-2xl bg-white/85 backdrop-blur p-5 border">
                            <div className="font-semibold">1 • Clean Source</div>
                            <p className="mt-1 text-slate-700">
                                Purified for clarity and taste—no plastics, no aftertaste.
                            </p>
                        </div>
                        <div className="rounded-2xl bg-white/85 backdrop-blur p-5 border">
                            <div className="font-semibold">2 • Glass Loop</div>
                            <p className="mt-1 text-slate-700">
                                Fill, deliver, collect, sanitize, repeat. A loop designed to endure.
                            </p>
                        </div>
                        <div className="rounded-2xl bg-white/85 backdrop-blur p-5 border">
                            <div className="font-semibold">3 • Local Routes</div>
                            <p className="mt-1 text-slate-700">
                                Efficient drops in your area keep things fresh and energy-smart.
                            </p>
                        </div>
                    </div>
                </div>
            </Section>

            {/* PROCESS / CRAFT */}
            <Section>
                <div className="grid md:grid-cols-2 gap-10 items-center">
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border">
                        <Image
                            src="/assets/about-process.jpg"
                            alt="Filling process"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </div>
                    <div>
                        <h2 className="text-2xl md:text-3xl font-semibold">Clarity, step by step</h2>
                        <ol className="mt-4 space-y-3 text-slate-700">
                            <li className="flex gap-3">
                                <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full border">1</span>
                                Source & purify for pristine taste.
                            </li>
                            <li className="flex gap-3">
                                <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full border">2</span>
                                Fill glass gallons; sanitize, seal, and batch-track.
                            </li>
                            <li className="flex gap-3">
                                <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full border">3</span>
                                Deliver to your door. Empty bottles collected, cleaned, and returned to the loop.
                            </li>
                        </ol>
                    </div>
                </div>
            </Section>

            {/* COMMUNITY */}
            <Section>
                <div className="rounded-2xl border p-6 md:p-10">
                    <div className="grid md:grid-cols-2 gap-10 items-center">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-semibold">Community & impact</h2>
                            <p className="mt-4 text-slate-600 leading-7">
                                We partner with local organizations to support responsible water use and
                                material recovery. As we grow, so does our capacity to give back.
                            </p>
                        </div>
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border">
                            <Image
                                src="/assets/about-community.jpg"
                                alt="Community initiatives"
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>
                    </div>
                </div>
            </Section>

            {/* CTA */}
            <Section className="pt-0">
                <div className="rounded-2xl border p-6 md:p-10 text-center">
                    <h2 className="text-2xl md:text-3xl font-semibold">Join the refillable future</h2>
                    <p className="mt-3 text-slate-600 md:text-lg">
                        Select your plan in minutes. Change or skip any week.
                    </p>
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                        <a href="/hydration" className="btn btn-primary h-11 rounded-full px-6">
                            Start your hydration
                        </a>
                        <button
                            onClick={() => window.dispatchEvent(new CustomEvent("velah:open-waitlist"))}
                            className="btn btn-ghost h-11 rounded-full px-6"
                        >
                            Join waitlist
                        </button>
                    </div>
                </div>
            </Section>
        </>
    );
}
