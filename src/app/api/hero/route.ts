import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { handleApiError, logError, ApiError } from "@/lib/api-error-handler";

export async function GET() {
  try {
    const hero = await prisma.heroSection.findFirst({
      where: { isActive: true },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(hero || {});
  } catch (error) {
    logError("GET /api/hero", error);
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      throw new ApiError(401, "Tidak terautentikasi", "UNAUTHORIZED");
    }

    const body = await request.json();

    const hero = await prisma.heroSection.create({
      data: {
        title: body.title,
        subtitle: body.subtitle,
        description: body.description,
        buttonText: body.buttonText || "Lihat Paket",
        buttonLink: body.buttonLink || "/products",
        imageUrl: body.imageUrl,
        backgroundUrl: body.backgroundUrl,
        isActive: body.isActive ?? true,
      },
    });

    return NextResponse.json(hero, { status: 201 });
  } catch (error) {
    logError("POST /api/hero", error);
    return handleApiError(error);
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      throw new ApiError(401, "Tidak terautentikasi", "UNAUTHORIZED");
    }

    const body = await request.json();
    const { id, ...data } = body;

    const hero = await prisma.heroSection.update({
      where: { id },
      data,
    });

    return NextResponse.json(hero);
  } catch (error) {
    logError("PUT /api/hero", error);
    return handleApiError(error);
  }
}
