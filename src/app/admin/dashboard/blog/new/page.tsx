import { BlogForm } from "@/components/admin/BlogForm";

export default function NewBlogPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          Tulis Artikel Baru
        </h1>
        <p className="text-gray-600">Buat artikel blog dengan SEO-friendly</p>
      </div>

      <BlogForm />
    </div>
  );
}
