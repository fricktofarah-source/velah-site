// components/AddToHome.tsx
"use client";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type BeforeInstallPromptEvent = Event & { prompt: () => Promise<void> };
type NavigatorWithStandalone = Navigator & { standalone?: boolean };

const DISMISS_KEY = "velah_a2hs_dismissed_until";
const INSTALLED_KEY = "velah_a2hs_installed";

export default function AddToHome() {
  const [show, setShow] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  const isiOS = useMemo(() => {
    if (typeof navigator === "undefined") return false;
    return /iphone|ipad|ipod/i.test(navigator.userAgent);
  }, []);

  const isStandalone = useMemo(() => {
    if (typeof window === "undefined") return false;
    // Android/desktop PWA
    const standaloneMM = window.matchMedia?.("(display-mode: standalone)")?.matches ?? false;
    // iOS PWA
    const iosStandalone =
      (window.navigator as NavigatorWithStandalone | undefined)?.standalone === true;
    return Boolean(standaloneMM || iosStandalone || localStorage.getItem(INSTALLED_KEY) === "1");
  }, []);

  useEffect(() => {
    if (isStandalone) return; // already installed -> never show

    // respect dismiss cooldown
    const until = Number(localStorage.getItem(DISMISS_KEY) || 0);
    if (Date.now() < until) return;

    const onBeforeInstallPrompt = (event: BeforeInstallPromptEvent) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setShow(true);
    };

    const onAppInstalled = () => {
      // once installed, hide forever
      localStorage.setItem(INSTALLED_KEY, "1");
      setShow(false);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt as EventListener);
    window.addEventListener("appinstalled", onAppInstalled);

    // iOS never fires beforeinstallprompt → show a gentle hint once
    if (isiOS) setShow(true);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt as EventListener);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, [isiOS, isStandalone]);

  if (!show) return null;

  const dismiss = () => {
    // snooze for 14 days
    const twoWeeks = 14 * 24 * 60 * 60 * 1000;
    localStorage.setItem(DISMISS_KEY, String(Date.now() + twoWeeks));
    setShow(false);
  };

  const onInstallClick = async () => {
    if (deferredPrompt?.prompt) {
      await deferredPrompt.prompt();
      setDeferredPrompt(null);
      // we’ll also get appinstalled event if install succeeds
      dismiss();
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-1.5rem)] max-w-xl">
      <div className="card border shadow-lg rounded-2xl bg-white/95 backdrop-blur p-4 flex items-start gap-3">
        <div className="relative shrink-0 h-9 w-9 rounded-xl overflow-hidden border">
          <Image
            src="/apple-touch-icon.png"
            alt="Velah"
            fill
            sizes="36px"
            className="object-cover"
            priority={false}
          />
        </div>
        <div className="flex-1">
          <div className="font-semibold">Add Velah to your Home Screen</div>
          {isiOS ? (
            <div className="text-sm text-slate-600 mt-0.5">
              Tap <span className="font-medium">Share</span> → <span className="font-medium">Add to Home Screen</span> for a clean, app-like experience.
            </div>
          ) : (
            <div className="text-sm text-slate-600 mt-0.5">
              Install Velah for a full-screen, app-like experience.
            </div>
          )}
          <div className="mt-3 flex gap-2">
            {!isiOS && (
              <button onClick={onInstallClick} className="btn btn-primary h-9 rounded-full px-4">
                Add to Home Screen
              </button>
            )}
            <button onClick={dismiss} className="btn btn-ghost btn-no-arrow h-9 rounded-full px-4">
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
