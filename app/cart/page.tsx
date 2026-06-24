import { CartPageClient } from "@/components/cart/CartPageClient";

export const metadata = {
  title: "Корзина",
  description: "Список товаров для оформления заявки ООО «АЗСТЕХСНАБ»."
};

export default function CartPage() {
  return <CartPageClient />;
}
