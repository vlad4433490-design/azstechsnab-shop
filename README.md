# АЗСТЕХСНАБ Shop

Дипломный прототип информационной системы интернет-магазина ООО «АЗСТЕХСНАБ».
Это B2B-каталог-заявочник: пользователь выбирает товары, оформляет заявку на КП,
а сотрудник видит ее в админ-панели и меняет статус обработки.

## Стек

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Prisma
- SQLite локально
- PostgreSQL для Vercel через Supabase или Neon
- bcryptjs + httpOnly cookie для demo admin login
- Playwright smoke-тесты

## Локальный запуск

1. Установить зависимости:

```bash
pnpm install
```

2. Создать локальный env-файл по примеру `.env.example`:

```bash
cp .env.example .env
```

Для Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

3. Подготовить SQLite-базу и seed:

```bash
pnpm prisma:generate
pnpm db:push
pnpm db:seed
```

4. Запустить проект:

```bash
pnpm dev
```

Открыть: `http://localhost:3000`

## Demo admin

Админ-панель: `http://localhost:3000/admin`

Демо-доступ из seed:

- email: `admin@azstechsnab.ru`
- пароль: `admin12345`

Для реального публичного стенда поменяйте `ADMIN_PASSWORD` перед seed production-базы.

## Основные страницы

- `/` - главная
- `/catalog` - каталог с поиском и фильтрами
- `/products/[slug]` - карточка товара
- `/cart` - корзина-заявка
- `/checkout` - оформление заявки
- `/success` - успешная отправка
- `/about` - о компании
- `/contacts` - контакты
- `/admin` - dashboard / login
- `/admin/products` - товары
- `/admin/orders` - заявки

## Проверки

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm test:e2e
pnpm audit
```

`pnpm test:e2e` автоматически выполняет Prisma generate, `db push` и seed для локальной SQLite-базы.

## Данные

Seed создаёт:

- 5 категорий;
- 12 товаров из макетов;
- контакты и реквизиты ООО «АЗСТЕХСНАБ»;
- demo admin.

`OrderItem` сохраняет snapshot товара: название, артикул, цену, количество и единицу. Поэтому старая заявка остаётся читаемой после изменения товара.

## Деплой на Vercel

Codex не создаёт аккаунты GitHub, Vercel, Supabase или Neon. Проект подготовлен так, чтобы деплой можно было выполнить вручную.

### 1. GitHub

```bash
git init
git add .
git commit -m "Initial AZSTECHSNAB diploma shop"
git branch -M main
git remote add origin <URL_ВАШЕГО_РЕПОЗИТОРИЯ>
git push -u origin main
```

### 2. Supabase или Neon

1. Создайте PostgreSQL-базу.
2. Скопируйте две строки подключения:
   - `DATABASE_URL` - pooled connection для сайта на Vercel;
   - `DIRECT_URL` - direct connection для Prisma `db push`.
3. В Neon pooled URL обычно содержит `-pooler` в hostname, direct URL - без `-pooler`.
4. Важно: для Vercel используется `prisma/schema.postgres.prisma`, потому что в основной локальной схеме стоит `provider = "sqlite"`.

### 3. Vercel

1. Создайте новый проект из GitHub-репозитория.
2. В Environment Variables добавьте:

```text
DATABASE_URL=<pooled PostgreSQL URL>
DIRECT_URL=<direct PostgreSQL URL>
SESSION_SECRET=<длинная случайная строка>
ADMIN_EMAIL=admin@azstechsnab.ru
ADMIN_PASSWORD=<временный пароль перед production seed>
NEXT_PUBLIC_SITE_URL=https://<ваш-домен>.vercel.app
```

3. Build Command в Vercel:

```bash
pnpm prisma:generate:prod && pnpm build:next
```

4. После первого деплоя выполните для production-базы локально или через Vercel shell:

```bash
pnpm prisma:generate:prod
pnpm db:push:prod
pnpm db:seed
```

Для дипломного прототипа используется `prisma db push` как быстрый способ создать структуру PostgreSQL. Если нужен строгий migration workflow, создайте отдельные PostgreSQL migrations уже от `schema.postgres.prisma`.

### 4. Проверка после деплоя

1. Открыть главную страницу.
2. Проверить каталог и карточку товара.
3. Добавить товар в корзину.
4. Оформить заявку.
5. Убедиться, что success screen показывает номер заявки.
6. Войти в `/admin`.
7. Проверить товары.
8. Проверить, что новая заявка появилась в `/admin/orders`.
9. Поменять статус заявки.

## Что не входит

- онлайн-оплата;
- личный кабинет клиента;
- интеграция с 1С;
- Telegram/email-уведомления;
- загрузка файлов;
- отзывы;
- сложные роли;
- промышленная авторизация;
- аналитика.
