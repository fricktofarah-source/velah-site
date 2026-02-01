// components/about/AnimatedCounter.tsx
"use client";

import { useRef, useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type AnimatedCounterProps = {
  value: number;
  suffix?: string;
};

export default function AnimatedCounter({ value, suffix = "" }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState(0);

  useGSAP(() => {
    const counter = { val: 0 };
    gsap.to(counter, {
        val: value,
        duration: 1.1,
        ease: "power2.out",
        onUpdate: () => {
            setDisplay(Math.floor(counter.val));
        },
        scrollTrigger: {
            trigger: ref.current,
            start: "top 90%",
        }
    });
  }, { scope: ref });

  return (
    <span ref={ref} className="text-3xl font-semibold text-slate-900 sm:text-4xl">
      {display}
      {suffix}
    </span>
  );
};
