// app/blog/[slug]/page.tsx
import Image from "next/image";
import Link from "next/link";
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
      images: post.hero
        ? [
            {
              url: post.hero.src,
              alt: post.hero.alt,
            },
          ]
        : undefined,
    },
    alternates: { canonical: `/blog/${post.slug}` },
  };
}

function readTime(txt: string) {
  const words = txt.trim().split(/\s+/).length;
  return Math.max(2, Math.round(words / 225));
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = posts.find((p) => p.slug === params.slug);
  if (!post) return notFound();

  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));
  const currentIdx = sorted.findIndex((p) => p.slug === post.slug);
  const previousPost = currentIdx >= 0 ? sorted[currentIdx + 1] : null;

  const minutes = readTime(post.content ?? "");
  const published = new Date(post.date).toLocaleDateString("en-US", {
    dateStyle: "long",
  });
  const tags = post.tags ?? [];

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
    <article className="pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <Link href="/blog" className="link-underline text-sm font-medium text-slate-600">
          ← Back to all articles
        </Link>
      </div>

      <header className="mt-6 sm:mt-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl space-y-3">
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
              {post.title}
            </h1>
            <p className="text-sm text-slate-500">
              {published} · {minutes} min read
            </p>
            {post.excerpt && (
              <p className="text-base text-slate-600">{post.excerpt}</p>
            )}
          </div>
        </div>
      </header>

      {post.hero ? (
        <div className="mt-8 sm:mt-10 mb-12 sm:mb-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <figure className="overflow-hidden rounded-3xl border bg-white/70 backdrop-blur">
              <div className="relative w-full aspect-[16/9]">
                <Image
                  src={post.hero.src}
                  alt={post.hero.alt}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 1200px"
                  className="object-cover"
                />
              </div>
              {(post.hero.caption || post.hero.eyebrow) && (
                <figcaption className="flex flex-col gap-2 px-5 py-4 text-sm text-slate-600">
                  {post.hero.eyebrow && (
                    <span className="text-[11px] uppercase tracking-[0.18em] text-slate-500 font-medium">
                      {post.hero.eyebrow}
                    </span>
                  )}
                  {post.hero.caption && <span>{post.hero.caption}</span>}
                </figcaption>
              )}
            </figure>
          </div>
        </div>
      ) : null}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-14">
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 text-xs uppercase tracking-wide text-slate-500">
            {tags.map((tag) => (
              <span key={tag} className="font-semibold text-slate-500">
                {tag}
              </span>
            ))}
          </div>
        )}

        {(post.sections ?? []).map((section, idx) => (
          <section key={section.heading ?? idx} className="space-y-5">
            {section.heading && (
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                {section.heading}
              </h2>
            )}

            {section.image && (
              <figure className="overflow-hidden rounded-2xl border bg-white/70 backdrop-blur">
                <Image
                  src={section.image.src}
                  alt={section.image.alt}
                  width={1200}
                  height={800}
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="h-auto w-full object-cover"
                />
                {section.image.caption && (
                  <figcaption className="px-4 py-3 text-xs text-slate-500">
                    {section.image.caption}
                  </figcaption>
                )}
              </figure>
            )}

            {section.body?.map((paragraph, i) => (
              <p key={i} className="text-base leading-relaxed text-slate-700">
                {paragraph}
              </p>
            ))}

            {section.bullets && (
              <ul className="list-disc space-y-2 pl-5 text-base text-slate-700">
                {section.bullets.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}

            {section.quote && (
              <blockquote className="rounded-2xl border-l-4 border-[var(--velah)] bg-[var(--velah)]/10 px-6 py-5 text-slate-800">
                <p className="text-lg font-medium leading-relaxed">
                  “{section.quote.text}”
                </p>
                <cite className="mt-3 block text-sm font-semibold text-slate-600">
                  {section.quote.by}
                </cite>
              </blockquote>
            )}
          </section>
        ))}

        {/* Fallback if sections missing */}
        {(!post.sections || post.sections.length === 0) && (
          <div className="space-y-5">
            {(post.content ?? "")
              .split("\n\n")
              .map((paragraph, i) => (
                <p key={i} className="text-base leading-relaxed text-slate-700">
                  {paragraph}
                </p>
              ))}
          </div>
        )}

        {post.cta && (
          <div className="card card-hover p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="text-lg font-semibold text-slate-900">
                  Velah is the clean-water upgrade
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  {post.cta.description ??
                    "Swap single-use plastic for refillable glass without sacrificing taste or convenience."}
                </p>
              </div>
              <a href={post.cta.href} className="btn btn-primary h-11 rounded-full px-6 shrink-0">
                {post.cta.label}
              </a>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/blog"
            className="link-underline text-sm font-medium text-slate-600"
          >
            ← Back to all articles
          </Link>
          {previousPost && (
            <Link
              href={`/blog/${previousPost.slug}`}
              className="btn btn-ghost h-10 px-4 rounded-full text-sm"
            >
              Previous: {previousPost.title}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
