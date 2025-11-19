// app/about/page.tsx
import type { Metadata, Viewport } from "next";
import AboutPageContent from "./AboutPageContent";

export const metadata: Metadata = {
  title: "About | Velah",
  description:
    "Velah is a refillable hydration loop in reusable glass. Calm, seamless, and considered.",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function AboutPage() {
  return <AboutPageContent />;
}
