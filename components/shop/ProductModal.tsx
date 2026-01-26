"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Product } from "@/lib/products";
import { useCart } from "@/components/CartProvider";

type ProductModalProps = {
    product: Product;
    onClose: () => void;
};

export default function ProductModal({ product, onClose }: ProductModalProps) {
    const { addItem } = useCart();
    const modalRef = useRef<HTMLDivElement>(null);

    // Close on Escape
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [onClose]);

    // Close on click outside
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) onClose();
    };

    const handleAddToCart = () => {
        addItem(product);
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 animate-fade-in"
            onClick={handleBackdropClick}
        >
            <div
                ref={modalRef}
                className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl animate-pop-in"
            >
                <div className="grid md:grid-cols-2">
                    {/* Image Side */}
                    <div className="relative bg-slate-50 min-h-[300px] md:min-h-full flex items-center justify-center p-8">
                        <Image
                            src={product.image}
                            alt={product.name}
                            width={400}
                            height={500}
                            className="object-contain max-h-[250px] md:max-h-[350px] w-auto drop-shadow-xl"
                        />
                    </div>

                    {/* Details Side */}
                    <div className="p-8 flex flex-col h-full">
                        <div className="flex justify-between items-start">
                            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                                {product.name}
                            </h2>
                            <button
                                onClick={onClose}
                                className="text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <p className="mt-4 text-slate-600 leading-relaxed">
                            {product.description}
                        </p>

                        <div className="mt-auto pt-8 space-y-4">
                            {/* Deposit Notice */}
                            <div className="text-xs bg-[var(--velah)]/10 text-[#2C7A85] px-4 py-3 rounded-xl border border-[var(--velah)]/20">
                                <span className="font-semibold block mb-1">Circular Economy</span>
                                A refundable deposit of <span className="font-bold">{product.deposit} AED</span> applies to this order to support our zero-waste mission.
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="text-xl font-semibold text-slate-900">
                                    {product.price} AED
                                </div>
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 btn btn-primary py-3 rounded-full text-base"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
