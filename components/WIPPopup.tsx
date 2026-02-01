"use client";

import { useState, useEffect } from "react";
import { useAuth } from "./AuthProvider";
import Link from "next/link";

export default function WIPPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, status } = useAuth();

  useEffect(() => {
    const hasBeenShownThisSession = sessionStorage.getItem('wipPopupShownThisSession') === 'true';

    if (hasBeenShownThisSession) {
      setIsOpen(false);
      return;
    }

    if (status === 'ready') {
      if (!user) { // Not logged in
        setIsOpen(true);
        sessionStorage.setItem('wipPopupShownThisSession', 'true');
      } else { // Logged in
        const hasSeenEver = localStorage.getItem('wipPopupSeen') === 'true';
        if (!hasSeenEver) {
          setIsOpen(true);
          sessionStorage.setItem('wipPopupShownThisSession', 'true');
        }
      }
    }
  }, [user, status]);

  const handleClose = () => {
    if (user) {
      localStorage.setItem('wipPopupSeen', 'true');
    }
    setIsOpen(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 max-w-lg w-full text-slate-700">
        <h2 className="text-2xl font-bold mb-4 text-slate-900">Work in Progress</h2>
        <div className="space-y-4">
          <p>
            Please note that this website is currently a work in progress. We&apos;re actively building and refining, so some features and content may not yet be final.
          </p>
          <p>
            Join our waitlist or follow our social media channels to stay updated on our progress and official launch.
          </p>
          <p>
            We welcome your questions and feedback as we continue to build and refine. Feel free to{" "}
            <Link href="/contact" className="underline text-slate-700 transition-colors hover:text-velah">
              reach out!
            </Link>
          </p>
          <p className="font-semibold">
            Thank you for your interest and continued support as we bring Velah to life.
          </p>
        </div>
        <div className="mt-6 flex flex-col sm:flex-row-reverse gap-3">
          <button
            onClick={handleClose}
            className="inline-block group focus-ring rounded-xl"
          >
            <span className="relative inline-flex items-center gap-2 text-slate-700 transition-colors group-hover:text-velah">
              <span>Continue to website</span>
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              <span className="absolute left-0 -bottom-0.5 h-[2px] w-0 bg-current transition-all duration-300 group-hover:w-full" />
            </span>
          </button>
          <button onClick={() => { handleClose(); window.dispatchEvent(new CustomEvent("velah:open-waitlist")); }} className="bg-velah text-white px-4 py-2 rounded-md hover:bg-velah-600 transition-colors text-center">
            Join the Waitlist
          </button>
        </div>
      </div>
    </div>
  );
}
