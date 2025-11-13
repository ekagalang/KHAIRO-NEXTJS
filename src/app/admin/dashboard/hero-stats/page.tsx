"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Eye, EyeOff, GripVertical } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface HeroStat {
  id: string;
  label: string;
  value: string;
  suffix: string | null;
  icon: string | null;
  order: number;
  isActive: boolean;
}

export default function HeroStatsPage() {
  const [stats, setStats] = useState<HeroStat[]>([]);
  const [loading, setLoading] = useState(true);

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

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const stat = stats.find((s) => s.id === id);
      if (!stat) return;

      const response = await fetch(`/api/admin/hero-stats/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...stat,
          isActive: !currentStatus,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(
          `Hero stat ${!currentStatus ? "diaktifkan" : "dinonaktifkan"}`
        );
        fetchStats();
      } else {
        toast.error(data.message || "Gagal mengubah status hero stat");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan");
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Hero Stats</h1>
          <p className="text-muted-foreground mt-1">
            Kelola statistik yang ditampilkan di hero section
          </p>
        </div>
        <Link href="/admin/dashboard/hero-stats/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Stat Baru
          </Button>
        </Link>
      </div>

      {/* Stats List */}
      <div className="bg-white rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Label
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Suffix
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Icon
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {stats.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="text-muted-foreground">
                      Belum ada hero stats. Klik tombol "Tambah Stat Baru" untuk
                      memulai.
                    </div>
                  </td>
                </tr>
              ) : (
                stats.map((stat) => (
                  <tr key={stat.id} className="hover:bg-muted/10">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{stat.order}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium">{stat.label}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-2xl font-bold text-primary">
                        {stat.value}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-muted-foreground">
                        {stat.suffix || "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-muted-foreground">
                        {stat.icon || "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleActive(stat.id, stat.isActive)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          stat.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {stat.isActive ? (
                          <>
                            <Eye className="w-3 h-3 mr-1" />
                            Aktif
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3 mr-1" />
                            Nonaktif
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/dashboard/hero-stats/${stat.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(stat.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
