import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/app/api/auth/[...nextauth]/route";

// GET - Ambil single hero stat
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const stat = await prisma.heroStat.findUnique({
      where: { id },
    });

    if (!stat) {
      return NextResponse.json(
        { success: false, message: "Hero stat tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: stat,
    });
  } catch (error) {
    console.error("Error fetching hero stat:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data stat" },
      { status: 500 }
    );
  }
}

// PUT - Update hero stat
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { label, value, suffix, icon, order, isActive } = body;

    const stat = await prisma.heroStat.update({
      where: { id },
      data: {
        label,
        value,
        suffix,
        icon,
        order,
        isActive,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Hero stat berhasil diupdate",
      data: stat,
    });
  } catch (error) {
    console.error("Error updating hero stat:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengupdate hero stat" },
      { status: 500 }
    );
  }
}

// DELETE - Hapus hero stat
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    await prisma.heroStat.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Hero stat berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting hero stat:", error);
    return NextResponse.json(
      { success: false, message: "Gagal menghapus hero stat" },
      { status: 500 }
    );
  }
}
