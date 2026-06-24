export const STOCK_OPTIONS = [
  { value: "IN_STOCK", label: "В наличии", tone: "green" },
  { value: "LOW_STOCK", label: "Мало на складе", tone: "amber" },
  { value: "ON_ORDER", label: "Под заказ", tone: "slate" }
] as const;

export const ORDER_STATUS_OPTIONS = [
  { value: "NEW", label: "Новая" },
  { value: "IN_PROGRESS", label: "В обработке" },
  { value: "DONE", label: "Обработана" },
  { value: "CANCELLED", label: "Отменена" }
] as const;

export const ADMIN_COOKIE = "admin_session";
