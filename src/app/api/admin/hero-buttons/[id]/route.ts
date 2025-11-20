import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/app/api/auth/[...nextauth]/route";

// PUT - Update hero button
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
    const { text, link, variant, bgColor, textColor, icon, order, isActive } = body;

    const button = await prisma.heroButton.update({
      where: { id },
      data: {
        text,
        link,
        variant,
        bgColor,
        textColor,
        icon,
        order,
        isActive,
      },
    });

    return NextResponse.json(button);
  } catch (error) {
    console.error("Error updating hero button:", error);
    return NextResponse.json(
      { error: "Failed to update hero button" },
      { status: 500 }
    );
  }
}

// DELETE - Delete hero button
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
    await prisma.heroButton.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Hero button deleted successfully" });
  } catch (error) {
    console.error("Error deleting hero button:", error);
    return NextResponse.json(
      { error: "Failed to delete hero button" },
      { status: 500 }
    );
  }
}
