import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";

export const metadata: Metadata = {
  title: "Galeri Foto Haji & Umroh | Khairo Tour",
  description:
    "Dokumentasi perjalanan ibadah haji dan umroh bersama Khairo Tour. Lihat galeri foto kegiatan dan momen berharga jamaah kami.",
  keywords:
    "galeri haji, foto umroh, dokumentasi haji, foto jamaah, kegiatan haji umroh",
  openGraph: {
    title: "Galeri Foto Haji & Umroh | Khairo Tour",
    description:
      "Dokumentasi perjalanan ibadah haji dan umroh bersama Khairo Tour",
    type: "website",
  },
};

export default function GalleryPage() {
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
              Galeri Dokumentasi
            </h1>
            <p className="text-gray-700">
              Momen berharga perjalanan ibadah jamaah Khairo Tour
            </p>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <GalleryGrid />
        </div>
      </div>
    </>
  );
}
