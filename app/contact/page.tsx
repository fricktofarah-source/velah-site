"use client";

import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import { useLanguage } from "@/components/LanguageProvider";

export default function ContactPage() {
  const { t } = useLanguage();
  const copy = t.contact;
  return (
    <main className="container mx-auto max-w-3xl px-4 py-16">
      <div className="contact-reveal contact-reveal--1">
        <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          {copy.label}
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
          {copy.title}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {copy.subtitle}
        </p>
      </div>

      <div className="contact-reveal contact-reveal--2">
        <div className="mt-8 border-y border-slate-100 py-8">
          <div className="flex flex-col gap-2">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{copy.whatsappLabel}</div>
            <Link
              href="https://wa.me/971585827403"
              className="inline-block w-fit text-lg font-semibold text-slate-900 link-underline"
              target="_blank"
              rel="noreferrer"
            >
              {copy.whatsappCta}
            </Link>
          </div>
        </div>
      </div>

      <div className="contact-reveal contact-reveal--3">
        <div className="mt-10">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{copy.formTitle}</div>
          <ContactForm />
        </div>
      </div>

      <div className="contact-reveal contact-reveal--4">
        <div className="mt-10 text-sm text-slate-500">
          {copy.availability}
        </div>
      </div>
    </main>
  );
}
