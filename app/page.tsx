import { ArrowRight, Building2, ClipboardCheck, PackageSearch, Search } from "lucide-react";
import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/product/ProductCard";
import { ButtonLink } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categoriesCount, productsCount, featuredProducts] = await Promise.all([
    prisma.category.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      include: { category: true },
      orderBy: { id: "asc" },
      take: 3
    })
  ]);

  return (
    <>
      <section className="bg-white">
        <div className="container-page grid gap-10 py-14 lg:grid-cols-[1.15fr_0.85fr] lg:py-16">
          <div>
            <p className="inline-flex rounded-full bg-[#eef4ff] px-3 py-1 text-sm font-extrabold text-brand-blue">
              B2B-каталог промышленного снабжения
            </p>
            <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-tight tracking-normal md:text-5xl">
              Интернет-магазин технических товаров для ООО «АЗСТЕХСНАБ»
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-[#40516b]">
              Информационная система помогает клиентам быстро подобрать оборудование, комплектующие
              и расходные материалы, собрать корзину и отправить заявку на коммерческое предложение.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/catalog">
                Перейти в каталог <ArrowRight size={18} aria-hidden="true" />
              </ButtonLink>
              <ButtonLink href="/contacts" variant="secondary">
                Контакты компании
              </ButtonLink>
            </div>
          </div>
          <div className="card grid gap-3 rounded-md p-5">
            <HeroStat title="Категории" value={`${categoriesCount} направлений снабжения`} />
            <HeroStat title="Товары" value={`${productsCount} тестовых позиций`} />
            <HeroStat title="Формат" value="Заявка для менеджера, без онлайн-оплаты" />
            <HeroStat title="Администрирование" value="CRUD товаров и обработка заявок" />
          </div>
        </div>
      </section>

      <section className="border-y border-brand-line bg-brand-surface py-12">
        <div className="container-page grid gap-4 md:grid-cols-4">
          <Feature icon={<Search size={26} />} title="Поиск по артикулу">
            Подбор по названию, SKU и производителю.
          </Feature>
          <Feature icon={<PackageSearch size={26} />} title="Каталог B2B">
            Структура ориентирована на закупщика и инженера.
          </Feature>
          <Feature icon={<ClipboardCheck size={26} />} title="Заявки">
            Корзина превращается в заявку на КП.
          </Feature>
          <Feature icon={<Building2 size={26} />} title="Реквизиты">
            Контакты и данные компании доступны клиенту.
          </Feature>
        </div>
      </section>

      <section className="container-page py-12">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="page-kicker">Каталог</p>
            <h2 className="mt-2 text-2xl font-extrabold">Рекомендуемые позиции</h2>
          </div>
          <ButtonLink href="/catalog" variant="secondary" className="hidden sm:inline-flex">
            Все товары
          </ButtonLink>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}

function HeroStat({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-md border border-brand-line bg-white p-4">
      <p className="text-sm font-semibold text-[#6a7b93]">{title}</p>
      <p className="mt-2 text-lg font-extrabold">{value}</p>
    </div>
  );
}

function Feature({
  icon,
  title,
  children
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="card rounded-md p-5">
      <div className="text-brand-blue">{icon}</div>
      <h2 className="mt-6 text-lg font-extrabold">{title}</h2>
      <p className="mt-3 leading-7 text-[#40516b]">{children}</p>
    </article>
  );
}
