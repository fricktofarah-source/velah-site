// components/SubscriptionTeaser.tsx
import Link from "next/link";

export default function SubscriptionTeaser() {
  return (
    <section id="subscriptionteaser" className="section max-w-7xl mx-auto px-4 sm:px-6">
      <div className="card p-6 sm:p-8 grid md:grid-cols-2 gap-6 items-center">
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Subscription, made simple</h2>
          <p className="mt-3 text-slate-600">
            Pick your weekly mix of 5G, 1L, and 500 mL. Change or skip any week. Deposits are refunded when
            bottles return.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/subscription" className="btn btn-primary h-11 rounded-full px-6">Explore subscription</Link>
            <Link href="/about" className="btn btn-ghost h-11 rounded-full px-6">How it works</Link>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border bg-white/70 backdrop-blur p-4 text-center">
            <div className="text-xs text-slate-500">5 Gallon</div>
            <div className="font-semibold mt-1">Counter + Dispenser</div>
          </div>
          <div className="rounded-xl border bg-white/70 backdrop-blur p-4 text-center">
            <div className="text-xs text-slate-500">1 Litre</div>
            <div className="font-semibold mt-1">Day & Gym</div>
          </div>
          <div className="rounded-xl border bg-white/70 backdrop-blur p-4 text-center">
            <div className="text-xs text-slate-500">500 mL</div>
            <div className="font-semibold mt-1">On the go</div>
          </div>
        </div>
      </div>
    </section>
  );
}
