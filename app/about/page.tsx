import type { Metadata } from "next";
import AboutClient from "../../components/AboutClient";

export const metadata: Metadata = {
  title: "About | Velah",
  description:
    "Eco-luxury hydration in reusable glass. The story behind Velah, our origin, and how the refillable loop works.",
};

export default function AboutPage() {
  return <AboutClient />;
}
