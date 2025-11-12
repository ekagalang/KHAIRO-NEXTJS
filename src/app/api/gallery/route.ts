import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const galleries = await prisma.gallery.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(galleries);
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}
