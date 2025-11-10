// app/subscription/page.tsx
import type { Metadata } from "next";
import Subscription from "@/components/Subscription";
import Bottles from "@/components/Bottles";
import Link from "next/link";
import JoinWaitlistButton from "@/components/JoinWaitlistButton";

export const metadata: Metadata = {
  title: "Subscription | Velah",
  description:
    "Pick your weekly mix of 5G, 1L, and 500 mL. Change or skip any week. Deposits refunded on return.",
};

export default function SubscriptionPage() {
  return (
    <main>
      {/* Hero */}
      <section className="section">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Your weekly subscription</h1>
          <p className="mt-3 text-slate-600 max-w-2xl">
            Start with our suggestion, then fine-tune quantities. You’re always in control. Confirm, change, or skip whenever you like.
          </p>
        </div>
      </section>

      <Bottles />

      {/* Estimator */}
      <section className="section pt-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Subscription />
        </div>
      </section>

      {/* Benefits */}
      <section className="section">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight">Why subscribe</h2>
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              ["Flexible every week", "Confirm, change, or skip before delivery."],
              ["Glassy & reusable", "Taste stays clean; bottles recirculate."],
              ["Optimized routes", "Batching lowers CO₂ per liter."],
              ["Refundable deposit", "Money back as bottles return."],
            ].map(([title, body]) => (
              <div key={title} className="rounded-2xl border bg-white/70 backdrop-blur p-5">
                <div className="font-medium">{title}</div>
                <p className="text-slate-600 mt-1 text-sm">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section pt-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight">FAQ</h2>
          <div className="mt-4 divide-y rounded-2xl border bg-white/70 backdrop-blur">
            {[
              ["How do deposits work?", "A small deposit per bottle keeps the loop working. It’s fully refunded when bottles return."],
              ["Can I change weeks?", "Yes. You’ll get a reminder to confirm, edit quantities, or skip with one tap."],
              ["What sizes can I mix?", "5 gallon, 1 liter, and 500 mL. Mix as you like for home, gym, and on-the-go."],
              ["Where do you deliver?", "We’re rolling out across Dubai first and opening more areas soon."],
            ].map(([q, a]) => (
              <details key={q} className="p-5">
                <summary className="cursor-pointer font-medium">{q}</summary>
                <p className="mt-2 text-slate-600">{a}</p>
              </details>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Link href="/about" className="nav-link inline-flex items-center gap-1">
              Learn more about the loop →
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section pt-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-semibold">Ready to start?</h2>
          <p className="text-slate-600 mt-2">Join the waitlist and we’ll notify you when your area opens.</p>
          <div className="mt-4 flex justify-center">
            <JoinWaitlistButton />
          </div>
        </div>
      </section>
    </main>
  );
}
