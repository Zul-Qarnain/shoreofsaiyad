"use client";

import type { CartItem, Product } from "@/types";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { addItem, cartCount, cartSubtotal, parseStoredCart, removeItem, setItemQuantity } from "@/lib/cart";
import { getProductById } from "@/lib/products";

const STORAGE_KEY = "sos-cart";

export type AddToCartResult = "added" | "limited" | "out-of-stock";

interface CartContextType {
  cartItems: CartItem[];
  /** Adds `quantity` units, capped at available stock. */
  addToCart: (product: Product, quantity?: number) => AddToCartResult;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  /** False until the cart has been restored from localStorage (avoids an empty-cart flash). */
  isHydrated: boolean;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

/** Re-syncs stored items with the current catalog so stale prices/stock never reach checkout. */
function reconcile(items: CartItem[]): CartItem[] {
  return items.flatMap((item) => {
    const product = getProductById(item.id);
    if (!product || product.stock <= 0) return [];
    return [{ ...product, quantity: Math.min(item.quantity, product.stock) }];
  });
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      setCartItems(reconcile(parseStoredCart(window.localStorage.getItem(STORAGE_KEY))));
    } catch {
      // Storage unavailable (private mode / blocked): cart simply isn't persisted.
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // ignore quota / privacy errors
    }
  }, [cartItems, isHydrated]);

  const addToCart = useCallback(
    (product: Product, quantity = 1): AddToCartResult => {
      if (product.stock <= 0) return "out-of-stock";
      const inCart = cartItems.find((i) => i.id === product.id)?.quantity ?? 0;
      const result: AddToCartResult = inCart + quantity > product.stock ? "limited" : "added";
      if (inCart >= product.stock) return "limited";
      setCartItems((prev) => addItem(prev, product, quantity));
      setIsCartOpen(true);
      return result;
    },
    [cartItems]
  );

  const removeFromCart = useCallback((productId: string) => {
    setCartItems((prev) => removeItem(prev, productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setCartItems((prev) => setItemQuantity(prev, productId, quantity));
  }, []);

  const clearCart = useCallback(() => setCartItems([]), []);

  const value = useMemo<CartContextType>(
    () => ({
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount: cartCount(cartItems),
      cartTotal: cartSubtotal(cartItems),
      isHydrated,
      isCartOpen,
      setIsCartOpen,
    }),
    [cartItems, addToCart, removeFromCart, updateQuantity, clearCart, isHydrated, isCartOpen]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
