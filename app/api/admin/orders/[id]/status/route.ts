import { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";
import { apiError, apiOk, validationError } from "@/lib/api";
import { requireAdminFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { orderStatusSchema } from "@/lib/validators";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  const admin = await requireAdminFromRequest(request);
  if (!admin) return apiError("UNAUTHORIZED", "Требуется вход администратора", 401);

  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isInteger(id)) return apiError("VALIDATION_ERROR", "Некорректный id", 422);

  const body = await request.json();
  const parsed = orderStatusSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  try {
    const order = await prisma.order.update({
      where: { id },
      data: { status: parsed.data.status }
    });
    return apiOk({ order });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return apiError("NOT_FOUND", "Заявка не найдена", 404);
    }
    return apiError("SERVER_ERROR", "Не удалось изменить статус заявки", 500);
  }
}
