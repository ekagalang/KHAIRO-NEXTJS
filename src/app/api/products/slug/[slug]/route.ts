import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
    discountPrice:
      p.discountPrice === null || p.discountPrice === undefined
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
  context: { params: { slug: string } }
) {
  try {
    const { slug } = context.params;
    const product = await prisma.product.findUnique({
      where: { slug },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(serializeProduct(product));
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
