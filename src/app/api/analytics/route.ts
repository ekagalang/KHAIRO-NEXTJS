import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { handleApiError, logError, ApiError } from "@/lib/api-error-handler";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      throw new ApiError(401, "Tidak terautentikasi", "UNAUTHORIZED");
    }

    // Get basic stats
    const [
      totalProducts,
      activeProducts,
      totalQuota,
      totalQuotaFilled,
      featuredProducts,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.product.aggregate({ _sum: { quota: true } }),
      prisma.product.aggregate({ _sum: { quotaFilled: true } }),
      prisma.product.count({ where: { isFeatured: true } }),
    ]);

    // Get products by type
    const productsByType = await prisma.product.groupBy({
      by: ["type"],
      _count: {
        type: true,
      },
      where: {
        isActive: true,
      },
    });

    // Get top performing products (by quota filled)
    const topProducts = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { quotaFilled: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        type: true,
        quota: true,
        quotaFilled: true,
        price: true,
      },
    });

    // Get nearly full products (80%+)
    const nearlyFullProducts = await prisma.product.findMany({
      where: {
        isActive: true,
        quotaFilled: {
          gte: prisma.raw(`quota * 0.8`),
        },
      },
      select: {
        id: true,
        name: true,
        type: true,
        quota: true,
        quotaFilled: true,
      },
    });

    return NextResponse.json({
      summary: {
        totalProducts,
        activeProducts,
        totalQuota: totalQuota._sum.quota || 0,
        totalQuotaFilled: totalQuotaFilled._sum.quotaFilled || 0,
        featuredProducts,
        fillRate:
          totalQuota._sum.quota && totalQuota._sum.quota > 0
            ? ((totalQuotaFilled._sum.quotaFilled || 0) /
                totalQuota._sum.quota) *
              100
            : 0,
      },
      productsByType: productsByType.map((item) => ({
        type: item.type,
        count: item._count.type,
      })),
      topProducts,
      nearlyFullProducts,
    });
  } catch (error) {
    logError("GET /api/analytics", error);
    return handleApiError(error);
  }
}
