// app/page.tsx
import Link from "next/link";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Bottles from "@/components/Bottles";
import Subscription from "@/components/Subscription";
import HowItWorks from "@/components/HowItWorks";
import Counter from "@/components/Counter";
import SubscriptionTeaser from "@/components/SubscriptionTeaser";
import { posts } from "@/lib/posts"; // <-- added for the blog preview

export default function HomePage() {
  return (
    <>
      <Hero />

      <section id="about" className="section">
        <About />
      </section>

      <section id="bottles" className="section">
        <Bottles />
      </section>

      <HowItWorks />

      <SubscriptionTeaser />

      <section id="sustainability" className="section bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              Sustainability
            </h2>
            <Link href="/sustainability" className="nav-link hover:text-velah">
              Read more →
            </Link>
          </div>

          <p className="mt-3 text-slate-600 max-w-3xl">
            Refillable glass, durable materials, and optimized routes to cut
            waste at the source. Our aim is to reduce plastic and emissions
            without compromising taste or convenience.
          </p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="rounded-3xl border bg-white/80 backdrop-blur p-5 text-center">
              <Counter to={90} suffix="%+" />
              <div className="text-slate-600 text-sm mt-1">
                Target bottle reuse rate
              </div>
            </div>

            <div className="rounded-3xl border bg-white/80 backdrop-blur p-5 text-center">
              <Counter to={60} prefix="−" suffix="%" />
              <div className="text-slate-600 text-sm mt-1">
                Less single-use plastic vs. cases
              </div>
            </div>

            <div className="rounded-3xl border bg-white/80 backdrop-blur p-5 text-center">
              <Counter to={30} prefix="−" suffix="%" />
              <div className="text-slate-600 text-sm mt-1">
                CO₂ per liter (optimized routes)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- BLOG (home section) --- */}
      <section id="blog" className="section">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              From the blog
            </h2>
            <Link href="/blog" className="nav-link hover:text-velah">
              All posts →
            </Link>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...posts]
              .sort((a, b) => b.date.localeCompare(a.date))
              .slice(0, 3)
              .map((p) => {
                const words = p.content.trim().split(/\s+/).length;
                const mins = Math.max(2, Math.round(words / 200)); // ~200 wpm
                const date = new Date(p.date).toLocaleDateString("en-US", {
                  dateStyle: "medium",
                });

                return (
                  <article
                    key={p.slug}
                    className="rounded-2xl border bg-white/70 backdrop-blur p-5 flex flex-col"
                  >
                    <div className="text-xs text-slate-500">
                      {date} • {mins} min read
                    </div>
                    <h3 className="mt-2 font-semibold text-lg">
                      <Link href={`/blog/${p.slug}`} className="hover-underline">
                        {p.title}
                      </Link>
                    </h3>
                    <p className="mt-2 text-slate-600">{p.excerpt}</p>
                    <div className="mt-4">
                      <Link
                        href={`/blog/${p.slug}`}
                        className="btn btn-ghost h-9 rounded-full"
                      >
                        Read
                      </Link>
                    </div>
                  </article>
                );
              })}
          </div>

          {/* Mobile CTA */}
          <div className="sm:hidden mt-4">
            <Link
              href="/blog"
              className="btn btn-primary h-11 w-full rounded-full"
            >
              All posts
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
