'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Package, 
  Users, 
  ImageIcon,  // ← Ganti dari Image jadi ImageIcon
  FileText, 
  TrendingUp, 
  Calendar 
} from 'lucide-react'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    totalGallery: 0,
    totalBlogs: 0,
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [productsRes, galleryRes, blogsRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/gallery'),
        fetch('/api/blog'),
      ])

      const products = await productsRes.json()
      const gallery = await galleryRes.json()
      const blogs = await blogsRes.json()

      setStats({
        totalProducts: products.length || 0,
        activeProducts: products.filter((p: any) => p.isActive).length || 0,
        totalGallery: gallery.length || 0,
        totalBlogs: blogs.filter((b: any) => b.isPublished).length || 0,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const statCards = [
    {
      title: 'Total Produk',
      value: stats.totalProducts,
      subtitle: `${stats.activeProducts} aktif`,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Produk Aktif',
      value: stats.activeProducts,
      subtitle: 'Sedang ditampilkan',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Galeri',
      value: stats.totalGallery,
      subtitle: 'Total foto',
      icon: ImageIcon,  // ← Ubah di sini
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Blog Published',
      value: stats.totalBlogs,
      subtitle: 'Artikel aktif',
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600">
          Selamat datang di Admin Panel Khairo Tour
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-800 mb-1">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500">{stat.subtitle}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="/admin/dashboard/products/new"
              className="p-4 border-2 border-dashed rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-center"
            >
              <Package className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="font-semibold">Tambah Produk</p>
            </a>
            <a
              href="/admin/dashboard/gallery/new"
              className="p-4 border-2 border-dashed rounded-lg hover:border-secondary hover:bg-secondary/5 transition-colors text-center"
            >
              <ImageIcon className="w-8 h-8 mx-auto mb-2 text-secondary" />
              <p className="font-semibold">Upload Galeri</p>
            </a>
            <a
              href="/admin/dashboard/blog/new"
              className="p-4 border-2 border-dashed rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors text-center"
            >
              <FileText className="w-8 h-8 mx-auto mb-2 text-orange-500" />
              <p className="font-semibold">Tulis Blog</p>
            </a>
            <a
              href="/admin/dashboard/settings"
              className="p-4 border-2 border-dashed rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-center"
            >
              <Calendar className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <p className="font-semibold">Pengaturan</p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
