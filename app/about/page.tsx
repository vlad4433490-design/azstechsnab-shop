export const metadata = {
  title: "О компании",
  description: "Информация об учебном проекте ООО «АЗСТЕХСНАБ»."
};

export default function AboutPage() {
  return (
    <section className="container-page py-10">
      <p className="page-kicker">О компании</p>
      <h1 className="mt-3 text-4xl font-extrabold">ООО «АЗСТЕХСНАБ»</h1>
      <div className="card mt-7 max-w-4xl rounded-md p-6">
        <p className="text-lg leading-8 text-[#40516b]">
          Проект представляет учебную информационную систему интернет-магазина для B2B-продаж
          промышленного оборудования, комплектующих и расходных материалов. Сайт помогает
          клиенту найти позиции, собрать заявку и передать ее сотруднику компании.
        </p>
        <p className="mt-5 text-lg leading-8 text-[#40516b]">
          В административной части сотрудник может управлять товарами, просматривать заявки
          и менять статус обработки. Такой формат соответствует дипломному сценарию:
          заявка вместо онлайн-оплаты и структурированная обработка обращений.
        </p>
      </div>
    </section>
  );
}
