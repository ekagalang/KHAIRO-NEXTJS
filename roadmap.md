# 🗺️ ROADMAP IMPLEMENTASI KHAIRO TOUR

## 📋 OVERVIEW

Dokumen ini berisi roadmap lengkap untuk improvement dan penambahan fitur.
**Estimasi Total: 3-5 hari**

---

## 🔴 FASE 1: CRITICAL FIXES (Prioritas Tinggi - 1 Hari)

**Status: Ready to implement**

### 1.1 Product Detail SEO Meta Tags

- [ ] Ubah `src/app/products/[slug]/page.tsx` menjadi Server Component
- [ ] Tambahkan `generateMetadata()` function
- [ ] Buat Client Component terpisah untuk interaktivitas
- [ ] Test SEO dengan tools (Google Rich Results, Facebook Debugger)

**Files affected:**

- `src/app/products/[slug]/page.tsx` (refactor)
- `src/app/products/[slug]/ProductDetailClient.tsx` (new)

### 1.2 Error Handling Improvement

- [ ] Tambahkan try-catch di semua API routes
- [ ] Buat custom error responses dengan status codes yang tepat
- [ ] Tambahkan error boundaries di client components
- [ ] Logging errors untuk monitoring

**Files affected:**

- `src/app/api/products/route.ts`
- `src/app/api/products/[id]/route.ts`
- `src/app/api/products/slug/[slug]/route.ts`
- `src/components/ErrorBoundary.tsx` (new)

### 1.3 Image Optimization

- [ ] Implementasi Next.js Image component di semua tempat
- [ ] Setup proper image sizes & responsive images
- [ ] Add loading="lazy" dan blur placeholder
- [ ] Optimize external image domains

**Files affected:**

- `src/components/product/ProductCard.tsx`
- `src/app/products/[slug]/page.tsx`
- `next.config.ts`

### 1.4 Analytics Visitor Website

- [ ] Integrasi Google Analytics 4
- [ ] Setup event tracking (page views, cart actions, checkout)
- [ ] Tambahkan visitor counter di admin dashboard
- [ ] Create analytics API endpoint untuk stats

**Files affected:**

- `src/app/layout.tsx` (add GA script)
- `src/lib/analytics.ts` (new)
- `src/app/api/analytics/route.ts` (new)
- `src/app/admin/dashboard/page.tsx` (show stats)

---

## 🟡 FASE 2: MEDIUM IMPROVEMENTS (Nice to Have - 1-2 Hari)

### 2.1 Loading States Enhancement

- [ ] Skeleton loaders untuk product cards
- [ ] Loading spinner yang lebih smooth
- [ ] Suspense boundaries untuk React 18
- [ ] Loading states untuk form submissions

**Files affected:**

- `src/components/ui/skeleton.tsx` (new)
- `src/components/product/ProductCardSkeleton.tsx` (new)
- All pages with data fetching

### 2.2 Form Validation dengan Zod

- [ ] Install & setup Zod + React Hook Form
- [ ] Buat validation schemas
- [ ] Update ProductForm dengan validasi
- [ ] Add real-time validation feedback

**Files affected:**

- `package.json` (add dependencies)
- `src/lib/validations/product.ts` (new)
- `src/components/admin/ProductForm.tsx`

### 2.3 Better Empty States

- [ ] Design empty state components
- [ ] Add illustrations atau icons
- [ ] Actionable CTAs untuk empty states
- [ ] Implement di semua list pages

**Files affected:**

- `src/components/ui/empty-state.tsx` (new)
- `src/app/page.tsx`
- `src/app/admin/dashboard/products/page.tsx`

### 2.4 Enhanced Toast Notifications

- [ ] Add icons ke notifications
- [ ] Different toast types (success, error, warning, info)
- [ ] Action buttons di toast
- [ ] Toast positioning options

**Files affected:**

- Toast sudah ada (sonner), tinggal customize usage

---

## 🟢 FASE 3: MINOR ENHANCEMENTS (Optional - 1-2 Hari)

### 3.1 Product Image Upload

- [ ] Setup upload endpoint (local/cloud)
- [ ] Implement image upload di ProductForm
- [ ] Image preview & crop functionality
- [ ] Multiple image upload support

**Files affected:**

- `src/app/api/upload/route.ts` (new)
- `src/components/admin/ImageUpload.tsx` (new)
- `src/components/admin/ProductForm.tsx`

### 3.2 Breadcrumbs Navigation

- [ ] Create Breadcrumb component
- [ ] Add to product detail page
- [ ] Add to all nested pages
- [ ] Schema.org breadcrumb markup

**Files affected:**

- `src/components/ui/breadcrumb.tsx` (new)
- `src/app/products/[slug]/page.tsx`

### 3.3 Search Debouncing

- [ ] Implement useDebounce hook
- [ ] Apply to product search
- [ ] Add loading indicator saat search
- [ ] Cache search results

**Files affected:**

- `src/hooks/useDebounce.ts` (new)
- `src/app/page.tsx`

---

## 📦 DEPENDENCIES YANG PERLU DITAMBAH

```json
{
  "zod": "^3.22.4",
  "react-hook-form": "^7.49.2",
  "@hookform/resolvers": "^3.3.3",
  "use-debounce": "^10.0.0"
}
```

---

## 🎯 CARA PENGGUNAAN ROADMAP INI

1. **Pilih Fase**: Mulai dari Fase 1 (Critical)
2. **Request ke Claude**: "Buatkan kode untuk Fase 1.1" atau "Fase 1 lengkap"
3. **Copy-Paste**: Salin kode yang diberikan ke file yang sesuai
4. **Test**: Test setiap fitur sebelum lanjut ke fase berikutnya
5. **Commit**: Git commit per fase untuk tracking yang baik

---

## 📝 NOTES

- Setiap fase independen, bisa dikerjakan terpisah
- Fase 1 adalah prioritas tertinggi
- Fase 2 & 3 bisa di-skip jika waktu terbatas
- Backup project sebelum mulai implementasi

---

**Siap untuk mulai? Silakan request fase mana yang ingin dikerjakan terlebih dahulu!**
