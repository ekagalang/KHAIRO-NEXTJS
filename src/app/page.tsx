"use client";

import { useEffect, useState } from "react";
import { Product } from "@prisma/client";
import { Navbar } from "@/components/layout/Navbar";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Plane,
  Shield,
  Users,
  Award,
  ArrowRight,
  Star,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch("/api/products?featured=true");
      const data = await response.json();
      setFeaturedProducts(data.slice(0, 3)); // Show only 3 featured
    } catch (error) {
      console.error("Error fetching featured products:", error);
    }
  };

  const features = [
    {
      icon: Shield,
      title: "Terpercaya & Legal",
      description: "Terdaftar resmi di Kemenag dengan izin lengkap",
    },
    {
      icon: Award,
      title: "Berpengalaman",
      description: "10+ tahun melayani jamaah haji dan umroh",
    },
    {
      icon: Users,
      title: "Pembimbing Profesional",
      description: "Tour guide berpengalaman dan bersertifikat",
    },
    {
      icon: Plane,
      title: "Fasilitas Terbaik",
      description: "Hotel nyaman dan transportasi berkualitas",
    },
  ];

  const testimonials = [
    {
      name: "Ibu Siti Aminah",
      location: "Jakarta",
      rating: 5,
      text: "Alhamdulillah, pelayanan sangat memuaskan. Tour guide ramah dan hotel nyaman. Terima kasih Khairo Tour!",
    },
    {
      name: "Bapak Ahmad Yani",
      location: "Bandung",
      rating: 5,
      text: "Paket umroh yang sangat lengkap dengan harga terjangkau. Prosesnya mudah dan cepat. Highly recommended!",
    },
    {
      name: "Ibu Fatimah",
      location: "Surabaya",
      rating: 5,
      text: "Pengalaman umroh pertama saya sangat berkesan. Tim Khairo Tour sangat membantu dari awal hingga akhir.",
    },
  ];

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-primary via-secondary to-primary py-16 sm:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center max-w-3xl mx-auto">
              <div className="mb-6 inline-block">
                <span className="text-6xl">🕌</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-800 mb-6">
                Wujudkan Impian Haji & Umroh Anda
              </h1>
              <p className="text-lg sm:text-xl text-gray-700 mb-8">
                Paket haji dan umroh terpercaya dengan harga terjangkau.
                Fasilitas lengkap, pembimbing berpengalaman, dan pelayanan
                terbaik.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gray-800 hover:bg-gray-900 text-white font-semibold shadow-xl"
                  asChild
                >
                  <Link href="/products">
                    Lihat Paket Tour
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-gray-800 text-gray-800 font-semibold hover:bg-gray-800 hover:text-white"
                  asChild
                >
                  <a
                    href="https://wa.me/6281234567890"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Phone className="mr-2 w-5 h-5" />
                    Hubungi Kami
                  </a>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-12 max-w-2xl mx-auto">
                <div className="text-center">
                  <p className="text-3xl sm:text-4xl font-bold text-gray-800">
                    10+
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Tahun Pengalaman</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl sm:text-4xl font-bold text-gray-800">
                    5000+
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Jamaah Terlayani</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl sm:text-4xl font-bold text-gray-800">
                    100%
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Kepuasan</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
                Mengapa Memilih Kami?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Kepercayaan dan kenyamanan jamaah adalah prioritas utama kami
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="text-center hover:shadow-lg transition-shadow"
                >
                  <CardContent className="pt-8 pb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="w-8 h-8 text-gray-800" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 sm:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
                  Paket Populer
                </h2>
                <p className="text-gray-600">
                  Pilihan paket tour terfavorit jamaah kami
                </p>
              </div>
              <Button variant="outline" asChild className="hidden sm:flex">
                <Link href="/products">
                  Lihat Semua
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="text-center sm:hidden">
              <Button variant="outline" asChild className="w-full">
                <Link href="/products">
                  Lihat Semua Paket
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
                Testimoni Jamaah
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Cerita pengalaman jamaah yang telah mempercayai kami
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-4 italic">
                      "{testimonial.text}"
                    </p>
                    <div className="border-t pt-4">
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">
                        {testimonial.location}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-20 bg-gradient-to-r from-primary to-secondary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
              Siap Berangkat Haji atau Umroh?
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              Konsultasikan kebutuhan perjalanan ibadah Anda bersama tim kami
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gray-800 hover:bg-gray-900 text-white font-semibold"
                asChild
              >
                <Link href="/products">Pilih Paket Tour</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white border-2 border-gray-800 text-gray-800 hover:bg-gray-100"
                asChild
              >
                <a
                  href="https://wa.me/6281234567890?text=Halo, saya ingin konsultasi mengenai paket haji/umroh"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Konsultasi Gratis
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {/* Company Info */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🕌</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Khairo Tour</h3>
                    <p className="text-sm text-gray-400">Haji & Umroh</p>
                  </div>
                </div>
                <p className="text-gray-400 text-sm">
                  Melayani perjalanan ibadah haji dan umroh dengan penuh amanah
                  dan profesional.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="font-bold mb-4">Tautan Cepat</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link
                      href="/products?type=UMROH"
                      className="text-gray-400 hover:text-primary transition-colors"
                    >
                      Paket Umroh
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/products?type=HAJI"
                      className="text-gray-400 hover:text-primary transition-colors"
                    >
                      Paket Haji
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/gallery"
                      className="text-gray-400 hover:text-primary transition-colors"
                    >
                      Galeri
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/blog"
                      className="text-gray-400 hover:text-primary transition-colors"
                    >
                      Blog & Artikel
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4 className="font-bold mb-4">Hubungi Kami</h4>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <Phone className="w-4 h-4 mt-1 flex-shrink-0 text-primary" />
                    <span className="text-gray-400">+62 812-3456-7890</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Mail className="w-4 h-4 mt-1 flex-shrink-0 text-primary" />
                    <span className="text-gray-400">info@khairotour.com</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-primary" />
                    <span className="text-gray-400">
                      Jl. Contoh No. 123
                      <br />
                      Jakarta, Indonesia
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
              <p>&copy; 2024 Khairo Tour. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
