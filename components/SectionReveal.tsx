'use client';

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type SectionRevealProps = {
  children: React.ReactNode;
  delay?: number;
  once?: boolean;
};

export default function SectionReveal({ children, delay = 0, once = true }: SectionRevealProps) {
  const container = useRef<HTMLDivElement | null>(null);

  useGSAP(() => {
    gsap.from(container.current, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power2.out",
      delay,
      scrollTrigger: {
        trigger: container.current,
        start: "top 90%",
        toggleActions: once ? "play none none none" : "play none play none",
      },
    });
  }, { scope: container });

  return (
    <div ref={container} className="section-reveal">
      {children}
    </div>
  );
}
