// app/subscription/page.tsx
import type { Metadata } from "next";
import OrderBuilder from "@/components/OrderBuilder";

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
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Order Velah</h1>
          <p className="mt-3 text-slate-600 max-w-2xl">
            Build a one-time order with our AI weekly recommendation. Adjust quantities or add individual bottles, then add to cart.
          </p>
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
