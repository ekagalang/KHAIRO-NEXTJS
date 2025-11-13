"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Blog } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { RichTextEditor } from "./RichTextEditor";
import Image from "next/image";

interface BlogFormProps {
  blog?: Blog;
  isEdit?: boolean;
}

export function BlogForm({ blog, isEdit = false }: BlogFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: blog?.title || "",
    slug: blog?.slug || "",
    content: blog?.content || "",
    excerpt: blog?.excerpt || "",
    coverImage: blog?.coverImage || "",
    author: blog?.author || "",
    category: blog?.category || "Tips",
    isPublished: blog?.isPublished ?? false,
  });

  // Auto-generate slug from title
  const handleTitleChange = (value: string) => {
    setFormData({
      ...formData,
      title: value,
      slug: value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Auto-generate excerpt if empty
      const excerpt =
        formData.excerpt ||
        formData.content
          .replace(/<[^>]*>/g, "") // Remove HTML
          .substring(0, 160) + "...";

      const body = {
        ...formData,
        excerpt,
      };

      const url = isEdit ? `/api/blog/${blog?.id}` : "/api/blog";
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      if (response.ok) {
        toast.success(
          isEdit ? "Artikel berhasil diupdate" : "Artikel berhasil dibuat"
        );
        router.push("/admin/dashboard/blog");
        router.refresh();
      } else {
        toast.error("Gagal menyimpan artikel");
      }
    } catch (error) {
      console.error("Error saving blog:", error);
      toast.error("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Artikel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Judul Artikel * (SEO: 60 karakter)</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Contoh: 10 Tips Persiapan Umroh Pertama Kali"
              required
              maxLength={100}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.title.length}/100 karakter - Optimal: 50-60 karakter
              untuk SEO
            </p>
          </div>

          <div>
            <Label htmlFor="slug">URL Slug * (SEO Friendly)</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              placeholder="10-tips-persiapan-umroh-pertama-kali"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              URL: /blog/{formData.slug}
            </p>
          </div>

          <div>
            <Label htmlFor="excerpt">
              Meta Description (SEO: 160 karakter)
            </Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) =>
                setFormData({ ...formData, excerpt: e.target.value })
              }
              placeholder="Ringkasan singkat artikel untuk preview dan SEO..."
              rows={3}
              maxLength={160}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.excerpt.length}/160 karakter - Optimal: 150-160 karakter
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Kategori *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tips">Tips</SelectItem>
                  <SelectItem value="Panduan">Panduan</SelectItem>
                  <SelectItem value="Berita">Berita</SelectItem>
                  <SelectItem value="Kisah">Kisah Inspiratif</SelectItem>
                  <SelectItem value="Edukasi">Edukasi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="author">Penulis *</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
                placeholder="Nama penulis"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="coverImage">Cover Image URL *</Label>
            <Input
              id="coverImage"
              type="url"
              value={formData.coverImage}
              onChange={(e) =>
                setFormData({ ...formData, coverImage: e.target.value })
              }
              placeholder="https://example.com/cover-image.jpg"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Rekomendasi: 1200x630px untuk optimal social media sharing
            </p>
          </div>

          {/* Image Preview */}
          {formData.coverImage && (
            <div>
              <Label>Preview Cover</Label>
              <div className="relative w-full h-64 mt-2 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={formData.coverImage}
                  alt="Preview"
                  fill
                  className="object-cover"
                  onError={() => toast.error("URL gambar tidak valid")}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Content Editor */}
      <Card>
        <CardHeader>
          <CardTitle>Konten Artikel *</CardTitle>
        </CardHeader>
        <CardContent>
          <RichTextEditor
            content={formData.content}
            onChange={(content) => setFormData({ ...formData, content })}
            placeholder="Tulis konten artikel di sini..."
          />
          <p className="text-xs text-gray-500 mt-2">
            💡 Tips SEO: Gunakan heading (H2, H3), tambahkan internal link, dan
            gunakan keyword secara natural
          </p>
        </CardContent>
      </Card>

      {/* SEO Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">📊 SEO Checklist</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-900">
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span
                className={
                  formData.title.length >= 50 && formData.title.length <= 60
                    ? "✅"
                    : "⚠️"
                }
              >
                {formData.title.length >= 50 && formData.title.length <= 60
                  ? "✅"
                  : "⚠️"}
              </span>
              <span>
                Judul 50-60 karakter (saat ini: {formData.title.length})
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span
                className={
                  formData.excerpt.length >= 150 &&
                  formData.excerpt.length <= 160
                    ? "✅"
                    : "⚠️"
                }
              >
                {formData.excerpt.length >= 150 &&
                formData.excerpt.length <= 160
                  ? "✅"
                  : "⚠️"}
              </span>
              <span>
                Meta description 150-160 karakter (saat ini:{" "}
                {formData.excerpt.length})
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span
                className={
                  formData.slug.length > 0 && !formData.slug.includes(" ")
                    ? "✅"
                    : "⚠️"
                }
              >
                {formData.slug.length > 0 && !formData.slug.includes(" ")
                  ? "✅"
                  : "⚠️"}
              </span>
              <span>URL slug SEO-friendly (pakai dash, lowercase)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className={formData.coverImage.length > 0 ? "✅" : "⚠️"}>
                {formData.coverImage.length > 0 ? "✅" : "⚠️"}
              </span>
              <span>Cover image tersedia (1200x630px)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className={formData.content.length > 300 ? "✅" : "⚠️"}>
                {formData.content.length > 300 ? "✅" : "⚠️"}
              </span>
              <span>Konten minimal 300 karakter</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Publish Option */}
      <Card>
        <CardContent className="pt-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isPublished}
              onChange={(e) =>
                setFormData({ ...formData, isPublished: e.target.checked })
              }
              className="w-4 h-4"
            />
            <span className="text-sm font-medium">
              Publish artikel (tampilkan di blog publik)
            </span>
          </label>
          {!formData.isPublished && (
            <p className="text-xs text-gray-500 mt-2">
              Artikel akan disimpan sebagai draft
            </p>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          type="submit"
          className="bg-primary hover:bg-primary/90 text-gray-800 font-semibold"
          disabled={loading}
        >
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {isEdit
            ? "Update Artikel"
            : formData.isPublished
            ? "Publish Artikel"
            : "Simpan Draft"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Batal
        </Button>
      </div>
    </form>
  );
}
