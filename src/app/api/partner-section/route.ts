import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const partnerSection = await prisma.partnerSection.findFirst({
      where: { isActive: true },
    });

    // Return default if none found
    if (!partnerSection) {
      return NextResponse.json({
        title: "Rekanan Kami",
        description: "Dipercaya oleh partner terbaik",
        isActive: true,
      });
    }

    return NextResponse.json(partnerSection);
  } catch (error) {
    console.error("Error fetching partner section:", error);
    return NextResponse.json(
      { error: "Failed to fetch partner section" },
      { status: 500 }
    );
  }
}
