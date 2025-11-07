"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Product } from "@prisma/client";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatDate, calculateDiscount } from "@/lib/utils";
import {
  Calendar,
  Users,
  Clock,
  MapPin,
  CheckCircle,
  ShoppingCart,
  Loader2,
  ChevronLeft,
  Star,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";

export default function ProductDetailPage() {
  const params = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string);
    }
  }, [params.id]);

  const fetchProduct = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${id}`);
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Gagal memuat detail produk");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addItem(product.id, quantity);
      toast.success(`${quantity} paket ditambahkan ke keranjang!`);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen">
          <p className="text-gray-500 mb-4">Produk tidak ditemukan</p>
          <Link href="/products">
            <Button>Kembali ke Katalog</Button>
          </Link>
        </div>
      </>
    );
  }

  const images = (product.images?.split(",") ?? []).filter((img) => !!img);
  const features = (product.features as string[]) || [];
  const itinerary =
    (product.itinerary as Array<{
      day: number;
      title: string;
      description: string;
    }>) || [];

  // Normalize numeric fields to avoid NaN in UI
  const priceNum = Number(product.price);
  const discountNum = product.discountPrice ? Number(product.discountPrice) : NaN;
  const hasDiscount = Number.isFinite(discountNum) && discountNum < priceNum;
  const discount = hasDiscount ? calculateDiscount(priceNum, discountNum) : 0;

  const quota = Number(product.quota ?? 0);
  const quotaFilled = Number(product.quotaFilled ?? 0);
  const quotaPercentage = quota > 0 ? (quotaFilled / quota) * 100 : 0;
  const isFull = quotaFilled >= quota && quota > 0;
  const availableSeats = Math.max(0, quota - quotaFilled);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 pb-20 sm:pb-8">
        {/* Back Button */}
        <div className="bg-white border-b sticky top-16 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <Link href="/products">
              <Button variant="ghost" size="sm">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Kembali
              </Button>
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Images & Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Main Image */}
              <Card className="overflow-hidden">
                <div className="relative w-full h-64 sm:h-96 bg-gray-200">
                  <Image
                    src={images[selectedImage] || "/placeholder-tour.jpg"}
                    alt={product?.name || "Gambar produk"}
                    fill
                    className="object-cover"
                    priority
                  />

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <Badge className="bg-secondary text-white font-semibold">
                      {product.type}
                    </Badge>
                    {hasDiscount && (
                      <Badge variant="destructive" className="font-semibold">
                        Diskon {discount}%
                      </Badge>
                    )}
                    {product.isFeatured && (
                      <Badge className="bg-primary text-gray-800 font-semibold">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Populer
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Thumbnail Images */}
                {images.length > 1 && (
                  <div className="p-4 flex gap-2 overflow-x-auto">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${
                          selectedImage === idx
                            ? "border-primary"
                            : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={img}
                          alt={`${product?.name || "Gambar produk"} ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </Card>

              {/* Product Info */}
              <Card>
                <CardContent className="p-6">
                  <h1 className="text-2xl sm:text-3xl font-bold mb-4">
                    {product.name}
                  </h1>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-gray-500">Durasi</p>
                        <p className="font-semibold text-sm">
                          {product.duration}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-gray-500">Keberangkatan</p>
                        <p className="font-semibold text-sm">
                          {formatDate(product.departure)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-gray-500">Kuota</p>
                        <p className="font-semibold text-sm">
                          {availableSeats} tersisa
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-gray-500">Status</p>
                        <p
                          className={`font-semibold text-sm ${
                            isFull ? "text-red-500" : "text-green-500"
                          }`}
                        >
                          {isFull ? "Penuh" : "Tersedia"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Quota Progress */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Kuota Terisi</span>
                      <span className="font-semibold">
                        {Number.isFinite(quotaFilled) ? quotaFilled : 0}/{Number.isFinite(quota) ? quota : 0} orang
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          quotaPercentage >= 100
                            ? "bg-red-500"
                            : quotaPercentage >= 80
                            ? "bg-orange-500"
                            : "bg-primary"
                        }`}
                        style={{ width: `${Math.min(quotaPercentage, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="prose max-w-none">
                    <h3 className="text-lg font-semibold mb-2">Deskripsi</h3>
                    <p className="text-gray-600 whitespace-pre-line">
                      {product.description}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Features */}
              {features.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Fasilitas yang Didapatkan
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Itinerary */}
              {itinerary.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Itinerary</h3>
                    <div className="space-y-4">
                      {itinerary.map((item, idx) => (
                        <div key={idx} className="flex gap-4">
                          <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="font-bold text-primary">
                            {Number.isFinite(Number(item.day)) ? Number(item.day) : idx + 1}
                          </span>
                        </div>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1">{item.title}</h4>
                            <p className="text-sm text-gray-600">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Booking Card (Sticky on Desktop) */}
            <div className="lg:col-span-1">
              <Card className="lg:sticky lg:top-24">
                <CardContent className="p-6">
                  <div className="mb-6">
                    {hasDiscount ? (
                      <>
                        <p className="text-sm text-gray-500 line-through mb-1">
                          {formatCurrency(Number.isFinite(priceNum) ? priceNum : 0)}
                        </p>
                        <p className="text-3xl font-bold text-primary">
                          {formatCurrency(Number.isFinite(discountNum) ? discountNum : 0)}
                        </p>
                      </>
                    ) : (
                      <p className="text-3xl font-bold text-primary">
                        {formatCurrency(Number.isFinite(priceNum) ? priceNum : 0)}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">per orang</p>
                  </div>

                  {/* Quantity Selector */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold mb-2">
                      Jumlah Jamaah
                    </label>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        -
                      </Button>
                      <span className="text-xl font-semibold w-12 text-center">
                        {quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          setQuantity(Math.min(availableSeats, quantity + 1))
                        }
                        disabled={quantity >= availableSeats || isFull}
                      >
                        +
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Maksimal {availableSeats} orang
                    </p>
                  </div>

                  {/* Total */}
                  <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total Harga:</span>
                      <span className="text-2xl font-bold text-primary">
                        {formatCurrency(
                          (Number.isFinite(discountNum) ? discountNum : (Number.isFinite(priceNum) ? priceNum : 0)) *
                            quantity
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button
                      className="w-full bg-primary hover:bg-primary/90 text-gray-800 font-semibold"
                      size="lg"
                      onClick={handleAddToCart}
                      disabled={isFull}
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      {isFull ? "Kuota Penuh" : "Tambah ke Keranjang"}
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full"
                      size="lg"
                      asChild
                    >
                      <a
                        href={`https://wa.me/6281234567890?text=Halo, saya tertarik dengan paket ${product.name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        💬 Hubungi Kami
                      </a>
                    </Button>
                  </div>

                  {/* Info */}
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Info:</strong> Harga dapat berubah sewaktu-waktu.
                      Hubungi kami untuk informasi lebih lanjut.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 lg:hidden z-40">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500">Total Harga</p>
            <p className="text-xl font-bold text-primary">
              {formatCurrency(
                Number(product.discountPrice || product.price) * quantity
              )}
            </p>
          </div>
          <Button
            className="bg-primary hover:bg-primary/90 text-gray-800 font-semibold"
            onClick={handleAddToCart}
            disabled={isFull}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {isFull ? "Penuh" : "Pesan"}
          </Button>
        </div>
      </div>
    </>
  );
}
