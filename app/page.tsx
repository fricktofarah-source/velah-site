// app/page.tsx
import Hero from "../components/Hero";
import About from "../components/About";
import Subscription from "../components/Subscription";
import Link from "next/link";
import { posts } from "../lib/posts";
import Bottles from "../components/Bottles";


export default function Home() {
  const latest = [...posts]
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .slice(0, 3);

  return (
    <>
      <Hero />

      {/* ABOUT SECTION */}
{/* ABOUT */}
<About />

{/* BOTTLES (new) */}
  <Bottles />

      {/* SUSTAINABILITY */}
<section id="sustainability" className="scroll-mt-28">
  <div className="relative">
    {/* subtle tinted band so this section feels distinct */}
    <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(127,203,216,0.08),rgba(127,203,216,0.06))]" />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-3xl font-semibold tracking-tight">Sustainability</h2>
        <Link href="/sustainability" className="nav-link hover:text-velah">
          Read more →
        </Link>
      </div>

      {/* Cards */}
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {/* 1 */}
        <div className="rounded-3xl border bg-white/70 backdrop-blur p-6 hover:shadow-soft transition card-hover">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 24 24" className="h-6 w-6 text-[var(--velah)]" aria-hidden>
              <path fill="currentColor" d="M12 2a8 8 0 0 1 8 8c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 8-8zm0 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/>
            </svg>
            <h3 className="font-semibold text-lg">Refill, not landfill</h3>
          </div>
          <p className="text-slate-600 mt-3">
            Every bottle is washed, sanitized, and put back into circulation, cutting single‑use waste at the source.
          </p>
        </div>

        {/* 2 (Dubai + ESG/CSR) */}
        <div className="rounded-3xl border bg-white/70 backdrop-blur p-6 hover:shadow-soft transition card-hover">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 24 24" className="h-6 w-6 text-[var(--velah)]" aria-hidden>
              <path fill="currentColor" d="M12 3l2.5 5.1L20 9l-4 3.9L17 19l-5-2.6L7 19l1-6.1L4 9l5.5-.9L12 3z"/>
            </svg>
            <h3 className="font-semibold text-lg">Aligned with Dubai’s agenda</h3>
          </div>
          <p className="text-slate-600 mt-3">
            Built to support Dubai’s long‑term sustainability ambitions while helping our partners report on
            ESG and CSR from circular packaging to lower emissions per delivery.
          </p>
        </div>

        {/* 3 */}
        <div className="rounded-3xl border bg-white/70 backdrop-blur p-6 hover:shadow-soft transition card-hover">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 24 24" className="h-6 w-6 text-[var(--velah)]" aria-hidden>
              <path fill="currentColor" d="M3 13h2a7 7 0 1 0 0-2H3a9 9 0 1 1 0 2z"/>
            </svg>
            <h3 className="font-semibold text-lg">Optimized routes</h3>
          </div>
          <p className="text-slate-600 mt-3">
            AI‑assisted batching reduces mileage per liter delivered—fewer trips, fewer emissions, same great water.
          </p>
        </div>
      </div>

      {/* Metrics row */}
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border bg-white/80 backdrop-blur p-5 text-center">
          <div className="text-3xl font-semibold tracking-tight">90%+</div>
          <div className="text-slate-600 text-sm mt-1">Target bottle reuse rate</div>
        </div>
        <div className="rounded-3xl border bg-white/80 backdrop-blur p-5 text-center">
          <div className="text-3xl font-semibold tracking-tight">−60%</div>
          <div className="text-slate-600 text-sm mt-1">Less single‑use plastic vs. cases</div>
        </div>
        <div className="rounded-3xl border bg-white/80 backdrop-blur p-5 text-center">
          <div className="text-3xl font-semibold tracking-tight">−30%</div>
          <div className="text-slate-600 text-sm mt-1">CO₂ per liter (optimized routes)</div>
        </div>
      </div>

      {/* CTA (same animated underline/arrow vibe) */}
      <div className="mt-8 flex justify-end">
        <Link href="/sustainability" className="relative inline-flex items-center gap-1 text-slate-900 group">
        </Link>
      </div>
    </div>
  </div>
</section>

      {/* SUBSCRIPTION (full) */}
      <section id="subscription" className="scroll-mt-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between gap-4 mb-8">
          <h2 className="text-3xl font-semibold tracking-tight">Subscription</h2>
        </div>
        <Subscription />
      </section>

      {/* Blog preview */}
      <section id="blog" className="scroll-mt-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-3xl font-semibold tracking-tight">From the blog</h2>
          <Link href="/blog" className="nav-link hover:text-velah">View all →</Link>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {latest.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="card p-6 card-hover group block">
              <h3 className="text-xl font-semibold">{p.title}</h3>
              <p className="text-xs text-slate-500 mt-1">{new Date(p.date).toLocaleDateString()}</p>
              <p className="text-slate-600 mt-3">{p.excerpt}</p>
              <span className="mt-4 inline-flex items-center gap-1 nav-link group-hover:text-velah">
                Read more →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
