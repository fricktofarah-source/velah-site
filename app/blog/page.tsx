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
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="card card-hover p-6 flex flex-col"
              aria-label={p.title}
            >
              <h3 className="text-xl font-semibold">{p.title}</h3>
              <p className="text-xs text-slate-500 mt-1">
                {new Date(p.date).toLocaleDateString()}
              </p>
              <p className="text-slate-600 mt-3">{p.excerpt}</p>
              <span className="mt-4 inline-flex items-center gap-1 nav-link">
                Read more →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
