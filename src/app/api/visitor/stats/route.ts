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

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "30");

    // Get date range
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    // Get stats for date range
    const stats = await prisma.visitorStat.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    // Calculate totals
    const totals = stats.reduce(
      (acc, stat) => ({
        pageViews: acc.pageViews + stat.pageViews,
        uniqueVisitors: acc.uniqueVisitors + stat.uniqueVisitors,
        productViews: acc.productViews + stat.productViews,
      }),
      { pageViews: 0, uniqueVisitors: 0, productViews: 0 }
    );

    // Get today's stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayStats = await prisma.visitorStat.findUnique({
      where: { date: today },
    });

    // Get yesterday's stats for comparison
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const yesterdayStats = await prisma.visitorStat.findUnique({
      where: { date: yesterday },
    });

    // Calculate growth
    const calculateGrowth = (today: number, yesterday: number) => {
      if (yesterday === 0) return today > 0 ? 100 : 0;
      return ((today - yesterday) / yesterday) * 100;
    };

    return NextResponse.json({
      today: {
        pageViews: todayStats?.pageViews || 0,
        uniqueVisitors: todayStats?.uniqueVisitors || 0,
        productViews: todayStats?.productViews || 0,
      },
      yesterday: {
        pageViews: yesterdayStats?.pageViews || 0,
        uniqueVisitors: yesterdayStats?.uniqueVisitors || 0,
        productViews: yesterdayStats?.productViews || 0,
      },
      growth: {
        pageViews: calculateGrowth(
          todayStats?.pageViews || 0,
          yesterdayStats?.pageViews || 0
        ),
        uniqueVisitors: calculateGrowth(
          todayStats?.uniqueVisitors || 0,
          yesterdayStats?.uniqueVisitors || 0
        ),
        productViews: calculateGrowth(
          todayStats?.productViews || 0,
          yesterdayStats?.productViews || 0
        ),
      },
      totals: {
        pageViews: totals.pageViews,
        uniqueVisitors: totals.uniqueVisitors,
        productViews: totals.productViews,
        averagePerDay: {
          pageViews: Math.round(totals.pageViews / Math.max(stats.length, 1)),
          uniqueVisitors: Math.round(
            totals.uniqueVisitors / Math.max(stats.length, 1)
          ),
          productViews: Math.round(
            totals.productViews / Math.max(stats.length, 1)
          ),
        },
      },
      chartData: stats.map((stat) => ({
        date: stat.date.toISOString().split("T")[0],
        pageViews: stat.pageViews,
        uniqueVisitors: stat.uniqueVisitors,
        productViews: stat.productViews,
      })),
    });
  } catch (error) {
    logError("GET /api/visitor/stats", error);
    return handleApiError(error);
  }
}
