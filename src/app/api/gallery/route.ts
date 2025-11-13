import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const admin = searchParams.get("admin");
    const category = searchParams.get("category");

    const where: any = {};

    if (!admin) {
      where.isActive = true;
    }

    if (category) {
      where.category = category;
    }

    const galleries = await prisma.gallery.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(galleries);
  } catch (error) {
    console.error("Error fetching galleries:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const gallery = await prisma.gallery.create({
      data: {
        title: body.title,
        description: body.description || null,
        imageUrl: body.imageUrl,
        category: body.category,
        isActive: body.isActive ?? true,
      },
    });

    return NextResponse.json(gallery);
  } catch (error) {
    console.error("Error creating gallery:", error);
    return NextResponse.json(
      { error: "Failed to create gallery" },
      { status: 500 }
    );
  }
}
