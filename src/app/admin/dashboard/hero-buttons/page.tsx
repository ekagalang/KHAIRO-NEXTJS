"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Save, X, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { IconPicker } from "@/components/admin/IconPicker";

interface HeroButton {
  id: string;
  heroSectionId: string;
  text: string;
  link: string;
  variant: string;
  bgColor?: string;
  textColor?: string;
  icon?: string;
  order: number;
  isActive: boolean;
}

const variantOptions = [
  { value: "primary", label: "Primary (Gelap)", bg: "bg-gray-800", text: "text-white", preview: "bg-gray-800 text-white" },
  { value: "secondary", label: "Secondary (Terang)", bg: "bg-white", text: "text-gray-800", preview: "bg-white text-gray-800 border-2 border-gray-200" },
  { value: "outline", label: "Outline", bg: "border-2 border-gray-800 bg-transparent", text: "text-gray-800", preview: "border-2 border-gray-800 bg-transparent text-gray-800" },
  { value: "custom", label: "Custom Color", bg: "bg-gradient-to-r from-blue-500 to-purple-500", text: "text-white", preview: "bg-gradient-to-r from-blue-500 to-purple-500 text-white" },
];

export default function HeroButtonsPage() {
  const [heroSection, setHeroSection] = useState<any>(null);
  const [buttons, setButtons] = useState<HeroButton[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    text: "",
    link: "",
    variant: "primary",
    bgColor: "#1f2937",
    textColor: "#ffffff",
    icon: "",
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchHeroSection();
  }, []);

  const fetchHeroSection = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/hero");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();

      if (!data.id) {
        toast.error("Hero section belum ada. Silakan buat di halaman Homepage.");
        setLoading(false);
        return;
      }

      setHeroSection(data);
      fetchButtons(data.id);
    } catch (error) {
      console.error("Error fetching hero section:", error);
      toast.error("Gagal memuat hero section");
      setLoading(false);
    }
  };

  const fetchButtons = async (heroSectionId: string) => {
    try {
      const response = await fetch(`/api/admin/hero-buttons?heroSectionId=${heroSectionId}`);
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setButtons(data);
    } catch (error) {
      console.error("Error fetching buttons:", error);
      toast.error("Gagal memuat tombol");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setShowForm(true);
    setEditingId(null);
    setFormData({
      text: "",
      link: "",
      variant: "primary",
      bgColor: "#1f2937",
      textColor: "#ffffff",
      icon: "",
      order: buttons.length,
      isActive: true,
    });
  };

  const handleEdit = (button: HeroButton) => {
    setShowForm(true);
    setEditingId(button.id);
    setFormData({
      text: button.text,
      link: button.link,
      variant: button.variant,
      bgColor: button.bgColor || "#1f2937",
      textColor: button.textColor || "#ffffff",
      icon: button.icon || "",
      order: button.order,
      isActive: button.isActive,
    });
  };

  const handleSave = async () => {
    try {
      if (!formData.text || !formData.link) {
        toast.error("Text dan Link harus diisi");
        return;
      }

      if (!heroSection?.id) {
        toast.error("Hero section tidak ditemukan");
        return;
      }

      if (editingId) {
        const response = await fetch(`/api/admin/hero-buttons/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error("Failed to update");
        toast.success("Tombol berhasil diupdate");
      } else {
        const response = await fetch("/api/admin/hero-buttons", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, heroSectionId: heroSection.id }),
        });

        if (!response.ok) throw new Error("Failed to create");
        toast.success("Tombol berhasil ditambahkan");
      }

      setShowForm(false);
      setEditingId(null);
      fetchButtons(heroSection.id);
    } catch (error) {
      toast.error("Gagal menyimpan tombol");
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus tombol ini?")) return;

    try {
      const response = await fetch(`/api/admin/hero-buttons/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete");
      toast.success("Tombol berhasil dihapus");
      fetchButtons(heroSection.id);
    } catch (error) {
      toast.error("Gagal menghapus tombol");
      console.error(error);
    }
  };

  const toggleActive = async (button: HeroButton) => {
    try {
      const response = await fetch(`/api/admin/hero-buttons/${button.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...button, isActive: !button.isActive }),
      });

      if (!response.ok) throw new Error("Failed to update");
      toast.success(`Tombol ${!button.isActive ? "diaktifkan" : "dinonaktifkan"}`);
      fetchButtons(heroSection.id);
    } catch (error) {
      toast.error("Gagal mengubah status");
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!heroSection) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Hero Buttons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">
                Hero section belum dibuat. Silakan buat Hero Section terlebih dahulu di halaman Homepage.
              </p>
              <Button asChild>
                <a href="/admin/dashboard/homepage">Buka Halaman Homepage</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Kelola Tombol Hero Section</h1>
          <p className="text-gray-600 mt-1">
            Tambah dan atur tombol call-to-action di hero section homepage
          </p>
        </div>
        {!showForm && (
          <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Tombol
          </Button>
        )}
      </div>

      {/* Form Create/Edit */}
      {showForm && (
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle>{editingId ? "Edit Tombol" : "Tambah Tombol Baru"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Teks Tombol *</Label>
                <Input
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  placeholder="Lihat Paket Tour"
                />
              </div>

              <div className="space-y-2">
                <Label>Link Tombol *</Label>
                <Input
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="/products"
                />
              </div>

              <div className="space-y-2">
                <Label>Variant Style</Label>
                <select
                  value={formData.variant}
                  onChange={(e) => setFormData({ ...formData, variant: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  {variantOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Urutan</Label>
                <Input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                />
              </div>

              {formData.variant === "custom" && (
                <>
                  <div className="space-y-2">
                    <Label>Background Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={formData.bgColor}
                        onChange={(e) => setFormData({ ...formData, bgColor: e.target.value })}
                        className="w-20 h-10"
                      />
                      <Input
                        type="text"
                        value={formData.bgColor}
                        onChange={(e) => setFormData({ ...formData, bgColor: e.target.value })}
                        placeholder="#1f2937"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Text Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={formData.textColor}
                        onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                        className="w-20 h-10"
                      />
                      <Input
                        type="text"
                        value={formData.textColor}
                        onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                        placeholder="#ffffff"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2 md:col-span-2">
                <Label>Icon (Optional)</Label>
                <IconPicker
                  value={formData.icon}
                  onChange={(icon) => setFormData({ ...formData, icon })}
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Aktif (tampilkan di homepage)</span>
                </label>
              </div>
            </div>

            {/* Preview */}
            <div className="border-t pt-4">
              <Label className="mb-2 block">Preview:</Label>
              <div className="flex gap-3">
                <button
                  className={`px-6 py-3 rounded-lg font-semibold shadow-lg transition-all ${
                    formData.variant === "custom"
                      ? ""
                      : variantOptions.find((v) => v.value === formData.variant)?.preview
                  }`}
                  style={
                    formData.variant === "custom"
                      ? {
                          backgroundColor: formData.bgColor,
                          color: formData.textColor,
                        }
                      : {}
                  }
                >
                  {formData.text || "Preview Tombol"}
                  <ArrowRight className="inline-block w-5 h-5 ml-2" />
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                Simpan
              </Button>
              <Button
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
                variant="outline"
              >
                <X className="w-4 h-4 mr-2" />
                Batal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* List Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Tombol ({buttons.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {buttons.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <p className="mb-2">Belum ada tombol yang dibuat.</p>
              <p className="text-sm">Klik tombol &quot;Tambah Tombol&quot; di atas untuk membuat tombol baru.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {buttons.map((button) => {
                const variant = variantOptions.find((v) => v.value === button.variant);
                return (
                  <div
                    key={button.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <button
                        className={`px-6 py-2 rounded-lg font-semibold text-sm shadow transition-all ${
                          button.variant === "custom" ? "" : variant?.preview
                        }`}
                        style={
                          button.variant === "custom" && button.bgColor && button.textColor
                            ? {
                                backgroundColor: button.bgColor,
                                color: button.textColor,
                              }
                            : {}
                        }
                      >
                        {button.text}
                        <ArrowRight className="inline-block w-4 h-4 ml-2" />
                      </button>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{button.text}</span>
                        <span className="text-xs text-gray-500">{button.link}</span>
                        <span className="text-xs text-gray-400">
                          Style: {variant?.label} | Urutan: {button.order}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleActive(button)}
                        className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                          button.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {button.isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {button.isActive ? "Aktif" : "Nonaktif"}
                      </button>
                      <Button onClick={() => handleEdit(button)} size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(button.id)}
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Section */}
      {buttons.filter((b) => b.isActive).length > 0 && (
        <Card className="bg-gradient-to-br from-gray-50 to-blue-50">
          <CardHeader>
            <CardTitle>Preview di Homepage (Hanya Tombol Aktif)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 justify-center">
              {buttons
                .filter((b) => b.isActive)
                .map((button) => {
                  const variant = variantOptions.find((v) => v.value === button.variant);
                  return (
                    <button
                      key={button.id}
                      className={`px-8 py-4 rounded-lg font-semibold shadow-xl transition-all hover:scale-105 ${
                        button.variant === "custom" ? "" : variant?.preview
                      }`}
                      style={
                        button.variant === "custom" && button.bgColor && button.textColor
                          ? {
                              backgroundColor: button.bgColor,
                              color: button.textColor,
                            }
                          : {}
                      }
                    >
                      {button.text}
                      <ArrowRight className="inline-block w-5 h-5 ml-2" />
                    </button>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
