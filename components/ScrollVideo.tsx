'use client';

import { useEffect, useMemo, useRef, type CSSProperties } from "react";

type ScrollVideoProps = {
  src: string;
  poster?: string;
  overlayTitle?: string;
  overlayCaption?: string;
  showCue?: boolean;
  showFades?: boolean;
  transformOnScroll?: boolean;
  className?: string;
  minHeight?: string;
  backgroundColor?: string;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export default function ScrollVideo({
  src,
  poster,
  overlayTitle,
  overlayCaption,
  showCue = true,
  showFades = true,
  transformOnScroll = true,
  className,
  minHeight,
  backgroundColor,
}: ScrollVideoProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const customStyle = useMemo(() => {
    const style: (CSSProperties & {
      "--scroll-video-min-height"?: string;
      "--scroll-video-bg"?: string;
    }) = {};
    if (minHeight) style["--scroll-video-min-height"] = minHeight;
    if (backgroundColor) style["--scroll-video-bg"] = backgroundColor;
    return style;
  }, [minHeight, backgroundColor]);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    let frame = 0;
    let duration = 0;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const scrubToProgress = (progress: number) => {
      if (!duration || container.classList.contains("scroll-video--reduced")) return;
      const targetTime = progress * duration;
      if (Math.abs(video.currentTime - targetTime) > 0.001) {
        video.currentTime = targetTime;
      }
    };

    const applyTransform = (progress: number) => {
      container.style.setProperty("--scroll-video-progress", progress.toFixed(4));
      scrubToProgress(progress);
      if (!transformOnScroll || container.classList.contains("scroll-video--reduced")) {
        video.style.transform = "none";
        return;
      }
      const translate = -(progress * 16);
      const scale = 1.08 - progress * 0.08;
      video.style.transform = `translate3d(0, ${translate}vh, 0) scale(${scale})`;
    };

    const updateProgress = () => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const totalScroll = Math.max(rect.height - viewport, 1);
      const offset = clamp(viewport - rect.top, 0, viewport + totalScroll);
      const progress = clamp(offset / (viewport + totalScroll), 0, 1);
      applyTransform(progress);
    };

    const scheduleUpdate = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(updateProgress);
    };

    const onLoadedMetadata = () => {
      duration = video.duration || 0;
      video.pause();
      scheduleUpdate();
    };

    const onMotionChange = () => {
      const reduce = prefersReducedMotion.matches;
      container.classList.toggle("scroll-video--reduced", reduce);
      if (reduce) {
        video.style.transform = "none";
        video.pause();
        video.currentTime = 0;
      } else {
        scheduleUpdate();
      }
    };

    onMotionChange();

    if (video.readyState >= 1) {
      onLoadedMetadata();
    } else {
      video.addEventListener("loadedmetadata", onLoadedMetadata);
    }

    scheduleUpdate();

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    const removeMotionListener = (() => {
      if (prefersReducedMotion.addEventListener) {
        prefersReducedMotion.addEventListener("change", onMotionChange);
        return () => prefersReducedMotion.removeEventListener("change", onMotionChange);
      }
      if (prefersReducedMotion.addListener) {
        prefersReducedMotion.addListener(onMotionChange);
        return () => prefersReducedMotion.removeListener(onMotionChange);
      }
      return () => {};
    })();

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      removeMotionListener();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [transformOnScroll]);

  return (
    <section
      className={["scroll-video", className].filter(Boolean).join(" ")}
      style={Object.keys(customStyle).length ? customStyle : undefined}
      ref={containerRef}
      aria-label="Velah animation"
    >
      <div className="scroll-video__pin">
        <video
          ref={videoRef}
          className="scroll-video__video"
          src={src}
          poster={poster}
          playsInline
          muted
          preload="auto"
        />

        {(overlayTitle || overlayCaption) && (
          <div className="scroll-video__overlay">
            {overlayTitle && <h1 className="scroll-video__title">{overlayTitle}</h1>}
            {overlayCaption && <p className="scroll-video__caption">{overlayCaption}</p>}
          </div>
        )}

        {showCue && (
          <div className="scroll-video__cue" aria-hidden>
            <span className="scroll-video__cue-line" />
            <span>Scroll</span>
          </div>
        )}

        {showFades && (
          <>
            <div className="scroll-video__fade-top" aria-hidden />
            <div className="scroll-video__fade-bottom" aria-hidden />
          </>
        )}
      </div>
    </section>
  );
}
