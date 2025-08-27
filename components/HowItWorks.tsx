"use client";
import { motion } from "framer-motion";

const steps = [
  { title: "Choose your bottles", text: "5G for home, 1L for daily use." },
  { title: "AI-tailored plan", text: "Quantity adjusts to your habits." },
  { title: "Delivery & returns", text: "Glass delivered, empties picked up." },
  { title: "Refill + repeat", text: "Cleaned, refilled, back to you." },
];

function DropletIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2C12 2 5 10 5 14.5C5 18.09 8.134 21 12 21C15.866 21 19 18.09 19 14.5C19 10 12 2 12 2Z" fill="currentColor"/>
    </svg>
  );
}

export default function HowItWorks() {
  return (
    <section className="section">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">How Velah works</h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="overflow-x-auto hide-scrollbar snap-x snap-mandatory"
        >
          <div className="flex gap-4 sm:gap-6 pr-4">
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                className="snap-start min-w-[80%] sm:min-w-[360px] card-glass card-press p-4 sm:p-6"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
              >
                <div className="flex items-center gap-2 text-slate-700">
                  <DropletIcon />
                  <span className="text-xs font-medium">Step {i + 1}</span>
                </div>
                <h3 className="mt-2 text-lg sm:text-xl font-semibold">{s.title}</h3>
                <p className="mt-1 text-slate-600 text-sm">{s.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
