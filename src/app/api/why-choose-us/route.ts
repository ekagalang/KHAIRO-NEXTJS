import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { handleApiError, logError, ApiError } from "@/lib/api-error-handler";

export async function GET() {
  try {
    const items = await prisma.whyChooseUs.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(items);
  } catch (error) {
    logError("GET /api/why-choose-us", error);
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

    const item = await prisma.whyChooseUs.create({
      data: {
        icon: body.icon,
        title: body.title,
        description: body.description,
        order: body.order || 0,
        isActive: body.isActive ?? true,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    logError("POST /api/why-choose-us", error);
    return handleApiError(error);
  }
}
