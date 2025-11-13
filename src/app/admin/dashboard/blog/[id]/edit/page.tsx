"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Blog } from "@prisma/client";
import { BlogForm } from "@/components/admin/BlogForm";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function EditBlogPage() {
  const params = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchBlog(params.id as string);
    }
  }, [params.id]);

  const fetchBlog = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/blog/${id}`);

      if (!response.ok) {
        toast.error("Artikel tidak ditemukan");
        return;
      }

      const data = await response.json();
      setBlog(data);
    } catch (error) {
      console.error("Error fetching blog:", error);
      toast.error("Gagal memuat artikel");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Artikel tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          Edit Artikel
        </h1>
        <p className="text-gray-600">Ubah konten dan informasi artikel</p>
      </div>

      <BlogForm blog={blog} isEdit />
    </div>
  );
}
