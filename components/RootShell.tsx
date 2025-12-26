"use client";

import { type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function RootShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isApp = pathname?.startsWith("/app");

  if (isApp) {
    return (
      <main id="content" className="app-shell">
        {children}
      </main>
    );
  }

  return (
    <>
      <a
        href="#content"
        className="sr-only focus:not-sr-only fixed top-2 left-2 z-[999] rounded-full bg-black text-white px-3 py-2 text-sm"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="content" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
