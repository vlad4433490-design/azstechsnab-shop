import Link from "next/link";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { StockBadge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/format";

type ProductCardData = {
  id: number;
  name: string;
  slug: string;
  sku: string;
  description: string;
  manufacturer: string;
  price: number;
  unit: string;
  stockStatus: string;
  category: { name: string };
};

export function ProductCard({ product }: { product: ProductCardData }) {
  return (
    <article className="card flex min-h-[310px] flex-col rounded-md p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <p className="text-xs font-extrabold uppercase text-[#6a7b93]">{product.category.name}</p>
        <StockBadge value={product.stockStatus} />
      </div>
      <Link href={`/products/${product.slug}`} className="hover:text-brand-blue">
        <h2 className="text-xl font-extrabold leading-7">{product.name}</h2>
      </Link>
      <p className="mt-5 min-h-[72px] text-[15px] font-medium leading-7 text-[#40516b]">
        {product.description}
      </p>
      <div className="mt-auto border-t border-[#edf1f6] pt-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-[#6a7b93]">Артикул</p>
            <p className="font-semibold">{product.sku}</p>
          </div>
          <div>
            <p className="text-[#6a7b93]">Производитель</p>
            <p className="font-semibold">{product.manufacturer}</p>
          </div>
        </div>
        <div className="mt-5 flex items-center justify-between gap-3">
          <p className="text-lg font-extrabold">{formatPrice(product.price, product.unit)}</p>
          <AddToCartButton
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
        </div>
      </div>
    </article>
  );
}
