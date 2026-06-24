"use client";

import { SlidersHorizontal, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { STOCK_OPTIONS } from "@/lib/constants";

type CategoryOption = {
  id: number;
  name: string;
  slug: string;
};

export function CatalogFilters({ categories }: { categories: CategoryOption[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "");
  const [stock, setStock] = useState(searchParams.get("stock") ?? "");

  function submit() {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (category) params.set("category", category);
    if (stock) params.set("stock", stock);
    router.push(`/catalog${params.toString() ? `?${params.toString()}` : ""}`);
  }

  function reset() {
    setQuery("");
    setCategory("");
    setStock("");
    router.push("/catalog");
  }

  return (
    <section className="card rounded-md p-4">
      <div className="mb-4 flex items-center gap-2 font-extrabold">
        <SlidersHorizontal size={18} aria-hidden="true" />
        <h2>Параметры подбора</h2>
      </div>
      <div className="grid gap-3 lg:grid-cols-[1.2fr_0.8fr_0.8fr_auto_auto]">
        <label>
          <span className="label">Поиск</span>
          <span className="relative block">
            <Search
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa8ba]"
              aria-hidden="true"
            />
            <input
              className="field pl-10"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") submit();
              }}
              placeholder="Название, артикул, производитель"
              type="search"
            />
          </span>
        </label>
        <label>
          <span className="label">Категория</span>
          <select className="field" value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="">Все категории</option>
            {categories.map((item) => (
              <option key={item.id} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="label">Наличие</span>
          <select className="field" value={stock} onChange={(event) => setStock(event.target.value)}>
            <option value="">Любое наличие</option>
            {STOCK_OPTIONS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="mt-0 h-11 self-end rounded-md bg-brand-blue px-6 font-extrabold text-white hover:bg-brand-blueDark lg:mt-6"
          onClick={submit}
        >
          Найти
        </button>
        <button
          type="button"
          className="mt-0 h-11 self-end rounded-md border border-brand-line bg-white px-6 font-extrabold lg:mt-6"
          onClick={reset}
        >
          Сброс
        </button>
      </div>
    </section>
  );
}
