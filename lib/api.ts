import { NextResponse } from "next/server";
import type { ZodError } from "zod";

export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "SERVER_ERROR";

export function apiError(
  code: ApiErrorCode,
  message: string,
  status: number,
  details?: unknown
) {
  return NextResponse.json({ error: { code, message, details } }, { status });
}

export function validationError(error: ZodError) {
  return apiError("VALIDATION_ERROR", "Проверьте заполнение полей", 422, error.flatten());
}

export function apiOk<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}
