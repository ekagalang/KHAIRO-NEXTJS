import { NextRequest, NextResponse } from "next/server";
import { readFile, stat } from "fs/promises";
import { join } from "path";

export const dynamic = 'force-dynamic';

type RouteContext = {
  params: Promise<{ filename: string }>;
};

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { filename } = await context.params;

    // Security check: prevent directory traversal
    if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
      return new NextResponse("Invalid filename", { status: 400 });
    }

    const filepath = join(process.cwd(), "public", "uploads", "videos", filename);

    // Check if file exists and get stats
    let stats;
    try {
      stats = await stat(filepath);
    } catch {
      return new NextResponse("Video not found", { status: 404 });
    }

    const fileSize = stats.size;

    // Determine MIME type based on extension
    let contentType = "video/mp4";
    if (filename.endsWith(".webm")) {
      contentType = "video/webm";
    } else if (filename.endsWith(".ogg")) {
      contentType = "video/ogg";
    }

    // Read the file
    const fileBuffer = await readFile(filepath);

    // Handle range requests for video streaming
    const range = request.headers.get("range");

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;

      const chunk = fileBuffer.slice(start, end + 1);

      return new NextResponse(chunk, {
        status: 206,
        headers: {
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunksize.toString(),
          "Content-Type": contentType,
        },
      });
    }

    // No range request, send full file
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": fileSize.toString(),
        "Accept-Ranges": "bytes",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error serving video:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
