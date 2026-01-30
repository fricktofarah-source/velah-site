// components/shop/ProductDetailClient.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCart } from "@/components/CartProvider";
import { useLanguage } from "@/components/LanguageProvider";
import type { Product } from "@/lib/products";

export default function ProductDetailClient({ product }: { product: Product }) {
    const { t } = useLanguage();
    const { addItem } = useCart();

    const formatPrice = (amount: number) => new Intl.NumberFormat('en-US').format(amount);

    return (
        <main className="bg-white py-16 sm:py-24">
            <div className="section-shell section-shell--wide">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="grid md:grid-cols-2 gap-10 lg:gap-16 items-start"
                >
                    {/* Left: Image */}
                    <div className="relative aspect-square w-full max-w-lg mx-auto md:max-w-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
                            className="relative h-full"
                        >
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                priority
                                sizes="(min-width: 768px) 50vw, 100vw"
                                className="object-contain drop-shadow-xl"
                            />
                        </motion.div>
                    </div>

                    {/* Right: Details */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                        className="flex flex-col pt-4"
                    >
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">{product.name}</h1>
                        <p className="mt-3 text-base text-slate-600 leading-relaxed">{product.description}</p>

                        <div className="mt-6">
                            <span className="text-3xl font-semibold text-slate-800">{formatPrice(product.price)} AED</span>
                            <p className="mt-1 text-sm text-slate-500">
                                + {formatPrice(product.deposit)} AED refundable deposit
                            </p>
                        </div>

                        <div className="mt-8 flex items-center gap-4">
                            <button
                                onClick={() => addItem(product)}
                                className="btn btn-primary h-12 px-10 rounded-full text-base"
                            >
                                {t.shop.addToCart}
                            </button>
                        </div>

                        <div className="mt-10">
                            <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-velah transition-colors group">
                                <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
                                <span>{t.shop.backToShop}</span>
                            </Link>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </main>
    );
}
