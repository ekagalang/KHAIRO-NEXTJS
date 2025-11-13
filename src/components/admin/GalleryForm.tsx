"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Gallery } from "@prisma/client";
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
import Image from "next/image";
import { MediaPicker } from "@/components/admin/MediaPicker";

interface GalleryFormProps {
  gallery?: Gallery;
  isEdit?: boolean;
}

export function GalleryForm({ gallery, isEdit = false }: GalleryFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: gallery?.title || "",
    description: gallery?.description || "",
    imageUrl: gallery?.imageUrl || "",
    category: gallery?.category || "Haji",
    isActive: gallery?.isActive ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEdit ? `/api/gallery/${gallery?.id}` : "/api/gallery";
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(
          isEdit ? "Foto berhasil diupdate" : "Foto berhasil diupload"
        );
        router.push("/admin/dashboard/gallery");
        router.refresh();
      } else {
        toast.error("Gagal menyimpan foto");
      }
    } catch (error) {
      console.error("Error saving gallery:", error);
      toast.error("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informasi Foto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Judul/Caption *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Contoh: Keberangkatan Umroh Januari 2024"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Deskripsi (Opsional)</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Tambahkan deskripsi detail foto..."
              rows={3}
            />
          </div>

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
                <SelectItem value="Haji">Haji</SelectItem>
                <SelectItem value="Umroh">Umroh</SelectItem>
                <SelectItem value="Kegiatan">Kegiatan</SelectItem>
                <SelectItem value="Dokumentasi">Dokumentasi</SelectItem>
                <SelectItem value="Lainnya">Lainnya</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <MediaPicker
              label="Gambar *"
              value={formData.imageUrl}
              onChange={(url) => setFormData({ ...formData, imageUrl: url })}
            />
            <p className="text-xs text-gray-500 mt-1">
              Pilih gambar dari file manager atau upload gambar baru
            </p>
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="w-4 h-4"
              />
              <span className="text-sm">Tampilkan di galeri publik</span>
            </label>
          </div>
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
          {isEdit ? "Update Foto" : "Upload Foto"}
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
