'use client';

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "./LanguageProvider";

export default function Experience() {
  const { t } = useLanguage();
  const copy = t.experience;
  return (
    <section className="section bg-white">
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] items-stretch">
          <div className="relative h-60 sm:h-72 lg:h-[520px] overflow-hidden rounded-[2rem] lg:rounded-[2.5rem]">
            <Image
              src="/assets/velah-nature-1.png"
              alt="Velah glass bottles beside fresh fruit and herbs"
              fill
              sizes="100vw"
              className="object-cover"
              priority={false}
            />
          </div>

          <div className="flex flex-col justify-center gap-6 lg:pl-12">
            <div className="w-fit text-[11px] uppercase tracking-[0.2em] text-slate-500">
              {copy.badge}
            </div>
            <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-slate-900">
              {copy.heading}
            </h2>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              {copy.body}
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              {copy.cards.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border bg-white/80 backdrop-blur p-4 transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-1"
                >
                  <div className="font-semibold text-slate-900">{item.title}</div>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{item.body}</p>
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
    </section>
  );
}
