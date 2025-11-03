// app/about/page.tsx
import type { Metadata, Viewport } from "next";
import dynamic from "next/dynamic";

// Client component holds all interactivity (tiny, respectful)
const AboutClient = dynamic(() => import("../../components/AboutClient"), { ssr: false });

export const metadata: Metadata = {
  title: "About | Velah",
  description:
    "Velah is a refillable hydration loop in reusable glass. Calm, seamless, and considered.",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function AboutPage() {
  return <AboutClient />;
}
