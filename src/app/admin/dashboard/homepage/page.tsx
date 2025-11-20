"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Plus, Edit, Trash2, Star } from "lucide-react";
import { IconPicker } from "@/components/admin/IconPicker";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { HeroButtonsSection } from "@/components/admin/HeroButtonsSection";
import { HeroStatsSection } from "@/components/admin/HeroStatsSection";
import { PartnersSection } from "@/components/admin/PartnersSection";

export default function HomepageEditor() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Hero Section
  const [hero, setHero] = useState<any>(null);
  const [heroForm, setHeroForm] = useState({
    id: "",
    title: "",
    subtitle: "",
    description: "",
    buttonText: "Lihat Paket",
    buttonLink: "/products",
    imageUrl: "",
    backgroundUrl: "",
  });

  // Why Choose Us
  const [whyChooseUs, setWhyChooseUs] = useState<any[]>([]);
  const [whyForm, setWhyForm] = useState({
    id: "",
    icon: "CheckCircle",
    title: "",
    description: "",
    order: 0,
  });
  const [showWhyForm, setShowWhyForm] = useState(false);

  // Testimonials
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [testimonialForm, setTestimonialForm] = useState({
    id: "",
    name: "",
    role: "",
    content: "",
    rating: 5,
    imageUrl: "",
    order: 0,
  });
  const [showTestimonialForm, setShowTestimonialForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [heroRes, whyRes, testimonialRes] = await Promise.all([
        fetch("/api/hero"),
        fetch("/api/why-choose-us"),
        fetch("/api/testimonials"),
      ]);

      const heroData = await heroRes.json();
      const whyData = await whyRes.json();
      const testimonialData = await testimonialRes.json();

      if (heroData.id) {
        setHero(heroData);
        setHeroForm(heroData);
      }
      setWhyChooseUs(whyData);
      setTestimonials(testimonialData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  const saveHero = async () => {
    try {
      setSaving(true);
      const method = hero?.id ? "PUT" : "POST";
      const response = await fetch("/api/hero", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(heroForm),
      });

      if (response.ok) {
        const savedHero = await response.json();
        console.log('Hero saved:', savedHero);
        toast.success("Hero section berhasil disimpan");

        // Update heroForm dengan data yang baru disimpan
        setHero(savedHero);
        setHeroForm(savedHero);

        await fetchData();
      } else {
        toast.error("Gagal menyimpan hero section");
      }
    } catch (error) {
      console.error('Error saving hero:', error);
      toast.error("Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  const saveWhyChooseUs = async () => {
    try {
      setSaving(true);
      const method = whyForm.id ? "PUT" : "POST";
      const url = whyForm.id ? `/api/why-choose-us/${whyForm.id}` : "/api/why-choose-us";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(whyForm),
      });

      if (response.ok) {
        toast.success("Berhasil disimpan");
        setShowWhyForm(false);
        setWhyForm({ id: "", icon: "CheckCircle", title: "", description: "", order: 0 });
        fetchData();
      } else {
        toast.error("Gagal menyimpan");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  const deleteWhyChooseUs = async (id: string) => {
    if (!confirm("Yakin ingin menghapus?")) return;

    try {
      const response = await fetch(`/api/why-choose-us/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Berhasil dihapus");
        fetchData();
      } else {
        toast.error("Gagal menghapus");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan");
    }
  };

  const saveTestimonial = async () => {
    try {
      setSaving(true);
      const method = testimonialForm.id ? "PUT" : "POST";
      const url = testimonialForm.id
        ? `/api/testimonials/${testimonialForm.id}`
        : "/api/testimonials";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testimonialForm),
      });

      if (response.ok) {
        toast.success("Testimoni berhasil disimpan");
        setShowTestimonialForm(false);
        setTestimonialForm({ id: "", name: "", role: "", content: "", rating: 5, imageUrl: "", order: 0 });
        fetchData();
      } else {
        toast.error("Gagal menyimpan testimoni");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm("Yakin ingin menghapus testimoni ini?")) return;

    try {
      const response = await fetch(`/api/testimonials/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Testimoni berhasil dihapus");
        fetchData();
      } else {
        toast.error("Gagal menghapus");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Edit Homepage</h1>
        <p className="text-gray-600">Kelola konten halaman utama website</p>
      </div>

      {/* Hero Section */}
      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Judul</Label>
            <Input
              value={heroForm.title}
              onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
              placeholder="Umroh & Haji Terpercaya"
            />
          </div>
          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Input
              value={heroForm.subtitle}
              onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
              placeholder="Berangkat Bersama Khairo Tour"
            />
          </div>
          <div className="space-y-2">
            <Label>Deskripsi</Label>
            <Textarea
              value={heroForm.description}
              onChange={(e) => setHeroForm({ ...heroForm, description: e.target.value })}
              placeholder="Deskripsi singkat..."
              rows={3}
            />
          </div>
          <div className="space-y-3">
            <MediaPicker
              label="Background Image/GIF (optional)"
              value={heroForm.backgroundUrl || ""}
              onChange={(url) => setHeroForm({ ...heroForm, backgroundUrl: url })}
            />
            <p className="text-xs text-gray-500 leading-relaxed">
              Upload atau pilih gambar/GIF untuk background hero section
            </p>
          </div>
          <Button onClick={saveHero} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Simpan Hero Section
          </Button>
        </CardContent>
      </Card>

      {/* Hero Buttons - Kelola Tombol */}
      {heroForm.id ? (
        <>
          <div className="text-xs text-gray-500 mb-2">Hero ID: {heroForm.id}</div>
          <HeroButtonsSection heroSectionId={heroForm.id} />
        </>
      ) : (
        <Card className="border-2 border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800">⚠️ Tombol Hero Section</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-orange-700 mb-4">
              Simpan Hero Section terlebih dahulu untuk mengelola tombol call-to-action.
            </p>
            <p className="text-sm text-orange-600">
              Klik tombol &quot;Simpan Hero Section&quot; di atas, lalu section tombol akan muncul di sini.
            </p>
            <p className="text-xs text-gray-500 mt-2">Debug: Hero ID = {heroForm.id || 'null'}</p>
          </CardContent>
        </Card>
      )}

      {/* Why Choose Us */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Mengapa Memilih Kami</CardTitle>
          <Button onClick={() => setShowWhyForm(!showWhyForm)} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Tambah
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {showWhyForm && (
            <Card className="bg-gray-50">
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Icon</Label>
                    <IconPicker
                      value={whyForm.icon}
                      onChange={(iconName) => setWhyForm({ ...whyForm, icon: iconName })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Urutan</Label>
                    <Input
                      type="number"
                      value={whyForm.order}
                      onChange={(e) => setWhyForm({ ...whyForm, order: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Judul</Label>
                  <Input
                    value={whyForm.title}
                    onChange={(e) => setWhyForm({ ...whyForm, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Deskripsi</Label>
                  <Textarea
                    value={whyForm.description}
                    onChange={(e) => setWhyForm({ ...whyForm, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={saveWhyChooseUs} disabled={saving}>
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Simpan
                  </Button>
                  <Button variant="outline" onClick={() => setShowWhyForm(false)}>
                    Batal
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-2">
            {whyChooseUs.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border rounded">
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <p className="text-xs text-gray-500 mt-1">Icon: {item.icon}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setWhyForm(item);
                      setShowWhyForm(true);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteWhyChooseUs(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Testimonials */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Testimoni</CardTitle>
          <Button onClick={() => setShowTestimonialForm(!showTestimonialForm)} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Testimoni
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {showTestimonialForm && (
            <Card className="bg-gray-50">
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nama</Label>
                    <Input
                      value={testimonialForm.name}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Role/Status</Label>
                    <Input
                      value={testimonialForm.role}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, role: e.target.value })}
                      placeholder="Jamaah Umroh 2024"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Testimoni</Label>
                  <Textarea
                    value={testimonialForm.content}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, content: e.target.value })}
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Rating (1-5)</Label>
                    <Input
                      type="number"
                      min="1"
                      max="5"
                      value={testimonialForm.rating}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, rating: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Urutan</Label>
                    <Input
                      type="number"
                      value={testimonialForm.order}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, order: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
                <div>
                  <MediaPicker
                    label="Foto (optional)"
                    value={testimonialForm.imageUrl || ""}
                    onChange={(url) => setTestimonialForm({ ...testimonialForm, imageUrl: url })}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={saveTestimonial} disabled={saving}>
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Simpan
                  </Button>
                  <Button variant="outline" onClick={() => setShowTestimonialForm(false)}>
                    Batal
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-2">
            {testimonials.map((item) => (
              <div key={item.id} className="flex items-start justify-between p-4 border rounded">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold">{item.name}</p>
                    <span className="text-xs text-gray-500">• {item.role}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{item.content}</p>
                  <div className="flex items-center gap-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setTestimonialForm(item);
                      setShowTestimonialForm(true);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteTestimonial(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Hero Stats Section */}
      <HeroStatsSection />

      {/* Partners Section */}
      <PartnersSection />
    </div>
  );
}
