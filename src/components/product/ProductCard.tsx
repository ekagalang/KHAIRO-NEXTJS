"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatCurrency, formatDate, calculateDiscount } from "@/lib/utils";
import { Calendar, Users, ShoppingCart, MapPin } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const images = product.images?.split(",") ?? [];
  const mainImage = images[0] || "/placeholder-tour.jpg";

  const hasDiscount =
    product.discountPrice &&
    Number(product.discountPrice) < Number(product.price);
  const discount = hasDiscount
    ? calculateDiscount(Number(product.price), Number(product.discountPrice))
    : 0;

  const handleAddToCart = () => {
    addItem(product.id, 1);
    toast.success("Produk ditambahkan ke keranjang!", {
      description: product.name,
    });
  };

  const quotaPercentage = (product.quotaFilled / product.quota) * 100;
  const isAlmostFull = quotaPercentage >= 80;
  const isFull = product.quotaFilled >= product.quota;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      <Link href={`/products/${product.id}`} className="relative">
        <div className="relative w-full h-48 sm:h-56 bg-gray-200">
          <Image
            src={mainImage}
            alt={product.name || "Gambar produk"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            <Badge
              variant="secondary"
              className="bg-secondary text-white font-semibold shadow-md"
            >
              {product.type}
            </Badge>
            {hasDiscount && (
              <Badge
                variant="destructive"
                className="bg-red-500 text-white font-semibold shadow-md"
              >
                -{discount}%
              </Badge>
            )}
            {product.isFeatured && (
              <Badge className="bg-primary text-gray-800 font-semibold shadow-md">
                ⭐ Populer
              </Badge>
            )}
          </div>

          {/* Quota Badge */}
          {isAlmostFull && (
            <div className="absolute top-2 right-2">
              <Badge
                variant={isFull ? "destructive" : "default"}
                className={`${
                  isFull ? "bg-red-500" : "bg-orange-500"
                } text-white font-semibold shadow-md`}
              >
                {isFull ? "PENUH" : "HAMPIR PENUH"}
              </Badge>
            </div>
          )}
        </div>
      </Link>

      <CardContent className="flex-grow p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-bold text-lg mb-2 line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Info Grid - Mobile Optimized */}
        <div className="grid grid-cols-2 gap-2 mb-3 text-xs sm:text-sm">
          <div className="flex items-center gap-1 text-gray-600">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{product.duration}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <Users className="w-4 h-4 flex-shrink-0" />
            <span>
              {product.quotaFilled}/{product.quota}
            </span>
          </div>
          <div className="col-span-2 flex items-center gap-1 text-gray-600">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">
              Keberangkatan: {formatDate(product.departure)}
            </span>
          </div>
        </div>

        {/* Price Section */}
        <div className="mt-auto">
          {hasDiscount ? (
            <div className="space-y-1">
              <p className="text-xs text-gray-500 line-through">
                {formatCurrency(Number(product.price))}
              </p>
              <p className="text-xl sm:text-2xl font-bold text-primary">
                {formatCurrency(Number(product.discountPrice))}
              </p>
            </div>
          ) : (
            <p className="text-xl sm:text-2xl font-bold text-primary">
              {formatCurrency(Number(product.price))}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">per orang</p>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 gap-2">
        <Button variant="outline" className="flex-1" asChild>
          <Link href={`/products/${product.id}`}>Detail</Link>
        </Button>
        <Button
          className="flex-1 bg-primary hover:bg-primary/90 text-gray-800 font-semibold"
          onClick={handleAddToCart}
          disabled={isFull}
        >
          <ShoppingCart className="w-4 h-4 mr-1" />
          {isFull ? "Penuh" : "Pesan"}
        </Button>
      </CardFooter>
    </Card>
  );
}
