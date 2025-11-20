# Setup Floating Social Media Buttons

Dokumentasi untuk mengatur floating social media buttons di website Khairo Tour.

## Fitur

- ✅ Tombol floating di sisi kanan website
- ✅ Hanya muncul di homepage visitor (tidak di halaman admin)
- ✅ Posisi fixed (tidak terpengaruh scroll)
- ✅ Customizable dari CMS Admin
- ✅ Support berbagai platform: WhatsApp, Instagram, Facebook, Phone, Email, Twitter, LinkedIn, YouTube

## Cara Mengatur

### 1. Login ke CMS Admin

Akses: `https://yourdomain.com/admin/login`

### 2. Buka Menu Social Media

Di sidebar admin, klik menu **"Social Media"**

### 3. Tambah/Edit Social Media

#### Menambah Social Media Baru:
1. Klik tombol **"Tambah Social Media"**
2. Isi form:
   - **Nama Platform**: Nama yang akan muncul saat hover (contoh: WhatsApp, Instagram)
   - **Icon**: Pilih icon yang sesuai dari dropdown
   - **URL / Link**: Masukkan URL atau nomor telepon
   - **Warna Background**: Pilih warna tombol
   - **Urutan**: Angka urutan tampilan (semakin kecil semakin atas)
   - **Aktif**: Centang untuk menampilkan tombol

#### Format URL:

**WhatsApp:**
```
https://wa.me/6281234567890
```
Ganti `6281234567890` dengan nomor WhatsApp Anda (gunakan format internasional tanpa +)

**Instagram:**
```
https://instagram.com/username
```
Ganti `username` dengan username Instagram Anda

**Facebook:**
```
https://facebook.com/pagename
```
Ganti `pagename` dengan nama halaman Facebook Anda

**Phone:**
```
tel:+6281234567890
```
Ganti dengan nomor telepon Anda (gunakan format internasional)

**Email:**
```
mailto:info@khairotour.com
```
Ganti dengan alamat email Anda

### 4. Mengedit Social Media

1. Klik icon **Edit (pensil)** pada baris social media yang ingin diubah
2. Ubah data yang diperlukan
3. Klik **"Simpan"**

### 5. Mengaktifkan/Menonaktifkan

- Klik badge **"Aktif"** atau **"Nonaktif"** untuk toggle status
- Hanya social media yang aktif yang akan ditampilkan di homepage

### 6. Menghapus Social Media

1. Klik icon **Hapus (tempat sampah)** pada baris yang ingin dihapus
2. Konfirmasi penghapusan

## Preview

Di halaman Social Media CMS, Anda bisa melihat preview tombol yang aktif di bagian bawah halaman.

## Lokasi Tampilan

Tombol floating social media **HANYA** muncul di:
- ✅ Homepage visitor (`/`)

Tombol **TIDAK** muncul di:
- ❌ Halaman admin (`/admin/*`)
- ❌ Halaman produk (`/products`)
- ❌ Halaman lainnya

Jika Anda ingin menampilkan di halaman lain, tambahkan komponen `<FloatingSocialButtons />` di halaman tersebut.

## Troubleshooting

### Tombol tidak muncul di homepage?
1. Pastikan ada minimal 1 social media yang statusnya **Aktif**
2. Cek apakah URL sudah benar
3. Refresh halaman homepage

### Warna tombol tidak sesuai?
Pilih kombinasi warna yang sesuai dari dropdown **Warna Background** di form.

### Tombol tidak bisa diklik?
Pastikan format URL sudah benar sesuai contoh di atas.

## Data Default

Saat pertama kali setup, sistem sudah menyediakan 4 tombol default:
1. WhatsApp (hijau)
2. Instagram (pink)
3. Facebook (biru)
4. Phone (teal)

Anda bisa mengubah URL/nomor di CMS Admin sesuai kebutuhan.

## Warna yang Tersedia

- Green (untuk WhatsApp)
- Pink (untuk Instagram)
- Blue (untuk Facebook)
- Teal (untuk Phone)
- Red (untuk YouTube)
- Sky (untuk Twitter)
- Indigo (untuk LinkedIn)
- Gray (untuk Email)

---

**Catatan**: Pastikan nomor WhatsApp dan nomor telepon menggunakan format internasional (contoh: 6281234567890 untuk Indonesia).
