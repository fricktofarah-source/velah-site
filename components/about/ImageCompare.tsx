// components/about/ImageCompare.tsx
"use client";

import { useState, useRef } from "react";
import Image from "next/image";

export default function ImageCompare({
  before,
  after,
  beforeLabel,
  afterLabel,
}: {
  before: string;
  after: string;
  beforeLabel: string;
  afterLabel: string;
}) {
  const [split, setSplit] = useState(55);
  const [dragging, setDragging] = useState(false);
  const frameRef = useRef<HTMLDivElement | null>(null);

  const updateSplit = (clientX: number) => {
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    const raw = ((clientX - rect.left) / rect.width) * 100;
    const next = Math.min(100, Math.max(0, Math.round(raw)));
    setSplit(next);
  };

  return (
    <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-100 select-none touch-none">
      <div
        ref={frameRef}
        className="relative aspect-[4/3] w-full"
        onPointerDown={(event) => {
          setDragging(true);
          updateSplit(event.clientX);
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (!dragging) return;
          updateSplit(event.clientX);
        }}
        onPointerUp={(event) => {
          setDragging(false);
          event.currentTarget.releasePointerCapture(event.pointerId);
        }}
        onPointerCancel={() => setDragging(false)}
      >
        <Image
          src={before}
          alt="Room with glass bottles"
          fill
          sizes="(min-width: 1024px) 520px, 90vw"
          className="object-cover object-center"
          draggable={false}
        />
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}
        >
          <Image
            src={after}
            alt="Room with plastic bottles"
            fill
            sizes="(min-width: 1024px) 520px, 90vw"
            className="object-cover object-center"
            draggable={false}
          />
        </div>
        <div
          className="absolute inset-y-0 cursor-ew-resize"
          style={{ left: `calc(${split}% - 18px)` }}
          role="slider"
          aria-label="Compare room images"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={split}
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") setSplit((v) => Math.max(0, v - 2));
            if (event.key === "ArrowRight") setSplit((v) => Math.min(100, v + 2));
          }}
        >
          <div className="h-full w-9 flex items-center justify-center">
            <div className="h-full w-[2px] bg-white/90 shadow-[0_0_12px_rgba(15,23,42,0.25)]" />
          </div>
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90 shadow-[0_10px_30px_rgba(15,23,42,0.18)] flex items-center justify-center text-slate-500 text-xs font-semibold">
            ↔
          </div>
        </div>
        <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-white/80 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-slate-600">
          {beforeLabel}
        </div>
        <div className="pointer-events-none absolute right-4 top-4 rounded-full bg-white/80 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-slate-600">
          {afterLabel}
        </div>
      </div>
    </div>
  );
};
