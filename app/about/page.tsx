// app/about/page.tsx
import type { Metadata, Viewport } from "next";
import ScrollVideo from "@/components/ScrollVideo";

export const metadata: Metadata = {
  title: "About | Velah",
  description:
    "Velah is a refillable hydration loop in reusable glass. Calm, seamless, and considered.",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function AboutPage() {
  return (
    <>
      <div className="-mt-16 sm:-mt-20">
        <ScrollVideo
          src="/videos/velah_animation.mp4"
          showCue={false}
          showFades={false}
          transformOnScroll={false}
          backgroundColor="#fff"
          minHeight="160vh"
        />
      </div>

      <main className="section-shell py-24 sm:py-32" />
    </>
  );
}
