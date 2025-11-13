"use client";

import { Blog } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  User,
  ArrowLeft,
  Share2,
  Facebook,
  Twitter,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface BlogContentProps {
  blog: Blog;
}

export function BlogContent({ blog }: BlogContentProps) {
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt || blog.title,
          url: shareUrl,
        });
      } catch (error) {
        console.log("Share canceled");
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success("Link berhasil disalin!");
    }
  };

  const shareToFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl
      )}`,
      "_blank",
      "width=600,height=400"
    );
  };

  const shareToTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        shareUrl
      )}&text=${encodeURIComponent(blog.title)}`,
      "_blank",
      "width=600,height=400"
    );
  };

  const shareToWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(
        blog.title + " - " + shareUrl
      )}`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b sticky top-16 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Link href="/blog">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Kembali ke Blog
            </Button>
          </Link>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Article Header */}
        <header className="mb-8">
          <Badge className="mb-4 bg-secondary text-white">
            {blog.category}
          </Badge>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            {blog.title}
          </h1>

          {blog.excerpt && (
            <p className="text-lg text-gray-600 mb-6">{blog.excerpt}</p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 pb-6 border-b">
            <span className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {blog.author}
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formatDate(blog.publishedAt || blog.createdAt)}
            </span>
          </div>
        </header>

        {/* Cover Image */}
        <div className="relative w-full h-64 sm:h-96 mb-8 rounded-xl overflow-hidden">
          <Image
            src={blog.coverImage}
            alt={blog.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Share Buttons */}
        <Card className="mb-8">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-semibold text-gray-600">
                Bagikan:
              </span>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={shareToFacebook}
                className="text-blue-600 hover:bg-blue-50"
              >
                <Facebook className="w-4 h-4 mr-1" />
                Facebook
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={shareToTwitter}
                className="text-sky-500 hover:bg-sky-50"
              >
                <Twitter className="w-4 h-4 mr-1" />
                Twitter
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={shareToWhatsApp}
                className="text-green-600 hover:bg-green-50"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                WhatsApp
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Article Content */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="mt-8 bg-gradient-to-r from-primary to-secondary">
          <CardContent className="p-6 sm:p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Tertarik dengan Paket Kami?
            </h3>
            <p className="text-gray-700 mb-6">
              Konsultasikan kebutuhan haji dan umroh Anda bersama kami
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                className="bg-gray-800 hover:bg-gray-900 text-white"
                asChild
              >
                <Link href="/products">Lihat Paket Tour</Link>
              </Button>
              <Button variant="outline" className="bg-white" asChild>
                <a
                  href="https://wa.me/6281234567890?text=Halo, saya membaca artikel tentang Haji & Umroh"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Hubungi Kami
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </article>
    </div>
  );
}
