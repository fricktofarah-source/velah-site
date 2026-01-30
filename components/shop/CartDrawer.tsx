"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { BUNDLES, Product } from "@/lib/products";

export default function CartDrawer() {
    const { cart, isOpen, closeCart, updateQty, subtotal, totalDeposit, grandTotal, addItem } = useCart();
    const [isClient, setIsClient] = useState(false);

    const visibleBundles = BUNDLES.filter(b => !cart.find(c => c.id === b.id));

    useEffect(() => setIsClient(true), []);

    if (!isClient) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                onClick={closeCart}
            />

            {/* Main Container for Drawers - Flex Row, aligned right */}
            <div
                className={`fixed inset-y-0 right-0 z-[101] flex items-stretch h-full pointer-events-none`}
            >

                {/* SIDE CAR (Upsells) - Slides out to the left of the main cart */}
                <div
                    className={`w-72 bg-white/95 backdrop-blur shadow-xl border-r border-slate-100 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col will-change-transform ${isOpen && visibleBundles.length > 0 ? "translate-x-0 opacity-100 pointer-events-auto" : "translate-x-12 opacity-0 pointer-events-none"
                        }`}
                    style={{ transitionDelay: isOpen ? "0.15s" : "0s" }}
                >
                    <div className="p-4 bg-[var(--velah)]/10 border-b border-slate-100">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-[#2C7A85]">Complete Your Ritual</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {visibleBundles.map(bundle => (
                            <Link
                                key={bundle.id}
                                href={`/shop/${bundle.id}`}
                                onClick={closeCart}
                                className="group block relative bg-white p-3 rounded-xl border border-slate-100 hover:border-[var(--velah)]/50 transition-all shadow-sm"
                            >
                                <div className="relative w-full h-24 mb-3 bg-slate-50 rounded-lg overflow-hidden">
                                    <Image src={bundle.image} alt={bundle.name} fill className="object-cover" />
                                </div>
                                <h4 className="text-sm font-bold text-slate-900 leading-tight mb-1">{bundle.name}</h4>
                                <p className="text-xs text-slate-500 mb-3">{bundle.price} AED</p>
                                <div
                                    // This button is just for show, the parent link handles navigation
                                    className="w-full py-1.5 text-xs font-semibold bg-[var(--velah)] text-slate-900 rounded-full group-hover:bg-[#68bac8] transition-colors"
                                >
                                    View Details
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>


                {/* MAIN CART DRAWER */}
                <div
                    className={`w-full max-w-md bg-white shadow-2xl flex flex-col h-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${isOpen ? "translate-x-0 pointer-events-auto" : "translate-x-full pointer-events-none"
                        }`}
                >
                    {/* Header */}
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white z-10">
                        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Your Ritual</h2>
                        <button onClick={closeCart} className="p-2 -mr-2 text-slate-400 hover:text-slate-600">
                            ✕
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8">
                        {cart.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-slate-500">
                                <p>Your cart is empty.</p>
                                <button onClick={closeCart} className="text-[#2C7A85] font-medium hover:underline">
                                    Start Shopping
                                </button>
                            </div>
                        ) : (
                            <ul className="space-y-6">
                                {cart.map((item) => (
                                    <li key={item.id} className="flex gap-4">
                                        <div className="relative w-20 h-20 bg-slate-50 rounded-xl shrink-0 border border-slate-100">
                                            <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-bold text-slate-900 truncate">{item.name}</h3>
                                            <div className="text-sm text-slate-500 mt-1">{item.price} AED</div>
                                            <div className="flex items-center gap-3 mt-3">
                                                <div className="flex items-center gap-3 border rounded-full px-2 py-1">
                                                    <button
                                                        onClick={() => updateQty(item.id, item.qty - 1)}
                                                        className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600"
                                                    >−</button>
                                                    <span className="text-sm font-medium w-4 text-center">{item.qty}</span>
                                                    <button
                                                        onClick={() => updateQty(item.id, item.qty + 1)}
                                                        className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600"
                                                    >+</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-sm font-semibold text-slate-900 self-start">
                                            {item.price * item.qty}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Footer - Fixed height content, pushes up if needed but keeps drawer full height */}
                    {cart.length > 0 && (
                        <div className="p-6 bg-white border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-10 mt-auto">
                            <div className="space-y-3 text-sm mb-6">
                                <div className="flex justify-between text-slate-600">
                                    <span>Subtotal</span>
                                    <span>{subtotal} AED</span>
                                </div>
                                <div className="flex justify-between text-[#2C7A85] bg-[var(--velah)]/10 p-2 rounded-lg -mx-2">
                                    <span className="flex items-center gap-2">
                                        Refundable Deposit
                                        <span className="w-4 h-4 rounded-full border border-[var(--velah)]/50 text-[#2C7A85] text-[10px] flex items-center justify-center cursor-help" title="100% refundable when you return the bottles">?</span>
                                    </span>
                                    <span className="font-semibold">{totalDeposit} AED</span>
                                </div>
                                <div className="flex justify-between text-base font-bold text-slate-900 pt-3 border-t border-slate-100">
                                    <span>Total</span>
                                    <span>{grandTotal} AED</span>
                                </div>
                            </div>

                            <button className="w-full btn bg-slate-900 text-white hover:bg-slate-800 h-12 rounded-full font-bold text-lg">
                                Checkout
                            </button>
                            <p className="text-center text-xs text-slate-400 mt-3">
                                Shipping calculated at checkout.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
