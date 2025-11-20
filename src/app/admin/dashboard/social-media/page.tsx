"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Eye,
  EyeOff,
  MessageCircle,
  Instagram,
  Facebook,
  Phone,
  Mail,
  Twitter,
  Linkedin,
  Youtube,
  Globe,
} from "lucide-react";

interface SocialMedia {
  id: string;
  name: string;
  icon: string;
  url: string;
  bgColor: string;
  hoverColor: string;
  order: number;
  isActive: boolean;
}

const iconOptions = [
  { value: "MessageCircle", label: "WhatsApp", Icon: MessageCircle },
  { value: "Instagram", label: "Instagram", Icon: Instagram },
  { value: "Facebook", label: "Facebook", Icon: Facebook },
  { value: "Phone", label: "Phone", Icon: Phone },
  { value: "Mail", label: "Email", Icon: Mail },
  { value: "Twitter", label: "Twitter/X", Icon: Twitter },
  { value: "Linkedin", label: "LinkedIn", Icon: Linkedin },
  { value: "Youtube", label: "YouTube", Icon: Youtube },
  { value: "Globe", label: "Website", Icon: Globe },
];

const colorOptions = [
  { bg: "bg-green-500", hover: "bg-green-600", label: "Green (WhatsApp)" },
  { bg: "bg-pink-500", hover: "bg-pink-600", label: "Pink (Instagram)" },
  { bg: "bg-blue-600", hover: "bg-blue-700", label: "Blue (Facebook)" },
  { bg: "bg-teal-500", hover: "bg-teal-600", label: "Teal (Phone)" },
  { bg: "bg-red-500", hover: "bg-red-600", label: "Red (YouTube)" },
  { bg: "bg-sky-500", hover: "bg-sky-600", label: "Sky (Twitter)" },
  { bg: "bg-indigo-600", hover: "bg-indigo-700", label: "Indigo (LinkedIn)" },
  { bg: "bg-gray-700", hover: "bg-gray-800", label: "Gray (Email)" },
];

export default function SocialMediaPage() {
  const [socialMedia, setSocialMedia] = useState<SocialMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    icon: "MessageCircle",
    url: "",
    bgColor: "bg-blue-500",
    hoverColor: "bg-blue-600",
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchSocialMedia();
  }, []);

  const fetchSocialMedia = async () => {
    try {
      const response = await fetch("/api/admin/social-media");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setSocialMedia(data);
    } catch (error) {
      toast.error("Gagal memuat data social media");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setIsCreating(true);
    setFormData({
      name: "",
      icon: "MessageCircle",
      url: "",
      bgColor: "bg-blue-500",
      hoverColor: "bg-blue-600",
      order: socialMedia.length,
      isActive: true,
    });
  };

  const handleEdit = (item: SocialMedia) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      icon: item.icon,
      url: item.url,
      bgColor: item.bgColor,
      hoverColor: item.hoverColor,
      order: item.order,
      isActive: item.isActive,
    });
  };

  const handleSave = async () => {
    try {
      if (!formData.name || !formData.url) {
        toast.error("Nama dan URL harus diisi");
        return;
      }

      if (isCreating) {
        const response = await fetch("/api/admin/social-media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error("Failed to create");
        toast.success("Social media berhasil ditambahkan");
      } else if (editingId) {
        const response = await fetch(`/api/admin/social-media/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error("Failed to update");
        toast.success("Social media berhasil diupdate");
      }

      setIsCreating(false);
      setEditingId(null);
      fetchSocialMedia();
    } catch (error) {
      toast.error("Gagal menyimpan data");
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus social media ini?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/social-media/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete");
      toast.success("Social media berhasil dihapus");
      fetchSocialMedia();
    } catch (error) {
      toast.error("Gagal menghapus social media");
      console.error(error);
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
  };

  const toggleActive = async (item: SocialMedia) => {
    try {
      const response = await fetch(`/api/admin/social-media/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...item, isActive: !item.isActive }),
      });

      if (!response.ok) throw new Error("Failed to update");
      toast.success(
        `Social media ${!item.isActive ? "diaktifkan" : "dinonaktifkan"}`
      );
      fetchSocialMedia();
    } catch (error) {
      toast.error("Gagal mengubah status");
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Kelola Social Media
          </h1>
          <p className="text-gray-600 mt-1">
            Atur tombol floating social media di homepage
          </p>
        </div>
        {!isCreating && !editingId && (
          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Tambah Social Media
          </button>
        )}
      </div>

      {/* Form Create/Edit */}
      {(isCreating || editingId) && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-2 border-blue-200">
          <h2 className="text-xl font-semibold mb-4">
            {isCreating ? "Tambah Social Media Baru" : "Edit Social Media"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Platform
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="WhatsApp, Instagram, dll"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icon
              </label>
              <select
                value={formData.icon}
                onChange={(e) =>
                  setFormData({ ...formData, icon: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {iconOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL / Link
              </label>
              <input
                type="text"
                value={formData.url}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://wa.me/628xxx atau https://instagram.com/xxx"
              />
              <p className="text-sm text-gray-500 mt-1">
                Contoh: https://wa.me/6281234567890, https://instagram.com/username, tel:+6281234567890
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Warna Background
              </label>
              <select
                value={formData.bgColor}
                onChange={(e) => {
                  const selectedColor = colorOptions.find(
                    (c) => c.bg === e.target.value
                  );
                  setFormData({
                    ...formData,
                    bgColor: e.target.value,
                    hoverColor: selectedColor?.hover || e.target.value,
                  });
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {colorOptions.map((option) => (
                  <option key={option.bg} value={option.bg}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Urutan
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) =>
                  setFormData({ ...formData, order: parseInt(e.target.value) })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              Simpan
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
            >
              <X className="w-5 h-5" />
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Platform
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                URL
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Warna
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Urutan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {socialMedia.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  Belum ada data social media. Klik tombol &quot;Tambah Social
                  Media&quot; untuk menambahkan.
                </td>
              </tr>
            ) : (
              socialMedia.map((item) => {
                const IconComponent =
                  iconOptions.find((opt) => opt.value === item.icon)?.Icon ||
                  Globe;
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div
                          className={`${item.bgColor} p-2 rounded-full text-white`}
                        >
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <span className="font-medium text-gray-900">
                          {item.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm truncate block max-w-xs"
                      >
                        {item.url}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <div className={`${item.bgColor} w-8 h-8 rounded`}></div>
                        <div
                          className={`${item.hoverColor} w-8 h-8 rounded`}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.order}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleActive(item)}
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                          item.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {item.isActive ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                        {item.isActive ? "Aktif" : "Nonaktif"}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Preview */}
      {socialMedia.filter((item) => item.isActive).length > 0 && (
        <div className="mt-6 bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Preview Floating Buttons (Hanya yang aktif yang ditampilkan)
          </h3>
          <div className="flex gap-3 flex-wrap">
            {socialMedia
              .filter((item) => item.isActive)
              .map((item) => {
                const IconComponent =
                  iconOptions.find((opt) => opt.value === item.icon)?.Icon ||
                  Globe;
                return (
                  <div
                    key={item.id}
                    className={`${item.bgColor} hover:${item.hoverColor} p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110`}
                  >
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
