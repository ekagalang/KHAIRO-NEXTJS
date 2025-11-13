import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { handleApiError, logError, ApiError } from "@/lib/api-error-handler";
import sizeOf from "image-size";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      throw new ApiError(401, "Tidak terautentikasi", "UNAUTHORIZED");
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      throw new ApiError(400, "File tidak ditemukan", "BAD_REQUEST");
    }

    // Validasi tipe file
    const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    const allowedVideoTypes = ["video/mp4", "video/webm", "video/ogg"];
    const allowedTypes = [...allowedImageTypes, ...allowedVideoTypes];

    if (!allowedTypes.includes(file.type)) {
      throw new ApiError(400, "Tipe file tidak didukung. Hanya JPG, PNG, GIF, WebP, MP4, WebM, dan OGG yang diperbolehkan", "BAD_REQUEST");
    }

    const isVideo = allowedVideoTypes.includes(file.type);
    const mediaType = isVideo ? "video" : "image";

    // Validasi ukuran file (max 50MB untuk video, 5MB untuk gambar)
    const maxSize = isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      const maxSizeMB = isVideo ? "50MB" : "5MB";
      throw new ApiError(400, `Ukuran file terlalu besar. Maksimal ${maxSizeMB}`, "BAD_REQUEST");
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const ext = path.extname(file.name);
    const filename = `${timestamp}-${randomStr}${ext}`;

    // Create upload directory if not exists
    const uploadSubDir = isVideo ? "videos" : "images";
    const uploadDir = path.join(process.cwd(), "public", "uploads", uploadSubDir);
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // Get media dimensions
    let width, height, duration;

    if (!isVideo) {
      // For images, get dimensions
      try {
        const dimensions = sizeOf(filepath);
        width = dimensions.width;
        height = dimensions.height;
      } catch (error) {
        console.log("Could not get image dimensions:", error);
      }
    } else {
      // For videos, we'll set default dimensions
      // In production, you could use ffprobe to get actual dimensions and duration
      width = 1920;
      height = 1080;
      duration = 0; // Could be extracted with ffprobe if needed
    }

    // Save to database
    const media = await prisma.media.create({
      data: {
        filename: file.name,
        filepath: `/uploads/${uploadSubDir}/${filename}`,
        filesize: file.size,
        mimetype: file.type,
        mediaType,
        width,
        height,
        duration,
        uploadedBy: session.user?.email || undefined,
      },
    });

    return NextResponse.json({
      success: true,
      media,
      url: `/uploads/${uploadSubDir}/${filename}`,
    }, { status: 201 });
  } catch (error) {
    logError("POST /api/media/upload", error);
    return handleApiError(error);
  }
}
