// components/shop/ProductDetailClient.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCart } from "@/components/CartProvider";
import { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import type { Product } from "@/lib/products";

export default function ProductDetailClient({ product }: { product: Product }) {
    const { t } = useLanguage();
    const { addItem } = useCart();

    // Plan State
    const [plan, setPlan] = useState<'one-time' | 'subscription'>('one-time');
    const [frequency, setFrequency] = useState<'weekly' | 'biweekly' | 'monthly'>('weekly');

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

                        <div className="mb-6">
                            <span className="text-3xl font-semibold text-slate-900">{formatPrice(product.price)} AED</span>
                            {plan === 'one-time' && (
                                <p className="mt-1 text-sm text-slate-500">
                                    + {formatPrice(product.deposit)} AED refundable deposit
                                </p>
                            )}
                        </div>

                        {/* Plan Selector: Two Boxes */}
                        {product.subscriptionEligible && (
                            <div className="grid grid-cols-1 gap-4 mb-8">
                                {/* Option 1: One-Time */}
                                <div
                                    onClick={() => setPlan('one-time')}
                                    className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${plan === 'one-time'
                                        ? 'border-[var(--velah)] bg-white shadow-sm'
                                        : 'border-slate-100 hover:border-slate-200 bg-slate-50/50'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${plan === 'one-time' ? 'border-[var(--velah)]' : 'border-slate-300'
                                                }`}>
                                                {plan === 'one-time' && <div className="w-2.5 h-2.5 bg-[var(--velah)] rounded-full" />}
                                            </div>
                                            <span className={`font-bold ${plan === 'one-time' ? 'text-slate-900' : 'text-slate-500'}`}>One-Time Purchase</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Option 2: Subscription */}
                                <div
                                    onClick={() => setPlan('subscription')}
                                    className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${plan === 'subscription'
                                        ? 'border-[var(--velah)] bg-[var(--velah)]/5 shadow-sm ring-1 ring-[var(--velah)]'
                                        : 'border-slate-100 hover:border-slate-200 bg-slate-50/50'
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${plan === 'subscription' ? 'border-[var(--velah)]' : 'border-slate-300'
                                                }`}>
                                                {plan === 'subscription' && <div className="w-2.5 h-2.5 bg-[var(--velah)] rounded-full" />}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className={`font-bold ${plan === 'subscription' ? 'text-slate-900' : 'text-slate-500'}`}>
                                                    Subscribe & Save
                                                </span>
                                                <span className="text-xs font-semibold text-[var(--velah)]">Save 15%</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="block font-bold text-[var(--velah)]">{(product.price * 0.85).toFixed(2)} AED</span>
                                            <span className="text-xs text-slate-400 line-through">{product.price} AED</span>
                                        </div>
                                    </div>

                                    {/* Always Visible Benefits */}
                                    <div className="pl-8 mb-4">
                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-slate-600">
                                            <span className="flex items-center gap-1">✓ No Deposit</span>
                                            <span className="flex items-center gap-1">✓ Free Delivery</span>
                                        </div>
                                    </div>

                                    {/* Frequency: Only visible when active */}
                                    <div className={`pl-8 transition-all overflow-hidden ${plan === 'subscription' ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
                                        <div className="flex gap-2">
                                            {(['weekly', 'biweekly'] as const).map((freq) => (
                                                <button
                                                    key={freq}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setFrequency(freq);
                                                    }}
                                                    className={`flex-1 py-1.5 text-[10px] uppercase font-bold tracking-wide rounded-md border transition-all ${frequency === freq
                                                        ? 'bg-white border-[var(--velah)] text-[var(--velah)] shadow-sm'
                                                        : 'bg-transparent border-slate-200 text-slate-400 hover:bg-white hover:text-slate-600'
                                                        }`}
                                                >
                                                    {freq === 'biweekly' ? 'Bi-Weekly' : freq}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mt-8 flex items-center gap-4">
                            <button
                                onClick={() => addItem(product, 1, plan, plan === 'subscription' ? frequency : undefined)}
                                className="w-full btn btn-primary h-14 rounded-full text-lg font-bold shadow-lg shadow-[var(--velah)]/20 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                            >
                                {plan === 'subscription' ? 'Start Subscription' : 'Add to Cart'}
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
