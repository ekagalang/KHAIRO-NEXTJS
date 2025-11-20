"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Eye, EyeOff, Save, X } from "lucide-react";
import { toast } from "sonner";
import { IconPicker } from "@/components/admin/IconPicker";

interface HeroStat {
  id: string;
  label: string;
  value: string;
  suffix: string | null;
  icon: string | null;
  order: number;
  isActive: boolean;
}

export function HeroStatsSection() {
  const [stats, setStats] = useState<HeroStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStat, setEditingStat] = useState<HeroStat | null>(null);
  const [formData, setFormData] = useState({
    label: "",
    value: "",
    suffix: "",
    icon: "",
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/hero-stats");
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      toast.error("Gagal mengambil data stats");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setShowForm(true);
    setEditingStat(null);
    setFormData({
      label: "",
      value: "",
      suffix: "",
      icon: "",
      order: stats.length,
      isActive: true,
    });
  };

  const handleEdit = (stat: HeroStat) => {
    setShowForm(true);
    setEditingStat(stat);
    setFormData({
      label: stat.label,
      value: stat.value,
      suffix: stat.suffix || "",
      icon: stat.icon || "",
      order: stat.order,
      isActive: stat.isActive,
    });
  };

  const handleSave = async () => {
    try {
      if (!formData.label || !formData.value) {
        toast.error("Label dan Value harus diisi");
        return;
      }

      const url = editingStat
        ? `/api/admin/hero-stats/${editingStat.id}`
        : "/api/admin/hero-stats";
      const method = editingStat ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(
          editingStat ? "Stat berhasil diupdate!" : "Stat berhasil ditambahkan!"
        );
        setShowForm(false);
        setEditingStat(null);
        fetchStats();
      } else {
        toast.error("Error: " + data.message);
      }
    } catch (error) {
      toast.error("Gagal menyimpan stat");
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus stat ini?")) return;

    try {
      const response = await fetch(`/api/admin/hero-stats/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Hero stat berhasil dihapus");
        fetchStats();
      } else {
        toast.error(data.message || "Gagal menghapus hero stat");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat menghapus hero stat");
    }
  };

  const toggleActive = async (stat: HeroStat) => {
    try {
      const response = await fetch(`/api/admin/hero-stats/${stat.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...stat,
          isActive: !stat.isActive,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(
          `Hero stat ${!stat.isActive ? "diaktifkan" : "dinonaktifkan"}`
        );
        fetchStats();
      } else {
        toast.error(data.message || "Gagal mengubah status hero stat");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan");
    }
  };

  const cancelEdit = () => {
    setShowForm(false);
    setEditingStat(null);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Hero Stats</CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Kelola statistik yang ditampilkan di hero section
            </p>
          </div>
          {!showForm && (
            <Button onClick={handleCreate} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Stat
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showForm && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 space-y-4">
            <h3 className="font-semibold text-lg">
              {editingStat ? "Edit Hero Stat" : "Tambah Hero Stat Baru"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Label</Label>
                <Input
                  value={formData.label}
                  onChange={(e) =>
                    setFormData({ ...formData, label: e.target.value })
                  }
                  placeholder="Pengalaman"
                />
              </div>

              <div className="space-y-2">
                <Label>Value</Label>
                <Input
                  value={formData.value}
                  onChange={(e) =>
                    setFormData({ ...formData, value: e.target.value })
                  }
                  placeholder="10+"
                />
              </div>

              <div className="space-y-2">
                <Label>Suffix (Optional)</Label>
                <Input
                  value={formData.suffix}
                  onChange={(e) =>
                    setFormData({ ...formData, suffix: e.target.value })
                  }
                  placeholder="Tahun"
                />
              </div>

              <div className="space-y-2">
                <Label>Urutan</Label>
                <Input
                  type="number"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({ ...formData, order: parseInt(e.target.value) })
                  }
                />
              </div>

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
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Aktif</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Simpan
              </Button>
              <Button onClick={cancelEdit} variant="outline">
                <X className="w-4 h-4 mr-2" />
                Batal
              </Button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : stats.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            Belum ada hero stats. Klik &quot;Tambah Stat&quot; untuk membuat stat
            baru.
          </div>
        ) : (
          <div className="space-y-3">
            {stats.map((stat) => (
              <div
                key={stat.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {stat.value}
                    </div>
                    {stat.suffix && (
                      <div className="text-xs text-gray-500">{stat.suffix}</div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{stat.label}</span>
                    <span className="text-xs text-gray-500">
                      Order: {stat.order}
                      {stat.icon && ` | Icon: ${stat.icon}`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleActive(stat)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                      stat.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {stat.isActive ? (
                      <>
                        <Eye className="w-3 h-3" />
                        Aktif
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3 h-3" />
                        Nonaktif
                      </>
                    )}
                  </button>
                  <Button
                    onClick={() => handleEdit(stat)}
                    size="sm"
                    variant="outline"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(stat.id)}
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
