import { redirect } from "next/navigation";
import { AdminOrdersClient } from "@/components/admin/AdminOrdersClient";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Заявки клиентов"
};

export default async function AdminOrdersPage() {
  const admin = await getAdminSession();
  if (!admin) redirect("/admin");

  const orders = await prisma.order.findMany({
    include: { customer: true, items: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <AdminShell>
      <p className="page-kicker">Админ-панель</p>
      <h1 className="mt-3 text-4xl font-extrabold">Заявки клиентов</h1>
      <div className="mt-6">
        <AdminOrdersClient orders={orders} />
      </div>
    </AdminShell>
  );
}
