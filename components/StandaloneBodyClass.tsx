'use client';

import { useEffect, useRef } from "react";
import { useStandaloneMode } from "@/lib/useStandaloneMode";

export default function StandaloneBodyClass() {
  const { isStandaloneDisplay } = useStandaloneMode();
  const originalViewportRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.classList.toggle("standalone-app", isStandaloneDisplay);

    const meta = document.querySelector('meta[name="viewport"]');
    if (meta && originalViewportRef.current === null) {
      originalViewportRef.current = meta.getAttribute("content");
    }
    if (meta) {
      if (isStandaloneDisplay) {
        meta.setAttribute(
          "content",
          "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        );
      } else if (originalViewportRef.current) {
        meta.setAttribute("content", originalViewportRef.current);
      }
    }

    return () => {
      document.body.classList.remove("standalone-app");
      if (meta && originalViewportRef.current) {
        meta.setAttribute("content", originalViewportRef.current);
      }
    };
  }, [isStandaloneDisplay]);

  return null;
}
