import { ORDER_STATUS_OPTIONS, STOCK_OPTIONS } from "@/lib/constants";

export function formatPrice(value: number, unit?: string) {
  return `${new Intl.NumberFormat("ru-RU").format(value)} ₽${unit ? `/${unit}` : ""}`;
}

export function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }).format(value);
}

export function getStockLabel(value: string) {
  return STOCK_OPTIONS.find((option) => option.value === value)?.label ?? value;
}

export function getStockTone(value: string) {
  return STOCK_OPTIONS.find((option) => option.value === value)?.tone ?? "slate";
}

export function getOrderStatusLabel(value: string) {
  return ORDER_STATUS_OPTIONS.find((option) => option.value === value)?.label ?? value;
}

export function parseSpecs(specsJson: string): Array<[string, string]> {
  try {
    const parsed = JSON.parse(specsJson) as Record<string, unknown>;
    return Object.entries(parsed).map(([key, value]) => [key, String(value)]);
  } catch {
    return [];
  }
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/ё/g, "e")
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-zа-я0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
