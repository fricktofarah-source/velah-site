// components/Hero.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section
      className="relative isolate section pt-12 sm:pt-16"
      aria-label="Velah — eco-luxury water in reusable glass"
    >
      {/* Subtle immersive background (keeps minimal look) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute inset-0 bg-[radial-gradient(60%_40%_at_50%_0%,rgba(127,203,216,0.10),transparent_65%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/60 to-white" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid items-center gap-8 sm:gap-12 md:grid-cols-2">
          {/* Copy */}
          <div>
            <motion.h1
              className="text-3xl sm:text-5xl font-semibold tracking-tight"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5 }}
            >
              Eco-luxury water.
              <br className="hidden sm:block" />
              Reusable glass. Real taste.
            </motion.h1>

            <motion.p
              className="mt-3 sm:mt-4 text-slate-600 max-w-xl"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: 0.08 }}
            >
              Velah replaces single-use with a clean, circular system—glass
              gallons for home, 1L for your day. Stainless caps. Refundable
              deposit. Delivery and returns, on repeat.
            </motion.p>

            <motion.div
              className="mt-5 sm:mt-6 flex flex-wrap items-center gap-3"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: 0.16 }}
            >
              <button
                type="button"
                className="btn btn-primary h-10 focus-ring"
                onClick={() => {
                  // Preserve your existing event contract for Navbar modal
                  window.dispatchEvent(new Event("velah:open-waitlist"));
                }}
              >
                Join waitlist
              </button>

              <Link href="/#about" className="btn btn-ghost h-10 focus-ring">
                Learn more
              </Link>
            </motion.div>

            <div className="mt-4 text-xs text-slate-500">
              Refillable • Stainless caps • Refundable deposit
            </div>
          </div>

          {/* Visual — minimalist “product silhouette” block */}
          <motion.div
            className="relative h-[280px] sm:h-[360px] md:h-[420px] rounded-2xl border bg-white/70 backdrop-blur shadow-soft overflow-hidden"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: 0.12 }}
          >
            {/* Subtle water shimmer */}
            <div
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(40%_60%_at_70%_30%,rgba(127,203,216,0.14),transparent_70%)]"
            />
            {/* Placeholder for your bottle render/image — keeps minimal aesthetic */}
            <div className="absolute inset-0 grid place-items-center">
              <div className="h-40 sm:h-48 w-40 sm:w-48 rounded-[40%_40%_46%_46%/55%_55%_45%_45%] border border-slate-200 bg-white/60 backdrop-blur" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
