"use client";

import { useEffect, useState } from "react";
import { Blog } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  FileText,
  Calendar,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    const filtered = blogs.filter(
      (b) =>
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBlogs(filtered);
  }, [searchQuery, blogs]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/blog?admin=true");
      const data = await response.json();
      setBlogs(data);
      setFilteredBlogs(data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Gagal memuat blog");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus artikel ini?")) {
      return;
    }

    try {
      setDeleteLoading(id);
      const response = await fetch(`/api/blog/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        toast.success("Artikel berhasil dihapus");
        fetchBlogs();
      } else {
        toast.error("Gagal menghapus artikel");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error("Terjadi kesalahan");
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleTogglePublish = async (blog: Blog) => {
    try {
      const response = await fetch(`/api/blog/${blog.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isPublished: !blog.isPublished }),
      });

      if (response.ok) {
        toast.success(
          blog.isPublished ? "Artikel di-unpublish" : "Artikel dipublish"
        );
        fetchBlogs();
      } else {
        toast.error("Gagal mengubah status");
      }
    } catch (error) {
      console.error("Error toggling publish:", error);
      toast.error("Terjadi kesalahan");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            Kelola Blog
          </h1>
          <p className="text-gray-600">Manajemen artikel dan konten blog</p>
        </div>
        <Button
          className="bg-primary hover:bg-primary/90 text-gray-800 font-semibold"
          asChild
        >
          <Link href="/admin/dashboard/blog/new">
            <Plus className="w-4 h-4 mr-2" />
            Tulis Artikel
          </Link>
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Cari artikel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Blog List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredBlogs.length === 0 ? (
        <Card>
          <CardContent className="py-20 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 mb-4">
              {searchQuery
                ? "Tidak ada artikel ditemukan"
                : "Belum ada artikel"}
            </p>
            <Button asChild>
              <Link href="/admin/dashboard/blog/new">
                Tulis Artikel Pertama
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredBlogs.map((blog) => (
            <Card
              key={blog.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Cover Image */}
                  <div className="relative w-full sm:w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={blog.coverImage}
                      alt={blog.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg mb-1 line-clamp-2">
                          {blog.title}
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge variant="outline">{blog.category}</Badge>
                          <Badge
                            variant={blog.isPublished ? "default" : "secondary"}
                          >
                            {blog.isPublished ? "Published" : "Draft"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {blog.excerpt && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {blog.excerpt}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {blog.publishedAt
                          ? formatDate(blog.publishedAt)
                          : "Belum dipublish"}
                      </span>
                      <span>Penulis: {blog.author}</span>
                      <span>Slug: /{blog.slug}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTogglePublish(blog)}
                      >
                        {blog.isPublished ? (
                          <>
                            <EyeOff className="w-4 h-4 mr-1" />
                            Unpublish
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 mr-1" />
                            Publish
                          </>
                        )}
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/dashboard/blog/${blog.id}/edit`}>
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Link>
                      </Button>
                      {blog.isPublished && (
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/blog/${blog.slug}`} target="_blank">
                            <Eye className="w-4 h-4 mr-1" />
                            Lihat
                          </Link>
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(blog.id)}
                        disabled={deleteLoading === blog.id}
                      >
                        {deleteLoading === blog.id ? (
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4 mr-1" />
                        )}
                        Hapus
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
