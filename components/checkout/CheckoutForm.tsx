"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/format";

type FormState = {
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  comment: string;
  consent: boolean;
};

const initialState: FormState = {
  companyName: "",
  contactName: "",
  phone: "",
  email: "",
  comment: "",
  consent: false
};

export function CheckoutForm() {
  const router = useRouter();
  const { lines, clearCart } = useCart();
  const [form, setForm] = useState<FormState>(initialState);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const total = useMemo(
    () => lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0),
    [lines]
  );

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        items: lines.map((line) => ({
          productId: line.product.id,
          quantity: line.quantity
        }))
      })
    });

    const payload = (await response.json()) as
      | { orderId: number }
      | { error: { message: string; details?: unknown } };

    setIsSubmitting(false);

    if (!response.ok || "error" in payload) {
      setError("error" in payload ? payload.error.message : "Не удалось отправить заявку");
      return;
    }

    clearCart();
    router.push(`/success?order=${payload.orderId}`);
  }

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
      <form id="checkout-form" className="card rounded-md p-6" onSubmit={submit}>
        <div className="grid gap-4 md:grid-cols-2">
          <label>
            <span className="label">Организация</span>
            <input
              className="field"
              value={form.companyName}
              onChange={(event) => setForm({ ...form, companyName: event.target.value })}
              placeholder="ООО «ПромМонтаж»"
            />
          </label>
          <label>
            <span className="label">Контактное лицо</span>
            <input
              className="field"
              value={form.contactName}
              onChange={(event) => setForm({ ...form, contactName: event.target.value })}
              placeholder="Иван Петров"
            />
          </label>
          <label>
            <span className="label">Телефон</span>
            <input
              className="field"
              value={form.phone}
              onChange={(event) => setForm({ ...form, phone: event.target.value })}
              placeholder="+7 (___) ___-__-__"
            />
          </label>
          <label>
            <span className="label">E-mail</span>
            <input
              className="field"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              placeholder="name@example.ru"
              type="email"
            />
          </label>
        </div>
        <label className="mt-4 block">
          <span className="label">Комментарий</span>
          <textarea
            className="field min-h-28 resize-y"
            value={form.comment}
            onChange={(event) => setForm({ ...form, comment: event.target.value })}
            placeholder="Укажите сроки, адрес поставки или дополнительные требования"
          />
        </label>
        <label className="mt-4 flex items-start gap-3 text-sm font-semibold text-[#40516b]">
          <input
            className="mt-1"
            type="checkbox"
            checked={form.consent}
            onChange={(event) => setForm({ ...form, consent: event.target.checked })}
          />
          <span>Я согласен на обработку персональных данных для подготовки ответа по заявке.</span>
        </label>
        {error ? (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 font-semibold text-red-700">
            {error}
          </div>
        ) : null}
      </form>

      <aside className="card h-fit rounded-md p-5">
        <h2 className="text-2xl font-extrabold">Состав заявки</h2>
        <div className="mt-5 grid gap-3">
          {lines.length ? (
            lines.map((line) => (
              <div key={line.product.id} className="rounded-md bg-[#f4f7fb] p-3">
                <p className="font-extrabold">{line.product.name}</p>
                <p className="mt-1 text-[#40516b]">
                  {line.product.sku} · {line.quantity} {line.product.unit}
                </p>
              </div>
            ))
          ) : (
            <p className="text-[#52627a]">Корзина пуста.</p>
          )}
        </div>
        <p className="mt-5 flex items-center justify-between font-semibold">
          <span>Итого</span>
          <strong>{formatPrice(total)}</strong>
        </p>
        <Button
          form="checkout-form"
          type="submit"
          className="mt-5 w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Отправка..." : "Отправить заявку"}
        </Button>
      </aside>
    </div>
  );
}
