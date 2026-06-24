import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE } from "@/lib/constants";
import { prisma } from "@/lib/db";

const DAY_SECONDS = 60 * 60 * 24;

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    return "development-only-session-secret";
  }
  return secret;
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("hex");
}

export function createAdminSessionValue(adminId: number) {
  const expires = Math.floor(Date.now() / 1000) + DAY_SECONDS;
  const payload = `${adminId}.${expires}`;
  return `${payload}.${sign(payload)}`;
}

function parseSessionValue(value?: string) {
  if (!value) return null;
  const parts = value.split(".");
  if (parts.length !== 3) return null;
  const [adminId, expires, signature] = parts;
  const payload = `${adminId}.${expires}`;
  const expected = sign(payload);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (actualBuffer.length !== expectedBuffer.length) return null;
  if (!timingSafeEqual(actualBuffer, expectedBuffer)) return null;
  if (Number(expires) < Math.floor(Date.now() / 1000)) return null;
  return Number(adminId);
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const adminId = parseSessionValue(cookieStore.get(ADMIN_COOKIE)?.value);
  if (!adminId) return null;
  return prisma.adminUser.findUnique({
    where: { id: adminId },
    select: { id: true, email: true, role: true }
  });
}

export async function requireAdminFromRequest(request: NextRequest) {
  const adminId = parseSessionValue(request.cookies.get(ADMIN_COOKIE)?.value);
  if (!adminId) return null;
  return prisma.adminUser.findUnique({
    where: { id: adminId },
    select: { id: true, email: true, role: true }
  });
}

export function adminCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: DAY_SECONDS
  };
}
