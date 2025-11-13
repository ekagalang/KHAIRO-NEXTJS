"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Gallery } from "@prisma/client";
import { GalleryForm } from "@/components/admin/GalleryForm";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function EditGalleryPage() {
  const params = useParams();
  const [gallery, setGallery] = useState<Gallery | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchGallery(params.id as string);
    }
  }, [params.id]);

  const fetchGallery = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/gallery/${id}`);

      if (!response.ok) {
        toast.error("Foto tidak ditemukan");
        return;
      }

      const data = await response.json();
      setGallery(data);
    } catch (error) {
      console.error("Error fetching gallery:", error);
      toast.error("Gagal memuat foto");
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

  if (!gallery) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Foto tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          Edit Foto
        </h1>
        <p className="text-gray-600">Ubah informasi foto galeri</p>
      </div>

      <GalleryForm gallery={gallery} isEdit />
    </div>
  );
}
