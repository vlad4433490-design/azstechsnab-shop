"use client";

import { ClipboardList, Grid2X2, LogOut, Package } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/admin", label: "Обзор", icon: Grid2X2 },
  { href: "/admin/products", label: "Товары", icon: Package },
  { href: "/admin/orders", label: "Заявки", icon: ClipboardList }
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin";
  }

  return (
    <section className="container-page grid gap-6 py-10 lg:grid-cols-[240px_1fr]">
      <aside className="card h-fit rounded-md p-5 lg:min-h-[470px]">
        <p className="mb-4 text-sm font-extrabold uppercase text-[#6a7b93]">Администрирование</p>
        <nav className="grid gap-2">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-md px-2 py-3 font-semibold ${
                  isActive ? "bg-[#eef4ff] text-brand-blue" : "hover:bg-[#f4f7fb]"
                }`}
              >
                <Icon size={18} aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
          <button
            type="button"
            className="mt-3 flex items-center gap-3 rounded-md px-2 py-3 text-left font-semibold hover:bg-[#f4f7fb]"
            onClick={logout}
          >
            <LogOut size={18} aria-hidden="true" />
            Выйти
          </button>
        </nav>
      </aside>
      <div>{children}</div>
    </section>
  );
}
