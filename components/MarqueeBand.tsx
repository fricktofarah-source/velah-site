"use client";

import { motion } from "framer-motion";
import { useLanguage } from "./LanguageProvider";

const ease = [0.22, 1, 0.36, 1] as const;

export default function MarqueeBand() {
  const { t } = useLanguage();
  const phrases = t.marquee.phrases;

  return (
    <section className="section-shell pt-12 pb-24 sm:pt-16 sm:pb-28" aria-label={t.marquee.ariaLabel}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.8, ease }}
        className="relative -mx-6 overflow-hidden sm:mx-0"
      >
        <div className="marquee-band__track text-base font-semibold text-slate-500">
          {[...Array(2)].map((_, loopIdx) => (
            <span key={loopIdx} className="flex gap-8">
              {phrases.map((text, idx) => (
                <span key={`${text}-${idx}-${loopIdx}`} className="tracking-tight">
                  {text}
                </span>
              ))}
            </span>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent" />
      </motion.div>
    </section>
  );
}
