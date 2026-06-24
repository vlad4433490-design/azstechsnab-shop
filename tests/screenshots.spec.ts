import { expect, type Page, test } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test("public catalog, cart and checkout flow works", async ({ page }) => {
  const consoleErrors = trackConsoleErrors(page);
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Интернет-магазин технических товаров/ })).toBeVisible();

  await page.goto("/catalog");
  await expect(page.getByRole("heading", { name: /Товары промышленного/ })).toBeVisible();

  await page.getByPlaceholder("Название, артикул, производитель").fill("насос");
  await page.getByRole("button", { name: "Найти" }).click();
  await expect(page.getByText("Найдено позиций: 1")).toBeVisible();

  await page.getByPlaceholder("Название, артикул, производитель").fill("AZS-NP80-001");
  await page.getByRole("button", { name: "Найти" }).click();
  await expect(page.getByText("Найдено позиций: 1")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Насос промышленный НП-80" })).toBeVisible();

  await page.getByRole("button", { name: "Сброс" }).click();
  await page.getByLabel("Категория").selectOption("industrial-equipment");
  await page.getByLabel("Наличие").selectOption("IN_STOCK");
  await page.getByRole("button", { name: "Найти" }).click();
  await expect(page.getByText("Найдено позиций: 1")).toBeVisible();

  await page.goto("/products/industrial-pump-np-80");
  await expect(page.getByRole("heading", { name: "Насос промышленный НП-80" })).toBeVisible();
  await page.getByRole("button", { name: "В корзину" }).click();

  await page.goto("/cart");
  await expect(page.getByRole("heading", { name: "Позиции для заявки" })).toBeVisible();
  await page.getByRole("button", { name: "Увеличить количество" }).click();

  await page.goto("/checkout");
  await page.getByRole("button", { name: "Отправить заявку" }).click();
  await expect(page.getByText("Проверьте заполнение полей")).toBeVisible();

  await page.getByLabel("Организация").fill("ООО «ПромМонтаж»");
  await page.getByLabel("Контактное лицо").fill("Иван Петров");
  await page.getByLabel("Телефон").fill("+7 (495) 111-22-33");
  await page.getByLabel("E-mail").fill("client@example.ru");
  await page.getByLabel("Комментарий").fill("Прошу подготовить КП и срок поставки.");
  await page.getByLabel(/Я согласен/).check();
  await page.getByRole("button", { name: "Отправить заявку" }).click();

  await expect(page).toHaveURL(/\/success\?order=\d+/);
  await expect(page.getByRole("heading", { name: "Заявка отправлена" })).toBeVisible();
  expect(consoleErrors).toEqual([]);
});

test("admin login, products and orders pages work", async ({ page }) => {
  const consoleErrors = trackConsoleErrors(page);
  await page.goto("/admin");
  if (await page.getByRole("heading", { name: "Вход администратора" }).isVisible()) {
    await page.getByLabel("Email").fill("admin@azstechsnab.ru");
    await page.getByLabel("Пароль").fill("admin12345");
    await page.getByRole("button", { name: "Войти" }).click();
  }

  await expect(page.getByRole("heading", { name: "Обзор информационной системы" })).toBeVisible();

  await page.goto("/admin/products");
  await expect(page.getByRole("heading", { name: "Управление товарами" })).toBeVisible();
  await expect(page.getByText("Насос промышленный НП-80").first()).toBeVisible();

  await page.goto("/admin/orders");
  await expect(page.getByRole("heading", { name: "Заявки клиентов" })).toBeVisible();
  await expect(page.getByText("ООО «ПромМонтаж»").first()).toBeVisible();
  await page.getByLabel("Статус").first().selectOption("IN_PROGRESS");
  await expect(page.getByLabel("Статус").first()).toHaveValue("IN_PROGRESS");
  expect(consoleErrors).toEqual([]);
});

test("mobile catalog layout works", async ({ page }) => {
  const consoleErrors = trackConsoleErrors(page);
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto("/catalog");

  await expect(page.getByRole("heading", { name: /Товары промышленного/ })).toBeVisible();
  await expect(page.getByLabel("Поиск")).toBeVisible();
  await expect(page.getByRole("button", { name: "Найти" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Корзина/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Компрессорный блок КБ-100" })).toBeVisible();
  expect(consoleErrors).toEqual([]);
});

function trackConsoleErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      const text = message.text();
      if (text.includes("Failed to load resource")) return;
      if (text.includes("Failed to fetch RSC payload")) return;
      errors.push(text);
    }
  });
  page.on("pageerror", (error) => errors.push(error.message));
  return errors;
}
