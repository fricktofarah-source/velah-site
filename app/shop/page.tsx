import { Metadata } from "next";
import ProductGrid from "@/components/shop/ProductGrid";
import Link from "next/link";
import { PRODUCTS, BUNDLES } from "@/lib/products";

export const metadata: Metadata = {
    title: "Shop | Velah Pro",
    description: "Experience the purity of Velah in sustainable glass.",
};

export default function ShopPage() {
    return (
        <main className="min-h-screen bg-white pb-32">
            {/* Minimal Shop Hero */}
            <section className="relative pt-32 pb-20 px-6 text-center">
                <div className="max-w-2xl mx-auto space-y-6 animate-fade-in-up">
                    <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#3B8C99]">
                        The Collection
                    </span>
                    <h1 className="text-4xl md:text-5xl font-light text-slate-900 leading-tight">
                        Pure Hydration for <br />
                        <span className="font-serif italic text-slate-500">Every Ritual</span>
                    </h1>
                    <p className="text-slate-500 leading-relaxed max-w-lg mx-auto">
                        Sustainably sourced, bottled in glass, and delivered with zero waste. Choose the plan that fits your life.
                    </p>
                </div>
            </section>

            {/* Bottles Section */}
            <section className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                <ProductGrid items={PRODUCTS} />
            </section>

            {/* Bundles Section */}
            <section className="mt-24 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                <div className="text-center mb-12">
                    <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#3B8C99] block mb-3">
                        Plans & Bundles
                    </span>
                    <h2 className="text-3xl font-light text-slate-900">Curated Sets</h2>
                </div>
                <ProductGrid items={BUNDLES} />
            </section>

            {/* Membership Teaser */}
            <section className="mt-32 border-t border-slate-100 pt-20 text-center px-4">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Looking for a Subscription?</h2>
                <p className="text-slate-500 mb-8">Save up to 15% and never run out with our automated refill plans.</p>
                <button
                    type="button"
                    className="btn btn-ghost border border-slate-200 rounded-full px-8 py-3 opacity-50 cursor-not-allowed"
                >
                    Build a Subscription
                </button>
            </section>
        </main>
    );
}

