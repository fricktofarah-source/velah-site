"use client";
import { useCallback } from "react";

export default function Hero() {
  const openWaitlist = useCallback(() => {
    window.dispatchEvent(new CustomEvent("velah:open-waitlist"));
  }, []);

  return (
    <section aria-label="Velah hero">
      {/* Background image */}
      <div
        className="
          relative -mt-px
          w-full
          bg-[url('/assets/Dubai_landscape.png')]
          bg-top bg-no-repeat
          bg-contain sm:bg-cover
          aspect-[16/9] sm:h-[90vh]
        "
      />

      {/* Button under image */}
      <div className="flex justify-center mt-4 sm:mt-8">
        <button
          onClick={openWaitlist}
          className="
            relative h-12 px-8 rounded-full font-medium
            bg-[var(--velah)] text-black
            shadow-md hover:shadow-lg
            transition-all duration-300
            hover:scale-[1.03] active:scale-[0.98]
          "
        >
          <span className="relative z-10">Join the waitlist</span>
          <span
            className="absolute inset-0 rounded-full bg-[var(--velah)] opacity-40 blur-md -z-10"
            aria-hidden
          />
        </button>
      </div>
    </section>
  );
}
