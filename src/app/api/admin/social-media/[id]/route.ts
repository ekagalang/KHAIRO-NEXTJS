import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/app/api/auth/[...nextauth]/route";

// PUT - Update social media
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, icon, url, bgColor, hoverColor, order, isActive } = body;

    const socialMedia = await prisma.socialMedia.update({
      where: { id },
      data: {
        name,
        icon,
        url,
        bgColor,
        hoverColor,
        order,
        isActive,
      },
    });

    return NextResponse.json(socialMedia);
  } catch (error) {
    console.error("Error updating social media:", error);
    return NextResponse.json(
      { error: "Failed to update social media" },
      { status: 500 }
    );
  }
}

// DELETE - Delete social media
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.socialMedia.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Social media deleted successfully" });
  } catch (error) {
    console.error("Error deleting social media:", error);
    return NextResponse.json(
      { error: "Failed to delete social media" },
      { status: 500 }
    );
  }
}
