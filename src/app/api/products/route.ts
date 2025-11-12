import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const featured = searchParams.get("featured");
    const admin = searchParams.get("admin"); // untuk admin dashboard

    const where: any = {};

    // Jika bukan request dari admin, hanya tampilkan yang aktif
    if (!admin) {
      where.isActive = true;
    }

    if (type) {
      where.type = type;
    }

    if (featured === "true") {
      where.isFeatured = true;
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        price: body.price,
        discountPrice: body.discountPrice || null,
        duration: body.duration,
        type: body.type,
        departure: new Date(body.departure),
        quota: body.quota,
        quotaFilled: body.quotaFilled || 0,
        features: body.features,
        itinerary: body.itinerary,
        images: body.images,
        isActive: body.isActive ?? true,
        isFeatured: body.isFeatured ?? false,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
