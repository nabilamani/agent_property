# 📄 Product Requirements Document (PRD)

## Web App Agent Property / Real Estate

---

## 1. 📌 Overview

Web App Agent Property adalah platform berbasis web real time yang digunakan oleh agen properti atau pemilik properti untuk memasarkan listing seperti rumah, tanah, kavling, dan cluster secara terstruktur, profesional, dan mudah diakses oleh publik.

Aplikasi ini memiliki dua sisi utama:

* **User (Publik):** melihat daftar properti dan menghubungi agen
* **Admin (Agent):** mengelola data properti dan identitas

---

## 2. 🎯 Objectives

* Mempermudah agen dalam mempromosikan properti secara online
* Menyediakan informasi properti yang lengkap dan rapi
* Mempercepat proses komunikasi antara calon pembeli dan agen
* Meningkatkan visibilitas listing properti

---

## 3. 👤 Target Users

### Primary User

* Agen properti freelance
* Developer perumahan kecil-menengah
* Pemilik properti individu

### Secondary User

* Calon pembeli properti

---

## 4. 🧩 Features

### 4.1 Public (User Side)

#### A. Landing Page

* Hero section (branding agent)
* Highlight property
* CTA (lihat listing)

#### B. Listing Properti

* List semua properti
* Filter (opsional):

  * Harga
  * Tipe (rumah, tanah, dll)
  * Lokasi

#### C. Detail Properti

Menampilkan:

* Title
* Gambar (multiple images / gallery)
* Harga
* Alamat (teks + embed Google Maps)
* Tipe/Jenis Properti
* Spesifikasi:

  * Luas Tanah
  * Luas Bangunan
  * Kondisi
* Deskripsi
* Tombol kontak:

  * WhatsApp Agent
  * WhatsApp Owner (opsional)

#### D. Contact Action

* Direct ke WhatsApp dengan pre-filled message

---

### 4.2 Admin Panel (Management)

#### A. Authentication

* Login Admin (Agent)

#### B. Dashboard

* Ringkasan:

  * Total properti
  * Properti aktif
  * Properti terjual (opsional)

#### C. Manajemen Properti (CRUD)

* Tambah properti
* Edit properti
* Hapus properti

Field:

* Title
* Gambar (multiple upload)
* Harga
* Alamat
* Google Maps link/embed
* Tipe properti
* Spesifikasi:

  * Luas tanah
  * Luas bangunan
  * Kondisi
* Deskripsi
* Nomor WhatsApp:

  * Agent
  * Owner (opsional)

#### D. Manajemen Identitas Agent

* Nama agent
* Foto profil
* Deskripsi / bio
* Nomor WhatsApp
* Logo (opsional)
* Sosial media (opsional)

---

## 5. 🏗️ Tech Stack

### Frontend + Backend

* Next.js (App Router)
* Tailwind CSS
* shadcn/ui

### Database & Backend Service

* Supabase (PostgreSQL + Auth + Storage)

### Deployment

* Vercel (full deployment)

---

## 6. 🧱 System Architecture

```
Client (Browser)
   ↓
Next.js App
   ├── UI (Frontend)
   ├── API Routes / Server Actions
   ↓
Supabase
   ├── Database (PostgreSQL)
   ├── Storage (Images)
   ├── Auth (Admin Login)
```

---

## 7. 🗄️ Data Model (Simplified)

### Table: agents

* id
* name
* photo
* bio
* phone
* logo
* created_at

### Table: properties

* id
* title
* price
* address
* map_url
* type
* land_area
* building_area
* condition
* description
* agent_whatsapp
* owner_whatsapp (optional)
* created_at

### Table: property_images

* id
* property_id
* image_url

---

## 8. 🔄 User Flow

### Public User Flow

1. User membuka website
2. Melihat listing properti
3. Klik detail properti
4. Melihat informasi lengkap
5. Klik tombol WhatsApp → langsung chat

### Admin Flow

1. Login
2. Masuk dashboard
3. Tambah/Edit properti
4. Upload gambar
5. Publish listing

---

## 9. 🎨 UI/UX Guidelines

* Clean & minimal
* Fokus ke visual (gambar properti)
* Mobile-first design
* Fast loading (optimize images)
* CTA jelas (WA button)

---

## 10. 🚀 Success Metrics

* Jumlah listing aktif
* Jumlah klik WhatsApp
* Conversion (chat → deal)
* Waktu update data (lebih cepat dibanding manual)

---

## 11. 🔮 Future Enhancements

* Filter advanced (range harga, lokasi radius)
* Bookmark / favorit
* Multi-agent support
* Analytics dashboard
* SEO optimization (property pages)

---

## 12. ⚠️ Constraints

* Harus optimal di Vercel (serverless)
* Tidak menggunakan backend tradisional (monolith)
* Image handling harus efisien

---

## 13. 📌 Notes

* Fokus utama: **simplicity + conversion ke WhatsApp**
* Tidak perlu fitur kompleks di awal
* MVP harus cepat jadi & usable

---
