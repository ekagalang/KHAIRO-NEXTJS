"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, ExternalLink, Save, X } from "lucide-react";
import Image from "next/image";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { toast } from "sonner";

interface Partner {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PartnerSection {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
}

export function PartnersSection() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [sectionSettings, setSectionSettings] = useState<PartnerSection | null>(null);
  const [sectionForm, setSectionForm] = useState({
    title: "Rekanan Kami",
    description: "Dipercaya oleh partner terbaik",
    isActive: true,
  });
  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    logoUrl: "",
    websiteUrl: "",
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchPartners();
    fetchSectionSettings();
  }, []);

  const fetchPartners = async () => {
    try {
      const response = await fetch("/api/admin/partners");
      const data = await response.json();
      if (data.success) {
        setPartners(data.data);
      }
    } catch (error) {
      console.error("Error fetching partners:", error);
      toast.error("Gagal memuat data partners");
    } finally {
      setLoading(false);
    }
  };

  const fetchSectionSettings = async () => {
    try {
      const response = await fetch("/api/admin/partner-section");
      if (response.ok) {
        const data = await response.json();
        setSectionSettings(data);
        setSectionForm({
          title: data.title,
          description: data.description,
          isActive: data.isActive,
        });
      }
    } catch (error) {
      console.error("Error fetching section settings:", error);
    }
  };

  const handleSectionSave = async () => {
    setSavingSection(true);
    try {
      const response = await fetch("/api/admin/partner-section", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sectionForm),
      });

      if (response.ok) {
        const data = await response.json();
        setSectionSettings(data);
        toast.success("Pengaturan section berhasil disimpan!");
      } else {
        toast.error("Gagal menyimpan pengaturan section");
      }
    } catch (error) {
      console.error("Error saving section settings:", error);
      toast.error("Gagal menyimpan pengaturan section");
    } finally {
      setSavingSection(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = "/api/admin/partners";
      const method = editingPartner ? "PUT" : "POST";
      const body = editingPartner
        ? { id: editingPartner.id, ...formData }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(
          editingPartner
            ? "Partner berhasil diupdate!"
            : "Partner berhasil ditambahkan!"
        );
        setShowForm(false);
        setEditingPartner(null);
        setFormData({
          name: "",
          logoUrl: "",
          websiteUrl: "",
          order: 0,
          isActive: true,
        });
        fetchPartners();
      } else {
        toast.error("Error: " + data.error);
      }
    } catch (error) {
      console.error("Error saving partner:", error);
      toast.error("Gagal menyimpan partner");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus partner ini?")) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/partners?id=${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Partner berhasil dihapus!");
        fetchPartners();
      } else {
        toast.error("Error: " + data.error);
      }
    } catch (error) {
      console.error("Error deleting partner:", error);
      toast.error("Gagal menghapus partner");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (partner: Partner) => {
    setEditingPartner(partner);
    setFormData({
      name: partner.name,
      logoUrl: partner.logoUrl,
      websiteUrl: partner.websiteUrl || "",
      order: partner.order,
      isActive: partner.isActive,
    });
    setShowForm(true);
  };

  const cancelEdit = () => {
    setShowForm(false);
    setEditingPartner(null);
    setFormData({
      name: "",
      logoUrl: "",
      websiteUrl: "",
      order: 0,
      isActive: true,
    });
  };

  return (
    <div className="space-y-6">
      {/* Section Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Pengaturan Section Rekanan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Judul Section</Label>
              <Input
                value={sectionForm.title}
                onChange={(e) =>
                  setSectionForm({ ...sectionForm, title: e.target.value })
                }
                placeholder="Rekanan Kami"
              />
            </div>

            <div>
              <Label>Deskripsi Section</Label>
              <Input
                value={sectionForm.description}
                onChange={(e) =>
                  setSectionForm({ ...sectionForm, description: e.target.value })
                }
                placeholder="Dipercaya oleh partner terbaik"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="sectionActive"
                checked={sectionForm.isActive}
                onChange={(e) =>
                  setSectionForm({ ...sectionForm, isActive: e.target.checked })
                }
                className="w-4 h-4"
              />
              <Label htmlFor="sectionActive">
                Tampilkan Section di Homepage
              </Label>
            </div>

            <Button onClick={handleSectionSave} disabled={savingSection}>
              {savingSection ? "Menyimpan..." : "Simpan Pengaturan"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Partners Management */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Kelola Rekanan</CardTitle>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2"
              size="sm"
            >
              {showForm ? (
                <>
                  <X className="w-4 h-4" />
                  Tutup Form
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Tambah Partner
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showForm && (
            <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <h3 className="font-semibold text-lg mb-4">
                {editingPartner ? "Edit Partner" : "Tambah Partner Baru"}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Nama Partner *</Label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Masukkan nama partner"
                  />
                </div>

                <div>
                  <MediaPicker
                    label="Logo Partner *"
                    value={formData.logoUrl}
                    onChange={(url) => setFormData({ ...formData, logoUrl: url })}
                  />
                </div>

                <div>
                  <Label>Website URL (Optional)</Label>
                  <Input
                    type="url"
                    value={formData.websiteUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, websiteUrl: e.target.value })
                    }
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <Label>Urutan</Label>
                  <Input
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        order: parseInt(e.target.value),
                      })
                    }
                    placeholder="0"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="w-4 h-4"
                  />
                  <Label htmlFor="isActive">Aktif</Label>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
                    <Save className="w-4 h-4 mr-2" />
                    {loading
                      ? "Menyimpan..."
                      : editingPartner
                      ? "Update Partner"
                      : "Tambah Partner"}
                  </Button>
                  {editingPartner && (
                    <Button type="button" variant="outline" onClick={cancelEdit}>
                      <X className="w-4 h-4 mr-2" />
                      Batal
                    </Button>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* Partners List */}
          {loading && partners.length === 0 ? (
            <div className="text-center py-8">Loading...</div>
          ) : partners.length === 0 ? (
            <div className="text-center text-gray-500 py-8">Belum ada partner</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {partners.map((partner) => (
                <div
                  key={partner.id}
                  className="p-4 border rounded-lg bg-gray-50"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">
                        {partner.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Urutan: {partner.order}
                      </p>
                      <span
                        className={`inline-block text-xs px-2 py-1 rounded mt-2 ${
                          partner.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {partner.isActive ? "Aktif" : "Nonaktif"}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(partner)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(partner.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="relative h-24 bg-white rounded-lg mb-3 flex items-center justify-center p-4">
                    <Image
                      src={partner.logoUrl}
                      alt={partner.name}
                      fill
                      className="object-contain"
                    />
                  </div>

                  {partner.websiteUrl && (
                    <a
                      href={partner.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Kunjungi Website
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
