// app/page.tsx
import Link from "next/link";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Bottles from "@/components/Bottles";
import HowItWorks from "@/components/HowItWorks";
import MarqueeBand from "@/components/MarqueeBand";
import Experience from "@/components/Experience";
import SubscriptionPeek from "@/components/SubscriptionPeek";
import ImpactStats from "@/components/ImpactStats";
import Testimonials from "@/components/Testimonials";
import { posts } from "@/lib/posts";

export default function HomePage() {
  return (
    <>
      <Hero />

      <About />

      <Bottles />

      <HowItWorks />

      <MarqueeBand />

      <Experience />

      <SubscriptionPeek />

      <ImpactStats />

      <Testimonials />

      {/* --- BLOG (home section) --- */}
      <section
        id="blog"
        className="section section-decor scroll-mt-24 sm:scroll-mt-32"
        data-tone="dawn"
      >
        <div className="section-shell">
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              From the blog
            </h2>
            <Link href="/blog" className="nav-link">
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
                    className="card card-hover p-5 flex flex-col"
                  >
                    <div className="text-xs text-slate-500">
                      {date} • {mins} min read
                    </div>
                    <h3 className="mt-2 font-semibold text-lg">
                      <Link href={`/blog/${p.slug}`} className="link-underline">
                        {p.title}
                      </Link>
                    </h3>
                    <p className="mt-2 text-slate-600 flex-1">{p.excerpt}</p>
                    <div className="mt-auto pt-4">
                      <Link
                        href={`/blog/${p.slug}`}
                        className="hover-parent inline-flex items-center gap-2 text-sm font-medium text-slate-900"
                      >
                        <span className="link-underline-tight">Read more</span>
                        <span aria-hidden>→</span>
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
