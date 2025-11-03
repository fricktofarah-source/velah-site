'use client';

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "./LanguageProvider";

export default function Experience() {
  const { t } = useLanguage();
  const copy = t.experience;
  return (
    <section className="section section-decor" data-tone="dawn">
      <div className="section-shell section-shell--wide">
        <div className="relative overflow-hidden rounded-[2.5rem] border bg-white shadow-soft">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] items-stretch">
            <div className="relative hidden lg:block overflow-hidden">
              <Image
                src="/assets/velah-nature-1.png"
                alt="Velah glass bottles beside fresh fruit and herbs"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
                priority={false}
              />
            </div>

            <div className="p-8 sm:p-10 lg:p-14 flex flex-col gap-6">
              <div className="w-fit text-[11px] uppercase tracking-[0.2em] text-slate-500">
                {copy.badge}
              </div>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
                {copy.heading}
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
                {copy.body}
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                {copy.cards.map((item) => (
                  <div key={item.title} className="rounded-2xl border bg-white/80 backdrop-blur p-4 transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-1">
                    <div className="font-semibold text-slate-900">{item.title}</div>
                    <p className="mt-2 text-sm text-slate-600">{item.body}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link href="/sustainability" className="btn btn-primary h-11 rounded-full px-6">
                  {copy.primaryCta}
                </Link>
                <Link href="/about" className="link-underline text-sm font-medium text-slate-700">
                  {copy.secondaryCta}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
