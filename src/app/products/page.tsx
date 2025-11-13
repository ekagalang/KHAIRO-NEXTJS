"use client";

import { useEffect, useState, Suspense } from "react";
import { Product, ProductType } from "@prisma/client";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductCardSkeletonGrid } from "@/components/product/ProductCardSkeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search, Package } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { trackSearch } from "@/lib/analytics";

function ProductsContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<ProductType | "ALL">("ALL");

  const searchParams = useSearchParams();
  const typeFromUrl = searchParams.get("type") as ProductType | null;

  // Debounce search query
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    if (typeFromUrl) {
      setSelectedType(typeFromUrl);
    }
    fetchProducts();
  }, [typeFromUrl]);

  useEffect(() => {
    filterProducts();
    // Track search if there's a query
    if (debouncedSearchQuery) {
      trackSearch(debouncedSearchQuery);
    }
  }, [products, debouncedSearchQuery, selectedType]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    // Filter by type
    if (selectedType !== "ALL") {
      filtered = filtered.filter((p) => p.type === selectedType);
    }

    // Filter by search (use debounced value)
    if (debouncedSearchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary py-8 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
              Paket Tour Kami
            </h1>
            <p className="text-gray-700">
              Pilih paket Haji atau Umroh terbaik untuk Anda
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filter Section */}
          <div className="mb-6 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Cari paket tour..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Type Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              <Button
                variant={selectedType === "ALL" ? "default" : "outline"}
                onClick={() => setSelectedType("ALL")}
                className={
                  selectedType === "ALL" ? "bg-primary text-gray-800" : ""
                }
              >
                Semua
              </Button>
              <Button
                variant={selectedType === "UMROH" ? "default" : "outline"}
                onClick={() => setSelectedType("UMROH")}
                className={
                  selectedType === "UMROH" ? "bg-secondary text-white" : ""
                }
              >
                Umroh
              </Button>
              <Button
                variant={selectedType === "HAJI" ? "default" : "outline"}
                onClick={() => setSelectedType("HAJI")}
                className={
                  selectedType === "HAJI" ? "bg-secondary text-white" : ""
                }
              >
                Haji
              </Button>
            </div>
          </div>

          {/* Results Count */}
          <p className="text-sm text-gray-600 mb-4">
            Menampilkan {filteredProducts.length} dari {products.length} paket
          </p>

          {/* Products Grid */}
          {loading ? (
            <ProductCardSkeletonGrid count={6} />
          ) : filteredProducts.length === 0 ? (
            <EmptyState
              icon={Package}
              title={
                searchQuery || selectedType !== "ALL"
                  ? "Tidak ada paket ditemukan"
                  : "Belum ada paket tour"
              }
              description={
                searchQuery || selectedType !== "ALL"
                  ? "Coba ubah filter atau kata kunci pencarian Anda"
                  : "Paket tour akan segera tersedia"
              }
              action={
                searchQuery || selectedType !== "ALL"
                  ? {
                      label: "Reset Filter",
                      onClick: () => {
                        setSearchQuery("");
                        setSelectedType("ALL");
                      },
                    }
                  : undefined
              }
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </>
    }>
      <ProductsContent />
    </Suspense>
  );
}
