"use client";

import { useState } from "react";
import Image from "next/image";
import { Product, PRODUCTS, BUNDLES } from "@/lib/products";
import { useCart } from "@/components/CartProvider";
import ProductModal from "./ProductModal";

export default function ProductGrid({ items }: { items: Product[] }) {
    const { addItem } = useCart();
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    return (
        <>
            <div className="flex flex-wrap justify-center gap-6 lg:gap-10 w-full max-w-7xl mx-auto px-4">
                {items.map((product) => (
                    <div
                        key={product.id}
                        className="group relative flex flex-col items-center text-center w-full sm:w-[calc(50%-1rem)] md:w-[calc(33.333%-1.25rem)] lg:w-[calc(25%-1.875rem)] shrink-0"
                    >
                        {/* Click to open modal */}
                        <div
                            className="cursor-pointer w-full flex flex-col items-center"
                            onClick={() => setSelectedProduct(product)}
                        >
                            <div className="relative w-full aspect-[4/5] mb-6 bg-[#F8F9FA] rounded-[2.5rem] overflow-hidden">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-contain p-8 transition-transform duration-700 ease-out group-hover:scale-105"
                                />

                                {/* Desktop Quick Add - Absolutel positioned inside image area for clean look, or below? 
                                   User said "cleaner". Reference image usually has button below or hidden.
                                   Let's keep it below but maybe floating or just clean text.
                                   Actually, let's keep the current behavior but cleaner.
                                */}
                            </div>

                            <h3 className="text-lg font-medium text-slate-900 mb-1">
                                {product.name}
                            </h3>
                            <div className="text-sm font-medium text-slate-500 mb-4">
                                {product.price} AED
                            </div>
                        </div>

                        {/* Desktop: Quick Add Button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                addItem(product);
                            }}
                            className="hidden md:block btn btn-secondary text-sm h-10 px-8 rounded-full opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                        >
                            Add to Cart
                        </button>

                        {/* Mobile: Quick Add always visible */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                addItem(product);
                            }}
                            className="md:hidden w-full btn btn-secondary text-sm h-10 rounded-full"
                        >
                            Add {product.price} AED
                        </button>
                    </div>
                ))}
            </div>

            {selectedProduct && (
                <ProductModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </>
    );
}
