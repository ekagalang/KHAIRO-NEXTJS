"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, Users, Package, TrendingUp, TrendingDown } from "lucide-react";

interface VisitorStats {
  today: {
    pageViews: number;
    uniqueVisitors: number;
    productViews: number;
  };
  yesterday: {
    pageViews: number;
    uniqueVisitors: number;
    productViews: number;
  };
  growth: {
    pageViews: number;
    uniqueVisitors: number;
    productViews: number;
  };
  totals: {
    pageViews: number;
    uniqueVisitors: number;
    productViews: number;
    averagePerDay: {
      pageViews: number;
      uniqueVisitors: number;
      productViews: number;
    };
  };
}

export function VisitorStatsCard() {
  const [stats, setStats] = useState<VisitorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    fetchStats();
  }, [days]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/visitor/stats?days=${days}`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching visitor stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("id-ID").format(num);
  };

  const formatGrowth = (growth: number) => {
    const formatted = Math.abs(growth).toFixed(1);
    return growth >= 0 ? `+${formatted}%` : `-${formatted}%`;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-24 mb-2" />
              <Skeleton className="h-4 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          Gagal memuat statistik pengunjung
        </CardContent>
      </Card>
    );
  }

  const statCards = [
    {
      title: "Total Kunjungan",
      value: stats.today.pageViews,
      growth: stats.growth.pageViews,
      icon: Eye,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Pengunjung Unik",
      value: stats.today.uniqueVisitors,
      growth: stats.growth.uniqueVisitors,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Views Produk",
      value: stats.today.productViews,
      growth: stats.growth.productViews,
      icon: Package,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Period Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Statistik Pengunjung Hari Ini</h2>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="px-3 py-1 border rounded-md text-sm"
        >
          <option value={7}>7 Hari Terakhir</option>
          <option value={30}>30 Hari Terakhir</option>
          <option value={90}>90 Hari Terakhir</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const isPositive = stat.growth >= 0;
          const TrendIcon = isPositive ? TrendingUp : TrendingDown;

          return (
            <Card key={index}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-full ${stat.bgColor}`}>
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">
                  {formatNumber(stat.value)}
                </div>
                <div className="flex items-center text-sm">
                  <TrendIcon
                    className={`w-4 h-4 mr-1 ${
                      isPositive ? "text-green-600" : "text-red-600"
                    }`}
                  />
                  <span
                    className={
                      isPositive ? "text-green-600" : "text-red-600"
                    }
                  >
                    {formatGrowth(stat.growth)}
                  </span>
                  <span className="text-gray-500 ml-1">vs kemarin</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Ringkasan {days} Hari Terakhir
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Kunjungan</p>
              <p className="text-2xl font-bold">
                {formatNumber(stats.totals.pageViews)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Rata-rata: {formatNumber(stats.totals.averagePerDay.pageViews)}/hari
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Pengunjung Unik</p>
              <p className="text-2xl font-bold">
                {formatNumber(stats.totals.uniqueVisitors)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Rata-rata: {formatNumber(stats.totals.averagePerDay.uniqueVisitors)}/hari
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Views Produk</p>
              <p className="text-2xl font-bold">
                {formatNumber(stats.totals.productViews)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Rata-rata: {formatNumber(stats.totals.averagePerDay.productViews)}/hari
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
