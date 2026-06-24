"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import type { CartProduct } from "@/lib/cart";

export function AddToCartButton({
  product,
  className = ""
}: {
  product: CartProduct;
  className?: string;
}) {
  const { addItem } = useCart();
  return (
    <button
      type="button"
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-md bg-brand-blue px-5 text-sm font-extrabold text-white transition hover:bg-brand-blueDark ${className}`}
      onClick={() => addItem(product)}
    >
      <ShoppingCart size={18} aria-hidden="true" />
      В корзину
    </button>
  );
}
