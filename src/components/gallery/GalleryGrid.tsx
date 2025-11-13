"use client";

import { useEffect, useState } from "react";
import { Gallery } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Loader2, ImageIcon } from "lucide-react";

export function GalleryGrid() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [filteredGalleries, setFilteredGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");

  const categories = ["Semua", "Haji", "Umroh", "Kegiatan", "Dokumentasi"];

  useEffect(() => {
    fetchGalleries();
  }, []);

  useEffect(() => {
    if (selectedCategory === "Semua") {
      setFilteredGalleries(galleries);
    } else {
      setFilteredGalleries(
        galleries.filter((g) => g.category === selectedCategory)
      );
    }
  }, [selectedCategory, galleries]);

  const fetchGalleries = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/gallery");
      const data = await response.json();
      setGalleries(data);
      setFilteredGalleries(data);
    } catch (error) {
      console.error("Error fetching galleries:", error);
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

      {/* Gallery Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredGalleries.length === 0 ? (
        <div className="text-center py-20">
          <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">Belum ada foto dalam kategori ini</p>
        </div>
      ) : (
        <>
          <p className="text-center text-gray-600">
            Menampilkan {filteredGalleries.length} foto
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredGalleries.map((gallery) => (
              <Card
                key={gallery.id}
                className="overflow-hidden group hover:shadow-xl transition-all"
              >
                <div className="relative h-64 bg-gray-100">
                  <Image
                    src={gallery.imageUrl}
                    alt={gallery.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <Badge className="mb-2 bg-secondary">
                        {gallery.category}
                      </Badge>
                      <h3 className="font-semibold text-sm mb-1">
                        {gallery.title}
                      </h3>
                      {gallery.description && (
                        <p className="text-xs opacity-90 line-clamp-2">
                          {gallery.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
