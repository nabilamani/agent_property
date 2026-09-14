# Agent Property

Platform listing properti untuk agen, developer, dan pemilik properti. Aplikasi ini menyediakan halaman publik untuk menampilkan properti dan panel admin untuk mengelola listing, profil agen, gambar, serta metrik interaksi calon pembeli.

## Fitur

### Halaman publik

- Landing page dengan branding, properti pilihan, dan ajakan melihat listing.
- Daftar properti aktif dengan kategori Rumah, Tanah, Kavling, Cluster, dan Apartemen.
- Pencarian berdasarkan judul, alamat, atau tipe properti.
- Filter rentang harga, kondisi, dan status terjual.
- Halaman detail dengan galeri gambar, spesifikasi, alamat, peta, dan tombol WhatsApp.
- Penyimpanan properti favorit di browser menggunakan `localStorage`.
- Mode terang dan gelap.
- Pelacakan jumlah kunjungan halaman detail dan klik WhatsApp.
- Tampilan responsif dengan fokus pada perangkat mobile.

### Panel admin

- Login admin menggunakan Supabase Auth.
- Dashboard ringkasan jumlah properti, properti aktif, kunjungan, dan klik WhatsApp.
- CRUD listing properti.
- Upload banyak gambar, kompresi gambar di sisi browser, penghapusan gambar, dan pengaturan urutan gambar.
- Status listing aktif/nonaktif, terjual, dan properti pilihan.
- Batas maksimal tiga properti pilihan di halaman beranda.
- Pencarian listing dari panel admin.
- Pengaturan profil agen, bio, nomor WhatsApp, foto, logo, dan caption.
- Generator detail properti dari teks mentah menggunakan Google Gemini (opsional).

## Teknologi

- [Next.js](https://nextjs.org/) 16 dengan App Router dan Server Actions
- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) 4
- [shadcn/ui](https://ui.shadcn.com/) dan Radix UI
- [Supabase](https://supabase.com/) untuk PostgreSQL, Auth, Storage, dan RPC
- [Google Gemini](https://ai.google.dev/) untuk generator detail properti opsional
- [Vercel](https://vercel.com/) sebagai target deployment yang direkomendasikan

## Persyaratan

- Node.js 20 atau versi yang lebih baru
- npm 10 atau versi yang lebih baru
- Project Supabase
- Akun Google AI Studio dan API key Gemini jika generator AI digunakan

## Instalasi lokal

1. Clone repository dan masuk ke folder project.

   ```bash
   git clone <URL_REPOSITORY>
   cd agent_property
   ```

2. Install dependency.

   ```bash
   npm install
   ```

3. Buat file `.env.local` di root project:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   GEMINI_API_KEY=your-gemini-api-key
   ```

   `GEMINI_API_KEY` boleh dikosongkan jika fitur generator AI tidak digunakan. Dua variabel Supabase tetap wajib diisi.

4. Siapkan database Supabase dengan menjalankan isi [`supabase/migration.sql`](./supabase/migration.sql) di **Supabase Dashboard > SQL Editor**.

5. Buat user admin di **Supabase Dashboard > Authentication > Users**. Email dan password user tersebut digunakan untuk masuk ke `/login`.

6. Jalankan server development:

   ```bash
   npm run dev
   ```

7. Buka [http://localhost:3000](http://localhost:3000).

## Konfigurasi Supabase

Migration menyediakan:

- Tabel `agents` untuk profil agen.
- Tabel `properties` untuk data listing.
- Tabel `property_images` untuk galeri listing.
- RPC `increment_property_views` dan `increment_property_whatsapp_clicks` untuk counter atomik.
- Row Level Security (RLS) untuk akses publik dan authenticated user.
- Storage bucket publik `property-images` dan `agent-assets`.
- Index untuk tipe properti, status aktif, dan relasi gambar.
- Data awal satu profil agen.

### Kebijakan akses

- Pengunjung publik dapat membaca profil agen, properti aktif, dan gambar.
- User yang sudah login dapat melihat seluruh properti.
- User authenticated dapat menambah, mengubah, dan menghapus properti serta gambar.
- User authenticated dapat mengubah profil agen.

Pastikan user admin hanya diberikan akses melalui Supabase Auth. Jangan menaruh service role key di browser atau di file environment yang ikut di-commit.

## Perintah yang tersedia

| Perintah | Kegunaan |
| --- | --- |
| `npm run dev` | Menjalankan server development |
| `npm run lint` | Menjalankan ESLint |
| `npm run build` | Membuat build production |
| `npm run start` | Menjalankan build production |

Sebelum membuat pull request atau deployment, jalankan:

```bash
npm run lint
npm run build
```

## Struktur folder

```text
.
├── public/                  # Asset statis dan gambar bawaan
├── src/
│   ├── app/
│   │   ├── (public)/        # Landing page, listing, dan detail properti
│   │   ├── actions/         # Server Actions untuk auth, agen, AI, dan properti
│   │   ├── admin/           # Dashboard dan halaman pengelolaan admin
│   │   └── login/           # Halaman login admin
│   ├── components/
│   │   ├── admin/           # Komponen dashboard dan form admin
│   │   ├── public/          # Komponen halaman publik
│   │   └── ui/              # Komponen UI dasar
│   ├── context/             # State favorit properti di browser
│   ├── lib/
│   │   └── supabase/        # Client, middleware, server client, dan type
│   └── proxy.ts             # Pembaruan session Supabase pada request
├── supabase/
│   └── migration.sql        # Schema, policy, bucket, RPC, dan seed
├── next.config.ts           # Konfigurasi Next.js dan remote images
└── package.json
```

## Route utama

| Route | Akses | Keterangan |
| --- | --- | --- |
| `/` | Publik | Landing page dan properti pilihan |
| `/properties` | Publik | Daftar, pencarian, kategori, dan filter |
| `/properties/[id]` | Publik | Detail properti |
| `/login` | Publik | Login admin |
| `/admin` | Admin | Dashboard dan statistik |
| `/admin/properties` | Admin | Kelola listing dan gambar |
| `/admin/profile` | Admin | Kelola identitas agen |

Filter kategori dapat dibuka melalui query string, misalnya `/properties?type=rumah`. Tampilan properti tersimpan dapat dibuka melalui `/properties?saved=true`.

## Alur pengelolaan listing

1. Login melalui `/login`.
2. Buka menu **Properties** pada panel admin.
3. Tambahkan judul, harga, alamat, tipe, kondisi, luas, deskripsi, dan nomor WhatsApp.
4. Pilih gambar. Gambar akan dikompres di browser sebelum dikirim ke Supabase Storage.
5. Atur status aktif atau terjual, lalu simpan.
6. Tandai sebagai properti pilihan jika ingin menampilkannya di landing page. Maksimal tiga listing dapat dipilih.
7. Gunakan menu profil untuk memperbarui branding dan kontak agen.

## Generator detail dengan Gemini

Generator AI berada di form properti admin dan menerima teks mentah. Hasilnya mengisi:

- Judul
- Harga
- Tipe
- Alamat
- Luas tanah
- Luas bangunan
- Kondisi
- Deskripsi

Fitur ini hanya berjalan jika `GEMINI_API_KEY` tersedia. Model yang digunakan adalah `gemini-2.5-flash`. Hasil generator tetap perlu diperiksa sebelum listing dipublikasikan, terutama harga, alamat, dan spesifikasi.

## Deployment ke Vercel

1. Push repository ke Git provider.
2. Import repository di [Vercel](https://vercel.com/new).
3. Tambahkan environment variables berikut pada project Vercel:

   ```text
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   GEMINI_API_KEY
   ```

4. Deploy dengan konfigurasi default Next.js.
5. Setelah deployment selesai, buat atau gunakan user admin di Supabase Auth dan uji:
   - halaman publik,
   - login admin,
   - upload gambar,
   - penyimpanan listing,
   - tombol WhatsApp,
   - generator detail jika digunakan.

Konfigurasi Next.js membatasi remote image ke `images.unsplash.com` dan project Supabase yang tercantum di `next.config.ts`. Jika gambar berasal dari domain lain, tambahkan domain tersebut ke `images.remotePatterns` sebelum deployment.

## Troubleshooting

### Tidak dapat terhubung ke Supabase

- Pastikan nama environment variable tepat.
- Pastikan `.env.local` berada di root project.
- Restart server setelah mengubah environment variable.
- Periksa URL dan anon key pada **Project Settings > API** di Supabase.

### Login admin gagal

- Pastikan user sudah dibuat di Supabase Auth.
- Pastikan email dan password benar.
- Periksa log Supabase Auth dan browser console.

### Gambar tidak tampil atau gagal di-upload

- Pastikan bucket `property-images` dan `agent-assets` tersedia.
- Jalankan ulang bagian storage dari migration jika bucket belum dibuat.
- Pastikan policy storage mengizinkan pembacaan publik dan upload oleh user authenticated.
- Periksa ukuran file dan batas body request pada `next.config.ts`.

### Generator AI tidak berjalan

- Pastikan `GEMINI_API_KEY` tersedia di environment yang sedang digunakan.
- Pastikan API key aktif dan memiliki akses ke Gemini API.
- Coba masukkan teks listing yang lebih lengkap dan terstruktur.

## Catatan keamanan

- `.env*` sudah diabaikan oleh Git; jangan commit credential.
- Gunakan anon key Supabase pada client sesuai pola Supabase. Jangan pernah mengekspos service role key.
- Batasi akses user admin melalui Supabase Auth.
- Tinjau policy RLS sebelum membuka akses ke user atau role tambahan.
- Validasi kembali output generator AI sebelum dipublikasikan.

## Lisensi

Belum ada lisensi open source yang ditetapkan untuk project ini. Hubungi pemilik repository sebelum menggunakan atau mendistribusikan kode di luar project.
