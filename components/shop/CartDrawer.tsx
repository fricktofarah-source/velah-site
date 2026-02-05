"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { BUNDLES } from "@/lib/products";

export default function CartDrawer() {
    const { cart, isOpen, closeCart, updateQty, subtotal, totalDeposit, grandTotal, addItem, deliveryFee, isFreeDelivery, removeItem, updateItem } = useCart();
    const [isClient, setIsClient] = useState(false);
    const [showInfo, setShowInfo] = useState(false); // New state for info toggle

    const visibleBundles = BUNDLES.filter(b => !cart.find(c => c.id === b.id));

    // Calculate "Potential" deposit to show savings
    // Calculate "Potential" deposit to show savings
    const potentialDeposit = cart.reduce((sum, item) => sum + item.deposit * item.qty, 0);
    const depositSavings = potentialDeposit - totalDeposit;

    // Calculate Total Savings (Discount + Waived Deposit)
    const potentialSubtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    // grandTotal from hook includes current delivery fee and current deposit
    // Potential Grand Total = potentialSubtotal + potentialDeposit + (potentialSubtotal < 80 ? 15 : 0)
    // Actually, let's just show "Total Savings" = (potentialSubtotal - subtotal) + depositSavings

    const subtotalSavings = potentialSubtotal - subtotal;
    const totalSavings = subtotalSavings + depositSavings;

    // Progress Bar Logic
    const progress = Math.min((subtotal / 80) * 100, 100);
    const amountToFree = Math.max(80 - subtotal, 0);

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
                                <button
                                    onClick={(e) => {
                                        e.preventDefault(); // Prevent navigating to detail page when adding to cart
                                        e.stopPropagation(); // Prevent the parent Link's onClick from firing
                                        addItem(bundle, 1);
                                    }}
                                    className="w-full py-1.5 text-xs font-semibold bg-[var(--velah)] text-slate-900 rounded-full group-hover:bg-[#68bac8] transition-colors"
                                >
                                    Add to Cart
                                </button>
                            </Link>
                        ))}
                    </div>
                </div>


                {/* MAIN CART DRAWER */}
                <div
                    className={`w-full max-w-md bg-white shadow-2xl flex flex-col h-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${isOpen ? "translate-x-0 pointer-events-auto" : "translate-x-full pointer-events-none"
                        }`}
                >

                    {/* Header & Progress Bar */}
                    <div className="bg-white z-10 flex flex-col border-b border-slate-100">
                        <div className="p-6 pb-4 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Your Ritual</h2>
                            <button onClick={closeCart} className="p-2 -mr-2 text-slate-400 hover:text-slate-600">
                                ✕
                            </button>
                        </div>

                        {/* Free Shipping Bar */}
                        {cart.length > 0 && (
                            <div className="px-6 pb-6">
                                <div className="mb-2 text-sm font-medium text-slate-600">
                                    {isFreeDelivery ? (
                                        <span className="text-[var(--velah)] flex items-center gap-2">
                                            <span className="text-lg">✨</span> Free Standard Delivery Unlocked
                                        </span>
                                    ) : (
                                        <span>Add <span className="text-slate-900 font-bold">{amountToFree} AED</span> for Free Shipping</span>
                                    )}
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[var(--velah)] transition-all duration-500 ease-out"
                                        style={{ width: `${isFreeDelivery ? 100 : progress}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8">
                        {cart.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-slate-500">
                                <p>Your cart is empty.</p>
                                <Link href="/shop" onClick={closeCart} className="text-[#2C7A85] font-medium hover:underline">
                                    Start Shopping
                                </Link>
                            </div>
                        ) : (
                            <ul className="space-y-6">
                                {cart.map((item) => (
                                    <li key={`${item.id}-${item.plan}`} className="flex gap-4">
                                        <div className="relative w-20 h-20 bg-slate-50 rounded-xl shrink-0 border border-slate-100">
                                            <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-bold text-slate-900 truncate">{item.name}</h3>
                                            <div className="text-sm text-slate-500 mt-1">{item.price} AED</div>
                                            <div className="flex items-center gap-3 mt-3">
                                                <div className="flex items-center gap-3 border rounded-full px-2 py-1">
                                                    <button
                                                        onClick={() => updateQty(item.id, item.plan || 'one-time', item.qty - 1)}
                                                        className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600"
                                                    >−</button>
                                                    <span className="text-sm font-medium w-4 text-center">{item.qty}</span>
                                                    <button
                                                        onClick={() => updateQty(item.id, item.plan || 'one-time', item.qty + 1)}
                                                        className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600"
                                                    >+</button>
                                                </div>
                                            </div>


                                            {/* Subscription Toggle & Frequency (Clean Layout) */}
                                            {item.subscriptionEligible && (
                                                <div className="mt-3 pt-3 border-t border-slate-50">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`text-xs font-semibold tracking-tight ${item.plan === 'subscription' ? 'text-[var(--velah)]' : 'text-slate-500'}`}>
                                                                Subscribe & Save
                                                            </span>
                                                            <button className="text-[10px] text-slate-400 border-b border-slate-300 hover:text-[var(--velah)] hover:border-[var(--velah)] transition-colors pb-px leading-none" title="Subscription Benefits">
                                                                How it works
                                                            </button>
                                                        </div>

                                                        {/* Toggle Switch */}
                                                        <button
                                                            onClick={() => {
                                                                const currentPlan = item.plan || 'one-time';
                                                                if (currentPlan === 'one-time') {
                                                                    updateItem(item.id, 'one-time', {
                                                                        plan: 'subscription',
                                                                        frequency: 'weekly'
                                                                    });
                                                                } else {
                                                                    updateItem(item.id, 'subscription', { plan: 'one-time', frequency: undefined });
                                                                }
                                                            }}
                                                            className={`relative w-9 h-5 rounded-full transition-colors duration-300 ${item.plan === 'subscription' ? 'bg-[var(--velah)]' : 'bg-slate-200'}`}
                                                        >
                                                            <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full shadow-sm transition-transform duration-300 ${item.plan === 'subscription' ? 'translate-x-4' : ''}`} />
                                                        </button>
                                                    </div>

                                                    {/* Frequency Selector (Expandable) */}
                                                    <div className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${item.plan === 'subscription' ? 'max-h-24 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                                                        <div className="flex gap-2">
                                                            {(['weekly', 'biweekly'] as const).map((freq) => (
                                                                <button
                                                                    key={freq}
                                                                    onClick={() => updateItem(item.id, 'subscription', { frequency: freq })}
                                                                    className={`flex-1 py-1.5 text-[10px] uppercase font-bold tracking-wide rounded-md border transition-all ${item.frequency === freq
                                                                        ? 'bg-white border-[var(--velah)] text-[var(--velah)] shadow-sm'
                                                                        : 'border-transparent text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                                                                        }`}
                                                                >
                                                                    {freq === 'biweekly' ? 'Bi-Weekly' : freq}
                                                                </button>
                                                            ))}
                                                        </div>
                                                        <p className="text-[10px] text-slate-400 mt-2 text-center">
                                                            ✨ No Deposit • Free Delivery • 3 Month Commitment
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
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
                                    <span>
                                        {subtotalSavings > 0 ? (
                                            <>
                                                <span className="line-through opacity-50 mr-2">{potentialSubtotal.toFixed(2)} AED</span>
                                                <span className="font-semibold text-[var(--velah)]">{subtotal.toFixed(2)} AED</span>
                                            </>
                                        ) : (
                                            <span>{subtotal.toFixed(2)} AED</span>
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between text-[#2C7A85] bg-[var(--velah)]/10 p-2 rounded-lg -mx-2">
                                    <span className="flex items-center gap-2">
                                        Refundable Deposit
                                        <span className="w-4 h-4 rounded-full border border-[var(--velah)]/50 text-[#2C7A85] text-[10px] flex items-center justify-center cursor-help" title="100% refundable when you return the bottles">?</span>
                                    </span>
                                    <span className="font-semibold">
                                        {depositSavings > 0 ? (
                                            totalDeposit === 0 ? (
                                                <>
                                                    <span className="line-through opacity-50 mr-2">{potentialDeposit} AED</span>
                                                    <span className="">Waived</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="line-through opacity-50 mr-2">{potentialDeposit} AED</span>
                                                    <span>{totalDeposit} AED</span>
                                                </>
                                            )
                                        ) : (
                                            <span>{totalDeposit} AED</span>
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between text-slate-600">
                                    <span>Delivery</span>
                                    <span>
                                        {isFreeDelivery ? (
                                            <>
                                                <span className="line-through opacity-50 mr-2">15 AED</span>
                                                <span className="font-medium text-[var(--velah)]">FREE</span>
                                            </>
                                        ) : (
                                            <span>{deliveryFee} AED</span>
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between text-base font-bold text-slate-900 pt-3 border-t border-slate-100">
                                    <span>Total</span>
                                    <div className="text-right">
                                        {(totalSavings > 0) && (
                                            <div className="text-xs font-normal text-slate-400 line-through mb-0.5">
                                                {(grandTotal + totalSavings).toFixed(2)} AED
                                            </div>
                                        )}
                                        <span>{grandTotal.toFixed(2)} AED</span>
                                    </div>
                                </div>
                                {totalSavings > 0 ? (
                                    <div className="mt-2 py-1.5 bg-[var(--velah)]/10 rounded text-center text-xs font-bold text-[#2C7A85]">
                                        You saved {totalSavings.toFixed(2)} AED!
                                    </div>
                                ) : (
                                    <div className="mt-2 text-center text-xs font-bold text-[#2C7A85]">
                                        Subscribe & Save {(subtotal * 0.15 + totalDeposit + deliveryFee).toFixed(2)} AED!
                                    </div>
                                )}
                            </div>

                            {/* Commitment Notice */}
                            <div className="mb-4 text-[10px] text-slate-400 leading-relaxed text-center">
                                By proceeding, you agree that subscriptions cannot be cancelled until 3 billing cycles have been completed. Early cancellation may incur a fee equal to the discount received.
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
            </div >
        </>
    );
}
