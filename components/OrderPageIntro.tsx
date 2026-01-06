"use client";

import { useLanguage } from "./LanguageProvider";

export default function OrderPageIntro() {
  const { t } = useLanguage();
  const copy = t.orderPage;

  return (
    <>
      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">{copy.title}</h1>
      <p className="mt-3 text-slate-600 max-w-2xl">{copy.description}</p>
    </>
  );
}
