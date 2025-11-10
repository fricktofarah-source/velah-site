'use client';

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useStandaloneMode } from "@/lib/useStandaloneMode";
import { useLanguage } from "./LanguageProvider";

type DockView = "about" | "subscription" | "blog";

export default function StandaloneDock() {
  const { isStandaloneDisplay } = useStandaloneMode();
  const { t } = useLanguage();
  const subscription = t.subscriptionPeek;
  const router = useRouter();
  const pathname = usePathname();
  const [homeView, setHomeView] = useState<DockView>("about");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.sessionStorage.getItem("standalone:last-view");
    if (stored === "subscription" || stored === "about" || stored === "blog") setHomeView(stored);

    const onViewChange = (event: Event) => {
      const detail = (event as CustomEvent<DockView>).detail;
      if (detail === "subscription" || detail === "about" || detail === "blog") {
        setHomeView(detail);
        window.sessionStorage.setItem("standalone:last-view", detail);
      }
    };

    window.addEventListener("standalone:view-change", onViewChange as EventListener);
    return () => window.removeEventListener("standalone:view-change", onViewChange as EventListener);
  }, []);

  if (!isStandaloneDisplay) return null;

  const goToHomeView = (target: DockView) => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("standalone:target-view", target);
    }
    if (pathname !== "/") {
      router.push("/");
      return;
    }
    window.dispatchEvent(new CustomEvent<DockView>("standalone:set-view", { detail: target }));
  };

  const goHydration = () => {
    router.push("/hydration");
  };

  const aboutActive = pathname === "/" && homeView === "about";
  const subActive = pathname === "/" && homeView === "subscription";
  const blogActive = pathname === "/" && homeView === "blog";
  const hydrationActive = pathname.startsWith("/hydration");

  return (
    <nav className="standalone-bottom-nav" aria-label="Velah navigation">
      <button
        type="button"
        className={aboutActive ? "is-active" : undefined}
        aria-label={t.about.heading}
        aria-current={aboutActive ? "page" : undefined}
        onClick={() => goToHomeView("about")}
      >
        <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5">
          <path
            fill="currentColor"
            d="M12 4c-4.4 0-8 3.13-8 7 0 2.52 1.44 4.7 3.63 5.95L6 20l3.54-1.41c.8.22 1.64.34 2.46.34 4.4 0 8-3.13 8-7s-3.6-7-8-7zm0 2c3.3 0 6 2.24 6 5s-2.7 5-6 5c-.73 0-1.46-.11-2.17-.33l-.36-.12-.33.13-1.25.5.43-1.36.15-.48-.42-.27C7 13.32 6 12 6 11c0-2.76 2.7-5 6-5z"
          />
        </svg>
      </button>

      <button
        type="button"
        className={subActive ? "is-active" : undefined}
        aria-label={subscription.badge || "Subscription"}
        aria-current={subActive ? "page" : undefined}
        onClick={() => goToHomeView("subscription")}
      >
        <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5">
          <path
            fill="currentColor"
            d="M7 4h10l3 5v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9l3-5zm1.7 2-2 3H17.3l-2-3H8.7zM6 11v8h12v-8H6z"
          />
        </svg>
      </button>

      <button
        type="button"
        className={blogActive ? "is-active" : undefined}
        aria-label={t.blog.heading}
        aria-current={blogActive ? "page" : undefined}
        onClick={() => goToHomeView("blog")}
      >
        <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5">
          <path
            fill="currentColor"
            d="M6 4h11a1 1 0 0 1 1 1v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm0 2v12h10V6H6zm2 2h6v2H8V8zm0 4h6v2H8v-2z"
          />
        </svg>
      </button>

      <button
        type="button"
        className={hydrationActive ? "is-active" : undefined}
        aria-label={t.nav.navLinks.hydration}
        aria-current={hydrationActive ? "page" : undefined}
        onClick={goHydration}
      >
        <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5">
          <path
            fill="currentColor"
            d="M12 2s5 6.16 5 9.5S15.76 19 12 19s-5-4.34-5-7.5S12 2 12 2zm0 2.7c-1.44 1.95-3 4.48-3 6.8 0 2.16 1.02 4.5 3 4.5s3-2.34 3-4.5c0-2.32-1.56-4.85-3-6.8z"
          />
        </svg>
      </button>
    </nav>
  );
}
