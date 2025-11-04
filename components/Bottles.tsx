// components/Bottles.tsx
"use client";

import Image from "next/image";
import { useLanguage } from "./LanguageProvider";

export default function Bottles() {
  const { t } = useLanguage();
  const bottles = t.bottles.items;

  function addToPlan(key: typeof bottles[number]["key"]) {
    // Optional: preselect bottle for Subscription section to read
    try {
      localStorage.setItem("velah:preselect", key);
    } catch {}
    // Smooth scroll to subscription
    document.getElementById("subscription")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section
      id="bottles"
      className="section section-decor scroll-mt-24 sm:scroll-mt-32"
      data-tone="oasis"
    >
      <div className="section-shell section-shell--wide">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-3xl font-semibold tracking-tight">{t.bottles.heading}</h2>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {bottles.map((b) => (
            <article
              key={b.key}
              className="group rounded-3xl border bg-white/70 backdrop-blur p-6 sm:p-8 transition hover:-translate-y-1 hover:shadow-soft"
            >
              <div className="grid grid-cols-[auto_1fr] md:grid-cols-[auto_1fr] gap-6 items-center">
                <div className="relative h-48 w-36 sm:h-56 sm:w-48">
                  <Image
                    src={b.img}
                    alt={b.name}
                    fill
                    sizes="(min-width: 1024px) 12rem, (min-width: 768px) 12rem, 10rem"
                    className="object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </div>

                <div>
                  <h3 className="text-xl font-semibold">{b.name}</h3>
                  <p className="mt-2 text-slate-600">{b.desc}</p>

                  <div className="mt-5">
                    <button
                      onClick={() => addToPlan(b.key)}
                      className="btn btn-primary h-10 px-4 rounded-full"
                    >
                      {t.bottles.addToPlan}
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
