// app/blog/[slug]/page.tsx
import { notFound } from "next/navigation";
import { posts } from "../../../lib/posts";

export async function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = posts.find((p) => p.slug === params.slug);
  if (!post) return notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">{post.title}</h1>
      <p className="text-xs text-slate-500 mt-1">{new Date(post.date).toLocaleDateString()}</p>
      <div className="prose prose-slate mt-6">
        {post.content.split("\n\n").map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
    </div>
  );
}
