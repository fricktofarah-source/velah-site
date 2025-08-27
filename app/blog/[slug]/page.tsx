// app/blog/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { posts } from "../../../lib/posts";

export async function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = posts.find((p) => p.slug === params.slug);
  if (!post) return {};
  const raw = (post.excerpt ?? post.content ?? "").replace(/\s+/g, " ").trim();
  const description = raw.slice(0, 160);

  return {
    title: `${post.title} | Velah Blog`,
    description,
    openGraph: {
      title: post.title,
      description,
      type: "article",
    },
    alternates: { canonical: `/blog/${post.slug}` },
  };
}

function readTime(txt: string) {
  const words = txt.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 225));
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = posts.find((p) => p.slug === params.slug);
  if (!post) return notFound();

  const minutes = readTime(post.content ?? "");
  const ld = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    description:
      (post.excerpt ?? post.content ?? "").replace(/\s+/g, " ").trim().slice(0, 160),
    author: { "@type": "Person", name: "Velah" },
    mainEntityOfPage: { "@type": "WebPage", "@id": `/blog/${post.slug}` },
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
      <h1 className="text-3xl font-semibold tracking-tight">{post.title}</h1>
      <p className="text-xs text-slate-500 mt-1">
        {new Date(post.date).toLocaleDateString()} · {minutes} min read
      </p>
      <div className="prose-default mt-6">
        {(post.content ?? "")
          .split("\n\n")
          .map((para: string, i: number) => (
            <p key={i}>{para}</p>
          ))}
      </div>
    </div>
  );
}
