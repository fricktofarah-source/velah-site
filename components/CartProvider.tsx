"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Product, PRODUCTS, BUNDLES } from "@/lib/products";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/components/AuthProvider";

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
    // Track who "owns" the currently loaded local cart to handle merge logic
    const [localCartOwner, setLocalCartOwner] = useState<string>("guest");
    const { user } = useAuth();

    // Load from local storage on mount
    useEffect(() => {
        const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (raw) {
            try {
                const parsed = JSON.parse(raw);
                // Handle legacy array format (treat as guest) vs new object format
                if (Array.isArray(parsed)) {
                    setCart(parsed);
                    setLocalCartOwner("guest");
                } else if (parsed && typeof parsed === 'object') {
                    setCart(parsed.items || []);
                    setLocalCartOwner(parsed.ownerId || "guest");
                }
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
        setIsInitialized(true);
    }, []);

    // Sync with Server on User Login / Change
    useEffect(() => {
        if (!isInitialized || !user) return;

        const syncCart = async () => {
            try {
                // 1. Fetch Server Cart
                const { data, error } = await supabase
                    .from('order_carts')
                    .select('items')
                    .eq('user_id', user.id)
                    .single();

                if (error && error.code !== 'PGRST116') {
                    console.error("Error fetching server cart:", error);
                    return;
                }

                const serverItems: CartItem[] = (data?.items as any) || [];

                // 2. Merge Logic
                // If local cart is "guest" and has items, merge into server.
                // If local cart is already owned by this user, or empty, trust the server (or just keep sync).

                if (localCartOwner === "guest" && cart.length > 0) {
                    // MERGE: Guest -> Server
                    const merged = [...serverItems];

                    cart.forEach(localItem => {
                        const existingIdx = merged.findIndex(i => i.id === localItem.id);
                        if (existingIdx >= 0) {
                            // Add quantities? Or overwrite? 
                            // Usually Add is expected behavior when "logging in with items in basket".
                            merged[existingIdx].qty += localItem.qty;
                        } else {
                            merged.push(localItem);
                        }
                    });

                    // Update State (this will trigger the Save effect)
                    setCart(merged);
                    setLocalCartOwner(user.id);
                } else {
                    // SYNC: Server -> Client
                    // If we are just loading firmly as the user, take server state.
                    // This handles the "Open on Phone" case.
                    setCart(serverItems);
                    setLocalCartOwner(user.id);
                }
            } catch (err) {
                console.error("Sync failed", err);
            }
        };

        syncCart();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, isInitialized]); // Run when user changes (login) or init finishes

    // Save to local storage AND Server on change
    useEffect(() => {
        if (!isInitialized) return;

        // Local Save (with owner metadata)
        const payload = {
            items: cart,
            ownerId: user?.id || "guest"
        };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));

        // Server Save
        if (user) {
            // Debounce could be good here, but for now direct save is okay for low volume
            supabase
                .from('order_carts')
                .upsert({
                    user_id: user.id,
                    items: cart,
                    updated_at: new Date().toISOString()
                })
                .then(({ error }) => {
                    if (error) console.error("Error saving cart to server:", error);
                });
        }
    }, [cart, isInitialized, user]);

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
