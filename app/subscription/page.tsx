// app/subscription/page.tsx
import type { Metadata } from "next";
import Subscription from "@/components/Subscription";

export const metadata: Metadata = {
  title: "Subscription | Velah",
  description: "AI-suggested weekly plan in reusable glass. Edit quantities any week.",
};

export default function SubscriptionPage() {
  return (
    <section className="section">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <header className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Subscription</h1>
          <p className="mt-2 text-slate-600 max-w-2xl">
            Start with an AI suggestion based on your household, then adjust any week. Refillable glass,
            stainless caps, refundable deposit.
          </p>
        </header>

        <Subscription />
      </div>
    </section>
  );
}
