"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, GripVertical } from "lucide-react";

interface FooterLink {
  label: string;
  href: string;
  order: number;
}

interface FooterSectionProps {
  footerAbout: string;
  footerLinks: string;
  footerSocialMedia: string;
  footerAddress: string;
  footerCopyright: string;
  onChange: (key: string, value: string) => void;
}

export function FooterSection({
  footerAbout,
  footerLinks,
  footerSocialMedia,
  footerAddress,
  footerCopyright,
  onChange,
}: FooterSectionProps) {
  const [links, setLinks] = useState<FooterLink[]>(() => {
    try {
      return JSON.parse(footerLinks || "[]");
    } catch {
      return [];
    }
  });

  const [socialMedia, setSocialMedia] = useState(() => {
    try {
      return JSON.parse(footerSocialMedia || "[]");
    } catch {
      return [];
    }
  });

  const updateLinks = (newLinks: FooterLink[]) => {
    setLinks(newLinks);
    onChange("footer_links", JSON.stringify(newLinks));
  };

  const updateSocialMedia = (newSocial: any[]) => {
    setSocialMedia(newSocial);
    onChange("footer_social_media", JSON.stringify(newSocial));
  };

  const addLink = () => {
    updateLinks([...links, { label: "", href: "", order: links.length + 1 }]);
  };

  const removeLink = (index: number) => {
    const newLinks = links.filter((_, i) => i !== index);
    // Reorder
    newLinks.forEach((link, i) => (link.order = i + 1));
    updateLinks(newLinks);
  };

  const updateLink = (index: number, field: string, value: string) => {
    const newLinks = [...links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    updateLinks(newLinks);
  };

  const addSocialMedia = () => {
    updateSocialMedia([...socialMedia, { platform: "", url: "", icon: "" }]);
  };

  const removeSocialMedia = (index: number) => {
    updateSocialMedia(socialMedia.filter((_: any, i: number) => i !== index));
  };

  const updateSocialMediaItem = (
    index: number,
    field: string,
    value: string
  ) => {
    const newSocial = [...socialMedia];
    newSocial[index] = { ...newSocial[index], [field]: value };
    updateSocialMedia(newSocial);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Footer Settings</CardTitle>
        <p className="text-sm text-gray-500 mt-1">
          Kelola konten footer website
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* About */}
        <div className="space-y-2">
          <Label>Tentang Kami (Footer)</Label>
          <Textarea
            value={footerAbout}
            onChange={(e) => onChange("footer_about", e.target.value)}
            placeholder="Melayani perjalanan ibadah..."
            rows={3}
          />
        </div>

        {/* Footer Links */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label>Tautan Footer</Label>
            <Button type="button" size="sm" variant="outline" onClick={addLink}>
              <Plus className="w-4 h-4 mr-1" />
              Tambah Link
            </Button>
          </div>
          <div className="space-y-2">
            {links.map((link, index) => (
              <div
                key={index}
                className="flex gap-2 items-start p-3 border rounded-lg"
              >
                <GripVertical className="w-5 h-5 text-gray-400 mt-2 cursor-move" />
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Label (misal: Paket Umroh)"
                    value={link.label}
                    onChange={(e) => updateLink(index, "label", e.target.value)}
                  />
                  <Input
                    placeholder="URL (misal: /products)"
                    value={link.href}
                    onChange={(e) => updateLink(index, "href", e.target.value)}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeLink(index)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            ))}
            {links.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                Belum ada tautan footer. Klik "Tambah Link" untuk menambahkan.
              </p>
            )}
          </div>
        </div>

        {/* Social Media */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label>Social Media</Label>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={addSocialMedia}
            >
              <Plus className="w-4 h-4 mr-1" />
              Tambah Social Media
            </Button>
          </div>
          <div className="space-y-2">
            {socialMedia.map((social: any, index: number) => (
              <div
                key={index}
                className="flex gap-2 items-start p-3 border rounded-lg"
              >
                <div className="flex-1 grid grid-cols-3 gap-2">
                  <Input
                    placeholder="Platform (Facebook)"
                    value={social.platform}
                    onChange={(e) =>
                      updateSocialMediaItem(index, "platform", e.target.value)
                    }
                  />
                  <Input
                    placeholder="URL"
                    value={social.url}
                    onChange={(e) =>
                      updateSocialMediaItem(index, "url", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Icon (Facebook)"
                    value={social.icon}
                    onChange={(e) =>
                      updateSocialMediaItem(index, "icon", e.target.value)
                    }
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSocialMedia(index)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            ))}
            {socialMedia.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                Belum ada social media. Klik "Tambah Social Media".
              </p>
            )}
          </div>
          <p className="text-xs text-gray-500">
            Icon yang tersedia: Facebook, Instagram, Youtube
          </p>
        </div>

        {/* Address */}
        <div className="space-y-2">
          <Label>Alamat Kantor</Label>
          <Textarea
            value={footerAddress}
            onChange={(e) => onChange("footer_address", e.target.value)}
            placeholder="Jl. Contoh No. 123&#10;Jakarta, Indonesia"
            rows={2}
          />
          <p className="text-xs text-gray-500">
            Gunakan Enter untuk baris baru
          </p>
        </div>

        {/* Copyright */}
        <div className="space-y-2">
          <Label>Copyright Text</Label>
          <Input
            value={footerCopyright}
            onChange={(e) => onChange("footer_copyright", e.target.value)}
            placeholder="2024 Khairo Tour. All rights reserved."
          />
        </div>
      </CardContent>
    </Card>
  );
}
