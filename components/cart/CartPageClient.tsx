"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { ButtonLink } from "@/components/ui/Button";
import { formatPrice } from "@/lib/format";

export function CartPageClient() {
  const { lines, total, setQuantity, removeItem } = useCart();

  return (
    <section className="container-page py-10">
      <p className="page-kicker">Корзина</p>
      <h1 className="mt-3 text-4xl font-extrabold">Позиции для заявки</h1>
      <p className="mt-5 text-lg font-medium text-[#40516b]">
        Корзина используется как список товаров для запроса коммерческого предложения.
      </p>

      {lines.length === 0 ? (
        <div className="card mt-8 rounded-md p-8">
          <h2 className="text-2xl font-extrabold">Корзина пуста</h2>
          <p className="mt-3 text-[#52627a]">Добавьте товары из каталога, чтобы оформить заявку.</p>
          <ButtonLink href="/catalog" className="mt-6">
            Перейти в каталог
          </ButtonLink>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="grid gap-4">
            {lines.map((line) => (
              <article key={line.product.id} className="card rounded-md p-4">
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div>
                    <Link
                      href={`/products/${line.product.slug}`}
                      className="text-lg font-extrabold hover:text-brand-blue"
                    >
                      {line.product.name}
                    </Link>
                    <p className="mt-2 font-semibold text-[#52627a]">Артикул: {line.product.sku}</p>
                    <p className="mt-3 font-extrabold">{formatPrice(line.product.price, line.product.unit)}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      className="grid h-9 w-9 place-items-center rounded-md border border-brand-line"
                      aria-label="Уменьшить количество"
                      onClick={() => setQuantity(line.product.id, line.quantity - 1)}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="min-w-8 text-center text-lg font-extrabold">{line.quantity}</span>
                    <button
                      type="button"
                      className="grid h-9 w-9 place-items-center rounded-md border border-brand-line"
                      aria-label="Увеличить количество"
                      onClick={() => setQuantity(line.product.id, line.quantity + 1)}
                    >
                      <Plus size={16} />
                    </button>
                    <button
                      type="button"
                      className="inline-flex h-9 items-center gap-2 rounded-md border border-brand-line px-3 font-semibold"
                      onClick={() => removeItem(line.product.id)}
                    >
                      <Trash2 size={16} aria-hidden="true" />
                      Удалить
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <aside className="card h-fit rounded-md p-5">
            <h2 className="text-2xl font-extrabold">Итого</h2>
            <div className="mt-5 flex items-center justify-between text-[#40516b]">
              <span>Позиций</span>
              <strong>{lines.length}</strong>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-[#40516b]">Сумма</span>
              <strong>{formatPrice(total)} /заявка</strong>
            </div>
            <ButtonLink href="/checkout" className="mt-6 w-full">
              Оформить заявку
            </ButtonLink>
          </aside>
        </div>
      )}
    </section>
  );
}
