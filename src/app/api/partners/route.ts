import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/partners - Fetch active partners
export async function GET(request: NextRequest) {
  try {
    const partners = await prisma.partner.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        order: "asc",
      },
    });

    return NextResponse.json(partners);
  } catch (error) {
    console.error("Error fetching partners:", error);
    return NextResponse.json(
      { error: "Failed to fetch partners" },
      { status: 500 }
    );
  }
}
