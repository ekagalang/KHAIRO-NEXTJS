import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const admin = searchParams.get("admin");
    const category = searchParams.get("category");

    const where: any = {};

    if (!admin) {
      where.isPublished = true;
    }

    if (category) {
      where.category = category;
    }

    const blogs = await prisma.blog.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Generate slug dari title jika tidak ada
    const slug =
      body.slug ||
      body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    // Generate excerpt dari content jika tidak ada
    const excerpt =
      body.excerpt ||
      body.content
        .replace(/<[^>]*>/g, "") // Remove HTML tags
        .substring(0, 160) + "...";

    const blog = await prisma.blog.create({
      data: {
        title: body.title,
        slug: slug,
        content: body.content,
        excerpt: excerpt,
        coverImage: body.coverImage,
        author: body.author,
        category: body.category,
        isPublished: body.isPublished ?? false,
        publishedAt: body.isPublished ? new Date() : null,
      },
    });

    return NextResponse.json(blog);
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json(
      { error: "Failed to create blog" },
      { status: 500 }
    );
  }
}
