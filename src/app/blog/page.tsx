import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { BlogList } from "@/components/blog/BlogList";

export const metadata: Metadata = {
  title: "Blog & Artikel Haji Umroh | Khairo Tour",
  description:
    "Tips, panduan, dan informasi lengkap seputar persiapan haji dan umroh. Baca artikel terbaru dari Khairo Tour.",
  keywords:
    "blog haji, artikel umroh, tips haji, panduan umroh, informasi haji, persiapan umroh",
  openGraph: {
    title: "Blog & Artikel Haji Umroh | Khairo Tour",
    description:
      "Tips, panduan, dan informasi lengkap seputar persiapan haji dan umroh",
    type: "website",
  },
};

export default function BlogListPage() {
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
              Blog & Artikel
            </h1>
            <p className="text-gray-700">
              Tips, panduan, dan informasi seputar haji dan umroh
            </p>
          </div>
        </div>

        {/* Blog List */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BlogList />
        </div>
      </div>
    </>
  );
}
