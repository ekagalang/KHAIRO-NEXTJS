import { NextRequest, NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { handleApiError, logError, ApiError } from "@/lib/api-error-handler";

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

    // Get media info before deleting
    const media = await prisma.media.findUnique({
      where: { id },
    });

    if (!media) {
      throw new ApiError(404, "Media tidak ditemukan", "NOT_FOUND");
    }

    // Delete file from filesystem
    try {
      const filepath = path.join(process.cwd(), "public", media.filepath);
      await unlink(filepath);
    } catch (error) {
      console.error("Error deleting file:", error);
      // Continue even if file deletion fails
    }

    // Delete from database
    await prisma.media.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "Media berhasil dihapus",
    });
  } catch (error) {
    logError("DELETE /api/media/[id]", error);
    return handleApiError(error);
  }
}

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

    const media = await prisma.media.update({
      where: { id },
      data: {
        alt: body.alt,
        title: body.title,
      },
    });

    return NextResponse.json(media);
  } catch (error) {
    logError("PUT /api/media/[id]", error);
    return handleApiError(error);
  }
}
