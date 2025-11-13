"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Blog } from "@prisma/client";
import { Navbar } from "@/components/layout/Navbar";
import { BlogContent } from "@/components/blog/BlogContent";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function BlogDetailPage() {
  const params = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (params.slug) {
      fetchBlog(params.slug as string);
    }
  }, [params.slug]);

  const fetchBlog = async (slug: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/blog/slug/${slug}`);

      if (!response.ok) {
        setNotFound(true);
        return;
      }

      const data = await response.json();
      setBlog(data);
    } catch (error) {
      console.error("Error fetching blog:", error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </>
    );
  }

  if (notFound || !blog) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
            <p className="text-gray-600 mb-6">Artikel tidak ditemukan</p>
            <Button asChild>
              <Link href="/blog">Kembali ke Blog</Link>
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <BlogContent blog={blog} />
    </>
  );
}
