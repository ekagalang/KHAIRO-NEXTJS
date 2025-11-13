"use client";

import { useEffect, useState } from "react";
import { Gallery } from "@prisma/client";
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
  ImageIcon,
} from "lucide-react";
import { toast } from "sonner";

export default function GalleryPage() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [filteredGalleries, setFilteredGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchGalleries();
  }, []);

  useEffect(() => {
    const filtered = galleries.filter(
      (g) =>
        g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredGalleries(filtered);
  }, [searchQuery, galleries]);

  const fetchGalleries = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/gallery?admin=true");
      const data = await response.json();
      setGalleries(data);
      setFilteredGalleries(data);
    } catch (error) {
      console.error("Error fetching galleries:", error);
      toast.error("Gagal memuat galeri");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus foto ini?")) {
      return;
    }

    try {
      setDeleteLoading(id);
      const response = await fetch(`/api/gallery/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        toast.success("Foto berhasil dihapus");
        fetchGalleries();
      } else {
        toast.error("Gagal menghapus foto");
      }
    } catch (error) {
      console.error("Error deleting gallery:", error);
      toast.error("Terjadi kesalahan");
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleToggleActive = async (gallery: Gallery) => {
    try {
      const response = await fetch(`/api/gallery/${gallery.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isActive: !gallery.isActive }),
      });

      if (response.ok) {
        toast.success(
          gallery.isActive ? "Foto disembunyikan" : "Foto ditampilkan"
        );
        fetchGalleries();
      } else {
        toast.error("Gagal mengubah status");
      }
    } catch (error) {
      console.error("Error toggling active:", error);
      toast.error("Terjadi kesalahan");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            Kelola Galeri
          </h1>
          <p className="text-gray-600">Manajemen foto dokumentasi kegiatan</p>
        </div>
        <Button
          className="bg-primary hover:bg-primary/90 text-gray-800 font-semibold"
          asChild
        >
          <Link href="/admin/dashboard/gallery/new">
            <Plus className="w-4 h-4 mr-2" />
            Upload Foto
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
              placeholder="Cari foto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Gallery Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredGalleries.length === 0 ? (
        <Card>
          <CardContent className="py-20 text-center">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 mb-4">
              {searchQuery ? "Tidak ada foto ditemukan" : "Belum ada foto"}
            </p>
            <Button asChild>
              <Link href="/admin/dashboard/gallery/new">
                Upload Foto Pertama
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGalleries.map((gallery) => (
            <Card
              key={gallery.id}
              className="overflow-hidden hover:shadow-lg transition-shadow group"
            >
              <div className="relative h-48 bg-gray-100">
                <Image
                  src={gallery.imageUrl}
                  alt={gallery.title}
                  fill
                  className="object-cover"
                />
                {!gallery.isActive && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge variant="secondary">Disembunyikan</Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <Badge variant="outline" className="mb-2">
                  {gallery.category}
                </Badge>
                <h3 className="font-semibold mb-1 line-clamp-1">
                  {gallery.title}
                </h3>
                {gallery.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {gallery.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleActive(gallery)}
                  >
                    {gallery.isActive ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/dashboard/gallery/${gallery.id}/edit`}>
                      <Edit className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete(gallery.id)}
                    disabled={deleteLoading === gallery.id}
                  >
                    {deleteLoading === gallery.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
