"use client";

import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ORDER_STATUS_OPTIONS } from "@/lib/constants";
import { formatDateTime, formatPrice, getOrderStatusLabel } from "@/lib/format";

type OrderRow = {
  id: number;
  status: string;
  totalAmount: number;
  createdAt: Date;
  customer: {
    companyName: string;
    contactName: string;
    phone: string;
    email: string;
    comment: string | null;
  };
  items: Array<{
    id: number;
    nameSnapshot: string;
    skuSnapshot: string;
    priceSnapshot: number;
    quantity: number;
    unitSnapshot: string;
  }>;
};

export function AdminOrdersClient({ orders }: { orders: OrderRow[] }) {
  const router = useRouter();
  const [openId, setOpenId] = useState<number | null>(orders[0]?.id ?? null);
  const [error, setError] = useState("");

  async function changeStatus(orderId: number, status: string) {
    setError("");
    const response = await fetch(`/api/admin/orders/${orderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    if (!response.ok) {
      setError("Не удалось изменить статус заявки");
      return;
    }
    router.refresh();
  }

  async function remove(orderId: number) {
    if (!window.confirm("Удалить тестовую заявку?")) return;
    const response = await fetch(`/api/admin/orders/${orderId}`, { method: "DELETE" });
    if (!response.ok) {
      setError("Не удалось удалить заявку");
      return;
    }
    router.refresh();
  }

  return (
    <div className="grid gap-4">
      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 font-semibold text-red-700">
          {error}
        </div>
      ) : null}
      {orders.length === 0 ? (
        <div className="card rounded-md p-6 text-[#52627a]">Заявок пока нет.</div>
      ) : null}
      {orders.map((order) => {
        const isOpen = openId === order.id;
        return (
          <article key={order.id} className="card rounded-md p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h2 className="text-2xl font-extrabold">Заявка #{order.id}</h2>
                <p className="mt-2 font-semibold text-[#52627a]">{formatDateTime(order.createdAt)}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <span className="rounded-md bg-[#eef4ff] px-3 py-2 font-semibold text-[#29415f]">
                    {order.customer.companyName}
                  </span>
                  <span className="rounded-md bg-[#eef4ff] px-3 py-2 font-extrabold text-brand-blue">
                    {formatPrice(order.totalAmount)}
                  </span>
                  <span className="rounded-md bg-[#eef4ff] px-3 py-2 font-semibold text-[#29415f]">
                    Позиций: {order.items.length}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <label>
                  <span className="label">Статус</span>
                  <select
                    className="field min-w-36"
                    value={order.status}
                    onChange={(event) => changeStatus(order.id, event.target.value)}
                  >
                    {ORDER_STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  type="button"
                  className="mt-6 inline-flex h-11 items-center gap-2 rounded-md border border-brand-line px-4 font-semibold"
                  onClick={() => setOpenId(isOpen ? null : order.id)}
                >
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  {isOpen ? "Скрыть детали" : "Открыть детали"}
                </button>
                <button
                  type="button"
                  className="mt-6 inline-flex h-11 items-center gap-2 rounded-md border border-red-200 px-4 font-semibold text-red-600"
                  onClick={() => remove(order.id)}
                >
                  <Trash2 size={18} />
                  Удалить тестовую
                </button>
              </div>
            </div>
            {isOpen ? (
              <div className="mt-5 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-md bg-[#f7f9fc] p-4">
                  <p className="font-extrabold">{order.customer.companyName}</p>
                  <p className="mt-2 text-[#40516b]">Контакт: {order.customer.contactName}</p>
                  <p className="text-[#40516b]">Телефон: {order.customer.phone}</p>
                  <p className="text-[#40516b]">Email: {order.customer.email}</p>
                  {order.customer.comment ? (
                    <p className="mt-4 text-[#40516b]">Комментарий: {order.customer.comment}</p>
                  ) : null}
                  <p className="mt-4 text-sm font-semibold text-[#6a7b93]">
                    Текущий статус: {getOrderStatusLabel(order.status)}
                  </p>
                </div>
                <div className="rounded-md border border-brand-line p-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="border-b border-[#edf1f6] py-3 first:pt-0 last:border-b-0 last:pb-0">
                      <p className="font-extrabold">{item.nameSnapshot}</p>
                      <p className="mt-1 text-[#40516b]">
                        {item.skuSnapshot} · количество: {item.quantity} ·{" "}
                        {formatPrice(item.priceSnapshot, item.unitSnapshot)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
