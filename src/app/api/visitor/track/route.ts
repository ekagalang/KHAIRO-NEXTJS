import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError, logError } from "@/lib/api-error-handler";

// Track page view - Lightweight endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pageType } = body; // "page" or "product"

    // Get today's date (without time)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if this is a unique visitor (using cookie/session)
    const hasVisitedToday = request.cookies.get("visited_today");
    const isUniqueVisitor = !hasVisitedToday;

    // Get or create today's stats - do everything in one upsert to avoid race condition
    await prisma.visitorStat.upsert({
      where: {
        date: today,
      },
      create: {
        date: today,
        pageViews: 1,
        uniqueVisitors: isUniqueVisitor ? 1 : 0,
        productViews: pageType === "product" ? 1 : 0,
      },
      update: {
        pageViews: {
          increment: 1,
        },
        ...(isUniqueVisitor && {
          uniqueVisitors: {
            increment: 1,
          },
        }),
        ...(pageType === "product" && {
          productViews: {
            increment: 1,
          },
        }),
      },
    });

    // Set cookie to expire at end of day
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const response = NextResponse.json({ success: true });

    // Set cookie for unique visitor tracking
    response.cookies.set("visited_today", "1", {
      expires: tomorrow,
      path: "/",
    });

    return response;
  } catch (error) {
    logError("POST /api/visitor/track", error);
    // Don't block the user if tracking fails
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
