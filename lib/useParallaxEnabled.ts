"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

const DESKTOP_WIDTH = 1024;

export const useParallaxEnabled = () => {
  const prefersReducedMotion = useReducedMotion();
  const [enabled, setEnabled] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return window.innerWidth >= DESKTOP_WIDTH;
  });

  useEffect(() => {
    if (prefersReducedMotion) {
      setEnabled(false);
      return;
    }
    const update = () => setEnabled(window.innerWidth >= DESKTOP_WIDTH);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [prefersReducedMotion]);

  return !prefersReducedMotion && enabled;
};
