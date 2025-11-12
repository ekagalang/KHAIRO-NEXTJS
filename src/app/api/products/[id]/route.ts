import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/app/api/auth/[...nextauth]/route";

function toNumber(
  value: unknown,
  { fallback = 0, allowNull = false }: { fallback?: number; allowNull?: boolean } = {}
) {
  if (value === null || value === undefined || value === "") return allowNull ? (null as any) : fallback;
  if (typeof value === "number") return Number.isFinite(value) ? value : fallback;
  if (typeof value === "string") {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }
  if (typeof value === "object") {
    try {
      const s = (value as any)?.toString?.();
      if (typeof s === "string") {
        const n = Number(s);
        return Number.isFinite(n) ? n : fallback;
      }
    } catch {}
  }
  return fallback;
}

function serializeProduct(p: any) {
  return {
    ...p,
    price: toNumber(p.price, { fallback: 0 }),
    discountPrice: p.discountPrice === null || p.discountPrice === undefined
      ? null
      : toNumber(p.discountPrice, { fallback: 0 }),
    quota: toNumber(p.quota, { fallback: 0 }),
    quotaFilled: toNumber(p.quotaFilled, { fallback: 0 }),
    images: typeof p.images === "string" ? p.images : "",
    features: Array.isArray(p.features) ? p.features : [],
    itinerary: Array.isArray(p.itinerary) ? p.itinerary : [],
  };
}

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;
    const product = await prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(serializeProduct(product));
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = context.params;
    const body = await request.json();

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        price: body.price,
        discountPrice: body.discountPrice ?? null,
        duration: body.duration,
        type: body.type,
        departure: body.departure ? new Date(body.departure) : undefined,
        quota: body.quota,
        quotaFilled: body.quotaFilled,
        features: body.features,
        itinerary: body.itinerary,
        images: body.images,
        isActive: body.isActive,
        isFeatured: body.isFeatured,
      },
    });

    return NextResponse.json(serializeProduct(updated));
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = context.params;
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
