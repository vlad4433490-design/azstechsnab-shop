import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminShell } from "@/components/admin/AdminShell";
import { prisma } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { formatDateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Админ-панель",
  description: "Обзор информационной системы ООО «АЗСТЕХСНАБ»."
};

export default async function AdminPage() {
  const admin = await getAdminSession();
  if (!admin) return <AdminLogin />;

  const [productsCount, categoriesCount, newOrdersCount, progressOrdersCount, recentOrders] =
    await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.order.count({ where: { status: "NEW" } }),
      prisma.order.count({ where: { status: "IN_PROGRESS" } }),
      prisma.order.findMany({
        include: { customer: true, items: true },
        orderBy: { createdAt: "desc" },
        take: 3
      })
    ]);

  return (
    <AdminShell>
      <p className="page-kicker">Админ-панель</p>
      <h1 className="mt-3 text-4xl font-extrabold">Обзор информационной системы</h1>
      <div className="mt-7 grid gap-4 md:grid-cols-4">
        <Stat title="Товары" value={productsCount} />
        <Stat title="Категории" value={categoriesCount} />
        <Stat title="Новые заявки" value={newOrdersCount} />
        <Stat title="В обработке" value={progressOrdersCount} />
      </div>
      <section className="card mt-6 rounded-md p-5">
        <h2 className="text-2xl font-extrabold">Последние заявки</h2>
        <div className="mt-5 grid gap-3">
          {recentOrders.length ? (
            recentOrders.map((order) => (
              <div key={order.id} className="rounded-md bg-[#f7f9fc] p-4">
                <p className="font-extrabold">
                  Заявка #{order.id} · {order.customer.companyName}
                </p>
                <p className="mt-2 text-[#40516b]">
                  {formatDateTime(order.createdAt)} · Позиций: {order.items.length}
                </p>
              </div>
            ))
          ) : (
            <p className="text-[#52627a]">Заявок пока нет.</p>
          )}
        </div>
      </section>
    </AdminShell>
  );
}

function Stat({ title, value }: { title: string; value: number }) {
  return (
    <div className="card rounded-md p-5">
      <p className="font-semibold text-[#6a7b93]">{title}</p>
      <p className="mt-3 text-3xl font-extrabold">{value}</p>
    </div>
  );
}
