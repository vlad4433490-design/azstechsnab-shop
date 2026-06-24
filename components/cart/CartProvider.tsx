"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CartLine, CartProduct } from "@/lib/cart";
import { calculateCartCount, calculateCartTotal } from "@/lib/cart";

type CartContextValue = {
  lines: CartLine[];
  count: number;
  total: number;
  addItem: (product: CartProduct) => void;
  setQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "azstechsnab_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as CartLine[];
        setLines(Array.isArray(parsed) ? parsed : []);
      } catch {
        setLines([]);
      }
    }
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (isReady) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    }
  }, [isReady, lines]);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      count: calculateCartCount(lines),
      total: calculateCartTotal(lines),
      addItem(product) {
        setLines((current) => {
          const existing = current.find((line) => line.product.id === product.id);
          if (existing) {
            return current.map((line) =>
              line.product.id === product.id
                ? { ...line, quantity: Math.min(line.quantity + 1, 999) }
                : line
            );
          }
          return [...current, { product, quantity: 1 }];
        });
      },
      setQuantity(productId, quantity) {
        setLines((current) =>
          current.map((line) =>
            line.product.id === productId
              ? { ...line, quantity: Math.max(1, Math.min(quantity, 999)) }
              : line
          )
        );
      },
      removeItem(productId) {
        setLines((current) => current.filter((line) => line.product.id !== productId));
      },
      clearCart() {
        setLines([]);
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }),
    [lines]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}
