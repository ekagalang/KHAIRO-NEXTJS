import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/app/api/auth/[...nextauth]/route";

// GET - Fetch all social media (admin)
export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const socialMedia = await prisma.socialMedia.findMany({
      orderBy: {
        order: "asc",
      },
    });

    return NextResponse.json(socialMedia);
  } catch (error) {
    console.error("Error fetching social media:", error);
    return NextResponse.json(
      { error: "Failed to fetch social media" },
      { status: 500 }
    );
  }
}

// POST - Create new social media
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, icon, url, bgColor, hoverColor, order, isActive } = body;

    const socialMedia = await prisma.socialMedia.create({
      data: {
        name,
        icon,
        url,
        bgColor: bgColor || "bg-blue-500",
        hoverColor: hoverColor || "bg-blue-600",
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json(socialMedia);
  } catch (error) {
    console.error("Error creating social media:", error);
    return NextResponse.json(
      { error: "Failed to create social media" },
      { status: 500 }
    );
  }
}
