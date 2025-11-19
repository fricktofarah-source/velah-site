"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { CarouselShot } from "@/lib/aboutCopy";

type Props = {
  shots: CarouselShot[];
  heightClass?: string;
  className?: string;
  showBackground?: boolean;
  showPlatform?: boolean;
};

const BottleCarouselStage = ({
  shots,
  heightClass = "h-[80vh]",
  className = "",
  showBackground = true,
  showPlatform = true,
}: Props) => {
  const [activeShot, setActiveShot] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const totalShots = shots.length;

  useEffect(() => {
    const id = setInterval(
      () => setActiveShot((prev) => (prev === totalShots - 1 ? 0 : prev + 1)),
      3500,
    );
    return () => clearInterval(id);
  }, [totalShots]);

  useEffect(() => {
    const updateMatch = () => {
      if (typeof window === "undefined") return;
      setIsMobile(window.innerWidth < 640);
    };
    updateMatch();
    window.addEventListener("resize", updateMatch);
    return () => window.removeEventListener("resize", updateMatch);
  }, []);

  const getPosition = (idx: number) => {
    if (idx === activeShot) return "center";
    const rightIndex = (activeShot + 1) % totalShots;
    const leftIndex = activeShot === 0 ? totalShots - 1 : activeShot - 1;
    if (idx === rightIndex) return "right";
    if (idx === leftIndex) return "left";
    return "back";
  };

  const positions = isMobile
    ? {
        center: { x: 0, scale: 1, opacity: 1, zIndex: 30 },
        left: { x: -80, scale: 0.85, opacity: 0.45, zIndex: 15 },
        right: { x: 80, scale: 0.85, opacity: 0.45, zIndex: 15 },
        back: { x: 0, scale: 0.6, opacity: 0, zIndex: 5 },
      }
    : {
        center: { x: 0, scale: 1, opacity: 1, zIndex: 40 },
        left: { x: -190, scale: 0.85, opacity: 0.5, zIndex: 20 },
        right: { x: 190, scale: 0.85, opacity: 0.5, zIndex: 20 },
        back: { x: 0, scale: 0.55, opacity: 0, zIndex: 5 },
      };

  const heights = isMobile
    ? {
        center: "min(60vh, 420px)",
        left: "min(48vh, 360px)",
        right: "min(48vh, 360px)",
        back: "min(32vh, 240px)",
      }
    : {
        center: "min(78vh, 640px)",
        left: "min(64vh, 520px)",
        right: "min(64vh, 520px)",
        back: "min(44vh, 360px)",
      };

  const getSizeStyles = (position: keyof typeof positions, aspect: number) => {
    const height = heights[position];
    const width = `calc(${height} / ${aspect.toFixed(4)})`;
    return { height, width };
  };

  return (
    <div
      className={`relative isolate flex w-full items-center justify-center overflow-hidden ${heightClass} ${className}`}
    >
      {showBackground && (
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <div className="absolute left-1/3 top-12 h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(127,203,216,0.18),_transparent_70%)] blur-3xl" />
          <div className="absolute bottom-10 right-1/5 h-80 w-80 rounded-full bg-[radial-gradient(circle,_rgba(148,163,184,0.2),_transparent_75%)] blur-3xl" />
        </div>
      )}
      <div className="relative mx-auto flex h-full w-full max-w-7xl items-end justify-center px-2 sm:px-0">
        {shots.map((shot, idx) => {
          const position = getPosition(idx);
          const size = getSizeStyles(position as keyof typeof positions, shot.aspect);
          return (
            <motion.div
              key={shot.alt}
              className="absolute bottom-0"
              animate={positions[position]}
              initial={positions[position]}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              style={{
                transformOrigin: "50% 100%",
                height: size.height,
                width: size.width,
              }}
            >
              <Image
                src={shot.image}
                alt={shot.alt}
                fill
                priority={idx === 0}
                sizes="(min-width: 1024px) 520px, 90vw"
                className="object-contain object-bottom"
              />
            </motion.div>
          );
        })}
        {showPlatform && (
          <div className="pointer-events-none absolute bottom-[6%] left-1/2 h-6 w-[70%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(15,23,42,0.12),_transparent_70%)] blur-3xl" />
        )}
      </div>
    </div>
  );
};

export default BottleCarouselStage;
