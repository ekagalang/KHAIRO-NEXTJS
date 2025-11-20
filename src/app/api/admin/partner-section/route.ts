import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get or create partner section settings
    let partnerSection = await prisma.partnerSection.findFirst();

    if (!partnerSection) {
      // Create default settings if none exist
      partnerSection = await prisma.partnerSection.create({
        data: {
          title: "Rekanan Kami",
          description: "Dipercaya oleh partner terbaik",
          isActive: true,
        },
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

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, isActive } = body;

    // Get existing or create new
    let partnerSection = await prisma.partnerSection.findFirst();

    if (partnerSection) {
      // Update existing
      partnerSection = await prisma.partnerSection.update({
        where: { id: partnerSection.id },
        data: {
          title,
          description,
          isActive,
        },
      });
    } else {
      // Create new
      partnerSection = await prisma.partnerSection.create({
        data: {
          title,
          description,
          isActive,
        },
      });
    }

    return NextResponse.json(partnerSection);
  } catch (error) {
    console.error("Error updating partner section:", error);
    return NextResponse.json(
      { error: "Failed to update partner section" },
      { status: 500 }
    );
  }
}
