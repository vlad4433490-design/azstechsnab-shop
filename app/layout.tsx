import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { CartProvider } from "@/components/cart/CartProvider";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "АЗСТЕХСНАБ - интернет-магазин технических товаров",
    template: "%s | АЗСТЕХСНАБ"
  },
  description:
    "B2B-каталог промышленного снабжения ООО «АЗСТЕХСНАБ» с корзиной-заявкой и админ-панелью.",
  openGraph: {
    title: "ООО «АЗСТЕХСНАБ»",
    description:
      "Информационная система интернет-магазина для B2B-заявок на промышленное оборудование.",
    type: "website",
    locale: "ru_RU"
  }
};

export const dynamic = "force-dynamic";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <CartProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
