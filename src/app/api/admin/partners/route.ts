import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/app/api/auth/[...nextauth]/route";

// GET /api/admin/partners - Fetch all partners (admin)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const partners = await prisma.partner.findMany({
      orderBy: {
        order: "asc",
      },
    });

    return NextResponse.json({ success: true, data: partners });
  } catch (error) {
    console.error("Error fetching partners:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch partners" },
      { status: 500 }
    );
  }
}

// POST /api/admin/partners - Create new partner
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, logoUrl, websiteUrl, order, isActive } = body;

    if (!name || !logoUrl) {
      return NextResponse.json(
        { success: false, error: "Name and logo URL are required" },
        { status: 400 }
      );
    }

    const partner = await prisma.partner.create({
      data: {
        name,
        logoUrl,
        websiteUrl: websiteUrl || null,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json({ success: true, data: partner });
  } catch (error) {
    console.error("Error creating partner:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create partner" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/partners - Update partner
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, logoUrl, websiteUrl, order, isActive } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Partner ID is required" },
        { status: 400 }
      );
    }

    const partner = await prisma.partner.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(logoUrl && { logoUrl }),
        ...(websiteUrl !== undefined && { websiteUrl }),
        ...(order !== undefined && { order }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json({ success: true, data: partner });
  } catch (error) {
    console.error("Error updating partner:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update partner" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/partners - Delete partner
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Partner ID is required" },
        { status: 400 }
      );
    }

    await prisma.partner.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Partner deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting partner:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete partner" },
      { status: 500 }
    );
  }
}
