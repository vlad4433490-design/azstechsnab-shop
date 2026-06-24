import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE } from "@/lib/constants";
import { apiError, validationError } from "@/lib/api";
import { adminCookieOptions, createAdminSessionValue } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { loginSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return validationError(parsed.error);
  }

  const admin = await prisma.adminUser.findUnique({ where: { email: parsed.data.email } });
  if (!admin) {
    return apiError("UNAUTHORIZED", "Неверный email или пароль", 401);
  }

  const isValid = await bcrypt.compare(parsed.data.password, admin.passwordHash);
  if (!isValid) {
    return apiError("UNAUTHORIZED", "Неверный email или пароль", 401);
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, createAdminSessionValue(admin.id), adminCookieOptions());
  return response;
}
