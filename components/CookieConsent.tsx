"use client";

import { useEffect, useState } from "react";

const CONSENT_KEY = "velah_cookie_consent";

function readConsent() {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_KEY}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function writeConsent() {
  if (typeof document === "undefined") return;
  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = `${CONSENT_KEY}=necessary; Path=/; Max-Age=${maxAge}; SameSite=Lax; Secure`;
}

export default function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!readConsent()) setOpen(true);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2">
      <div className="rounded-2xl border border-slate-200 bg-white/95 px-4 py-3 shadow-lg backdrop-blur">
        <div className="text-sm text-slate-700">
          We use a required cookie to keep you signed in and save your profile. This is essential for the site to work.
        </div>
        <div className="mt-3 flex justify-end">
          <button
            onClick={() => {
              writeConsent();
              setOpen(false);
            }}
            className="btn btn-primary h-9 rounded-full px-4"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
