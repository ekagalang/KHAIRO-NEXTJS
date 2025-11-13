"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Upload,
  X,
  Image as ImageIcon,
  Trash2,
  Search,
  Loader2,
  Check,
} from "lucide-react";
import Image from "next/image";

interface Media {
  id: string;
  filename: string;
  filepath: string;
  filesize: number;
  mimetype: string;
  mediaType: string;
  width?: number;
  height?: number;
  duration?: number;
  alt?: string;
  title?: string;
  createdAt: string;
}

interface MediaPickerProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function MediaPicker({ value, onChange, label }: MediaPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedMedia, setSelectedMedia] = useState<string>(value);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
    }
  }, [isOpen, search]);

  useEffect(() => {
    setSelectedMedia(value);
  }, [value]);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: "50",
        search,
      });
      const response = await fetch(`/api/media?${params}`);
      const data = await response.json();
      setMedia(data.media || []);
    } catch (error) {
      console.error("Error fetching media:", error);
      toast.error("Gagal memuat media");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Upload gagal");
      }

      const data = await response.json();
      toast.success("File berhasil diupload");
      fetchMedia();
      setSelectedMedia(data.url);
    } catch (error: any) {
      toast.error(error.message || "Gagal upload file");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDelete = async (id: string, filepath: string) => {
    if (!confirm("Yakin ingin menghapus gambar ini?")) return;

    try {
      const response = await fetch(`/api/media/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Media berhasil dihapus");
        // If deleted media is currently selected, clear selection
        if (selectedMedia === filepath) {
          setSelectedMedia("");
        }
        fetchMedia();
      } else {
        toast.error("Gagal menghapus media");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan");
    }
  };

  const handleSelect = () => {
    onChange(selectedMedia);
    setIsOpen(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div>
      {label && <Label className="mb-2 block">{label}</Label>}

      {/* Preview */}
      <div className="mb-2">
        {value ? (
          <div className="relative inline-block">
            <div className="w-32 h-32 border rounded-lg overflow-hidden bg-gray-100">
              {value.includes('/videos/') || value.endsWith('.mp4') || value.endsWith('.webm') || value.endsWith('.ogg') ? (
                <video
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                  loop
                  autoPlay
                  preload="metadata"
                >
                  <source src={value.replace('/uploads/videos/', '/api/video/')} type={value.endsWith('.webm') ? 'video/webm' : value.endsWith('.ogg') ? 'video/ogg' : 'video/mp4'} />
                </video>
              ) : (
                <Image
                  src={value}
                  alt="Preview"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <Button
              type="button"
              size="icon"
              variant="destructive"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
              onClick={() => onChange("")}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center bg-gray-50">
            <ImageIcon className="w-8 h-8 text-gray-400" />
          </div>
        )}
      </div>

      {/* Button to open picker */}
      <Button type="button" variant="outline" onClick={() => setIsOpen(true)}>
        <ImageIcon className="w-4 h-4 mr-2" />
        Pilih Gambar
      </Button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card
            ref={modalRef}
            className="w-full max-w-4xl max-h-[80vh] flex flex-col"
          >
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-bold text-lg">Pilih Gambar</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-4 border-b space-y-4">
              {/* Upload */}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4 mr-2" />
                  )}
                  Upload Media Baru
                </Button>
                <p className="text-xs text-gray-500 mt-1">
                  Gambar (max 5MB) atau Video (max 50MB)
                </p>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Cari gambar..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Media Grid */}
            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : media.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Belum ada gambar. Upload gambar baru di atas.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {media.map((item) => (
                    <div
                      key={item.id}
                      className={`relative group border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                        selectedMedia === item.filepath
                          ? "border-primary ring-2 ring-primary"
                          : "border-gray-200 hover:border-primary"
                      }`}
                      onClick={() => setSelectedMedia(item.filepath)}
                    >
                      <div className="aspect-square bg-gray-100 relative">
                        {item.mediaType === "video" ? (
                          <video
                            className="w-full h-full object-cover"
                            muted
                            playsInline
                            preload="metadata"
                          >
                            <source src={item.filepath.replace('/uploads/videos/', '/api/video/')} type={item.mimetype} />
                          </video>
                        ) : (
                          <Image
                            src={item.filepath}
                            alt={item.alt || item.filename}
                            fill
                            className="object-cover"
                          />
                        )}
                        {selectedMedia === item.filepath && (
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                            <div className="bg-primary text-white rounded-full p-1">
                              <Check className="w-5 h-5" />
                            </div>
                          </div>
                        )}
                        {item.mediaType === "video" && (
                          <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            VIDEO
                          </div>
                        )}
                      </div>
                      <div className="p-2 bg-white">
                        <p className="text-xs truncate font-medium">
                          {item.filename}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.width}x{item.height} • {formatFileSize(item.filesize)}
                        </p>
                      </div>
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item.id, item.filepath);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Batal
              </Button>
              <Button
                onClick={handleSelect}
                disabled={!selectedMedia}
              >
                Pilih Gambar
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
