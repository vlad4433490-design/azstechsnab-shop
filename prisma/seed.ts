import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const categories = [
  {
    name: "Промышленное оборудование",
    slug: "industrial-equipment",
    description: "Оборудование для производственных линий и инженерных систем.",
    sortOrder: 1
  },
  {
    name: "Комплектующие и запчасти",
    slug: "parts",
    description: "Запасные части и комплектующие для ремонта оборудования.",
    sortOrder: 2
  },
  {
    name: "Расходные материалы",
    slug: "consumables",
    description: "Материалы для обслуживания производственных участков.",
    sortOrder: 3
  },
  {
    name: "Инструменты",
    slug: "tools",
    description: "Ручной и сервисный инструмент для монтажных работ.",
    sortOrder: 4
  },
  {
    name: "Электротехника",
    slug: "electrical",
    description: "Кабельная продукция, двигатели и электротехнические позиции.",
    sortOrder: 5
  }
];

const products = [
  {
    categorySlug: "industrial-equipment",
    name: "Компрессорный блок КБ-100",
    slug: "compressor-block-kb-100",
    sku: "AZS-KB100-002",
    description: "Компрессорный блок для сборки и ремонта пневмосистем производственных линий.",
    manufacturer: "ПромПневмо",
    price: 124000,
    unit: "шт.",
    stockStatus: "ON_ORDER",
    isFeatured: true,
    specs: { "Производительность": "100 м3/ч", "Мощность": "11 кВт", "Материал корпуса": "сталь", "Гарантия": "12 месяцев" }
  },
  {
    categorySlug: "industrial-equipment",
    name: "Насос промышленный НП-80",
    slug: "industrial-pump-np-80",
    sku: "AZS-NP80-001",
    description: "Центробежный насос для перекачки технической воды и нейтральных жидкостей на производственных объектах.",
    manufacturer: "ТехМаш",
    price: 78500,
    unit: "шт.",
    stockStatus: "IN_STOCK",
    isFeatured: true,
    specs: { "Производительность": "80 м3/ч", "Мощность": "7,5 кВт", "Материал корпуса": "чугун", "Гарантия": "12 месяцев" }
  },
  {
    categorySlug: "industrial-equipment",
    name: "Шкаф управления насосами ШУН-2",
    slug: "pump-control-cabinet-shun-2",
    sku: "AZS-SHUN2-040",
    description: "Шкаф автоматического управления двумя насосами с защитой электродвигателей и индикацией режимов.",
    manufacturer: "АвтоматикаПлюс",
    price: 56900,
    unit: "шт.",
    stockStatus: "ON_ORDER",
    isFeatured: true,
    specs: { "Количество насосов": "2", "Напряжение": "380 В", "Степень защиты": "IP54", "Монтаж": "настенный" }
  },
  {
    categorySlug: "parts",
    name: "Запорная арматура Ду50",
    slug: "valve-du50",
    sku: "AZS-VALVE-DU50",
    description: "Фланцевый шаровый кран для трубопроводных систем производственного и складского назначения.",
    manufacturer: "АрмаПром",
    price: 5100,
    unit: "шт.",
    stockStatus: "LOW_STOCK",
    specs: { "Диаметр": "Ду50", "Материал": "сталь", "Тип соединения": "фланцевое", "Давление": "Ру16" }
  },
  {
    categorySlug: "parts",
    name: "Подшипник 6205 ZZ",
    slug: "bearing-6205-zz",
    sku: "AZS-BRG-6205ZZ",
    description: "Закрытый шариковый подшипник для электродвигателей, редукторов и промышленного оборудования.",
    manufacturer: "SKF Analog",
    price: 420,
    unit: "шт.",
    stockStatus: "IN_STOCK",
    specs: { "Тип": "шариковый", "Внутренний диаметр": "25 мм", "Наружный диаметр": "52 мм", "Защита": "ZZ" }
  },
  {
    categorySlug: "parts",
    name: "Редуктор червячный Ч-80",
    slug: "worm-gearbox-ch-80",
    sku: "AZS-RED-CH80",
    description: "Червячный редуктор для приводов транспортеров, подъемных механизмов и вспомогательного оборудования.",
    manufacturer: "РедукторСервис",
    price: 44700,
    unit: "шт.",
    stockStatus: "IN_STOCK",
    specs: { "Тип": "червячный", "Передаточное число": "1:40", "Момент": "до 250 Нм", "Монтаж": "универсальный" }
  },
  {
    categorySlug: "consumables",
    name: "Рукав высокого давления РВД-16",
    slug: "high-pressure-hose-rvd-16",
    sku: "AZS-RVD16-011",
    description: "РВД для гидравлических контуров промышленного оборудования и строительной техники.",
    manufacturer: "ГидроСнаб",
    price: 960,
    unit: "м.",
    stockStatus: "IN_STOCK",
    specs: { "Диаметр": "16 мм", "Давление": "до 25 МПа", "Тип": "двухоплеточный", "Единица": "метр" }
  },
  {
    categorySlug: "consumables",
    name: "Фильтр гидравлический ФГ-25",
    slug: "hydraulic-filter-fg-25",
    sku: "AZS-FG25-010",
    description: "Сменный фильтрующий элемент для гидравлических систем станков, прессов и спецтехники.",
    manufacturer: "ГидроФильтр",
    price: 1850,
    unit: "шт.",
    stockStatus: "IN_STOCK",
    specs: { "Тонкость фильтрации": "25 мкм", "Материал": "целлюлоза", "Назначение": "гидравлика", "Ресурс": "до 500 ч" }
  },
  {
    categorySlug: "tools",
    name: "Набор слесарного инструмента НСИ-82",
    slug: "tool-kit-nsi-82",
    sku: "AZS-NSI82-021",
    description: "Комплект ручного инструмента для механиков, сервисных инженеров и ремонтных бригад.",
    manufacturer: "МастерПроф",
    price: 14800,
    unit: "шт.",
    stockStatus: "IN_STOCK",
    specs: { "Количество предметов": "82", "Материал": "Cr-V", "Кейс": "пластиковый", "Назначение": "сервисные работы" }
  },
  {
    categorySlug: "tools",
    name: "Сварочный инвертор промышленный СИ-250",
    slug: "welding-inverter-si-250",
    sku: "AZS-SI250-020",
    description: "Инверторный сварочный аппарат для монтажных и ремонтных работ на производстве.",
    manufacturer: "ЭнергоСвар",
    price: 32600,
    unit: "шт.",
    stockStatus: "ON_ORDER",
    specs: { "Ток": "до 250 А", "Напряжение": "220 В", "Режим": "MMA", "Вес": "7,8 кг" }
  },
  {
    categorySlug: "electrical",
    name: "Кабель силовой ВВГнг 3x2,5",
    slug: "power-cable-vvgng-3x25",
    sku: "AZS-VVGNG-0325",
    description: "Силовой кабель с медными жилами для стационарной прокладки в промышленных и коммерческих помещениях.",
    manufacturer: "КабельСтандарт",
    price: 118,
    unit: "м",
    stockStatus: "IN_STOCK",
    specs: { "Сечение": "3x2,5", "Материал жил": "медь", "Исполнение": "нг", "Единица": "метр" }
  },
  {
    categorySlug: "electrical",
    name: "Электродвигатель АИР 90L2",
    slug: "electric-motor-air-90l2",
    sku: "AZS-AIR90L2-030",
    description: "Асинхронный электродвигатель для насосов, вентиляции, приводов и станочного оборудования.",
    manufacturer: "ЭлМаш",
    price: 21900,
    unit: "шт.",
    stockStatus: "LOW_STOCK",
    specs: { "Мощность": "3 кВт", "Обороты": "3000 об/мин", "Напряжение": "380 В", "Класс защиты": "IP55" }
  }
];

async function main() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category
    });
  }

  const categoryBySlug = new Map(
    (await prisma.category.findMany()).map((category) => [category.slug, category.id])
  );

  for (const product of products) {
    const categoryId = categoryBySlug.get(product.categorySlug);
    if (!categoryId) {
      throw new Error(`Category not found: ${product.categorySlug}`);
    }

    await prisma.product.upsert({
      where: { sku: product.sku },
      update: {
        name: product.name,
        slug: product.slug,
        sku: product.sku,
        description: product.description,
        manufacturer: product.manufacturer,
        price: product.price,
        unit: product.unit,
        stockStatus: product.stockStatus,
        isFeatured: product.isFeatured ?? false,
        categoryId,
        specsJson: JSON.stringify(product.specs)
      },
      create: {
        name: product.name,
        slug: product.slug,
        sku: product.sku,
        description: product.description,
        manufacturer: product.manufacturer,
        price: product.price,
        unit: product.unit,
        stockStatus: product.stockStatus,
        isFeatured: product.isFeatured ?? false,
        categoryId,
        specsJson: JSON.stringify(product.specs)
      }
    });
  }

  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {
      companyName: "ООО «АЗСТЕХСНАБ»",
      phone: "+7 (926) 091-62-50",
      email: "info@azstechsnab.ru",
      inn: "9719004681",
      kpp: "771901001",
      ogrn: "1207700215788",
      description: "Учебный проект информационной системы интернет-магазина для B2B-продаж промышленного оборудования, комплектующих и расходных материалов.",
      address: "г. Москва"
    },
    create: {
      id: 1,
      companyName: "ООО «АЗСТЕХСНАБ»",
      phone: "+7 (926) 091-62-50",
      email: "info@azstechsnab.ru",
      inn: "9719004681",
      kpp: "771901001",
      ogrn: "1207700215788",
      description: "Учебный проект информационной системы интернет-магазина для B2B-продаж промышленного оборудования, комплектующих и расходных материалов.",
      address: "г. Москва"
    }
  });

  const email = process.env.ADMIN_EMAIL ?? "admin@azstechsnab.ru";
  const password = process.env.ADMIN_PASSWORD ?? "admin12345";
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash, role: "ADMIN" },
    create: { email, passwordHash, role: "ADMIN" }
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
