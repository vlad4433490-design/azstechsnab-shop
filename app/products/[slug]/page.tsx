import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { ProductImage } from "@/components/product/ProductImage";
import { StockBadge } from "@/components/ui/Badge";
import { prisma } from "@/lib/db";
import { formatPrice, parseSpecs } from "@/lib/format";

export const dynamic = "force-dynamic";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    select: { name: true, description: true }
  });
  return {
    title: product?.name ?? "Товар",
    description: product?.description ?? "Карточка товара ООО «АЗСТЕХСНАБ»."
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await prisma.product.findFirst({
    where: { slug, isActive: true },
    include: { category: true }
  });

  if (!product) notFound();

  const specs = parseSpecs(product.specsJson);

  return (
    <section className="container-page py-10">
      <Link href="/catalog" className="inline-flex items-center gap-2 font-extrabold hover:text-brand-blue">
        <ArrowLeft size={18} aria-hidden="true" />
        Вернуться в каталог
      </Link>

      <div className="mt-8 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <ProductImage />
        <article className="card rounded-md p-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[#eef2f7] px-3 py-1 text-xs font-extrabold text-[#52627a]">
              {product.category.name}
            </span>
            <StockBadge value={product.stockStatus} />
          </div>
          <h1 className="mt-5 text-3xl font-extrabold leading-tight">{product.name}</h1>
          <p className="mt-5 text-lg font-medium leading-8 text-[#40516b]">{product.description}</p>
          <div className="mt-7 grid gap-4 border-y border-[#edf1f6] py-5 md:grid-cols-3">
            <Info label="Артикул" value={product.sku} />
            <Info label="Производитель" value={product.manufacturer} />
            <Info label="Цена" value={formatPrice(product.price, product.unit)} />
          </div>
          <AddToCartButton
            className="mt-6 w-full"
            product={{
              id: product.id,
              name: product.name,
              slug: product.slug,
              sku: product.sku,
              price: product.price,
              unit: product.unit,
              manufacturer: product.manufacturer
            }}
          />
        </article>
      </div>

      <section className="card mt-8 rounded-md p-6">
        <h2 className="text-2xl font-extrabold">Технические характеристики</h2>
        <div className="mt-5 overflow-hidden rounded-md border border-brand-line">
          {specs.length ? (
            specs.map(([label, value]) => (
              <div key={label} className="grid border-b border-brand-line last:border-b-0 md:grid-cols-[0.34fr_0.66fr]">
                <div className="bg-[#f7f9fc] px-4 py-3 font-extrabold text-[#344258]">{label}</div>
                <div className="px-4 py-3 text-[#172033]">{value}</div>
              </div>
            ))
          ) : (
            <div className="px-4 py-3 text-[#52627a]">Характеристики не указаны.</div>
          )}
        </div>
      </section>
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm font-semibold text-[#6a7b93]">{label}</p>
      <p className="mt-1 font-extrabold">{value}</p>
    </div>
  );
}
