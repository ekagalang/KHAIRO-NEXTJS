"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Product } from "@prisma/client";
import { ProductForm } from "@/components/admin/ProductForm";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function EditProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if ((params as any)?.id) {
      fetchProduct((params as any).id as string);
    }
  }, [(params as any)?.id]);

  const fetchProduct = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${id}`);

      if (!response.ok) {
        toast.error("Produk tidak ditemukan");
        return;
      }

      const data = await response.json();
      setProduct(data);
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Gagal memuat produk");
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

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Produk tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          Edit Produk
        </h1>
        <p className="text-gray-600">Ubah informasi paket tour</p>
      </div>

      <ProductForm product={product} isEdit />
    </div>
  );
}

