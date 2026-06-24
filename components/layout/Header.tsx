"use client";

import { Menu, Package, ShoppingCart, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";

const navItems = [
  { href: "/", label: "Главная" },
  { href: "/catalog", label: "Каталог" },
  { href: "/about", label: "О компании" },
  { href: "/contacts", label: "Контакты" }
];

export function Header() {
  const { count } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-brand-line bg-white">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 font-extrabold" aria-label="На главную">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-brand-blue text-white">
            <Package size={20} aria-hidden="true" />
          </span>
          <span>АЗСТЕХСНАБ</span>
        </Link>

        <nav className="hidden items-center gap-9 text-sm font-semibold text-[#111827] md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-brand-blue">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/cart"
            className="flex h-10 items-center gap-2 rounded-md border border-brand-line px-3 font-bold"
            aria-label={`Корзина, товаров: ${count}`}
          >
            <ShoppingCart size={20} aria-hidden="true" />
            <span className="hidden sm:inline">Корзина</span>
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand-blue px-1 text-xs text-white">
              {count}
            </span>
          </Link>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-md border border-brand-line md:hidden"
            aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
            onClick={() => setIsOpen((value) => !value)}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {isOpen ? (
        <nav className="border-t border-brand-line bg-white px-4 py-3 md:hidden">
          <div className="container-page grid gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-2 py-2 font-semibold"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
