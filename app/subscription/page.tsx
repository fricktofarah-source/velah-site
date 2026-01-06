// app/subscription/page.tsx
import type { Metadata } from "next";
import OrderBuilder from "@/components/OrderBuilder";
import OrderPageIntro from "@/components/OrderPageIntro";

export const metadata: Metadata = {
  title: "Order | Velah",
  description:
    "Build a one-time order with AI guidance. Add bottles to your cart and place orders as needed.",
};

export default function SubscriptionPage() {
  return (
    <main>
      <section className="section">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <OrderPageIntro />
        </div>
      </section>

      <section className="section pt-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <OrderBuilder />
        </div>
      </section>
    </main>
  );
}
