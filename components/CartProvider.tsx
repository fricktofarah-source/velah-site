"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Product, PRODUCTS, BUNDLES } from "@/lib/products";

type CartItem = Product & {
    qty: number;
};

type CartContextType = {
    cart: CartItem[];
    isOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    addItem: (product: Product, qty?: number) => void;
    removeItem: (productId: string) => void;
    updateQty: (productId: string, qty: number) => void;
    subtotal: number;
    totalDeposit: number;
    grandTotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "velah:shop-cart";

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load from local storage on mount
    useEffect(() => {
        const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (raw) {
            try {
                setCart(JSON.parse(raw));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
        setIsInitialized(true);
    }, []);

    // Save to local storage on change
    useEffect(() => {
        if (!isInitialized) return;
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cart));
    }, [cart, isInitialized]);

    const openCart = () => setIsOpen(true);
    const closeCart = () => setIsOpen(false);

    const addItem = (product: Product, qty = 1) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id ? { ...item, qty: item.qty + qty } : item
                );
            }
            return [...prev, { ...product, qty }];
        });
        setIsOpen(true);
    };

    const removeItem = (productId: string) => {
        setCart((prev) => prev.filter((item) => item.id !== productId));
    };

    const updateQty = (productId: string, qty: number) => {
        if (qty <= 0) {
            removeItem(productId);
            return;
        }
        setCart((prev) =>
            prev.map((item) => (item.id === productId ? { ...item, qty } : item))
        );
    };

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const totalDeposit = cart.reduce((sum, item) => sum + item.deposit * item.qty, 0);
    const grandTotal = subtotal + totalDeposit;

    return (
        <CartContext.Provider
            value={{
                cart,
                isOpen,
                openCart,
                closeCart,
                addItem,
                removeItem,
                updateQty,
                subtotal,
                totalDeposit,
                grandTotal,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
