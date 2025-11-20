'use client';

import { useEffect, useState } from 'react';
import {
  MessageCircle,
  Instagram,
  Facebook,
  Phone,
  Mail,
  Twitter,
  Linkedin,
  Youtube,
  Globe,
  LucideIcon,
} from 'lucide-react';

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

const iconMap: Record<string, LucideIcon> = {
  MessageCircle,
  Instagram,
  Facebook,
  Phone,
  Mail,
  Twitter,
  Linkedin,
  Youtube,
  Globe,
};

const FloatingSocialButtons = () => {
  const [socialMedia, setSocialMedia] = useState<SocialMedia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSocialMedia = async () => {
      try {
        const response = await fetch('/api/social-media');
        if (response.ok) {
          const data = await response.json();
          setSocialMedia(data);
        }
      } catch (error) {
        console.error('Failed to fetch social media:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSocialMedia();
  }, []);

  if (loading || socialMedia.length === 0) {
    return null;
  }

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
      {socialMedia.map((social) => {
        const Icon = iconMap[social.icon] || Globe;
        return (
          <a
            key={social.id}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${social.bgColor} hover:${social.hoverColor} p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl group`}
            aria-label={social.name}
          >
            <Icon className="w-6 h-6 text-white" />
            <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              {social.name}
            </span>
          </a>
        );
      })}
    </div>
  );
};

export default FloatingSocialButtons;
