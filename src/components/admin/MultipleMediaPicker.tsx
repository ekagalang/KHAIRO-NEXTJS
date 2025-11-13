"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { X, Plus } from "lucide-react";
import Image from "next/image";

interface MultipleMediaPickerProps {
  value: string; // comma-separated URLs
  onChange: (urls: string) => void;
  label?: string;
  maxImages?: number;
}

export function MultipleMediaPicker({
  value,
  onChange,
  label = "Gambar",
  maxImages = 5,
}: MultipleMediaPickerProps) {
  const [showPicker, setShowPicker] = useState(false);

  const urls = value ? value.split(",").filter((url) => url.trim()) : [];

  const handleAddImage = (url: string) => {
    if (urls.length >= maxImages) {
      return;
    }
    const newUrls = [...urls, url];
    onChange(newUrls.join(","));
    setShowPicker(false);
  };

  const handleRemoveImage = (index: number) => {
    const newUrls = urls.filter((_, i) => i !== index);
    onChange(newUrls.join(","));
  };

  return (
    <div className="space-y-3">
      {label && <Label>{label}</Label>}

      {/* Preview Grid */}
      {urls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {urls.map((url, index) => (
            <Card key={index} className="relative group overflow-hidden">
              <div className="relative aspect-square">
                <Image
                  src={url}
                  alt={`Image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7"
                onClick={() => handleRemoveImage(index)}
              >
                <X className="w-4 h-4" />
              </Button>
              {index === 0 && (
                <div className="absolute bottom-2 left-2 bg-primary text-gray-800 text-xs font-semibold px-2 py-1 rounded">
                  Utama
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Add Button */}
      {urls.length < maxImages && (
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowPicker(true)}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Gambar ({urls.length}/{maxImages})
        </Button>
      )}

      {/* Media Picker Modal */}
      {showPicker && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <MediaPicker
              value=""
              onChange={handleAddImage}
              label="Pilih Gambar"
            />
            <div className="p-4 border-t flex justify-end">
              <Button
                variant="outline"
                onClick={() => setShowPicker(false)}
              >
                Batal
              </Button>
            </div>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500">
        {urls.length === 0
          ? `Maksimal ${maxImages} gambar. Gambar pertama akan menjadi gambar utama.`
          : `${urls.length}/${maxImages} gambar dipilih. Gambar pertama adalah gambar utama.`}
      </p>
    </div>
  );
}
