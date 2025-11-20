"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@prisma/client";
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
import { Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { MultipleMediaPicker } from "@/components/admin/MultipleMediaPicker";

interface ProductFormProps {
  product?: Product;
  isEdit?: boolean;
}

export function ProductForm({ product, isEdit = false }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [productTypes, setProductTypes] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    price: product?.price?.toString() || "",
    discountPrice: product?.discountPrice?.toString() || "",
    duration: product?.duration || "",
    type: product?.type || "",
    departure: product?.departure
      ? new Date(product.departure).toISOString().split("T")[0]
      : "",
    quota: product?.quota?.toString() || "",
    quotaFilled: product?.quotaFilled?.toString() || "0",
    images: product?.images || "",
    isActive: product?.isActive ?? true,
    isFeatured: product?.isFeatured ?? false,
  });

  const [features, setFeatures] = useState<string[]>(
    (product?.features as string[]) || [""]
  );

  const [itinerary, setItinerary] = useState<
    Array<{ day: number; title: string; description: string }>
  >((product?.itinerary as any[]) || [{ day: 1, title: "", description: "" }]);

  // Fetch product types
  useEffect(() => {
    const fetchProductTypes = async () => {
      try {
        const response = await fetch("/api/product-types");
        const data = await response.json();
        if (data.success) {
          setProductTypes(data.data);
          // Set default type if creating new product
          if (!product && data.data.length > 0) {
            setFormData((prev) => ({ ...prev, type: data.data[0].slug }));
          }
        }
      } catch (error) {
        console.error("Error fetching product types:", error);
        toast.error("Gagal memuat tipe produk");
      }
    };
    fetchProductTypes();
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Generate slug from name if empty
      const slug =
        formData.slug ||
        formData.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

      const body = {
        ...formData,
        slug,
        price: parseFloat(formData.price),
        discountPrice: formData.discountPrice
          ? parseFloat(formData.discountPrice)
          : null,
        quota: parseInt(formData.quota),
        quotaFilled: parseInt(formData.quotaFilled),
        features: features.filter((f) => f.trim() !== ""),
        itinerary: itinerary.filter((i) => i.title.trim() !== ""),
      };

      const url = isEdit ? `/api/products/${product?.id}` : "/api/products";
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      if (response.ok) {
        toast.success(
          isEdit ? "Produk berhasil diupdate" : "Produk berhasil ditambahkan"
        );
        router.push("/admin/dashboard/products");
        router.refresh();
      } else {
        toast.error("Gagal menyimpan produk");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const addFeature = () => setFeatures([...features, ""]);
  const removeFeature = (index: number) =>
    setFeatures(features.filter((_, i) => i !== index));
  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const addItinerary = () =>
    setItinerary([
      ...itinerary,
      { day: itinerary.length + 1, title: "", description: "" },
    ]);
  const removeItinerary = (index: number) =>
    setItinerary(itinerary.filter((_, i) => i !== index));
  const updateItinerary = (index: number, field: string, value: any) => {
    const newItinerary = [...itinerary];
    newItinerary[index] = { ...newItinerary[index], [field]: value };
    setItinerary(newItinerary);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Dasar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Paket *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                placeholder="auto-generate jika kosong"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipe *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tipe produk" />
                </SelectTrigger>
                <SelectContent>
                  {productTypes.map((type) => (
                    <SelectItem key={type.id} value={type.slug}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Durasi *</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
                placeholder="9 Hari 8 Malam"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Harga Normal (Rp) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discountPrice">Harga Diskon (Rp)</Label>
              <Input
                id="discountPrice"
                type="number"
                value={formData.discountPrice}
                onChange={(e) =>
                  setFormData({ ...formData, discountPrice: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="departure">Keberangkatan *</Label>
              <Input
                id="departure"
                type="date"
                value={formData.departure}
                onChange={(e) =>
                  setFormData({ ...formData, departure: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quota">Kuota *</Label>
              <Input
                id="quota"
                type="number"
                value={formData.quota}
                onChange={(e) =>
                  setFormData({ ...formData, quota: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quotaFilled">Kuota Terisi</Label>
              <Input
                id="quotaFilled"
                type="number"
                value={formData.quotaFilled}
                onChange={(e) =>
                  setFormData({ ...formData, quotaFilled: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <MultipleMediaPicker
              label="Gambar Produk *"
              value={formData.images}
              onChange={(urls) => setFormData({ ...formData, images: urls })}
              maxImages={5}
            />
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="w-4 h-4"
              />
              <span className="text-sm">Aktif</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) =>
                  setFormData({ ...formData, isFeatured: e.target.checked })
                }
                className="w-4 h-4"
              />
              <span className="text-sm">Featured</span>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>Fasilitas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={feature}
                onChange={(e) => updateFeature(index, e.target.value)}
                placeholder="Contoh: Tiket Pesawat PP"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeFeature(index)}
                disabled={features.length === 1}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addFeature}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Fasilitas
          </Button>
        </CardContent>
      </Card>

      {/* Itinerary */}
      <Card>
        <CardHeader>
          <CardTitle>Itinerary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {itinerary.map((item, index) => (
            <div key={index} className="border p-4 rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <Label>Hari {item.day}</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItinerary(index)}
                  disabled={itinerary.length === 1}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <Input
                value={item.title}
                onChange={(e) =>
                  updateItinerary(index, "title", e.target.value)
                }
                placeholder="Judul kegiatan"
              />
              <Textarea
                value={item.description}
                onChange={(e) =>
                  updateItinerary(index, "description", e.target.value)
                }
                placeholder="Deskripsi kegiatan"
                rows={2}
              />
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addItinerary}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Hari
          </Button>
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
          {isEdit ? "Update Produk" : "Simpan Produk"}
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
