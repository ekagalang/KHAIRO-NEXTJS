"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Edit, Loader2, Package } from "lucide-react";
import { toast } from "sonner";
import { IconPicker } from "@/components/admin/IconPicker";

interface ProductType {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  isActive: boolean;
  order: number;
  _count?: {
    products: number;
  };
}

export function ProductTypesSection() {
  const [types, setTypes] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingType, setEditingType] = useState<ProductType | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "Package",
    color: "#3b82f6",
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/product-types");
      const data = await response.json();
      if (data.success) {
        setTypes(data.data);
      }
    } catch (error) {
      console.error("Error fetching product types:", error);
      toast.error("Gagal memuat tipe produk");
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_|_$/g, "");
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: editingType ? formData.slug : generateSlug(name),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = "/api/admin/product-types";
      const method = editingType ? "PUT" : "POST";
      const body = editingType ? { id: editingType.id, ...formData } : formData;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(
          editingType
            ? "Tipe produk berhasil diupdate!"
            : "Tipe produk berhasil ditambahkan!"
        );
        setShowForm(false);
        setEditingType(null);
        setFormData({
          name: "",
          slug: "",
          description: "",
          icon: "Package",
          color: "#3b82f6",
          order: 0,
          isActive: true,
        });
        fetchTypes();
      } else {
        toast.error("Error: " + data.error);
      }
    } catch (error) {
      console.error("Error saving product type:", error);
      toast.error("Gagal menyimpan tipe produk");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, productsCount: number) => {
    if (productsCount > 0) {
      toast.error(
        `Tidak dapat menghapus tipe ini. Masih ada ${productsCount} produk yang menggunakan tipe ini.`
      );
      return;
    }

    if (!confirm("Yakin ingin menghapus tipe produk ini?")) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/product-types?id=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Tipe produk berhasil dihapus!");
        fetchTypes();
      } else {
        toast.error("Error: " + data.error);
      }
    } catch (error) {
      console.error("Error deleting product type:", error);
      toast.error("Gagal menghapus tipe produk");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (type: ProductType) => {
    setEditingType(type);
    setFormData({
      name: type.name,
      slug: type.slug,
      description: type.description || "",
      icon: type.icon || "Package",
      color: type.color || "#3b82f6",
      order: type.order,
      isActive: type.isActive,
    });
    setShowForm(true);
  };

  const cancelEdit = () => {
    setShowForm(false);
    setEditingType(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      icon: "Package",
      color: "#3b82f6",
      order: 0,
      isActive: true,
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Tipe Produk</CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            Kelola kategori produk (Haji, Umroh, dll)
          </p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          size="sm"
          variant={showForm ? "outline" : "default"}
        >
          {showForm ? (
            "Tutup"
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Tipe
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Form */}
        {showForm && (
          <Card className="bg-gray-50">
            <CardContent className="pt-6 space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>
                      Nama Tipe <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="Wisata Religi"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>
                      Slug <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={formData.slug}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          slug: e.target.value.toUpperCase(),
                        })
                      }
                      placeholder="WISATA_RELIGI"
                      required
                    />
                    <p className="text-xs text-gray-500">
                      Digunakan di database (huruf kapital)
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Deskripsi</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Deskripsi tipe produk"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Icon</Label>
                    <IconPicker
                      value={formData.icon}
                      onChange={(icon) => setFormData({ ...formData, icon })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Warna Badge</Label>
                    <Input
                      type="color"
                      value={formData.color}
                      onChange={(e) =>
                        setFormData({ ...formData, color: e.target.value })
                      }
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Urutan</Label>
                    <Input
                      type="number"
                      value={formData.order}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          order: parseInt(e.target.value),
                        })
                      }
                      min="0"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="w-4 h-4"
                  />
                  <Label
                    htmlFor="isActive"
                    className="text-sm font-medium cursor-pointer"
                  >
                    Aktif
                  </Label>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : null}
                    {editingType ? "Update Tipe" : "Tambah Tipe"}
                  </Button>
                  {editingType && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={cancelEdit}
                    >
                      Batal
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Types List */}
        <div className="space-y-3">
          {loading && types.length === 0 ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : types.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Belum ada tipe produk
            </p>
          ) : (
            types.map((type) => (
              <div
                key={type.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: type.color || "#3b82f6" }}
                  >
                    <Package className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-800">
                        {type.name}
                      </h4>
                      <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                        {type.slug}
                      </span>
                      {!type.isActive && (
                        <span className="text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded">
                          Nonaktif
                        </span>
                      )}
                    </div>
                    {type.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {type.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {type._count?.products || 0} produk · Urutan: {type.order}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(type)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() =>
                      handleDelete(type.id, type._count?.products || 0)
                    }
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
