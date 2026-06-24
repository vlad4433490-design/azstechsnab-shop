import { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";
import { apiError, apiOk, validationError } from "@/lib/api";
import { requireAdminFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/format";
import { productInputSchema } from "@/lib/validators";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  const admin = await requireAdminFromRequest(request);
  if (!admin) return apiError("UNAUTHORIZED", "Требуется вход администратора", 401);

  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isInteger(id)) return apiError("VALIDATION_ERROR", "Некорректный id", 422);

  const body = await request.json();
  const parsed = productInputSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...parsed.data,
        slug: parsed.data.slug || slugify(parsed.data.name)
      }
    });
    return apiOk({ product });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return apiError("CONFLICT", "Товар с таким артикулом или slug уже существует", 409);
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return apiError("NOT_FOUND", "Товар не найден", 404);
    }
    return apiError("SERVER_ERROR", "Не удалось обновить товар", 500);
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const admin = await requireAdminFromRequest(request);
  if (!admin) return apiError("UNAUTHORIZED", "Требуется вход администратора", 401);

  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isInteger(id)) return apiError("VALIDATION_ERROR", "Некорректный id", 422);

  try {
    await prisma.product.delete({ where: { id } });
    return apiOk({ ok: true });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return apiError("NOT_FOUND", "Товар не найден", 404);
    }
    return apiError("SERVER_ERROR", "Не удалось удалить товар", 500);
  }
}
