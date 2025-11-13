import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function handleApiError(error: unknown): NextResponse {
  console.error("API Error:", error);

  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return NextResponse.json(
          {
            error: "Data sudah ada",
            message: "Data dengan nilai yang sama sudah ada di database",
            code: "DUPLICATE_ENTRY",
          },
          { status: 409 }
        );
      case "P2025":
        return NextResponse.json(
          {
            error: "Data tidak ditemukan",
            message: "Data yang Anda cari tidak ditemukan",
            code: "NOT_FOUND",
          },
          { status: 404 }
        );
      case "P2003":
        return NextResponse.json(
          {
            error: "Constraint violation",
            message: "Terdapat relasi data yang tidak valid",
            code: "CONSTRAINT_VIOLATION",
          },
          { status: 400 }
        );
      default:
        return NextResponse.json(
          {
            error: "Database error",
            message: "Terjadi kesalahan pada database",
            code: "DATABASE_ERROR",
          },
          { status: 500 }
        );
    }
  }

  // Prisma validation errors
  if (error instanceof Prisma.PrismaClientValidationError) {
    return NextResponse.json(
      {
        error: "Validation error",
        message: "Data yang diberikan tidak valid",
        code: "VALIDATION_ERROR",
      },
      { status: 400 }
    );
  }

  // Custom API errors
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
      },
      { status: error.statusCode }
    );
  }

  // JSON parse errors
  if (error instanceof SyntaxError) {
    return NextResponse.json(
      {
        error: "Invalid JSON",
        message: "Format data tidak valid",
        code: "INVALID_JSON",
      },
      { status: 400 }
    );
  }

  // Generic errors
  if (error instanceof Error) {
    return NextResponse.json(
      {
        error: "Internal server error",
        message:
          process.env.NODE_ENV === "development"
            ? error.message
            : "Terjadi kesalahan pada server",
        code: "INTERNAL_ERROR",
      },
      { status: 500 }
    );
  }

  // Unknown errors
  return NextResponse.json(
    {
      error: "Unknown error",
      message: "Terjadi kesalahan yang tidak diketahui",
      code: "UNKNOWN_ERROR",
    },
    { status: 500 }
  );
}

export function logError(
  context: string,
  error: unknown,
  metadata?: Record<string, any>
) {
  const errorInfo = {
    context,
    timestamp: new Date().toISOString(),
    error:
      error instanceof Error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : error,
    metadata,
  };

  console.error(JSON.stringify(errorInfo, null, 2));

  // Here you can add external logging service integration
  // Example: Sentry, LogRocket, etc.
}
