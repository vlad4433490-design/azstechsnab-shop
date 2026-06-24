import { redirect } from "next/navigation";
import { AdminProductsClient } from "@/components/admin/AdminProductsClient";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Управление товарами"
};

export default async function AdminProductsPage() {
  const admin = await getAdminSession();
  if (!admin) redirect("/admin");

  const [categories, products] = await Promise.all([
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.product.findMany({
      include: { category: true },
      orderBy: [{ category: { sortOrder: "asc" } }, { id: "desc" }]
    })
  ]);

  return (
    <AdminShell>
      <p className="page-kicker">Админ-панель</p>
      <h1 className="mt-3 text-4xl font-extrabold">Управление товарами</h1>
      <div className="mt-6">
        <AdminProductsClient categories={categories} products={products} />
      </div>
    </AdminShell>
  );
}
