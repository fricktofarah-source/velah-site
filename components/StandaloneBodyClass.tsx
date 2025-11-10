'use client';

import { useEffect } from "react";
import { useStandaloneMode } from "@/lib/useStandaloneMode";

export default function StandaloneBodyClass() {
  const { isStandaloneDisplay } = useStandaloneMode();

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.classList.toggle("standalone-app", isStandaloneDisplay);
    return () => {
      document.body.classList.remove("standalone-app");
    };
  }, [isStandaloneDisplay]);

  return null;
}
