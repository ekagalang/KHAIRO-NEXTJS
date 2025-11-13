import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, logError } from "@/lib/api-error-handler";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const category = searchParams.get("category");

    const where: any = { isActive: true };
    if (category) {
      where.category = category;
    }

    const galleries = await prisma.gallery.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json({
      galleries,
      total: galleries.length,
    });
  } catch (error) {
    logError("GET /api/galleries", error);
    return handleApiError(error);
  }
}
