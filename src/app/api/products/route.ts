import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { handleApiError, logError, ApiError } from "@/lib/api-error-handler";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const featured = searchParams.get("featured");
    const admin = searchParams.get("admin");

    const where: any = {};

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
    logError("GET /api/products", error, { searchParams: request.url });
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session) {
      throw new ApiError(401, "Tidak terautentikasi", "UNAUTHORIZED");
    }

    const body = await request.json();

    // Validation
    if (!body.name || !body.slug || !body.price) {
      throw new ApiError(
        400,
        "Field name, slug, dan price wajib diisi",
        "MISSING_REQUIRED_FIELDS"
      );
    }

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

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    logError("POST /api/products", error);
    return handleApiError(error);
  }
}
