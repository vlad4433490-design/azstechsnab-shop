import { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";
import { apiError, apiOk } from "@/lib/api";
import { requireAdminFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(request: NextRequest, { params }: Params) {
  const admin = await requireAdminFromRequest(request);
  if (!admin) return apiError("UNAUTHORIZED", "Требуется вход администратора", 401);

  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isInteger(id)) return apiError("VALIDATION_ERROR", "Некорректный id", 422);

  try {
    await prisma.order.delete({ where: { id } });
    return apiOk({ ok: true });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return apiError("NOT_FOUND", "Заявка не найдена", 404);
    }
    return apiError("SERVER_ERROR", "Не удалось удалить заявку", 500);
  }
}
