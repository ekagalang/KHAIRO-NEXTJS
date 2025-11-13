import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const blog = await prisma.blog.findUnique({
      where: { id },
    });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch blog" },
      { status: 500 }
    );
  }
}

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

    const data: any = {};

    if ("title" in body) {
      data.title = body.title;
    }
    if ("slug" in body || "title" in body) {
      const newSlug = body.slug || (typeof body.title === "string"
        ? body.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "")
        : undefined);
      if (newSlug !== undefined) data.slug = newSlug;
    }
    if ("content" in body) {
      data.content = body.content;
    }
    if ("excerpt" in body || "content" in body) {
      const newExcerpt = body.excerpt || (typeof body.content === "string"
        ? body.content.replace(/<[^>]*>/g, "").substring(0, 160) + "..."
        : undefined);
      if (newExcerpt !== undefined) data.excerpt = newExcerpt;
    }
    if ("coverImage" in body) data.coverImage = body.coverImage;
    if ("author" in body) data.author = body.author;
    if ("category" in body) data.category = body.category;
    if (typeof body.isPublished === "boolean") {
      data.isPublished = body.isPublished;
      data.publishedAt = body.isPublished ? new Date() : null;
    }

    const blog = await prisma.blog.update({
      where: { id },
      data,
    });

    return NextResponse.json(blog);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update blog" },
      { status: 500 }
    );
  }
}

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
    await prisma.blog.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete blog" },
      { status: 500 }
    );
  }
}
