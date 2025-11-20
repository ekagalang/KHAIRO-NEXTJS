import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/product-types - Fetch active product types (public)
export async function GET() {
  try {
    const types = await prisma.productType.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        order: "asc",
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        icon: true,
        color: true,
        order: true,
      },
    });

    return NextResponse.json({ success: true, data: types });
  } catch (error) {
    console.error("Error fetching product types:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch product types" },
      { status: 500 }
    );
  }
}
