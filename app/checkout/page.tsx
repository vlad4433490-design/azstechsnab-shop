import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export const metadata = {
  title: "Оформление заявки",
  description: "Форма оформления заявки на коммерческое предложение."
};

export default function CheckoutPage() {
  return (
    <section className="container-page py-10">
      <p className="page-kicker">Оформление</p>
      <h1 className="mt-3 text-4xl font-extrabold">Заявка на коммерческое предложение</h1>
      <p className="mt-5 text-lg font-medium text-[#40516b]">
        Заполните контактные данные, чтобы менеджер обработал заявку.
      </p>
      <CheckoutForm />
    </section>
  );
}
