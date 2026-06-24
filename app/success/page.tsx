import { CheckCircle2 } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

type SuccessPageProps = {
  searchParams: Promise<{ order?: string }>;
};

export const metadata = {
  title: "Заявка отправлена",
  description: "Заявка успешно сохранена в системе."
};

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  return (
    <section className="container-page py-10">
      <div className="card rounded-md border-emerald-200 p-10 text-center">
        <CheckCircle2 className="mx-auto text-emerald-600" size={48} aria-hidden="true" />
        <h1 className="mt-5 text-3xl font-extrabold">Заявка отправлена</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg font-medium text-[#40516b]">
          Номер заявки: #{params.order ?? "—"}. Менеджер сможет увидеть ее в админ-панели
          и изменить статус обработки.
        </p>
        <ButtonLink href="/catalog" className="mt-7">
          Вернуться в каталог
        </ButtonLink>
      </div>
    </section>
  );
}
