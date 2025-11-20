"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Save, X, Eye, EyeOff, ArrowRight } from "lucide-react";
import { IconPicker } from "@/components/admin/IconPicker";

interface HeroButton {
  id: string;
  text: string;
  link: string;
  variant: string;
  bgColor?: string;
  textColor?: string;
  icon?: string;
  order: number;
  isActive: boolean;
}

interface Props {
  heroSectionId: string;
}

const variantOptions = [
  { value: "primary", label: "Primary (Gelap)", bg: "bg-gray-800", text: "text-white" },
  { value: "secondary", label: "Secondary (Terang)", bg: "bg-white", text: "text-gray-800" },
  { value: "outline", label: "Outline", bg: "border-2 border-gray-800 bg-transparent", text: "text-gray-800" },
  { value: "custom", label: "Custom Color", bg: "bg-gradient-to-r from-blue-500 to-purple-500", text: "text-white" },
];

export function HeroButtonsSection({ heroSectionId }: Props) {
  const [buttons, setButtons] = useState<HeroButton[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    text: "",
    link: "",
    variant: "primary",
    bgColor: "",
    textColor: "",
    icon: "",
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    if (heroSectionId) {
      console.log('Fetching buttons for hero section:', heroSectionId);
      fetchButtons();
    } else {
      console.log('No heroSectionId provided');
      setLoading(false);
    }
  }, [heroSectionId]);

  const fetchButtons = async () => {
    try {
      setError(null);
      const response = await fetch(`/api/admin/hero-buttons?heroSectionId=${heroSectionId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch");
      }
      const data = await response.json();
      setButtons(data);
    } catch (error: any) {
      console.error("Error fetching buttons:", error);
      setError(error.message || "Gagal memuat tombol");
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
      bgColor: "",
      textColor: "",
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
      bgColor: button.bgColor || "",
      textColor: button.textColor || "",
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
          body: JSON.stringify({ ...formData, heroSectionId }),
        });

        if (!response.ok) throw new Error("Failed to create");
        toast.success("Tombol berhasil ditambahkan");
      }

      setShowForm(false);
      setEditingId(null);
      fetchButtons();
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
      fetchButtons();
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
      fetchButtons();
    } catch (error) {
      toast.error("Gagal mengubah status");
      console.error(error);
    }
  };

  const getButtonStyle = (btn: HeroButton) => {
    if (btn.variant === "custom" && btn.bgColor && btn.textColor) {
      return {
        backgroundColor: btn.bgColor,
        color: btn.textColor,
      };
    }
    const variant = variantOptions.find((v) => v.value === btn.variant);
    return { className: `${variant?.bg} ${variant?.text}` };
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-gray-500">Loading tombol...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tombol Hero Section</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">Error: {error}</p>
            <Button onClick={fetchButtons} size="sm">
              Coba Lagi
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Tombol Hero Section</CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Kelola tombol call-to-action di hero section
            </p>
          </div>
          {!showForm && (
            <Button onClick={handleCreate} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Tombol
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showForm && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 space-y-4">
            <h3 className="font-semibold text-lg">
              {editingId ? "Edit Tombol" : "Tambah Tombol Baru"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Teks Tombol</Label>
                <Input
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  placeholder="Lihat Paket Tour"
                />
              </div>

              <div className="space-y-2">
                <Label>Link Tombol</Label>
                <Input
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="/products atau https://example.com"
                />
                <p className="text-xs text-gray-500">
                  Internal: /products | External: https://google.com (akan buka tab baru)
                </p>
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
                        value={formData.bgColor || "#1f2937"}
                        onChange={(e) => setFormData({ ...formData, bgColor: e.target.value })}
                        className="w-20 h-10"
                      />
                      <Input
                        type="text"
                        value={formData.bgColor || "#1f2937"}
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
                        value={formData.textColor || "#ffffff"}
                        onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                        className="w-20 h-10"
                      />
                      <Input
                        type="text"
                        value={formData.textColor || "#ffffff"}
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
                  value={formData.icon || ""}
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
                  <span className="ml-2 text-sm text-gray-700">Aktif</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3">
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
          </div>
        )}

        {buttons.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            Belum ada tombol. Klik &quot;Tambah Tombol&quot; untuk membuat tombol baru.
          </div>
        ) : (
          <div className="space-y-3">
            {buttons.map((button) => {
              const style = getButtonStyle(button);
              return (
                <div
                  key={button.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <button
                      {...(style.className ? { className: `px-4 py-2 rounded-lg font-semibold text-sm ${style.className}` } : { style: { ...style, padding: "0.5rem 1rem", borderRadius: "0.5rem", fontWeight: 600, fontSize: "0.875rem" } })}
                    >
                      {button.text}
                      <ArrowRight className="inline-block w-4 h-4 ml-2" />
                    </button>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{button.text}</span>
                      <span className="text-xs text-gray-500">{button.link}</span>
                      <span className="text-xs text-gray-400">
                        Variant: {button.variant} | Order: {button.order}
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
                      {button.isActive ? (
                        <Eye className="w-3 h-3" />
                      ) : (
                        <EyeOff className="w-3 h-3" />
                      )}
                      {button.isActive ? "Aktif" : "Nonaktif"}
                    </button>
                    <Button
                      onClick={() => handleEdit(button)}
                      size="sm"
                      variant="outline"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(button.id)}
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {buttons.filter((b) => b.isActive).length > 0 && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <h4 className="font-semibold mb-3">Preview Tombol (Hanya yang aktif)</h4>
            <div className="flex flex-wrap gap-3">
              {buttons
                .filter((b) => b.isActive)
                .map((button) => {
                  const style = getButtonStyle(button);
                  return (
                    <button
                      key={button.id}
                      {...(style.className ? { className: `px-6 py-3 rounded-lg font-semibold shadow-lg transition-all hover:scale-105 ${style.className}` } : { style: { ...style, padding: "0.75rem 1.5rem", borderRadius: "0.5rem", fontWeight: 600, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)", transition: "all 0.3s" } })}
                    >
                      {button.text}
                      <ArrowRight className="inline-block w-5 h-5 ml-2" />
                    </button>
                  );
                })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
