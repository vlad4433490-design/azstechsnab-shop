import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Контакты",
  description: "Контакты и реквизиты ООО «АЗСТЕХСНАБ»."
};

export default async function ContactsPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });

  return (
    <section className="container-page py-10">
      <p className="page-kicker">Контакты</p>
      <h1 className="mt-3 text-4xl font-extrabold">Контакты компании</h1>
      <div className="mt-7 grid gap-5 md:grid-cols-2">
        <div className="card rounded-md p-6">
          <h2 className="text-2xl font-extrabold">Связь</h2>
          <dl className="mt-5 grid gap-4">
            <ContactRow label="Телефон" value={settings?.phone ?? "+7 (926) 091-62-50"} />
            <ContactRow label="Email" value={settings?.email ?? "info@azstechsnab.ru"} />
            <ContactRow label="Адрес" value={settings?.address ?? "г. Москва"} />
          </dl>
        </div>
        <div className="card rounded-md p-6">
          <h2 className="text-2xl font-extrabold">Реквизиты</h2>
          <dl className="mt-5 grid gap-4">
            <ContactRow label="Компания" value={settings?.companyName ?? "ООО «АЗСТЕХСНАБ»"} />
            <ContactRow label="ИНН" value={settings?.inn ?? "9719004681"} />
            <ContactRow label="КПП" value={settings?.kpp ?? "771901001"} />
            <ContactRow label="ОГРН" value={settings?.ogrn ?? "1207700215788"} />
          </dl>
        </div>
      </div>
    </section>
  );
}

function ContactRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm font-semibold text-[#6a7b93]">{label}</dt>
      <dd className="mt-1 text-lg font-extrabold">{value}</dd>
    </div>
  );
}
