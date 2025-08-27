// app/about/page.tsx
import type { Metadata, Viewport } from "next";
import dynamic from "next/dynamic";

// avoid RSC event-handler errors: AboutClient is a client component
const AboutClient = dynamic(() => import("../../components/AboutClient"), { ssr: false });

export const metadata: Metadata = {
  title: "About | Velah",
  description:
    "Eco-luxury hydration in reusable glass. The story behind Velah and our refillable loop.",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function AboutPage() {
  return <AboutClient />;
}
