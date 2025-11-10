'use client';

import { useEffect, useRef } from "react";
import { useStandaloneMode } from "@/lib/useStandaloneMode";

export default function StandaloneBodyClass() {
  const { isStandaloneDisplay } = useStandaloneMode();
  const originalViewportRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const body = document.body;
    body.classList.toggle("standalone-app", isStandaloneDisplay);

    const meta = document.querySelector('meta[name="viewport"]');
    if (meta && originalViewportRef.current === null) {
      originalViewportRef.current = meta.getAttribute("content");
    }
    const setViewport = (portrait: boolean) => {
      if (!meta || !originalViewportRef.current) return;
      if (portrait) {
        meta.setAttribute(
          "content",
          "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        );
      } else {
        meta.setAttribute("content", originalViewportRef.current);
      }
    };

    let cleanupOrientation = () => {};

    if (isStandaloneDisplay) {
      setViewport(true);

      const lockOrientation = async () => {
        try {
          await window.screen.orientation?.lock?.("portrait");
        } catch {
          /* ignore */
        }
      };
      lockOrientation();

      const updateOrientationClass = () => {
        const isLandscape = window.matchMedia("(orientation: landscape)").matches;
        body.classList.toggle("standalone-landscape", isLandscape);
      };
      updateOrientationClass();
      window.addEventListener("orientationchange", updateOrientationClass);
      window.addEventListener("resize", updateOrientationClass);

      cleanupOrientation = () => {
        window.removeEventListener("orientationchange", updateOrientationClass);
        window.removeEventListener("resize", updateOrientationClass);
        body.classList.remove("standalone-landscape");
        try {
          window.screen.orientation?.unlock?.();
        } catch {
          /* ignore */
        }
      };
    } else {
      setViewport(false);
      try {
        window.screen.orientation?.unlock?.();
      } catch {
        /* ignore */
      }
    }

    return () => {
      cleanupOrientation();
      body.classList.remove("standalone-app");
      body.classList.remove("standalone-landscape");
      if (meta && originalViewportRef.current) {
        meta.setAttribute("content", originalViewportRef.current);
      }
    };
  }, [isStandaloneDisplay]);

  return null;
}
