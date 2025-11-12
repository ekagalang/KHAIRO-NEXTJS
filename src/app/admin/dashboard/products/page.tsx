"use client";

import { useEffect, useState } from "react";
import { Product } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  Package,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Tambahkan ?admin=true untuk ambil semua produk
      const response = await fetch("/api/products?admin=true");
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Gagal memuat produk");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      return;
    }

    try {
      setDeleteLoading(id);
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Produk berhasil dihapus");
        fetchProducts();
      } else {
        toast.error("Gagal menghapus produk");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Terjadi kesalahan");
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleToggleActive = async (product: Product) => {
    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...product,
          isActive: !product.isActive,
        }),
      });

      if (response.ok) {
        toast.success(
          product.isActive ? "Produk dinonaktifkan" : "Produk diaktifkan"
        );
        fetchProducts();
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
            Kelola Produk
          </h1>
          <p className="text-gray-600">Manajemen paket tour haji dan umroh</p>
        </div>
        <Button
          className="bg-primary hover:bg-primary/90 text-gray-800 font-semibold"
          asChild
        >
          <Link href="/admin/dashboard/products/new">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Produk
          </Link>
        </Button>
      </div>

      {/* Search & Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Cari produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Products List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="py-20 text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 mb-4">
              {searchQuery ? "Tidak ada produk ditemukan" : "Belum ada produk"}
            </p>
            <Button asChild>
              <Link href="/admin/dashboard/products/new">
                Tambah Produk Pertama
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Image */}
                  <div className="relative w-full sm:w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={
                        product.images.split(",")[0] || "/placeholder-tour.jpg"
                      }
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg mb-1 line-clamp-1">
                          {product.name}
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge
                            variant={
                              product.type === "HAJI" ? "default" : "secondary"
                            }
                          >
                            {product.type}
                          </Badge>
                          <Badge
                            variant={product.isActive ? "default" : "secondary"}
                          >
                            {product.isActive ? "Aktif" : "Nonaktif"}
                          </Badge>
                          {product.isFeatured && (
                            <Badge className="bg-yellow-500">Featured</Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">
                          {formatCurrency(
                            Number(product.discountPrice || product.price)
                          )}
                        </p>
                        {product.discountPrice && (
                          <p className="text-sm text-gray-500 line-through">
                            {formatCurrency(Number(product.price))}
                          </p>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-4">
                      <span>📅 {product.duration}</span>
                      <span>🛫 {formatDate(product.departure)}</span>
                      <span>
                        👥 {product.quotaFilled}/{product.quota}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(product)}
                      >
                        {product.isActive ? (
                          <>
                            <EyeOff className="w-4 h-4 mr-1" />
                            Nonaktifkan
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 mr-1" />
                            Aktifkan
                          </>
                        )}
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link
                          href={`/admin/dashboard/products/${product.id}/edit`}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(product.id)}
                        disabled={deleteLoading === product.id}
                      >
                        {deleteLoading === product.id ? (
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
