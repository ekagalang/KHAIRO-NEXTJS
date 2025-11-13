import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/app/api/auth/[...nextauth]/route";

// GET - Ambil semua hero stats
export async function GET() {
  try {
    const stats = await prisma.heroStat.findMany({
      orderBy: { order: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching hero stats:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data stats" },
      { status: 500 }
    );
  }
}

// POST - Buat hero stat baru
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { label, value, suffix, icon, order, isActive } = body;

    if (!label || !value) {
      return NextResponse.json(
        { success: false, message: "Label dan value harus diisi" },
        { status: 400 }
      );
    }

    const stat = await prisma.heroStat.create({
      data: {
        label,
        value,
        suffix: suffix || null,
        icon: icon || null,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Hero stat berhasil dibuat",
      data: stat,
    });
  } catch (error) {
    console.error("Error creating hero stat:", error);
    return NextResponse.json(
      { success: false, message: "Gagal membuat hero stat" },
      { status: 500 }
    );
  }
}
