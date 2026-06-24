import { NextRequest } from "next/server";
import { apiError, apiOk, validationError } from "@/lib/api";
import { prisma } from "@/lib/db";
import { orderSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = orderSchema.safeParse(body);

    if (!parsed.success) {
      return validationError(parsed.error);
    }

    const uniqueIds = [...new Set(parsed.data.items.map((item) => item.productId))];
    const products = await prisma.product.findMany({
      where: { id: { in: uniqueIds }, isActive: true }
    });
    const productMap = new Map(products.map((product) => [product.id, product]));

    if (products.length !== uniqueIds.length) {
      return apiError("NOT_FOUND", "Один из товаров не найден", 404);
    }

    const totalAmount = parsed.data.items.reduce((sum, item) => {
      const product = productMap.get(item.productId);
      return sum + (product?.price ?? 0) * item.quantity;
    }, 0);

    const order = await prisma.order.create({
      data: {
        totalAmount,
        customer: {
          create: {
            companyName: parsed.data.companyName,
            contactName: parsed.data.contactName,
            phone: parsed.data.phone,
            email: parsed.data.email,
            comment: parsed.data.comment || null
          }
        },
        items: {
          create: parsed.data.items.map((item) => {
            const product = productMap.get(item.productId);
            if (!product) {
              throw new Error("Product map invariant failed");
            }
            return {
              productId: product.id,
              nameSnapshot: product.name,
              skuSnapshot: product.sku,
              priceSnapshot: product.price,
              unitSnapshot: product.unit,
              quantity: item.quantity
            };
          })
        }
      },
      select: { id: true }
    });

    return apiOk({ orderId: order.id }, 201);
  } catch {
    return apiError("SERVER_ERROR", "Не удалось сохранить заявку", 500);
  }
}
