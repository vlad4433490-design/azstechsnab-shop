import { z } from "zod";
import { ORDER_STATUS_OPTIONS, STOCK_OPTIONS } from "@/lib/constants";

const stockValues = STOCK_OPTIONS.map((option) => option.value) as [string, ...string[]];
const orderStatusValues = ORDER_STATUS_OPTIONS.map((option) => option.value) as [
  string,
  ...string[]
];

export const cartItemSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().min(1).max(999)
});

export const orderSchema = z.object({
  companyName: z.string().trim().min(2, "Укажите организацию").max(160),
  contactName: z.string().trim().min(2, "Укажите контактное лицо").max(120),
  phone: z.string().trim().min(6, "Укажите телефон").max(40),
  email: z.string().trim().email("Укажите корректный email").max(160),
  comment: z.string().trim().max(1200).optional().or(z.literal("")),
  consent: z.literal(true),
  items: z.array(cartItemSchema).min(1, "Добавьте товары в корзину")
});

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(6).max(120)
});

export const productInputSchema = z.object({
  categoryId: z.number().int().positive(),
  name: z.string().trim().min(2).max(180),
  slug: z.string().trim().max(180).optional().or(z.literal("")),
  sku: z.string().trim().min(2).max(80),
  description: z.string().trim().min(5).max(1200),
  manufacturer: z.string().trim().min(2).max(120),
  price: z.number().int().min(0).max(999999999),
  unit: z.string().trim().min(1).max(20),
  stockStatus: z.enum(stockValues),
  specsJson: z.string().trim().max(5000).default("{}"),
  imageUrl: z.string().trim().url().optional().or(z.literal("")),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true)
});

export const orderStatusSchema = z.object({
  status: z.enum(orderStatusValues)
});

export type OrderInput = z.infer<typeof orderSchema>;
export type ProductInput = z.infer<typeof productInputSchema>;
