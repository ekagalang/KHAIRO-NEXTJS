import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/app/api/auth/[...nextauth]/route";

// GET - Fetch all hero buttons for a hero section
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const heroSectionId = searchParams.get("heroSectionId");

    if (!heroSectionId) {
      return NextResponse.json({ error: "heroSectionId is required" }, { status: 400 });
    }

    const buttons = await prisma.heroButton.findMany({
      where: { heroSectionId },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(buttons);
  } catch (error) {
    console.error("Error fetching hero buttons:", error);
    return NextResponse.json(
      { error: "Failed to fetch hero buttons" },
      { status: 500 }
    );
  }
}

// POST - Create new hero button
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { heroSectionId, text, link, variant, bgColor, textColor, icon, order, isActive } = body;

    if (!heroSectionId || !text || !link) {
      return NextResponse.json(
        { error: "heroSectionId, text, and link are required" },
        { status: 400 }
      );
    }

    const button = await prisma.heroButton.create({
      data: {
        heroSectionId,
        text,
        link,
        variant: variant || "primary",
        bgColor,
        textColor,
        icon,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json(button);
  } catch (error) {
    console.error("Error creating hero button:", error);
    return NextResponse.json(
      { error: "Failed to create hero button" },
      { status: 500 }
    );
  }
}
