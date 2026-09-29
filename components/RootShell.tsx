"use client";

import { type ReactNode, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import WIPPopup from "./WIPPopup";
import WaitlistModal, { WAITLIST_SOURCE_KEY } from "./WaitlistModal";
import AuthModal from "./AuthModal"; // Import AuthModal

export default function RootShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideShell = pathname === "/auth/reset";
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false); // New state for AuthModal
  const [authMode, setAuthMode] = useState<'signup' | 'signin'>('signin'); // New state for AuthModal initialMode

  useEffect(() => {
    const openWaitlist = () => setIsWaitlistOpen(true);
    window.addEventListener("velah:open-waitlist", openWaitlist);
    return () => window.removeEventListener("velah:open-waitlist", openWaitlist);
  }, []);

  // drinkvelah.com/waitlist redirects to /?waitlist=1: open the form straight away, then tidy the URL.
  // A ?from= value (e.g. /waitlist?from=whatsapp) is remembered for this visit so the signup records its source.
  useEffect(() => {
    const url = new URL(window.location.href);
    const from = url.searchParams.get("from");
    const openForm = url.searchParams.has("waitlist");
    if (!from && !openForm) return;
    if (from) {
      try {
        sessionStorage.setItem(WAITLIST_SOURCE_KEY, from.slice(0, 32));
      } catch {
        // storage unavailable (private mode); the signup is just recorded as "website"
      }
    }
    if (openForm) setIsWaitlistOpen(true);
    url.searchParams.delete("waitlist");
    url.searchParams.delete("from");
    window.history.replaceState(null, "", url.pathname + url.search + url.hash);
  }, []);

  useEffect(() => {
    const openAuth = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && (customEvent.detail.mode === 'signup' || customEvent.detail.mode === 'signin')) {
        setAuthMode(customEvent.detail.mode);
      }
      setIsAuthOpen(true);
    };
    window.addEventListener("velah:open-auth", openAuth);
    return () => window.removeEventListener("velah:open-auth", openAuth);
  }, []);

  return (
    <>
      <a
        href="#content"
        className="sr-only focus:not-sr-only fixed top-2 left-2 z-[999] rounded-full bg-black text-white px-3 py-2 text-sm"
      >
        Skip to content
      </a>
      {hideShell ? null : <Navbar />}
      <main id="content" className="flex-1">
        {children}
      </main>
      {hideShell ? null : <Footer />}
      <WIPPopup />
      <WaitlistModal open={isWaitlistOpen} onClose={() => setIsWaitlistOpen(false)} />
      <AuthModal open={isAuthOpen} onClose={() => setIsAuthOpen(false)} initialMode={authMode} />
    </>
  );
}
