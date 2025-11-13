"use client";

import { useEffect, useState } from "react";
import { Product } from "@prisma/client";
import { Navbar } from "@/components/layout/Navbar";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel } from "@/components/ui/carousel";
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
import Image from "next/image";
import * as Icons from "lucide-react";

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [hero, setHero] = useState<any>(null);
  const [whyChooseUs, setWhyChooseUs] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [galleries, setGalleries] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);

  useEffect(() => {
    fetchFeaturedProducts();
    fetchHero();
    fetchWhyChooseUs();
    fetchTestimonials();
    fetchGalleries();
    fetchBlogs();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch("/api/products?featured=true");
      const data = await response.json();
      setFeaturedProducts(data.slice(0, 3));
    } catch (error) {
      console.error("Error fetching featured products:", error);
    }
  };

  const fetchHero = async () => {
    try {
      const response = await fetch("/api/hero");
      const data = await response.json();
      console.log("Hero data from API:", data);
      console.log("Background URL:", data.backgroundUrl);
      setHero(data);
    } catch (error) {
      console.error("Error fetching hero:", error);
    }
  };

  const fetchWhyChooseUs = async () => {
    try {
      const response = await fetch("/api/why-choose-us");
      const data = await response.json();
      setWhyChooseUs(data);
    } catch (error) {
      console.error("Error fetching why choose us:", error);
    }
  };

  const fetchTestimonials = async () => {
    try {
      const response = await fetch("/api/testimonials");
      const data = await response.json();
      setTestimonials(data);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    }
  };

  const fetchGalleries = async () => {
    try {
      const response = await fetch("/api/galleries?limit=6");
      if (!response.ok) {
        console.error("Galleries API error:", response.status);
        return;
      }
      const data = await response.json();
      console.log("Galleries data:", data);
      setGalleries(data.galleries || []);
    } catch (error) {
      console.error("Error fetching galleries:", error);
    }
  };

  const fetchBlogs = async () => {
    try {
      const response = await fetch("/api/blogs?published=true&limit=4");
      if (!response.ok) {
        console.error("Blogs API error:", response.status);
        return;
      }
      const data = await response.json();
      console.log("Blogs data:", data);
      setBlogs(data.blogs || []);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  // Get icon component by name
  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent || CheckCircle;
  };

  // Default features for fallback
  const defaultFeatures = [
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

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        {/* Hero Section - Dynamic dari CMS */}
        <section className="relative bg-gradient-to-r from-primary via-secondary to-primary py-16 sm:py-24 overflow-hidden">
          {/* Background Image/Video */}
          {hero?.backgroundUrl && (
            <>
              {hero.backgroundUrl.includes('/videos/') || hero.backgroundUrl.endsWith('.mp4') || hero.backgroundUrl.endsWith('.webm') || hero.backgroundUrl.endsWith('.ogg') ? (
                <div className="absolute inset-0 z-0">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    preload="auto"
                  >
                    <source
                      src={hero.backgroundUrl.replace('/uploads/videos/', '/api/video/')}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                  <div className="absolute inset-0 bg-black/40 z-10"></div>
                </div>
              ) : (
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${hero.backgroundUrl})` }}
                >
                  <div className="absolute inset-0 bg-black/30"></div>
                </div>
              )}
            </>
          )}
          <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10 z-20"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-30">
            <div className="text-center max-w-3xl mx-auto">
              <div className="mb-6 inline-block">
                <span className="text-6xl">🕌</span>
              </div>
              <h1 className={`text-4xl sm:text-5xl md:text-6xl font-bold mb-6 ${hero?.backgroundUrl ? "text-white drop-shadow-2xl" : "text-gray-800"}`}>
                {hero?.title || "Wujudkan Impian Haji & Umroh Anda"}
              </h1>
              <p className={`text-lg sm:text-xl mb-4 ${hero?.backgroundUrl ? "text-white drop-shadow-2xl" : "text-gray-700"}`}>
                {hero?.subtitle || "Berangkat Bersama Khairo Tour"}
              </p>
              {hero?.description && (
                <p className={`text-base mb-8 ${hero?.backgroundUrl ? "text-gray-100 drop-shadow-2xl" : "text-gray-600"}`}>
                  {hero.description}
                </p>
              )}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href={hero?.buttonLink || "/products"}>
                  <Button
                    size="lg"
                    className="bg-gray-800 hover:bg-gray-900 text-white font-semibold shadow-xl w-full sm:w-auto"
                  >
                    {hero?.buttonText || "Lihat Paket"}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us - Dynamic dari CMS */}
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
                Mengapa Memilih Kami?
              </h2>
              <p className="text-gray-600">
                Keunggulan Khairo Tour yang membuat kami berbeda
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {whyChooseUs.length > 0 ? (
                whyChooseUs.map((feature, index) => {
                  const IconComponent = getIcon(feature.icon);
                  return (
                    <Card
                      key={index}
                      className="text-center hover:shadow-lg transition-shadow"
                    >
                      <CardContent className="pt-8 pb-6">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <IconComponent className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <>
                  {defaultFeatures.map((feature, index) => (
                    <Card
                      key={index}
                      className="text-center hover:shadow-lg transition-shadow"
                    >
                      <CardContent className="pt-8 pb-6">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <feature.icon className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </>
              )}
            </div>
          </div>
        </section>

        {/* Gallery Preview - Eye-catching */}
        <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full filter blur-3xl"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Galeri Dokumentasi
              </h2>
              <p className="text-gray-300">
                Momen berharga perjalanan ibadah jamaah kami
              </p>
            </div>

            {galleries.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                  {galleries.slice(0, 6).map((gallery, index) => (
                    <div
                      key={gallery.id}
                      className={`relative group overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ${
                        index === 0 ? "md:col-span-2 md:row-span-2" : ""
                      }`}
                      style={{
                        height: index === 0 ? "400px" : "190px",
                      }}
                    >
                      <Image
                        src={gallery.imageUrl}
                        alt={gallery.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-white font-semibold text-lg mb-1">
                            {gallery.title}
                          </h3>
                          {gallery.description && (
                            <p className="text-gray-200 text-sm line-clamp-2">
                              {gallery.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="absolute top-3 right-3 bg-primary/90 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                        {gallery.category}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center">
                  <Link href="/gallery">
                    <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                      Lihat Semua Galeri
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-400 py-12">
                Galeri akan segera hadir
              </div>
            )}
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 sm:py-20 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
                Paket Pilihan
              </h2>
              <p className="text-gray-600">
                Paket haji dan umroh terbaik dengan fasilitas lengkap
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="text-center">
              <Link href="/products">
                <Button size="lg" variant="outline">
                  Lihat Semua Paket
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials - Carousel */}
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
                Testimoni Jamaah
              </h2>
              <p className="text-gray-600">
                Apa kata mereka yang telah berangkat bersama kami
              </p>
            </div>

            {testimonials.length > 0 ? (
              <Carousel autoplay interval={5000} itemsPerSlide={3}>
                {testimonials.map((testimonial, index) => (
                  <Card key={index} className="h-full">
                    <CardContent className="pt-8 pb-6 text-center flex flex-col h-full">
                      {testimonial.imageUrl && (
                        <div className="w-16 h-16 rounded-full bg-gray-200 mx-auto mb-4 overflow-hidden">
                          <img
                            src={testimonial.imageUrl}
                            alt={testimonial.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex justify-center mb-3">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-700 mb-4 italic flex-1">
                        "{testimonial.content}"
                      </p>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">
                          {testimonial.name}
                        </p>
                        <p className="text-xs text-gray-500">{testimonial.role}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </Carousel>
            ) : (
              <div className="text-center text-gray-500">
                Belum ada testimoni
              </div>
            )}
          </div>
        </section>

        {/* Blog Section with Headline */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
                Artikel & Panduan
              </h2>
              <p className="text-gray-600">
                Tips dan informasi seputar ibadah haji dan umroh
              </p>
            </div>

            {blogs.length > 0 ? (
              <>
                {/* Headline Blog */}
                <div className="mb-8">
                  <Link href={`/blog/${blogs[0].slug}`}>
                    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 group cursor-pointer">
                      <div className="md:flex">
                        <div className="md:w-1/2 relative h-64 md:h-auto">
                          <Image
                            src={blogs[0].coverImage}
                            alt={blogs[0].title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-4 left-4 bg-primary text-white px-4 py-2 rounded-lg font-semibold text-sm">
                            {blogs[0].category}
                          </div>
                        </div>
                        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
                          <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                            <span className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-primary text-primary" />
                              Artikel Unggulan
                            </span>
                            <span>•</span>
                            <span>{new Date(blogs[0].publishedAt || blogs[0].createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
                          </div>
                          <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3 group-hover:text-primary transition-colors">
                            {blogs[0].title}
                          </h3>
                          {blogs[0].excerpt && (
                            <p className="text-gray-600 mb-4 line-clamp-3">
                              {blogs[0].excerpt}
                            </p>
                          )}
                          <div className="flex items-center text-primary font-semibold group-hover:gap-3 transition-all">
                            Baca Selengkapnya
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </div>

                {/* Other Blogs */}
                {blogs.length > 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {blogs.slice(1, 4).map((blog) => (
                      <Link key={blog.id} href={`/blog/${blog.slug}`}>
                        <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer">
                          <div className="relative h-48">
                            <Image
                              src={blog.coverImage}
                              alt={blog.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-xs font-semibold">
                              {blog.category}
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <p className="text-xs text-gray-500 mb-2">
                              {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                            </p>
                            <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                              {blog.title}
                            </h3>
                            {blog.excerpt && (
                              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                                {blog.excerpt}
                              </p>
                            )}
                            <div className="flex items-center text-primary text-sm font-semibold">
                              Baca Artikel
                              <ArrowRight className="ml-1 w-4 h-4" />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}

                <div className="text-center">
                  <Link href="/blog">
                    <Button size="lg" variant="outline">
                      Lihat Semua Artikel
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500 py-12">
                Artikel akan segera hadir
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-20 bg-gradient-to-r from-secondary to-primary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
              Siap Berangkat?
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              Hubungi kami sekarang untuk informasi lebih lanjut dan dapatkan
              penawaran terbaik
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gray-800 hover:bg-gray-900 text-white font-semibold"
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
