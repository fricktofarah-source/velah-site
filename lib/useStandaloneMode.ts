'use client';

import { useEffect, useState } from "react";

type StandaloneState = {
  isStandaloneDisplay: boolean;
  isStandaloneMobile: boolean;
};

function checkStandaloneDisplay() {
  if (typeof window === "undefined") return false;
  const standaloneMedia = window.matchMedia?.("(display-mode: standalone)")?.matches ?? false;
  const iosStandalone = ((window.navigator as Navigator & { standalone?: boolean })?.standalone ?? false) === true;
  return standaloneMedia || iosStandalone;
}

function checkMobileViewport() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 768px)").matches;
}

export function useStandaloneMode(): StandaloneState {
  const [state, setState] = useState<StandaloneState>({
    isStandaloneDisplay: false,
    isStandaloneMobile: false,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const update = () => {
      const standalone = checkStandaloneDisplay();
      const mobile = checkMobileViewport();
      setState({
        isStandaloneDisplay: standalone,
        isStandaloneMobile: standalone && mobile,
      });
    };

    update();

    const displayMedia = window.matchMedia?.("(display-mode: standalone)");
    const mobileMedia = window.matchMedia("(max-width: 768px)");

    const handleDisplayChange = () => update();
    const handleMobileChange = (event: MediaQueryListEvent) => {
      const standalone = checkStandaloneDisplay();
      setState({
        isStandaloneDisplay: standalone,
        isStandaloneMobile: standalone && event.matches,
      });
    };

    if (displayMedia?.addEventListener) {
      displayMedia.addEventListener("change", handleDisplayChange);
    } else if (displayMedia?.addListener) {
      displayMedia.addListener(handleDisplayChange);
    }
    if (mobileMedia.addEventListener) {
      mobileMedia.addEventListener("change", handleMobileChange);
    } else {
      mobileMedia.addListener(handleMobileChange);
    }
    window.addEventListener("resize", update);
    window.addEventListener("visibilitychange", update);

    return () => {
      if (displayMedia?.removeEventListener) {
        displayMedia.removeEventListener("change", handleDisplayChange);
      } else if (displayMedia?.removeListener) {
        displayMedia.removeListener(handleDisplayChange);
      }
      if (mobileMedia.removeEventListener) {
        mobileMedia.removeEventListener("change", handleMobileChange);
      } else {
        mobileMedia.removeListener(handleMobileChange);
      }
      window.removeEventListener("resize", update);
      window.removeEventListener("visibilitychange", update);
    };
  }, []);

  return state;
}
