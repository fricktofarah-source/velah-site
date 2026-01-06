// app/blog/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { posts } from "../../lib/posts";

export const metadata: Metadata = {
  title: "Blog | Velah",
  description:
    "Notes on glass systems, sustainable logistics, and product updates.",
};

export default function BlogIndex() {
  const all = [...posts].sort(
    (a, b) => +new Date(b.date) - +new Date(a.date)
  );

  return (
    <section className="section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-6 sm:mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">Blog</h1>
          <p className="mt-2 text-slate-600 max-w-2xl">
            Updates from the Velah team: product notes, circular system learnings,
            and delivery operations in Dubai.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          {all.map((p) => (
            <article key={p.slug} className="card card-hover p-6 flex flex-col">
              <h3 className="text-xl font-semibold">
                <Link href={`/blog/${p.slug}`} className="focus-ring rounded-lg">
                  {p.title}
                </Link>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {new Date(p.date).toLocaleDateString()}
              </p>
              <p className="text-slate-600 mt-3">{p.excerpt}</p>
              <div className="mt-4">
                <Link href={`/blog/${p.slug}`} className="inline-block group focus-ring rounded-xl">
                  <span className="relative inline-flex items-center gap-2 text-slate-700 transition-colors group-hover:text-velah">
                    <span>Read more</span>
                    <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                    <span className="absolute left-0 -bottom-0.5 h-[2px] w-0 bg-current transition-all duration-300 group-hover:w-full" />
                  </span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
