// components/Bottles.tsx
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "./LanguageProvider";
import { PRODUCTS } from "@/lib/products";
import { useCart } from "@/components/CartProvider";

const ease = [0.22, 1, 0.36, 1] as const;

const revealProps = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.35 },
  transition: { duration: 0.9, ease, delay },
});

export default function Bottles() {
  const { t } = useLanguage();
  const { addItem } = useCart();
  const bottles = t.bottles.items;

  // Mapping local bottle keys to Shop IDs
  const productMap: Record<string, string> = {
    "5g": "5G",
    "1l": "1L_single",
    "500ml": "500ml_case",
  };

  const heroImages: Record<string, string> = {
    "5g": "/about/5G_Invisiblebg.png",
    "1l": "/about/1L_invisiblebg.png",
    "500ml": "/about/500mL_invisiblebg.png",
  };

  return (
    <section id="bottles" className="relative isolate overflow-hidden bg-white py-24 sm:py-32">
      <div className="absolute inset-0 hidden bg-gradient-to-b from-white via-[#f4fbfc] to-white md:block" />
      <div className="absolute -left-16 top-8 hidden h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(127,203,216,0.18),_transparent_65%)] blur-3xl md:block" />
      <div className="absolute right-[-12%] bottom-0 hidden h-80 w-80 rounded-full bg-[radial-gradient(circle,_rgba(148,163,184,0.18),_transparent_65%)] blur-[110px] md:block" />
      <div className="absolute inset-x-0 top-24 mx-auto hidden h-64 w-[70%] rounded-full bg-white/50 blur-[140px] md:block" />
      <div className="absolute inset-x-0 bottom-10 mx-auto hidden h-56 w-[80%] rounded-full bg-white/40 blur-[160px] md:block" />

      <div className="section-shell section-shell--wide relative z-10">
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            {t.bottles.heading}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600">{t.about.paragraphs[0]}</p>

          <div className="mt-8 text-center">
            <Link href="/shop" className="btn btn-primary h-11 rounded-full px-8">
              Go to Shop
            </Link>
          </div>
        </div>

        <div
          className="relative mt-16 flex gap-12 overflow-x-auto pb-8 pl-10 pr-24 md:grid md:grid-cols-3 md:gap-12 md:overflow-visible md:px-0 md:pb-0"
          style={{ scrollSnapType: "x mandatory", scrollPaddingInline: "4.5rem" }}
        >
          {bottles.map((b, idx) => {
            const pid = productMap[b.key];
            const product = PRODUCTS.find(p => p.id === pid);

            return (
              <motion.article
                key={b.key}
                {...revealProps(idx * 0.08)}
                className="group relative flex min-w-[78%] snap-center snap-always flex-col items-center gap-6 text-center md:min-w-0"
              >
                <div className="pointer-events-none absolute inset-x-0 top-8 z-[-1] h-56 w-full rounded-full bg-white/40 blur-3xl" />
                <div className="relative flex w-full flex-col items-center">
                  <div className="pointer-events-none absolute bottom-0 h-20 w-40 rounded-full bg-slate-300/60 blur-[60px] sm:w-48" />
                  <div className="relative h-[420px] w-[220px] sm:h-[450px] sm:w-[240px]">
                    <Image
                      src={heroImages[b.key] ?? b.img}
                      alt={b.name}
                      fill
                      sizes="(min-width: 1024px) 16rem, (min-width: 768px) 15rem, 14rem"
                      className="object-contain object-bottom drop-shadow-[0_45px_110px_rgba(15,23,42,0.25)] transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="pointer-events-none absolute bottom-[-10px] h-16 w-40 rounded-full bg-gradient-to-r from-transparent via-slate-200/70 to-transparent blur-2xl sm:w-48" />
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl font-semibold text-slate-900">{b.name}</h3>
                  <p className="text-base leading-relaxed text-slate-600">{b.desc}</p>

                  {product && (
                    <div className="pt-2">
                      <div className="text-sm font-semibold text-slate-900 mb-3">{product.price} AED</div>
                      <button
                        onClick={() => addItem(product)}
                        className="btn btn-secondary rounded-full h-10 px-6 text-sm"
                      >
                        Add to Cart
                      </button>
                    </div>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
