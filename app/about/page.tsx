// app/about/page.tsx
import type { Metadata, Viewport } from "next";
import dynamic from "next/dynamic";

// Client component (holds all interactivity/handlers)
const AboutClient = dynamic(() => import("../../components/AboutClient"), { ssr: false });

export const metadata: Metadata = {
  title: "About | Velah",
  description:
    "A seamless, story-driven look at Velah—eco-luxury hydration in reusable glass.",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function AboutPage() {
  return <AboutClient />;
}
