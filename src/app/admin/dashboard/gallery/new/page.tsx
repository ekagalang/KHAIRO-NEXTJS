import { GalleryForm } from "@/components/admin/GalleryForm";

export default function NewGalleryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          Upload Foto Baru
        </h1>
        <p className="text-gray-600">
          Tambahkan foto dokumentasi kegiatan ke galeri
        </p>
      </div>

      <GalleryForm />
    </div>
  );
}
