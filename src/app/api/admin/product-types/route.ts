import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/app/api/auth/[...nextauth]/route";

// GET /api/admin/product-types - Fetch all product types (admin)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const types = await prisma.productType.findMany({
      orderBy: {
        order: "asc",
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return NextResponse.json({ success: true, data: types });
  } catch (error) {
    console.error("Error fetching product types:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch product types" },
      { status: 500 }
    );
  }
}

// POST /api/admin/product-types - Create new product type
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, slug, description, icon, color, order, isActive } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: "Name and slug are required" },
        { status: 400 }
      );
    }

    const productType = await prisma.productType.create({
      data: {
        name,
        slug: slug.toUpperCase(), // Ensure slug is uppercase for consistency
        description: description || null,
        icon: icon || null,
        color: color || null,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Product type created successfully",
      data: productType,
    });
  } catch (error: any) {
    console.error("Error creating product type:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        {
          success: false,
          error: "Product type with this name or slug already exists",
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create product type" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/product-types - Update product type
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, slug, description, icon, color, order, isActive } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Product type ID is required" },
        { status: 400 }
      );
    }

    const productType = await prisma.productType.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug: slug.toUpperCase() }),
        description: description || null,
        icon: icon || null,
        color: color || null,
        ...(order !== undefined && { order }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Product type updated successfully",
      data: productType,
    });
  } catch (error: any) {
    console.error("Error updating product type:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        {
          success: false,
          error: "Product type with this name or slug already exists",
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update product type" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/product-types - Delete product type
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
        { success: false, error: "Product type ID is required" },
        { status: 400 }
      );
    }

    // Check if any products use this type
    const productsCount = await prisma.product.count({
      where: {
        type:
          (await prisma.productType.findUnique({ where: { id } }))?.slug || "",
      },
    });

    if (productsCount > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot delete product type. ${productsCount} product(s) are using this type.`,
        },
        { status: 400 }
      );
    }

    await prisma.productType.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Product type deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product type:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete product type" },
      { status: 500 }
    );
  }
}
