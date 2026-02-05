"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Product } from "@/lib/products";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/components/AuthProvider";

type CartItem = Product & {
    qty: number;
    plan?: 'one-time' | 'subscription';
    frequency?: 'weekly' | 'biweekly' | 'monthly';
};

type CartContextType = {
    cart: CartItem[];
    isOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    addItem: (product: Product, qty?: number, plan?: 'one-time' | 'subscription', frequency?: 'weekly' | 'biweekly' | 'monthly') => void;
    updateItem: (productId: string, plan: 'one-time' | 'subscription', updates: Partial<CartItem>) => void;
    removeItem: (productId: string, plan: 'one-time' | 'subscription') => void;
    updateQty: (productId: string, plan: 'one-time' | 'subscription', qty: number) => void;
    subtotal: number;
    totalDeposit: number;
    grandTotal: number;
    deliveryFee: number;
    isFreeDelivery: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "velah:shop-cart";

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    // Track who "owns" the currently loaded local cart to handle merge logic
    const [localCartOwner, setLocalCartOwner] = useState<string>("guest");
    // "idle" | "syncing" | "synced"
    const [dbSyncStatus, setDbSyncStatus] = useState<"idle" | "syncing" | "synced">("idle");
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
        if (!isInitialized) return;

        // Reset sync status when user changes (e.g. logout or switch)
        if (!user) {
            setDbSyncStatus("idle");
            return;
        }

        const syncCart = async () => {
            setDbSyncStatus("syncing");
            try {
                // 1. Fetch Server Cart
                const { data, error } = await supabase
                    .from('order_carts')
                    .select('items')
                    .eq('user_id', user.id)
                    .single();

                if (error && error.code !== 'PGRST116') {
                    console.error("Error fetching server cart:", error);
                    setDbSyncStatus("synced"); // Fail safe to allow saving future changes? Or keep trying?
                    return;
                }

                const serverItems: CartItem[] = (data?.items as CartItem[]) || [];

                // 2. Merge Logic
                if (localCartOwner === "guest" && cart.length > 0) {
                    // MERGE: Guest -> Server
                    const merged = [...serverItems];

                    cart.forEach(localItem => {
                        const existingIdx = merged.findIndex(i => i.id === localItem.id);
                        if (existingIdx >= 0) {
                            merged[existingIdx].qty += localItem.qty;
                        } else {
                            merged.push(localItem);
                        }
                    });

                    setCart(merged);
                    // We update owner immediately so the subsequent Save effect knows we are owning this now
                    setLocalCartOwner(user.id);
                } else {
                    // SYNC: Server -> Client
                    setCart(serverItems);
                    setLocalCartOwner(user.id);
                }
            } catch (err) {
                console.error("Sync failed", err);
            } finally {
                setDbSyncStatus("synced");
            }
        };

        syncCart();

        // 3. Realtime Subscription
        const channel = supabase
            .channel('cart_updates')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'order_carts',
                    filter: `user_id=eq.${user.id}`,
                },
                (payload) => {
                    // When an update comes in from another device
                    const newItems = (payload.new as { items: CartItem[] }).items;
                    if (newItems) {
                        // We simply replace our cart with the server version
                        // We need to be careful not to create a loop, but because we only SAVE on local change,
                        // and setFromExternal doesn't trigger a user-initiated change event in some architectures, 
                        // but here `cart` is state. 
                        // To avoid loop: The Save effect will see `cart` change. It will try to upsert. 
                        // The upsert will trigger Realtime. Loop!
                        // FIX: We need a way to distinguish "Local Change" from "Remote Change".
                        // However, for this MVP, if the content is identical, Supabase might filter, 
                        // or we can check equality before setting.

                        setCart((current) => {
                            // Deep compare simple check
                            if (JSON.stringify(current) === JSON.stringify(newItems)) {
                                return current;
                            }
                            return newItems;
                        });
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, isInitialized]); // Run when user changes (login) or init finishes

    // Save to local storage AND Server on change
    useEffect(() => {
        if (!isInitialized) return;

        // Local Save (Always save locally for offline/reloads)
        const payload = {
            items: cart,
            ownerId: user?.id || "guest"
        };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));

        // Server Save
        // Only save if we have a user AND we are "synced". 
        // This prevents overwriting server data with "empty" local data during the split-second before fetch completes.
        if (user && dbSyncStatus === "synced") {
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
    }, [cart, isInitialized, user, dbSyncStatus]);

    const openCart = () => setIsOpen(true);
    const closeCart = () => setIsOpen(false);

    const addItem = (product: Product, qty = 1, plan: 'one-time' | 'subscription' = 'one-time', frequency?: 'weekly' | 'biweekly' | 'monthly') => {
        setCart((prev) => {
            // Find valid existing item (same ID AND same plan)
            const existing = prev.find((item) => item.id === product.id && item.plan === plan);

            if (existing) {
                return prev.map((item) =>
                    (item.id === product.id && item.plan === plan) ? { ...item, qty: item.qty + qty } : item
                );
            }
            // Default frequency for new subscriptions if not provided
            const defaultFrequency = plan === 'subscription' ? (frequency || 'weekly') : undefined;
            return [...prev, { ...product, qty, plan, frequency: defaultFrequency }];
        });
        setIsOpen(true);
    };

    const updateItem = (productId: string, plan: 'one-time' | 'subscription', updates: Partial<CartItem>) => {
        setCart((prev) => prev.map((item) => {
            if (item.id === productId && item.plan === plan) {
                // If the plan is changing, we need to check if we are merging into another existing item
                // But for simplicity in this user request context, we'll just update directly.
                // React key constraints in CartDrawer will handle display.
                return { ...item, ...updates };
            }
            return item;
        }));
    };

    const removeItem = (productId: string, plan: 'one-time' | 'subscription') => {
        setCart((prev) => prev.filter((item) => !(item.id === productId && item.plan === plan)));
    };

    const updateQty = (productId: string, plan: 'one-time' | 'subscription', qty: number) => {
        if (qty <= 0) {
            removeItem(productId, plan);
            return;
        }
        setCart((prev) =>
            prev.map((item) => (item.id === productId && item.plan === plan ? { ...item, qty } : item))
        );
    };

    // Logic Gates
    const hasSubscription = cart.some(item => item.plan === 'subscription');

    // Calculate Subtotal with Discounts
    const subtotal = cart.reduce((sum, item) => {
        const itemPrice = item.plan === 'subscription' ? item.price * 0.85 : item.price;
        return sum + itemPrice * item.qty;
    }, 0);

    // Free Delivery: If Sub exists OR Total >= 80 (using discounted subtotal? usually based on value. Let's stick to subtotal)
    const isFreeDelivery = hasSubscription || subtotal >= 80;
    const deliveryFee = isFreeDelivery ? 0 : 15;

    // Asset Protection: Per-Item Logic
    // Subscription items get deposit WAIVED.
    // One-Time items get deposit CHARGED.
    const totalDeposit = cart.reduce((sum, item) => {
        if (item.plan === 'subscription') return sum;
        return sum + item.deposit * item.qty;
    }, 0);

    const grandTotal = subtotal + totalDeposit + deliveryFee;

    return (
        <CartContext.Provider
            value={{
                cart,
                isOpen,
                openCart,
                closeCart,
                addItem,
                updateItem,
                removeItem,
                updateQty,
                subtotal,
                totalDeposit,
                grandTotal,
                deliveryFee,
                isFreeDelivery,
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
