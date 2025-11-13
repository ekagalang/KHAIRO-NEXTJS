import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { handleApiError, logError, ApiError } from "@/lib/api-error-handler";

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(testimonials);
  } catch (error) {
    logError("GET /api/testimonials", error);
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

    const testimonial = await prisma.testimonial.create({
      data: {
        name: body.name,
        role: body.role,
        content: body.content,
        rating: body.rating || 5,
        imageUrl: body.imageUrl,
        order: body.order || 0,
        isActive: body.isActive ?? true,
      },
    });

    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    logError("POST /api/testimonials", error);
    return handleApiError(error);
  }
}
