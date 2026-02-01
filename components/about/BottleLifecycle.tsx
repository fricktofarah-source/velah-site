"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Simple SVG icons for a clean, luxury feel
const BottleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-12 h-12 text-slate-800">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 21h8M12 15v6M5 9c0-2.21 1.79-4 4-4h6c2.21 0 4 1.79 4 4v6H5V9z" />
  </svg>
);

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 22V12h6v10" />
  </svg>
);

const TruckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 19h4m-4 0a2 2 0 10-4 0 2 2 0 004 0zM4 19h2m-2 0a2 2 0 10-4 0 2 2 0 004 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 17V8h13.5l3.5 4v5H4zM1 8h3v9" />
  </svg>
);

const WaterDropIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 22C8.686 22 6 19.314 6 16c0-2.031.984-3.834 2.5-5 .25-.192.5-.39.75-.595" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 22c3.314 0 6-2.686 6-6 0-2.031-.984-3.834-2.5-5-.25-.192-.5-.39-.75-.595L12 8l-2.75 2.405" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a5 5 0 015 5c0 1.638-.79 3.09-2 4" />
  </svg>
);

const LoopIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 20v-5h-5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19.8A9 9 0 0019.4 13" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 4.2A9 9 0 0115 11" />
  </svg>
);


type BottleLifecycleProps = {
  data: {
    points: Array<{ title: string; detail: string }>;
  };
};

export default function BottleLifecycle({ data }: BottleLifecycleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const steps = [
    { icon: <HomeIcon />, ...data.points[0] },
    { icon: <TruckIcon />, ...data.points[1] },
    { icon: <WaterDropIcon />, ...data.points[2] },
    { icon: <LoopIcon />, ...data.points[3] },
  ];

  useGSAP(() => {
    gsap.from(".bottle-icon", {
      opacity: 0,
      scale: 0.8,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
      },
    });

    gsap.from(".lifecycle-step", {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: "power2.out",
      stagger: 0.2,
      scrollTrigger: {
        trigger: ".steps-container",
        start: "top 80%",
      },
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="space-y-12">
      <div className="flex justify-center bottle-icon">
        <BottleIcon />
      </div>

      <div className="grid md:grid-cols-2 gap-8 steps-container">
        {steps.map((step, index) => (
          <div key={index} className="lifecycle-step p-4 rounded-2xl transition-colors hover:bg-white/50">
            <div className="flex items-center gap-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-lg">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold text-slate-900">{step.title}</h3>
            </div>
            <p className="mt-2 text-slate-600 md:pl-16">{step.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
