import { prisma } from "@/lib/db";

export async function Footer() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });

  return (
    <footer className="bg-[#030817] py-12 text-white">
      <div className="container-page grid gap-8 md:grid-cols-3">
        <div>
          <h2 className="text-lg font-extrabold">{settings?.companyName ?? "ООО «АЗСТЕХСНАБ»"}</h2>
          <p className="mt-4 max-w-sm leading-7 text-slate-300">
            {settings?.description ??
              "Учебный проект информационной системы интернет-магазина для B2B-продаж промышленного оборудования, комплектующих и расходных материалов."}
          </p>
        </div>
        <div>
          <h2 className="font-extrabold">Контакты</h2>
          <p className="mt-4 leading-7 text-slate-300">{settings?.phone ?? "+7 (926) 091-62-50"}</p>
          <p className="leading-7 text-slate-300">{settings?.email ?? "info@azstechsnab.ru"}</p>
        </div>
        <div>
          <h2 className="font-extrabold">Реквизиты</h2>
          <p className="mt-4 leading-7 text-slate-300">ИНН {settings?.inn ?? "9719004681"}</p>
          <p className="leading-7 text-slate-300">КПП {settings?.kpp ?? "771901001"}</p>
          <p className="leading-7 text-slate-300">ОГРН {settings?.ogrn ?? "1207700215788"}</p>
        </div>
      </div>
    </footer>
  );
}
