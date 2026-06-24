import type { Prisma } from "@prisma/client";
import { CatalogFilters } from "@/components/product/CatalogFilters";
import { ProductCard } from "@/components/product/ProductCard";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

type CatalogPageProps = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    stock?: string;
  }>;
};

export const metadata = {
  title: "Каталог",
  description: "Каталог промышленного и технического снабжения ООО «АЗСТЕХСНАБ»."
};

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams;
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
  const where: Prisma.ProductWhereInput = { isActive: true };

  if (params.q) {
    where.OR = [
      { name: { contains: params.q } },
      { sku: { contains: params.q } },
      { manufacturer: { contains: params.q } }
    ];
  }

  if (params.category) {
    where.category = { slug: params.category };
  }

  if (params.stock) {
    where.stockStatus = params.stock;
  }

  const products = await prisma.product.findMany({
    where,
    include: { category: true },
    orderBy: [{ category: { sortOrder: "asc" } }, { id: "asc" }]
  });

  return (
    <section className="container-page py-10">
      <p className="page-kicker">Каталог</p>
      <h1 className="mt-3 max-w-3xl text-4xl font-extrabold leading-tight">
        Товары промышленного и технического снабжения
      </h1>
      <p className="mt-5 max-w-3xl text-lg font-semibold leading-8 text-[#52627a]">
        Каталог позволяет быстро найти нужную позицию, проверить наличие и добавить товары
        в заявку для менеджера.
      </p>

      <div className="mt-9">
        <CatalogFilters categories={categories} />
      </div>

      <div className="mt-6 flex flex-col gap-2 text-[#52627a] md:flex-row md:items-center md:justify-between">
        <p className="font-semibold">Найдено позиций: {products.length}</p>
        <p className="font-semibold">Цены указаны для учебной демонстрации и не являются публичной офертой</p>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products.length === 0 ? (
        <div className="card mt-5 rounded-md p-8 text-center font-semibold text-[#52627a]">
          По выбранным параметрам товары не найдены.
        </div>
      ) : null}
    </section>
  );
}
