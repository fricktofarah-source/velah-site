"use client";

import SustainabilityHero from "@/components/SustainabilityHero";
import SustainabilityImpact from "@/components/SustainabilityImpact";
import Microplastics from "@/components/Microplastics";
import SavingsCalculator from "@/components/SavingsCalculator";
import TasteSection from "@/components/TasteSection";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import SectionReveal from "@/components/SectionReveal";

export default function SustainabilityPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* 1. V5 Hero (Bottle Right, Text Left) */}
      <SustainabilityHero />

      {/* 2. Microplastics (Parallax Water Background) */}
      <SectionReveal>
        <Microplastics />
      </SectionReveal>

      {/* 3. NEW: Taste/Purity Section */}
      <SectionReveal>
        <TasteSection />
      </SectionReveal>

      {/* 4. Savings Calculator */}
      <SectionReveal>
        <SavingsCalculator />
      </SectionReveal>

      {/* 5. Impact Stats (Clean, No Borders) */}
      <SectionReveal>
        <SustainabilityImpact />
      </SectionReveal>

      {/* 6. CTA (Solid Green, Visible Background) */}
      <SectionReveal>
        <section className="relative py-32 overflow-hidden bg-white">
          {/* Background Image - Increased Opacity */}
          <div className="absolute inset-x-0 bottom-0 h-full opacity-60 pointer-events-none">
            <Image
              src="/assets/cta-soft-nature.png"
              alt=""
              fill
              className="object-cover object-center"
            />
          </div>

          {/* Top Fade to White */}
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white via-white/80 to-transparent pointer-events-none" />

          <div className="section-shell relative z-10 text-center space-y-10">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 drop-shadow-sm">
                <span className="block text-emerald-600 text-lg uppercase tracking-widest font-medium mb-4">The time is now</span>
                Join the Reuse Revolution
              </h2>
              <p className="text-lg md:text-xl text-slate-600 mt-8 mb-10 leading-relaxed font-medium">
                Dubai uses <span className="text-emerald-700 font-bold">4 billion</span> plastic bottles a year. <br />
                One decision today changes your impact forever.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  href="/subscription"
                  className="btn bg-emerald-600 text-white hover:bg-emerald-700 px-10 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-xl shadow-emerald-600/20"
                >
                  Start Your Plan
                </Link>
              </div>
            </div>
          </div>
        </section>
      </SectionReveal>
    </main>
  );
}
