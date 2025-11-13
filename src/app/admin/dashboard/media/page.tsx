"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Upload,
  Trash2,
  Search,
  Loader2,
  Image as ImageIcon,
  Edit2,
  X,
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

export default function MediaManager() {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [editingMedia, setEditingMedia] = useState<Media | null>(null);
  const [editForm, setEditForm] = useState({ alt: "", title: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchMedia();
  }, [search]);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: "100",
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
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploading(true);

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
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
      }

      toast.success(`${files.length} file berhasil diupload`);
      fetchMedia();
    } catch (error: any) {
      toast.error(error.message || "Gagal upload file");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus gambar ini?")) return;

    try {
      const response = await fetch(`/api/media/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Media berhasil dihapus");
        fetchMedia();
      } else {
        toast.error("Gagal menghapus media");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan");
    }
  };

  const handleEdit = (item: Media) => {
    setEditingMedia(item);
    setEditForm({
      alt: item.alt || "",
      title: item.title || "",
    });
  };

  const handleSaveEdit = async () => {
    if (!editingMedia) return;

    try {
      const response = await fetch(`/api/media/${editingMedia.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        toast.success("Media berhasil diupdate");
        setEditingMedia(null);
        fetchMedia();
      } else {
        toast.error("Gagal update media");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL berhasil dicopy");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">File Manager</h1>
        <p className="text-gray-600">Kelola file gambar yang diupload</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload & Cari</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Upload className="w-4 h-4 mr-2" />
              )}
              Upload Media
            </Button>
            <p className="text-xs text-gray-500 leading-relaxed mt-3">
              Gambar: max 5MB (JPG, PNG, GIF, WebP) • Video: max 50MB (MP4, WebM, OGG)
            </p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Cari gambar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Media Library ({media.length} file)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : media.length === 0 ? (
            <div className="text-center py-8">
              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {search ? "Tidak ada hasil pencarian" : "Belum ada gambar. Upload gambar baru di atas."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {media.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="aspect-square bg-gray-100 relative">
                    {item.mediaType === "video" ? (
                      <>
                        <video
                          className="w-full h-full object-cover"
                          muted
                          playsInline
                          preload="metadata"
                        >
                          <source src={item.filepath.replace('/uploads/videos/', '/api/video/')} type={item.mimetype} />
                          Your browser does not support the video tag.
                        </video>
                        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          VIDEO
                        </div>
                      </>
                    ) : (
                      <Image
                        src={item.filepath}
                        alt={item.alt || item.filename}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <CardContent className="p-3 space-y-2">
                    <div>
                      <p className="text-sm font-medium truncate" title={item.filename}>
                        {item.filename}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.width}x{item.height} • {formatFileSize(item.filesize)}
                      </p>
                      {item.alt && (
                        <p className="text-xs text-gray-600 mt-1">Alt: {item.alt}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-xs"
                        onClick={() => copyToClipboard(item.filepath)}
                      >
                        Copy URL
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit2 className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      {editingMedia && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Edit Media</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditingMedia(null)}
              >
                <X className="w-5 h-5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-square bg-gray-100 relative rounded-lg overflow-hidden">
                {editingMedia.mediaType === "video" ? (
                  <video
                    className="w-full h-full object-cover"
                    controls
                    muted
                    playsInline
                    preload="metadata"
                  >
                    <source src={editingMedia.filepath.replace('/uploads/videos/', '/api/video/')} type={editingMedia.mimetype} />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <Image
                    src={editingMedia.filepath}
                    alt={editingMedia.filename}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div>
                <Label>Filename</Label>
                <Input value={editingMedia.filename} disabled />
              </div>
              <div>
                <Label>Title (optional)</Label>
                <Input
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  placeholder="Judul gambar"
                />
              </div>
              <div>
                <Label>Alt Text (optional)</Label>
                <Input
                  value={editForm.alt}
                  onChange={(e) => setEditForm({ ...editForm, alt: e.target.value })}
                  placeholder="Deskripsi gambar untuk SEO"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setEditingMedia(null)}
                >
                  Batal
                </Button>
                <Button className="flex-1" onClick={handleSaveEdit}>
                  Simpan
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
