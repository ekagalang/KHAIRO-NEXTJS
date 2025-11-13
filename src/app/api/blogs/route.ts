import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, logError } from "@/lib/api-error-handler";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const published = searchParams.get("published");
    const category = searchParams.get("category");

    const where: any = {};

    if (published === "true") {
      where.isPublished = true;
    }

    if (category) {
      where.category = category;
    }

    const blogs = await prisma.blog.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      take: limit,
    });

    return NextResponse.json({
      blogs,
      total: blogs.length,
    });
  } catch (error) {
    logError("GET /api/blogs", error);
    return handleApiError(error);
  }
}
