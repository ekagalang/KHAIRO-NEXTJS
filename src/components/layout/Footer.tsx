"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Youtube,
} from "lucide-react";

interface FooterLink {
  label: string;
  href: string;
  order: number;
}

interface SocialMedia {
  platform: string;
  url: string;
  icon: string;
}

export function Footer() {
  const [settings, setSettings] = useState<any>({});
  const [footerLinks, setFooterLinks] = useState<FooterLink[]>([]);
  const [socialMedia, setSocialMedia] = useState<SocialMedia[]>([]);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings");
      const data = await response.json();
      setSettings(data);

      // Parse footer links
      if (data.footer_links) {
        try {
          const links = JSON.parse(data.footer_links);
          setFooterLinks(
            links.sort((a: FooterLink, b: FooterLink) => a.order - b.order)
          );
        } catch (e) {
          console.error("Error parsing footer links:", e);
        }
      }

      // Parse social media
      if (data.footer_social_media) {
        try {
          const social = JSON.parse(data.footer_social_media);
          setSocialMedia(social);
        } catch (e) {
          console.error("Error parsing social media:", e);
        }
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const getSocialIcon = (iconName: string) => {
    const icons: any = {
      Facebook,
      Instagram,
      Youtube,
    };
    return icons[iconName] || Facebook;
  };

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div>
                <h3 className="font-bold text-lg">
                  {settings.site_name || "Khairo Tour"}
                </h3>
                <p className="text-sm text-gray-400">Haji & Umroh</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              {settings.footer_about ||
                "Melayani perjalanan ibadah haji dan umroh dengan penuh amanah dan profesional."}
            </p>

            {/* Social Media */}
            {socialMedia.length > 0 && (
              <div className="flex gap-3 mt-4">
                {socialMedia.map((social, index) => {
                  const Icon = getSocialIcon(social.icon);
                  return (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
                      aria-label={social.platform}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Tautan Cepat</h4>
            <ul className="space-y-2 text-sm">
              {footerLinks.length > 0 ? (
                footerLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li>
                    <Link
                      href="/products"
                      className="text-gray-400 hover:text-primary transition-colors"
                    >
                      Produk
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/gallery"
                      className="text-gray-400 hover:text-primary transition-colors"
                    >
                      Galeri
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4">Hubungi Kami</h4>
            <ul className="space-y-3 text-sm">
              {settings.site_phone && (
                <li className="flex items-start gap-2">
                  <Phone className="w-4 h-4 mt-1 flex-shrink-0 text-primary" />
                  <span className="text-gray-400">{settings.site_phone}</span>
                </li>
              )}
              {settings.site_email && (
                <li className="flex items-start gap-2">
                  <Mail className="w-4 h-4 mt-1 flex-shrink-0 text-primary" />
                  <span className="text-gray-400">{settings.site_email}</span>
                </li>
              )}
              {settings.footer_address && (
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-primary" />
                  <span className="text-gray-400 whitespace-pre-line">
                    {settings.footer_address}
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>
            ©{" "}
            {settings.footer_copyright ||
              `${new Date().getFullYear()} ${
                settings.site_name || "Khairo Tour"
              }. All rights reserved.`}
          </p>
        </div>
      </div>
    </footer>
  );
}
