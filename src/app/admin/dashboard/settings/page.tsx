"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { MediaPicker } from "@/components/admin/MediaPicker";
import Image from "next/image";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState({
    site_name: "",
    site_description: "",
    site_email: "",
    site_phone: "",
    whatsapp_number: "",
    site_logo: "",
    site_logo_admin: "",
    site_favicon: "",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/settings");
      const data = await response.json();
      setSettings({
        site_name: data.site_name || "",
        site_description: data.site_description || "",
        site_email: data.site_email || "",
        site_phone: data.site_phone || "",
        whatsapp_number: data.whatsapp_number || "",
        site_logo: data.site_logo || "",
        site_logo_admin: data.site_logo_admin || "",
        site_favicon: data.site_favicon || "",
      });
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Gagal memuat pengaturan");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Update each setting
      const updates = Object.entries(settings).map(([key, value]) =>
        fetch("/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key, value }),
        })
      );

      await Promise.all(updates);
      toast.success("Pengaturan berhasil disimpan");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Gagal menyimpan pengaturan");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          Pengaturan Website
        </h1>
        <p className="text-gray-600">
          Kelola informasi dan konfigurasi website
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Informasi Umum</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="site_name">Nama Website</Label>
              <Input
                id="site_name"
                value={settings.site_name}
                onChange={(e) =>
                  setSettings({ ...settings, site_name: e.target.value })
                }
                placeholder="Khairo Tour"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="site_description">Deskripsi Website</Label>
              <Textarea
                id="site_description"
                value={settings.site_description}
                onChange={(e) =>
                  setSettings({ ...settings, site_description: e.target.value })
                }
                placeholder="Layanan tour Haji dan Umroh terpercaya"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Informasi Kontak</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="site_email">Email</Label>
              <Input
                id="site_email"
                type="email"
                value={settings.site_email}
                onChange={(e) =>
                  setSettings({ ...settings, site_email: e.target.value })
                }
                placeholder="info@khairotour.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="site_phone">Nomor Telepon</Label>
              <Input
                id="site_phone"
                value={settings.site_phone}
                onChange={(e) =>
                  setSettings({ ...settings, site_phone: e.target.value })
                }
                placeholder="021-12345678"
              />
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="whatsapp_number">Nomor WhatsApp</Label>
                <Input
                  id="whatsapp_number"
                  value={settings.whatsapp_number}
                  onChange={(e) =>
                    setSettings({ ...settings, whatsapp_number: e.target.value })
                  }
                  placeholder="6281234567890"
                />
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Format: 62xxx (tanpa tanda +, untuk fitur checkout)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Logo & Branding */}
        <Card>
          <CardHeader>
            <CardTitle>Logo & Branding</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Logo Homepage */}
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Logo Homepage</Label>
                <MediaPicker
                  value={settings.site_logo}
                  onChange={(url) => setSettings({ ...settings, site_logo: url })}
                  accept="image/*"
                />
              </div>
              {settings.site_logo && (
                <div className="relative w-48 h-16 border rounded-lg overflow-hidden bg-white p-2">
                  <Image
                    src={settings.site_logo}
                    alt="Logo Homepage"
                    fill
                    className="object-contain"
                  />
                </div>
              )}
              <p className="text-xs text-gray-500 leading-relaxed">
                Logo yang ditampilkan di navbar homepage (Rekomendasi: PNG transparan, max 200x60px)
              </p>
            </div>

            {/* Logo Admin */}
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Logo Admin/CMS</Label>
                <MediaPicker
                  value={settings.site_logo_admin}
                  onChange={(url) => setSettings({ ...settings, site_logo_admin: url })}
                  accept="image/*"
                />
              </div>
              {settings.site_logo_admin && (
                <div className="relative w-48 h-16 border rounded-lg overflow-hidden bg-white p-2">
                  <Image
                    src={settings.site_logo_admin}
                    alt="Logo Admin"
                    fill
                    className="object-contain"
                  />
                </div>
              )}
              <p className="text-xs text-gray-500 leading-relaxed">
                Logo yang ditampilkan di sidebar admin (Rekomendasi: PNG transparan, max 200x60px)
              </p>
            </div>

            {/* Favicon */}
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Favicon</Label>
                <MediaPicker
                  value={settings.site_favicon}
                  onChange={(url) => setSettings({ ...settings, site_favicon: url })}
                  accept="image/*"
                />
              </div>
              {settings.site_favicon && (
                <div className="flex items-center gap-3">
                  <div className="relative w-8 h-8 border rounded overflow-hidden bg-white">
                    <Image
                      src={settings.site_favicon}
                      alt="Favicon"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="text-sm text-gray-600">Preview favicon (32x32px)</span>
                </div>
              )}
              <p className="text-xs text-gray-500 leading-relaxed">
                Icon yang muncul di tab browser (Rekomendasi: PNG/ICO, 32x32px atau 64x64px)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex gap-3">
          <Button
            type="submit"
            className="bg-primary hover:bg-primary/90 text-gray-800 font-semibold"
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Simpan Pengaturan
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
