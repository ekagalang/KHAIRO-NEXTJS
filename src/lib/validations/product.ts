import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .min(3, "Nama produk minimal 3 karakter")
    .max(200, "Nama produk maksimal 200 karakter"),

  slug: z
    .string()
    .min(3, "Slug minimal 3 karakter")
    .max(200, "Slug maksimal 200 karakter")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung (-)"
    ),

  description: z
    .string()
    .min(10, "Deskripsi minimal 10 karakter")
    .max(5000, "Deskripsi maksimal 5000 karakter"),

  price: z
    .number({
      message: "Harga harus berupa angka",
    })
    .positive("Harga harus lebih dari 0")
    .or(z.string().regex(/^\d+$/).transform(Number)),

  discountPrice: z
    .number()
    .positive("Harga diskon harus lebih dari 0")
    .optional()
    .nullable()
    .or(z.string().regex(/^\d+$/).transform(Number).optional()),

  duration: z
    .string()
    .min(1, "Durasi wajib diisi")
    .max(100, "Durasi maksimal 100 karakter"),

  type: z.enum(["Umroh", "Haji", "Wisata Religi", "Tour Domestik"], {
    message: "Tipe produk wajib dipilih",
  }),

  departure: z
    .string()
    .min(1, "Tanggal keberangkatan wajib diisi")
    .or(z.date()),

  quota: z
    .number({
      message: "Kuota harus berupa angka",
    })
    .int("Kuota harus berupa bilangan bulat")
    .nonnegative("Kuota tidak boleh negatif")
    .or(z.string().regex(/^\d+$/).transform(Number)),

  quotaFilled: z
    .number()
    .int("Kuota terisi harus berupa bilangan bulat")
    .nonnegative("Kuota terisi tidak boleh negatif")
    .default(0)
    .or(z.string().regex(/^\d+$/).transform(Number)),

  features: z
    .array(z.string())
    .min(1, "Minimal satu fasilitas harus diisi")
    .default([]),

  itinerary: z
    .array(
      z.object({
        day: z.number().int().positive(),
        title: z.string().min(1, "Judul itinerary wajib diisi"),
        description: z.string().min(1, "Deskripsi itinerary wajib diisi"),
      })
    )
    .default([]),

  images: z
    .string()
    .optional()
    .default(""),

  isActive: z
    .boolean()
    .default(true),

  isFeatured: z
    .boolean()
    .default(false),
});

export type ProductFormData = z.infer<typeof productSchema>;

// Validation for updating product (all fields optional except id)
export const updateProductSchema = productSchema.partial().extend({
  id: z.string().min(1, "ID produk wajib diisi"),
});

export type UpdateProductFormData = z.infer<typeof updateProductSchema>;
