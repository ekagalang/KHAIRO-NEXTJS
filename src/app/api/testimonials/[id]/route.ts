import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { handleApiError, logError, ApiError } from "@/lib/api-error-handler";

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      throw new ApiError(401, "Tidak terautentikasi", "UNAUTHORIZED");
    }

    const { id } = await context.params;
    const body = await request.json();

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(testimonial);
  } catch (error) {
    logError("PUT /api/testimonials/[id]", error);
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      throw new ApiError(401, "Tidak terautentikasi", "UNAUTHORIZED");
    }

    const { id } = await context.params;
    await prisma.testimonial.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    logError("DELETE /api/testimonials/[id]", error);
    return handleApiError(error);
  }
}
