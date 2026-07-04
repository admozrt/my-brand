# Panduan Instalasi & Deploy untuk UMKM Lain (GitHub + Cloudflare Pages)

Panduan ini untuk developer yang ingin memakai ulang codebase ini (`my-brand`) untuk **UMKM lain** — brand hijab, kuliner, kerajinan, atau kategori apa pun — dengan hosting gratis lewat GitHub + Cloudflare Pages.

**Prinsip dasar:** satu codebase, banyak deploy. Setiap UMKM punya **repo GitHub sendiri** dan **project Cloudflare Pages sendiri**, tapi kodenya sama persis. Yang beda cuma isi file seed (identitas brand & produk awal).

---

## 1. Prasyarat

- Akun [GitHub](https://github.com) (gratis)
- Akun [Cloudflare](https://dash.cloudflare.com/sign-up) (gratis, untuk Cloudflare Pages)
- [Node.js](https://nodejs.org) versi 20 ke atas terpasang di komputer
- Git terpasang (`git --version` untuk cek)

---

## 2. Langkah 1 — Duplikasi Project untuk Brand Baru

1. Download/clone project ini ke folder baru.
2. Hapus riwayat git lama supaya bersih untuk brand baru:
   ```bash
   rm -rf .git
   git init
   ```
3. Buat repo baru di GitHub khusus untuk UMKM tersebut (jangan pakai repo `admozrt/my-brand` yang sudah ada — itu untuk brand pertama).

---

## 3. Langkah 2 — Sesuaikan Identitas Brand di Seed

Semua identitas brand (nama, warna, kontak, produk awal) **bukan** di-hardcode di komponen React — semuanya berasal dari file seed di [seeds/fashion.seed.json](seeds/fashion.seed.json), yang dibaca oleh [src/lib/db/client.ts](src/lib/db/client.ts) hanya **sekali** saat pengunjung membuka situs untuk pertama kali (database browser mereka masih kosong).

Edit field-field berikut sesuai UMKM baru:

| Bagian | Field Penting | Catatan |
|---|---|---|
| `brand_profile` | `brand_id`, `brand_name`, `tagline` | `brand_id` cukup slug singkat, mis. `kuliner-sari-rasa` |
| | `business_category` | `fashion` \| `kuliner` \| `kerajinan` \| dst. |
| | `color_primary`, `color_secondary`, `color_accent`, `color_neutral_bg`, `color_neutral_text` | Format hex `#RRGGBB`. Hindari palet krem+coklat generik — pilih warna yang mencerminkan brand aslinya. |
| | `hero_headline`, `hero_subheadline`, `about_story` | Konten halaman Beranda & Tentang |
| | `primary_attribute_label`, `secondary_attribute_label`, `size_chart_enabled` | Sesuaikan kategori bisnis — contoh brand kuliner: `"Varian Rasa"` sebagai primary attribute, `size_chart_enabled: false` |
| | `whatsapp_number` | Format `62xxxxxxxxxx`, **tanpa** `+`, spasi, atau strip |
| | `whatsapp_message_template`, `instagram_url`, `tiktok_url`, `address`, `operating_hours` | Kontak & lokasi |
| `categories` | `name`, `slug` | Kategori produk untuk filter katalog |
| `products` | — | Array produk awal. Field `images` diisi URL foto (boleh link foto asli produk, atau placeholder sementara) |
| `promotions`, `testimonials` | — | Opsional, boleh dikosongkan `[]` di awal |

> Tips: kalau kategori bisnisnya jauh berbeda (mis. kuliner), boleh duplikasi file ini jadi `seeds/kuliner.seed.json` dan ubah baris import di [src/lib/db/client.ts](src/lib/db/client.ts):
> ```ts
> import fashionSeed from '../../../seeds/fashion.seed.json';
> ```
> ganti jadi `import brandSeed from '../../../seeds/kuliner.seed.json';` (dan sesuaikan nama variabel yang dipakai di bawahnya).

---

## 4. Langkah 3 — Uji Coba Lokal

```bash
npm install
npm run dev
```

Buka `http://localhost:5173`, cek:
- Beranda tampil sesuai identitas brand baru (nama, warna, foto, cerita brand)
- Katalog & detail produk
- Login ke `/admin` dengan password default **`admin123`**

**PENTING — ganti password admin sebelum go-live.** Edit konstanta `ADMIN_PASSWORD` di [src/lib/admin/useAdminAuth.ts:6](src/lib/admin/useAdminAuth.ts:6):

```ts
const ADMIN_PASSWORD = 'admin123'; // ganti dengan password unik brand ini
```

---

## 5. Langkah 4 — Push ke GitHub

```bash
git add .
git commit -m "Setup brand baru: <nama-umkm>"
git remote add origin https://github.com/<username>/<nama-repo-baru>.git
git branch -M main
git push -u origin main
```

`.gitignore` sudah menangani `node_modules` — tidak perlu dikhawatirkan.

---

## 6. Langkah 5 — Deploy ke Cloudflare Pages

1. Buka [Cloudflare Pages dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create application** → tab **Pages** → **Connect to Git**.
2. Pilih repo GitHub yang baru dibuat.
3. Isi konfigurasi build:
   | Setting | Nilai |
   |---|---|
   | Framework preset | Vite |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Environment variable (jika build gagal karena versi Node) | `NODE_VERSION` = `20` |
4. Klik **Save and Deploy**. Tunggu 1-2 menit, situs akan tersedia di domain `*.pages.dev`.
5. **(Opsional)** Hubungkan domain sendiri milik UMKM lewat tab **Custom domains** di project Cloudflare Pages tersebut.

Setiap kali ada `git push` ke branch `main`, Cloudflare Pages otomatis build & deploy ulang — tidak perlu langkah manual tambahan.

---

## 7. Langkah 6 — Alur Update Konten Sehari-hari (baca baik-baik)

Dashboard Admin (`/admin`) memungkinkan pemilik UMKM login dan mengubah produk, promo, testimoni, dan Pengaturan Brand (warna, logo, kontak) langsung dari browser, tanpa sentuh kode. **Tapi penting dipahami cara kerjanya:**

- Semua perubahan dari `/admin` tersimpan dulu di **database lokal browser admin sendiri** (IndexedDB), bukan di server pusat — karena aplikasi ini memang didesain tanpa backend (lihat PRD Section 6.1).
- Artinya: perubahan yang dibuat admin **belum otomatis tampil ke pengunjung lain** sampai admin mem-publish-nya lewat langkah di bawah.

**Cara mempublikasikan perubahan ke semua pengunjung:**
1. Login `/admin` → buka `/admin/export` → klik **Export Data**. File `data.sqlite` akan terunduh.
2. Simpan/timpa file itu sebagai `public/data.sqlite` di project (menggantikan versi lama kalau ada).
3. `git add public/data.sqlite`, `git commit`, `git push`.
4. Cloudflare Pages otomatis rebuild & deploy dalam 1-2 menit.

Begitu `public/data.sqlite` ter-deploy, aplikasi akan **otomatis membaca dan menyinkronkan data ini** setiap kali ada yang membuka atau me-refresh situs ([src/lib/db/client.ts](src/lib/db/client.ts)) — baik pengunjung baru maupun pengunjung yang sudah pernah membuka situs sebelumnya. Tidak perlu edit seed JSON manual lagi untuk update konten sehari-hari.

> **Untuk admin sendiri:** begitu kamu mulai mengedit sesuatu di `/admin` (tambah produk, ubah warna, dll.), browser kamu berhenti auto-sync dari `data.sqlite` yang ter-publish — supaya editan yang belum di-export tidak tiba-tiba tertimpa data lama. Sinkronisasi otomatis akan aktif lagi setelah kamu export ulang dan publish. Ini bukan bug; ini melindungi kerja kamu yang belum disimpan.

Seed JSON ([seeds/fashion.seed.json](seeds/fashion.seed.json)) tetap dipakai, tapi cuma untuk **provisioning brand baru** yang belum pernah punya `data.sqlite` sama sekali (lihat Langkah 2). Setelah `data.sqlite` pertama kali ter-publish, itu jadi satu-satunya sumber kebenaran.

---

## 8. Onboarding Brand Berikutnya

Untuk UMKM ketiga, keempat, dan seterusnya: ulangi dari **Langkah 1** dengan repo GitHub baru. Codebase yang dipakai tetap sama persis — cukup ganti isi seed dan deploy ke project Cloudflare Pages baru.

---

## 9. Troubleshooting

| Masalah | Penyebab & Solusi |
|---|---|
| Refresh halaman selain `/` (mis. `/katalog`) menampilkan 404 | Pastikan file [public/_redirects](public/_redirects) ada dan berisi `/*    /index.html   200`. File ini otomatis ikut ter-deploy karena semua isi `public/` disalin ke `dist/` saat build. |
| Warna/logo/konten tidak berubah setelah publish `data.sqlite` baru, padahal di browser lain sudah berubah | Kemungkinan browser ini sedang berstatus "dirty" karena pernah dipakai untuk edit di `/admin` (lihat catatan di Langkah 6) — auto-sync memang sengaja berhenti untuk melindungi editan yang belum di-export. Kalau memang mau paksa reset ke data ter-publish: buka DevTools → Application → IndexedDB → hapus database `my-brand-db`, lalu refresh. |
| Update seed JSON (`seeds/*.json`) tidak berpengaruh | Wajar kalau `public/data.sqlite` sudah pernah ter-publish sebelumnya — begitu ada `data.sqlite`, itu jadi satu-satunya sumber kebenaran dan seed JSON tidak dibaca lagi. |
| Build gagal di Cloudflare Pages | Cek log build; biasanya karena versi Node tidak cocok — tambahkan environment variable `NODE_VERSION=20`. |
| Tombol WhatsApp tidak membuka chat dengan benar | Cek format `whatsapp_number` di seed — harus `62xxxxxxxxxx`, tanpa `+`, spasi, atau tanda hubung. |
| Lupa password admin | Edit ulang `ADMIN_PASSWORD` di [src/lib/admin/useAdminAuth.ts](src/lib/admin/useAdminAuth.ts), commit, push. |

---

## 10. Lampiran — Struktur File Penting

```
seeds/fashion.seed.json          # Data awal brand: profil, kategori, produk, promo, testimoni
src/lib/db/schema.ts             # Skema tabel SQLite (products, brand_profile, dst.)
src/lib/db/client.ts             # Inisialisasi database + load seed pertama kali
src/lib/brand/types.ts           # Bentuk (shape) BrandConfig yang dipakai seluruh komponen
src/lib/admin/useAdminAuth.ts    # Password login admin
src/pages/admin/                 # Semua halaman Dashboard Admin
public/_redirects                # Wajib untuk SPA routing di Cloudflare Pages
```
