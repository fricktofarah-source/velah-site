"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Post } from "@/lib/posts";
import { useLanguage } from "./LanguageProvider";

type BlogPreviewProps = {
  posts: Post[];
};

export default function BlogPreview({ posts }: BlogPreviewProps) {
  const { t, language } = useLanguage();
  const copy = t.blog;

  const latestPosts = useMemo(() => {
    return [...posts]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 3);
  }, [posts]);

  return (
    <section
      id="blog"
      className="section section-decor scroll-mt-24 sm:scroll-mt-32"
      data-tone="dawn"
    >
      <div className="section-shell">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            {copy.heading}
          </h2>
          <Link href="/blog" className="nav-link">
            {copy.allPosts}
          </Link>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {latestPosts.map((post) => {
            const words = post.content.trim().split(/\s+/).length;
            const mins = Math.max(2, Math.round(words / 200));
            const date = new Date(post.date).toLocaleDateString(language === "AR" ? "ar-SA" : "en-US", {
              dateStyle: "medium",
            });
            const localized = language === "AR" ? post.translations?.AR : undefined;
            const displayTitle = localized?.title ?? post.title;
            const displayExcerpt = localized?.excerpt ?? post.excerpt;

            return (
              <article
                key={post.slug}
                className="card card-hover p-5 flex flex-col"
              >
                <div className="text-xs text-slate-500">
                  {date} • {mins} {language === "AR" ? "دقيقة قراءة" : "min read"}
                </div>
                <h3 className="mt-2 font-semibold text-lg">
                  <Link href={`/blog/${post.slug}`} className="link-underline">
                    {displayTitle}
                  </Link>
                </h3>
                <p className="mt-2 text-slate-600 flex-1">{displayExcerpt}</p>
                <div className="mt-auto pt-4">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="hover-parent inline-flex items-center gap-2 text-sm font-medium text-slate-900"
                  >
                    <span className="link-underline-tight">{copy.readMore}</span>
                    <span aria-hidden>→</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <div className="sm:hidden mt-4">
          <Link
            href="/blog"
            className="btn btn-primary h-11 w-full rounded-full"
          >
            {copy.mobileButton}
          </Link>
        </div>
      </div>
    </section>
  );
}
