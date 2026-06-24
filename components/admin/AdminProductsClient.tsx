"use client";

import { Edit, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { STOCK_OPTIONS } from "@/lib/constants";
import { formatPrice } from "@/lib/format";

type CategoryOption = { id: number; name: string };
type ProductRow = {
  id: number;
  categoryId: number;
  name: string;
  slug: string;
  sku: string;
  manufacturer: string;
  price: number;
  unit: string;
  stockStatus: string;
  specsJson: string;
  description: string;
  imageUrl: string | null;
  isFeatured: boolean;
  isActive: boolean;
  category: { name: string };
};

type FormState = {
  id?: number;
  categoryId: number;
  name: string;
  slug: string;
  sku: string;
  manufacturer: string;
  price: string;
  unit: string;
  stockStatus: string;
  specsJson: string;
  description: string;
  imageUrl: string;
  isFeatured: boolean;
  isActive: boolean;
};

function emptyForm(categoryId: number): FormState {
  return {
    categoryId,
    name: "",
    slug: "",
    sku: "",
    manufacturer: "",
    price: "",
    unit: "шт.",
    stockStatus: "IN_STOCK",
    specsJson: "{\"Параметр\":\"Значение\"}",
    description: "",
    imageUrl: "",
    isFeatured: false,
    isActive: true
  };
}

export function AdminProductsClient({
  categories,
  products
}: {
  categories: CategoryOption[];
  products: ProductRow[];
}) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(emptyForm(categories[0]?.id ?? 1));
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  function edit(product: ProductRow) {
    setForm({
      id: product.id,
      categoryId: product.categoryId,
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      manufacturer: product.manufacturer,
      price: String(product.price),
      unit: product.unit,
      stockStatus: product.stockStatus,
      specsJson: product.specsJson,
      description: product.description,
      imageUrl: product.imageUrl ?? "",
      isFeatured: product.isFeatured,
      isActive: product.isActive
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSaving(true);

    const payload = {
      ...form,
      price: Number(form.price),
      specsJson: form.specsJson || "{}"
    };
    const url = form.id ? `/api/admin/products/${form.id}` : "/api/admin/products";
    const response = await fetch(url, {
      method: form.id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = (await response.json()) as { error?: { message: string } };
    setIsSaving(false);
    if (!response.ok || data.error) {
      setError(data.error?.message ?? "Не удалось сохранить товар");
      return;
    }
    setForm(emptyForm(categories[0]?.id ?? 1));
    router.refresh();
  }

  async function remove(productId: number) {
    if (!window.confirm("Удалить товар?")) return;
    const response = await fetch(`/api/admin/products/${productId}`, { method: "DELETE" });
    if (!response.ok) {
      setError("Не удалось удалить товар");
      return;
    }
    router.refresh();
  }

  return (
    <div>
      <form className="card rounded-md p-5" onSubmit={submit}>
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-extrabold">
            {form.id ? "Редактирование товара" : "Добавление товара"}
          </h2>
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-md border border-brand-line px-4 font-semibold"
            onClick={() => setForm(emptyForm(categories[0]?.id ?? 1))}
          >
            <Plus size={18} aria-hidden="true" />
            Новый товар
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label>
            <span className="label">Категория</span>
            <select
              className="field"
              value={form.categoryId}
              onChange={(event) => setForm({ ...form, categoryId: Number(event.target.value) })}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <Field label="Название" value={form.name} onChange={(value) => setForm({ ...form, name: value })} />
          <Field label="Slug" value={form.slug} onChange={(value) => setForm({ ...form, slug: value })} />
          <Field label="Артикул" value={form.sku} onChange={(value) => setForm({ ...form, sku: value })} />
          <Field
            label="Производитель"
            value={form.manufacturer}
            onChange={(value) => setForm({ ...form, manufacturer: value })}
          />
          <Field label="Цена" type="number" value={form.price} onChange={(value) => setForm({ ...form, price: value })} />
          <Field label="Единица" value={form.unit} onChange={(value) => setForm({ ...form, unit: value })} />
          <label>
            <span className="label">Наличие</span>
            <select
              className="field"
              value={form.stockStatus}
              onChange={(event) => setForm({ ...form, stockStatus: event.target.value })}
            >
              {STOCK_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-end gap-3 pb-3 font-semibold text-[#40516b]">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) => setForm({ ...form, isActive: event.target.checked })}
            />
            Активен в каталоге
          </label>
          <label className="flex items-end gap-3 pb-3 font-semibold text-[#40516b]">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(event) => setForm({ ...form, isFeatured: event.target.checked })}
            />
            Рекомендуемый товар
          </label>
        </div>
        <label className="mt-4 block">
          <span className="label">Описание</span>
          <textarea
            className="field min-h-24"
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
          />
        </label>
        <label className="mt-4 block">
          <span className="label">Характеристики JSON</span>
          <textarea
            className="field min-h-24 font-mono text-sm"
            value={form.specsJson}
            onChange={(event) => setForm({ ...form, specsJson: event.target.value })}
          />
        </label>
        {error ? (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 font-semibold text-red-700">
            {error}
          </div>
        ) : null}
        <button className="mt-5 h-12 w-full rounded-md bg-brand-blue font-extrabold text-white">
          {isSaving ? "Сохранение..." : "Сохранить товар"}
        </button>
      </form>

      <div className="card mt-6 overflow-x-auto rounded-md">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead className="bg-[#f7f9fc] text-sm text-[#52627a]">
            <tr>
              <th className="p-4">Товар</th>
              <th className="p-4">Категория</th>
              <th className="p-4">Цена</th>
              <th className="p-4">Статус</th>
              <th className="p-4">Действия</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-[#edf1f6] align-top">
                <td className="p-4">
                  <p className="font-extrabold">{product.name}</p>
                  <p className="text-sm text-[#52627a]">{product.sku}</p>
                </td>
                <td className="p-4 font-semibold text-[#52627a]">{product.category.name}</td>
                <td className="p-4 font-semibold">{formatPrice(product.price, product.unit)}</td>
                <td className="p-4">
                  <p className="font-semibold">{STOCK_OPTIONS.find((item) => item.value === product.stockStatus)?.label}</p>
                  <p className="text-sm text-[#52627a]">{product.isActive ? "активен" : "скрыт"}</p>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="grid h-9 w-9 place-items-center rounded-md border border-brand-line"
                      aria-label="Редактировать товар"
                      onClick={() => edit(product)}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      type="button"
                      className="grid h-9 w-9 place-items-center rounded-md border border-red-200 text-red-600"
                      aria-label="Удалить товар"
                      onClick={() => remove(product.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text"
}: {
  label: string;
  value: string;
  type?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span className="label">{label}</span>
      <input className="field" type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}
