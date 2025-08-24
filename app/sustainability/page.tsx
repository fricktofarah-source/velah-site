export default function SustainabilityPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Sustainability at Velah</h1>
      <p className="text-slate-600 mt-3">
        We’re building a water service that tastes better and wastes less. Here’s how our system reduces
        single‑use plastic, lengthens bottle lifecycles, and lowers emissions per delivery.
      </p>

      <section className="prose prose-slate mt-8">
        <h2>Refillable glass system</h2>
        <p>
          Our bottles are collected, sanitized, and redeployed. No downcycling. No microplastics in taste.
        </p>

        <h2>Materials that last</h2>
        <p>
          Glass bottles and stainless caps can be reused many times. Components are easy to replace and recycle.
        </p>

        <h2>Route optimization</h2>
        <p>
          AI‑batched deliveries minimize miles per liter. Customers can skip or change schedules to avoid waste.
        </p>

        <h2>What’s next</h2>
        <p>
          We’re exploring lightweight crates, pooled returns, and a deposit model that maximizes bottle reuse.
        </p>
      </section>
    </main>
  );
}
