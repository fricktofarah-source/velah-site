"use client";

import { type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function AppTransitions({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  const initial = reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 };
  const animate = reduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 };
  const exit = reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={initial}
        animate={animate}
        exit={exit}
        transition={{ duration: reduceMotion ? 0 : 0.18, ease: "easeOut" }}
        className="flex-1"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
