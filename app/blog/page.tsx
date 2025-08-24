// app/blog/page.tsx
import Link from "next/link";
import { posts } from "../../lib/posts";

export default function BlogIndex() {
  const all = [...posts].sort((a, b) => +new Date(b.date) - +new Date(a.date));
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Blog</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {all.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="card p-6 card-hover block">
            <h3 className="text-xl font-semibold">{p.title}</h3>
            <p className="text-xs text-slate-500 mt-1">{new Date(p.date).toLocaleDateString()}</p>
            <p className="text-slate-600 mt-3">{p.excerpt}</p>
            <span className="mt-4 inline-flex items-center gap-1 nav-link">Read more →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
