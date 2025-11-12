import { ProductForm } from "@/components/admin/ProductForm";
import { Card } from "@/components/ui/card";

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          Tambah Produk Baru
        </h1>
        <p className="text-gray-600">Buat paket tour haji atau umroh baru</p>
      </div>

      <ProductForm />
    </div>
  );
}
