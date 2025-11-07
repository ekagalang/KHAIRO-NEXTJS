Khairo Tour — Haji & Umroh App

Aplikasi katalog paket Haji & Umroh dengan keranjang belanja sederhana, dibuat dengan Next.js (App Router), Tailwind CSS v4, Prisma (MySQL), dan komponen UI berbasis shadcn.

**Fitur**
- Daftar paket (filter, pencarian), detail paket, dan keranjang belanja
- API berbasis App Router (`/app/api`) untuk produk dan settings
- Prisma + MySQL untuk data (User, Product, CartItem, dsb.)
- Tailwind CSS v4 (utility-first) dan shadcn/ui untuk komponen
- Dukungan gambar eksternal (Unsplash) di `next/image`
- Animasi halus untuk drawer keranjang

**Stack**
- Next.js 16 (App Router) — `next.config.ts:1`
- React 19 + TypeScript — `tsconfig.json:1`
- Tailwind CSS 4 — `src/app/globals.css:1`
- Prisma (MySQL) — `prisma/schema.prisma:1`
- shadcn/ui + lucide-react — `components.json:1`

**Persiapan**
- Node.js 18.18+ (disarankan Node 20 LTS)
- npm 9+ (atau pnpm/yarn jika diinginkan)
- MySQL server (lokal atau hosted)

**Setup Cepat (Local)**
1) Clone repo dan masuk folder
- `git clone <repo-url>`
- `cd khairo-tour`

2) Install dependencies
- `npm install`

3) Siapkan environment
- Buat file `.env` di root proyek (jika belum ada) dengan contoh berikut:
```
# Database MySQL
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/khairo_db"

# NextAuth (opsional jika nanti menambah auth)
NEXTAUTH_SECRET="please-change-this-secret"
NEXTAUTH_URL="http://localhost:3000"
```
- Ganti `USER`, `PASSWORD`, dan nama database sesuai mesin MySQL Anda.

4) Inisialisasi database
- Jalankan migrasi dan generate client:
  - `npx prisma migrate dev`
- Seed data awal (opsional):
  - `npm run prisma:seed`
- Cek data via Prisma Studio (opsional):
  - `npx prisma studio`

5) Jalankan aplikasi (development)
- `npm run dev`
- Buka `http://localhost:3000`

6) Build untuk production
- `npm run build`
- `npm start`

**Struktur Penting**
- App routes dan halaman
  - `src/app/page.tsx:1` — halaman katalog produk
  - `src/app/products/[id]/page.tsx:1` — halaman detail produk
  - `src/app/layout.tsx:1` — layout global + import `globals.css`

- API routes
  - `src/app/api/products/route.ts:1` — list produk (+filter)
  - `src/app/api/products/[id]/route.ts:1` — detail produk
  - (Opsi) `src/app/api/settings` — konfigurasi WhatsApp, dsb.

- UI & state
  - `src/components` — komponen UI (shadcn)
  - `src/components/cart/CartDrawer.tsx:1` — drawer keranjang + animasi
  - `src/components/product/ProductCard.tsx:1` — kartu produk
  - `src/components/layout/Navbar.tsx:1` — navbar + tombol keranjang
  - `src/contexts/CartContext.tsx:1` — state keranjang (localStorage)

- Styling
  - `src/app/globals.css:1` — Tailwind v4 `@import "tailwindcss";` + theme tokens

- Prisma
  - `prisma/schema.prisma:1` — schema (User, Product, CartItem, dsb.)
  - `prisma/seed.ts:1` — seed data awal

- Konfigurasi Next Image
  - `next.config.ts:1` — domain gambar eksternal (Unsplash) sudah diizinkan

**Catatan Penting**
- Tailwind v4: tidak membutuhkan file `tailwind.config.js` default. Utilities tersedia setelah `@import "tailwindcss";` di `globals.css`.
- React Compiler aktif di `next.config.ts` (`reactCompiler: true`).
- Jika menambah CDN gambar lain, tambahkan host ke `images.remotePatterns` di `next.config.ts`.

**Perintah Berguna**
- Development: `npm run dev`
- Lint: `npm run lint`
- Build: `npm run build`
- Start (prod): `npm start`
- Prisma migrate (dev): `npx prisma migrate dev`
- Prisma generate: `npx prisma generate`
- Prisma Studio: `npx prisma studio`
- Seed: `npm run prisma:seed`

**Troubleshooting**
- Tidak bisa konek DB (Prisma P1001)
  - Pastikan MySQL berjalan dan `DATABASE_URL` benar.
  - Coba `npx prisma db push` atau `npx prisma migrate dev` setelah membuat database.

- Gambar eksternal error (next/image unconfigured host)
  - Tambah domain di `next.config.ts` bagian `images.remotePatterns`.

- Styling/utility Tailwind tidak terapkan
  - Pastikan `src/app/globals.css` mengandung `@import "tailwindcss";` dan file tersebut di-import di `src/app/layout.tsx`.

- Nilai harga menjadi 0/NaN
  - Pastikan migrasi dan generate Prisma sudah dijalankan.
  - Cek nilai numerik di Prisma Studio; seed ulang jika perlu.
  - Hapus keranjang lama di localStorage jika struktur berubah: buka DevTools dan jalankan `localStorage.removeItem("cart")` lalu reload.

- Keranjang tidak muncul animasinya
  - Pastikan membuka dari tombol keranjang di navbar (`Navbar`), karena animasi dipicu saat prop `open` berubah.

**Lisensi**
Proyek ini untuk keperluan internal. Silakan sesuaikan lisensi sesuai kebutuhan Anda.
