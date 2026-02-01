// components/about/AnimatedVelahLogo.tsx
"use client";

import { useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const LOGO_OUTER_PATH =
  "M373.8,396.3c44.65-3.5,85.61,15.16,118.21,44.19,3.75,3.33,16.86,18.6,20.51,18.5,2.11-.06,10.07-9.35,12.46-11.5,40-35.84,84.5-59.26,140.24-49.21,111.93,20.18,137.37,170.67,31.13,219.59-67.11,30.9-136.35-.55-184-49.79-38.96,34.81-82.78,65.27-137.9,61.97-151.93-9.09-151.64-221.91-.66-233.74";
const LOGO_WAVE_PATH =
  "M643,589h-14.5c-26.43,0-58.34-25.24-75.01-43.99-48.65-54.67-97.31-133.12-182.86-122.89-99.44,11.9-116.5,145.81-21.59,177.33,58.26,19.35,111.82-14.69,150.47-55.44,4-4.22,6.09-11.11,13.01-11.05,5.98.05,8.51,7.35,11.97,11.05,40.06,42.89,95.85,77.53,156.19,53.17,84.48-34.11,70.51-153.47-15.48-172.88-54.04-12.2-99.58,15.43-135.02,53.19,31.39,34.27,54.25,76.98,93.9,102.93l18.92,8.58";
const LOGO_FULL_PATH = `${LOGO_OUTER_PATH}Z${LOGO_WAVE_PATH}Z`;

const LOGO_TOTAL_DURATION = 8.5;

export default function AnimatedVelahLogo() {
  useGSAP(() => {
    const path = document.querySelector(".logo-path");
    const length = path ? path.getTotalLength() : 1000; // Fallback to a large number if path is not immediately available

    gsap.set(".logo-path", {
      strokeDasharray: length,
      strokeDashoffset: length,
    });

    gsap.to(".logo-path", {
      strokeDashoffset: 0,
      duration: 2,
      ease: "power2.out",
    });

    gsap.to(".logo-fill", {
      opacity: 1,
      delay: 1.5,
      duration: 1.5,
      ease: "power2.out",
    });

    gsap.to(".logo-container", {
        y: -12,
        scale: 1.012,
        rotate: 0.2,
        repeat: -1,
        yoyo: true,
        duration: 6.5,
        ease: "sine.inOut"
    });
  });

  return (
    <div
      className="relative flex h-full w-full max-w-[420px] items-center justify-center drop-shadow-[0_35px_90px_rgba(15,23,42,0.18)] logo-container"
    >
      <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" className="w-full">
        <path
          d={LOGO_FULL_PATH}
          fill="none"
          stroke="#0F172A"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="logo-path"
        />
        <path
          d={LOGO_FULL_PATH}
          fill="#0F172A"
          className="logo-fill"
          style={{ opacity: 0 }}
        />
      </svg>
    </div>
  );
};
