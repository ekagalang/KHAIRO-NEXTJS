"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
  value?: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
  disabled?: boolean;
}

export function ImageUpload({
  value = [],
  onChange,
  maxImages = 5,
  disabled = false,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    // Check if we can upload more images
    if (value.length + files.length > maxImages) {
      toast.error(`Maksimal ${maxImages} gambar`);
      return;
    }

    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate file type
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} bukan file gambar`);
          continue;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} terlalu besar. Maksimal 5MB`);
          continue;
        }

        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Upload gagal");
        }

        const data = await response.json();
        uploadedUrls.push(data.url);
      }

      if (uploadedUrls.length > 0) {
        onChange([...value, ...uploadedUrls]);
        toast.success(`${uploadedUrls.length} gambar berhasil diupload`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        error instanceof Error ? error.message : "Gagal mengupload gambar"
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = async (url: string, index: number) => {
    try {
      // Extract filename from URL
      const filename = url.split("/").pop();
      if (filename) {
        await fetch(`/api/upload?filename=${filename}`, {
          method: "DELETE",
        });
      }

      const newUrls = value.filter((_, i) => i !== index);
      onChange(newUrls);
      toast.success("Gambar berhasil dihapus");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Gagal menghapus gambar");
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? "border-primary bg-primary/5"
            : "border-gray-300 hover:border-gray-400"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleUpload(e.target.files)}
          disabled={disabled || uploading}
        />

        {uploading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-sm text-gray-600">Mengupload gambar...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Upload className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-sm font-medium text-gray-700 mb-1">
              Klik atau drag & drop untuk upload
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, WebP hingga 5MB (Maksimal {maxImages} gambar)
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4"
              disabled={disabled || uploading}
            >
              Pilih File
            </Button>
          </div>
        )}
      </div>

      {/* Preview Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {value.map((url, index) => (
            <Card key={index} className="relative group overflow-hidden">
              <div className="relative aspect-square">
                <Image
                  src={url}
                  alt={`Upload ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemove(url, index)}
                disabled={disabled}
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

      {value.length === 0 && (
        <Card className="p-8">
          <div className="flex flex-col items-center text-center text-gray-500">
            <ImageIcon className="w-12 h-12 mb-2" />
            <p className="text-sm">Belum ada gambar diupload</p>
          </div>
        </Card>
      )}
    </div>
  );
}
