import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { handleApiError, logError, ApiError } from "@/lib/api-error-handler";

// Maximum file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Allowed image types
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      throw new ApiError(401, "Tidak terautentikasi", "UNAUTHORIZED");
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      throw new ApiError(400, "File tidak ditemukan", "FILE_NOT_FOUND");
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new ApiError(
        400,
        "Tipe file tidak didukung. Hanya JPG, PNG, dan WebP yang diperbolehkan",
        "INVALID_FILE_TYPE"
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      throw new ApiError(
        400,
        "Ukuran file terlalu besar. Maksimal 5MB",
        "FILE_TOO_LARGE"
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/\s+/g, "-").toLowerCase();
    const filename = `${timestamp}-${originalName}`;

    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), "public", "uploads", "products");
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // Directory might already exist, that's fine
    }

    // Save file
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // Return URL
    const fileUrl = `/uploads/products/${filename}`;

    return NextResponse.json(
      {
        success: true,
        url: fileUrl,
        filename: filename,
        size: file.size,
        type: file.type,
      },
      { status: 201 }
    );
  } catch (error) {
    logError("POST /api/upload", error);
    return handleApiError(error);
  }
}

// Delete uploaded file
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      throw new ApiError(401, "Tidak terautentikasi", "UNAUTHORIZED");
    }

    const { searchParams } = new URL(request.url);
    const filename = searchParams.get("filename");

    if (!filename) {
      throw new ApiError(400, "Filename tidak ditemukan", "FILENAME_REQUIRED");
    }

    // Security check: prevent directory traversal
    if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
      throw new ApiError(400, "Filename tidak valid", "INVALID_FILENAME");
    }

    const filepath = join(process.cwd(), "public", "uploads", "products", filename);

    try {
      const { unlink } = await import("fs/promises");
      await unlink(filepath);
    } catch (error) {
      throw new ApiError(404, "File tidak ditemukan", "FILE_NOT_FOUND");
    }

    return NextResponse.json({
      success: true,
      message: "File berhasil dihapus",
    });
  } catch (error) {
    logError("DELETE /api/upload", error);
    return handleApiError(error);
  }
}
