import { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";
import { apiError, apiOk, validationError } from "@/lib/api";
import { requireAdminFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/format";
import { productInputSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  const admin = await requireAdminFromRequest(request);
  if (!admin) return apiError("UNAUTHORIZED", "Требуется вход администратора", 401);

  const body = await request.json();
  const parsed = productInputSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  try {
    const product = await prisma.product.create({
      data: {
        ...parsed.data,
        slug: parsed.data.slug || slugify(parsed.data.name)
      }
    });
    return apiOk({ product }, 201);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return apiError("CONFLICT", "Товар с таким артикулом или slug уже существует", 409);
    }
    return apiError("SERVER_ERROR", "Не удалось сохранить товар", 500);
  }
}
