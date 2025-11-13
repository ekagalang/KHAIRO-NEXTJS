import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { ProductDetailClient } from "./ProductDetailClient";
import { prisma } from "@/lib/prisma";
import { Breadcrumb, BreadcrumbJsonLd } from "@/components/ui/breadcrumb";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
    });
    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: "Produk Tidak Ditemukan | Khairo Tour",
      description: "Produk yang Anda cari tidak ditemukan",
    };
  }

  const images = product.images?.split(",").filter((img) => !!img) || [];
  const mainImage = images[0] || "/placeholder-tour.jpg";

  const price = product.discountPrice || product.price;
  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Number(price));

  const description = product.description.length > 160
    ? product.description.substring(0, 157) + "..."
    : product.description;

  return {
    title: `${product.name} | Khairo Tour`,
    description: description,
    keywords: [
      product.name,
      product.type,
      "tour",
      "travel",
      "umroh",
      "haji",
      "wisata religi",
      "khairo tour",
    ],
    openGraph: {
      title: product.name,
      description: description,
      type: "website",
      url: `https://khairotour.com/products/${product.slug}`,
      images: [
        {
          url: mainImage,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
      siteName: "Khairo Tour",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: description,
      images: [mainImage],
    },
    alternates: {
      canonical: `https://khairotour.com/products/${product.slug}`,
    },
    other: {
      "product:price:amount": String(price),
      "product:price:currency": "IDR",
      "product:availability": product.quotaFilled >= product.quota ? "out of stock" : "in stock",
      "product:category": product.type,
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const breadcrumbItems = [
    { label: "Produk", href: "/products" },
    { label: product.name },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <Navbar />

      {/* Breadcrumb & Back Button */}
      <div className="bg-white border-b sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <Breadcrumb items={breadcrumbItems} />
            <Link href="/products">
              <Button variant="ghost" size="sm">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Kembali
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <ProductDetailClient product={product} />
    </>
  );
}
