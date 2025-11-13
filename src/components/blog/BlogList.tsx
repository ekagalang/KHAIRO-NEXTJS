"use client";

import { useEffect, useState } from "react";
import { Blog } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { Loader2, FileText, Calendar, User, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";

export function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");

  const categories = ["Semua", "Tips", "Panduan", "Berita", "Kisah", "Edukasi"];

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (selectedCategory === "Semua") {
      setFilteredBlogs(blogs);
    } else {
      setFilteredBlogs(blogs.filter((b) => b.category === selectedCategory));
    }
  }, [selectedCategory, blogs]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/blog");
      const data = await response.json();
      setBlogs(data);
      setFilteredBlogs(data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter Categories */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(category)}
            className={
              selectedCategory === category ? "bg-primary text-gray-800" : ""
            }
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Blog Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="text-center py-20">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">Belum ada artikel dalam kategori ini</p>
        </div>
      ) : (
        <>
          <p className="text-center text-gray-600">
            Menampilkan {filteredBlogs.length} artikel
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => (
              <Card
                key={blog.id}
                className="overflow-hidden hover:shadow-lg transition-shadow group"
              >
                <Link href={`/blog/${blog.slug}`}>
                  <div className="relative h-48 bg-gray-100">
                    <Image
                      src={blog.coverImage}
                      alt={blog.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-secondary text-white">
                        {blog.category}
                      </Badge>
                    </div>
                  </div>
                </Link>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(blog.publishedAt || blog.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {blog.author}
                    </span>
                  </div>

                  <Link href={`/blog/${blog.slug}`}>
                    <h3 className="font-bold text-lg mb-2 line-clamp-2 hover:text-primary transition-colors">
                      {blog.title}
                    </h3>
                  </Link>

                  {blog.excerpt && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {blog.excerpt}
                    </p>
                  )}

                  <Link href={`/blog/${blog.slug}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-0 h-auto hover:text-primary"
                    >
                      Baca Selengkapnya
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
