"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function isStandaloneDisplay() {
  if (typeof window === "undefined") return false;
  const standaloneMedia = window.matchMedia?.("(display-mode: standalone)")?.matches ?? false;
  const iosStandalone = (window.navigator as Navigator & { standalone?: boolean })?.standalone === true;
  return standaloneMedia || iosStandalone;
}

export default function StandaloneRedirect() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    if (pathname.startsWith("/app")) return;
    if (!isStandaloneDisplay()) return;
    window.location.replace("/app");
  }, [pathname]);

  return null;
}
