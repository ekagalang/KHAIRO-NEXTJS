"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { IconPicker } from "@/components/admin/IconPicker";
import * as Icons from "lucide-react";

export default function EditHeroStatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    label: "",
    value: "",
    suffix: "",
    icon: "",
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchStat();
  }, []);

  const fetchStat = async () => {
    try {
      const response = await fetch(`/api/admin/hero-stats/${resolvedParams.id}`);
      const data = await response.json();

      if (data.success) {
        const stat = data.data;
        setFormData({
          label: stat.label,
          value: stat.value,
          suffix: stat.suffix || "",
          icon: stat.icon || "",
          order: stat.order,
          isActive: stat.isActive,
        });
      } else {
        toast.error("Gagal mengambil data stat");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(`/api/admin/hero-stats/${resolvedParams.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Hero stat berhasil diupdate");
        router.push("/admin/dashboard/hero-stats");
        router.refresh();
      } else {
        toast.error(data.message || "Gagal mengupdate hero stat");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/dashboard/hero-stats">
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Hero Stat</h1>
          <p className="text-muted-foreground mt-1">
            Update statistik yang ditampilkan di hero section
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg border p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Label */}
          <div className="space-y-3">
            <Label htmlFor="label">Label *</Label>
            <Input
              id="label"
              placeholder="Contoh: Pengalaman"
              value={formData.label}
              onChange={(e) =>
                setFormData({ ...formData, label: e.target.value })
              }
              required
            />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Label yang akan ditampilkan (contoh: Pengalaman, Jamaah, Kepuasan)
            </p>
          </div>

          {/* Value */}
          <div className="space-y-3">
            <Label htmlFor="value">Value *</Label>
            <Input
              id="value"
              placeholder="Contoh: 10+"
              value={formData.value}
              onChange={(e) =>
                setFormData({ ...formData, value: e.target.value })
              }
              required
            />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Nilai yang akan ditampilkan (contoh: 10+, 5000+, 100%)
            </p>
          </div>

          {/* Suffix */}
          <div className="space-y-3">
            <Label htmlFor="suffix">Suffix</Label>
            <Input
              id="suffix"
              placeholder="Contoh: Tahun"
              value={formData.suffix}
              onChange={(e) =>
                setFormData({ ...formData, suffix: e.target.value })
              }
            />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Teks tambahan setelah value (opsional)
            </p>
          </div>

          {/* Icon */}
          <div className="space-y-3">
            <Label htmlFor="icon">Icon</Label>
            <IconPicker
              value={formData.icon || "Award"}
              onChange={(iconName) =>
                setFormData({ ...formData, icon: iconName })
              }
            />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Pilih icon dari lucide-react (opsional)
            </p>
          </div>

          {/* Order */}
          <div className="space-y-3">
            <Label htmlFor="order">Order</Label>
            <Input
              id="order"
              type="number"
              placeholder="0"
              value={formData.order}
              onChange={(e) =>
                setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
              }
            />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Urutan tampilan (semakin kecil semakin di awal)
            </p>
          </div>

          {/* Status */}
          <div className="space-y-3">
            <Label htmlFor="isActive">Status</Label>
            <div className="flex items-center space-x-2">
              <input
                id="isActive"
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <Label htmlFor="isActive" className="font-normal cursor-pointer">
                Aktif
              </Label>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Hanya stat yang aktif yang akan ditampilkan
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-4 border-t">
          <Link href="/admin/dashboard/hero-stats">
            <Button type="button" variant="outline" disabled={submitting}>
              Batal
            </Button>
          </Link>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>
      </form>

      {/* Preview */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-semibold mb-4">Preview</h2>
        <div className="flex items-center justify-center p-8 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg">
          <div className="text-center">
            {formData.icon && (() => {
              const IconComponent = (Icons as any)[formData.icon];
              return IconComponent ? (
                <div className="flex justify-center mb-3">
                  <IconComponent className="w-8 h-8 text-primary" />
                </div>
              ) : null;
            })()}
            <div className="text-4xl font-bold text-primary mb-2">
              {formData.value || "10+"}
              {formData.suffix && (
                <span className="text-lg ml-2">{formData.suffix}</span>
              )}
            </div>
            <div className="text-muted-foreground leading-relaxed">
              {formData.label || "Pengalaman"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
