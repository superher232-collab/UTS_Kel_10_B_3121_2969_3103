**📋 SOFTWARE REQUIREMENTS SPECIFICATION (SRS)**

Sistem Informasi Cargo Multi-Modal (CRUDS Next.js)

| **Project:**       | UGD SIWEB - KEL 10-B         |
| ------------------ | ---------------------------- |
| **Deadline:**      | 26 Mei 2026, 16:00-18:00 WIB |
| **Versi Dokumen:** | 1.0                          |
| **Tanggal:**       | 26 Mei 2026                  |

**1\. PENDAHULUAN**

**1.1 Tujuan Dokumen**

Dokumen ini menjelaskan spesifikasi fungsional dan non-fungsional untuk perbaikan dan pengembangan aplikasi cargo berbasis Next.js sesuai requirement UGD SIWEB, dengan fokus implementasi CRUDS (Create, Read, Update, Delete, Search) terintegrasi database.

**1.2 Ruang Lingkup**

Aplikasi mengelola data pengiriman cargo untuk 3 moda transportasi:

• Darat (🚛)

• Udara (✈️)

• Laut (🚢)

**1.3 Masalah Teridentifikasi pada Aplikasi Saat Ini**

| **No** | **Masalah**                                   | **Dampak**                                                | **Prioritas** |
| ------ | --------------------------------------------- | --------------------------------------------------------- | ------------- |
| 1      | Halaman /admin mengembalikan 404              | Fitur CRUDS tidak dapat diakses                           | 🔴 Critical   |
| 2      | Fokus aplikasi hanya maritim                  | Tidak memenuhi requirement multi-modal (darat/udara/laut) | 🔴 Critical   |
| 3      | Tidak ada form input data cargo               | Fitur CREATE tidak tersedia                               | 🔴 Critical   |
| 4      | Tidak ada tabel/list data dari database       | Fitur READ menggunakan data dummy/hardcode                | 🔴 Critical   |
| 5      | Tidak ada mekanisme edit/update               | Fitur UPDATE tidak berfungsi                              | 🟠 High       |
| 6      | Tidak ada tombol hapus data                   | Fitur DELETE tidak tersedia                               | 🟠 High       |
| 7      | Tidak ada field pencarian                     | Fitur SEARCH tidak berfungsi                              | 🟠 High       |
| 8      | Autentikasi role-based tidak terimplementasi  | Admin dan user tidak dapat dibedakan                      | 🟡 Medium     |
| 9      | Struktur database tidak terverifikasi sinkron | Risiko data tidak persisten                               | 🔴 Critical   |

**2\. DESKRIPSI UMUM**

**2.1 Perspektif Produk**

Aplikasi ini adalah modul admin untuk sistem logistik cargo yang harus:

• Berbasis Next.js (App Router atau Pages Router)

• Terhubung ke database (PostgreSQL/MySQL/MongoDB)

• Mengimplementasikan CRUDS penuh

• Mendukung role-based access (Admin)

**2.2 Kelas Pengguna**

| **Role**  | **Hak Akses**                                               |
| --------- | ----------------------------------------------------------- |
| **Admin** | Full CRUDS + manajemen kendaraan + update status pengiriman |
| **User**  | Read-only + search (opsional, sesuai scope project)         |

**2.3 Asumsi dan Ketergantungan**

• Developer memiliki akses ke source code repository

• Database sudah tersedia atau dapat di-deploy (Vercel Postgres/Supabase/Neon)

• Environment variables dapat dikonfigurasi di Vercel Dashboard

• Tidak mengubah arsitektur dasar, hanya memperbaiki dan melengkapi fitur

**3\. REQUIREMENT FUNGSIONAL**

**3.1 CREATE - Tambah Data Cargo (20 Poin)**

FR-001: Sistem harus menyediakan form tambah data cargo dengan field:  
├─ Id Pengiriman/No Resi (auto-generated: format RESI-YYYYMMDD-XXXX)  
├─ Tanggal Kirim (date picker)  
├─ Nama Pengirim (text, required)  
├─ Nama Penerima (text, required)  
├─ No Telepon (numeric, validation)  
├─ Kota Asal (dropdown/text)  
├─ Kota Tujuan (dropdown/text)  
├─ Jenis Barang (text)  
├─ Berat Barang (number, kg)  
├─ Harga/Tarif Pengiriman (currency)  
├─ Jenis Kendaraan (dropdown: Truck/Pesawat/Kapal)  
├─ Jenis Pengiriman (dropdown: Biasa/Cepat/VVIP)  
├─ Status Pengiriman (default: "Diproses")  
└─ Deskripsi/Catatan Barang (textarea)

FR-002: Jika project memiliki modul kendaraan, form harus mencakup:  
├─ Nama Kendaraan  
├─ Jenis Kendaraan  
├─ Plat Nomor/Kode Kendaraan  
├─ Kapasitas Muatan (kg)  
└─ Status Kendaraan (Available/In Use/Maintenance)

FR-003: Data harus tersimpan ke database dan form reset setelah submit sukses  
FR-004: Validasi client-side dan server-side wajib diimplementasikan  
FR-005: Tidak boleh ada error 500/404 saat submit form

**3.2 READ - Menampilkan Data (10 Poin)**

FR-006: Sistem harus menampilkan seluruh data cargo dari database di halaman admin  
FR-007: Data dapat ditampilkan dalam bentuk:  
• Tabel dengan pagination  
• Card view (opsional)  
• Chart ringkasan (jumlah pengiriman per status)  
FR-008: Data harus real-time dari database, bukan hardcode/dummy  
FR-009: Kolom minimal yang tampil: No Resi, Tanggal, Pengirim, Penerima,  
Kota Asal-Tujuan, Status, Aksi (Edit/Hapus)

**3.3 UPDATE - Edit Data & Status (10 Poin)**

FR-010: Sistem harus menyediakan tombol edit pada setiap baris data  
FR-011: Form edit harus menampilkan data lama sebagai default value  
FR-012: Field yang dapat diupdate untuk Pengiriman:  
• Status Pengiriman (Diproses → Dalam Pengiriman → Sampai Tujuan → Selesai)  
• Status Barang  
• Status Transaksi  
• Harga Pengiriman (jika ada revisi)  
FR-013: Field yang dapat diupdate untuk Kendaraan:  
• Nama, Jenis, Kode, Kapasitas, Status Kendaraan  
FR-014: Perubahan harus tersimpan ke database dan UI langsung terupdate  
FR-015: Tidak boleh ada error saat proses update

**3.4 DELETE - Hapus Data (10 Poin)**

FR-016: Sistem harus menyediakan tombol hapus dengan konfirmasi (modal/confirm)  
FR-017: Data harus terhapus dari database secara permanen atau soft-delete  
FR-018: UI harus refresh otomatis setelah delete berhasil  
FR-019: Tidak boleh ada error saat proses delete

**3.5 SEARCH - Pencarian Data (10 Poin)**

FR-020: Sistem harus menyediakan input search di halaman admin  
FR-021: Pencarian dapat berdasarkan:  
• No Resi (exact/partial match)  
• Nama Pengirim (contains)  
• Nama Penerima (contains)  
• Nama/Jenis Barang (contains)  
FR-022: Hasil search harus mengambil data dari database, bukan filter client-side saja  
FR-023: Tampilkan pesan "Data tidak ditemukan" jika hasil kosong

**4\. REQUIREMENT DATABASE**

**4.1 Struktur Tabel Minimal**

\-- Tabel: shipments (pengiriman)  
CREATE TABLE shipments (  
id SERIAL PRIMARY KEY,  
no_resi VARCHAR(50) UNIQUE NOT NULL,  
tanggal_kirim DATE NOT NULL,  
nama_pengirim VARCHAR(100) NOT NULL,  
nama_penerima VARCHAR(100) NOT NULL,  
no_telepon VARCHAR(20),  
kota_asal VARCHAR(100),  
kota_tujuan VARCHAR(100),  
jenis_barang VARCHAR(100),  
berat_kg DECIMAL(10,2),  
harga_tarif DECIMAL(15,2),  
jenis_kendaraan ENUM('darat','udara','laut'),  
jenis_pengiriman ENUM('biasa','cepat','vvip'),  
status_pengiriman ENUM('diproses','dalam_pengiriman','sampai_tujuan','pending','selesai'),  
deskripsi TEXT,  
created_at TIMESTAMP DEFAULT NOW(),  
updated_at TIMESTAMP DEFAULT NOW()  
);  
<br/>\-- Tabel: vehicles (jika ada modul kendaraan)  
CREATE TABLE vehicles (  
id SERIAL PRIMARY KEY,  
nama_kendaraan VARCHAR(100),  
jenis_kendaraan ENUM('truck','pesawat','kapal'),  
plat_nomor VARCHAR(20) UNIQUE,  
kapasitas_muatan_kg DECIMAL(10,2),  
status_kendaraan ENUM('available','in_use','maintenance'),  
created_at TIMESTAMP DEFAULT NOW()  
);  
<br/>\-- Tabel: users (untuk autentikasi admin)  
CREATE TABLE users (  
id SERIAL PRIMARY KEY,  
username VARCHAR(50) UNIQUE NOT NULL,  
password_hash VARCHAR(255) NOT NULL,  
role ENUM('admin','user') DEFAULT 'user',  
created_at TIMESTAMP DEFAULT NOW()  
);

**4.2 Relasi dan Sinkronisasi**

• shipments.jenis_kendaraan → vehicles.jenis_kendaraan (opsional foreign key)  
• UI form ↔ database: field name harus konsisten (snake_case recommended)  
• Auto-generated no_resi harus unik dan tidak bentrok

**5\. REQUIREMENT NON-FUNGSIONAL**

**5.1 Teknis**

| **Kategori**    | **Requirement**                                             |
| --------------- | ----------------------------------------------------------- |
| **Framework**   | Next.js 14+ (App Router preferred)                          |
| **Database**    | PostgreSQL/MySQL dengan ORM (Prisma/Drizzle) atau raw query |
| **Deployment**  | Vercel (sesuai URL saat ini)                                |
| **API Route**   | Gunakan Next.js API Routes atau Server Actions untuk CRUD   |
| **Environment** | Gunakan .env.local\` untuk kredensial database              |

**5.2 Keamanan**

NFR-001: Password admin harus di-hash (bcrypt/argon2)  
NFR-002: API endpoint CRUD harus dilindungi middleware autentikasi  
NFR-003: Input harus disanitasi untuk mencegah SQL injection/XSS  
NFR-004: Role-based access: hanya admin yang bisa CRUD

**5.3 Usability & Performance**

NFR-005: Form harus memiliki loading state saat submit  
NFR-006: Tampilkan toast/notification untuk sukses/error  
NFR-007: Search harus debounce (300ms) untuk hindari spam query  
NFR-008: Pagination untuk data >50 baris  
NFR-009: UI boleh sederhana, tapi harus fungsional dan tidak error

**6\. STRATEGI PERBAIKAN TANPA MENGUBAH SOURCE CODE INTI**

_⚠️ Constraint: "Tanpa mengubah isi source code" diinterpretasikan sebagai:  
Tidak mengubah arsitektur dasar, library utama, atau struktur folder, tetapi boleh menambahkan file, route, dan logic baru untuk melengkapi fitur._

**6.1 Pendekatan Incremental Patch**

✅ BOLEH:  
• Menambahkan file route baru: /app/admin/cargo/page.tsx  
• Menambahkan API route: /app/api/cargo/route.ts  
• Menambahkan komponen form: /components/cargo/CargoForm.tsx  
• Menambahkan schema Prisma/Drizzle untuk tabel baru  
• Menambahkan middleware untuk autentikasi admin  
<br/>❌ TIDAK BOLEH (jika constraint ketat):  
• Menghapus/mengganti framework Next.js  
• Mengubah konfigurasi next.config.js yang kritis  
• Mengganti database engine yang sudah deployed

**6.2 Prioritas Implementasi**

Alur prioritas implementasi digambarkan sebagai berikut:

• 1. Perbaiki routing agar halaman /admin tidak mengembalikan status 404.

• 2. Buat schema database sesuai dengan requirements tabel shipments, vehicles, dan users.

• 3. Implementasi API CRUD pada endpoint /api/cargo.

• 4. Bangun halaman Admin yang memuat form, tabel data, serta fitur search.

• 5. Tambahkan sistem autentikasi berbasis role-based access.

• 6. Lakukan pengujian end-to-end secara menyeluruh (CREATE → READ → UPDATE → DELETE → SEARCH).

• 7. Deploy hasil perbaikan ke Vercel dan verifikasi seluruh environment variables.

**7\. KRITERIA PENERIMAAN (ACCEPTANCE CRITERIA)**

**7.1 Functional Testing Checklist**

• \[CREATE\] Form cargo muncul, field lengkap, submit berhasil, data masuk DB

• \[CREATE\] No resi auto-generated unik dan format sesuai

• \[READ\] Halaman admin menampilkan data dari DB, bukan dummy

• \[READ\] Semua field tampil, pagination berfungsi jika data banyak

• \[UPDATE\] Klik edit → form terisi data lama → simpan → DB terupdate

• \[UPDATE\] Status pengiriman bisa diubah dengan dropdown

• \[DELETE\] Klik hapus → konfirmasi → data hilang dari UI dan DB

• \[SEARCH\] Ketik keyword → hasil filter sesuai dari DB

• \[AUTH\] Login admin berhasil, user biasa tidak bisa akses /admin

• \[ERROR\] Tidak ada console error / 500 response saat operasi CRUD

**7.2 Non-Functional Testing**

• Load time halaman admin < 3s (dengan 100 data)

• Form validasi muncul sebelum submit jika field required kosong

• Search debounce bekerja, tidak spam request ke API

• Responsive: tampilan usable di mobile (minimal)

**8\. LAMPIRAN**

**8.1 Contoh Payload API**

// POST /api/cargo - CREATE  
{  
"nama_pengirim": "Choirul",  
"nama_penerima": "Budi Santoso",  
"no_telepon": "081234567890",  
"kota_asal": "Jakarta",  
"kota_tujuan": "Surabaya",  
"jenis_barang": "Elektronik",  
"berat_kg": 15.5,  
"harga_tarif": 125000,  
"jenis_kendaraan": "darat",  
"jenis_pengiriman": "cepat",  
"status_pengiriman": "diproses",  
"deskripsi": "Fragile, handle with care"  
}  
<br/>// Response  
{  
"success": true,  
"data": {  
"id": 1,  
"no_resi": "RESI-20260526-0001",  
"created_at": "2026-05-26T10:30:00Z"  
}  
}

**8.2 Daftar File yang Perlu Ditambahkan/Dimodifikasi**

📁 app/  
├── admin/  
│ ├── page.tsx ← \[NEW\] Dashboard admin dengan tabel cargo  
│ ├── cargo/  
│ │ ├── page.tsx ← \[NEW\] Halaman CRUDS cargo  
│ │ └── \[id\]/edit/page.tsx ← \[NEW\] Halaman edit  
├── api/  
│ └── cargo/  
│ ├── route.ts ← \[NEW\] API handler untuk GET/POST  
│ └── \[id\]/route.ts ← \[NEW\] API handler untuk PUT/DELETE  
📁 components/  
├── cargo/  
│ ├── CargoForm.tsx ← \[NEW\] Form reusable untuk create/edit  
│ ├── CargoTable.tsx ← \[NEW\] Tabel data dengan action buttons  
│ └── SearchBar.tsx ← \[NEW\] Input search dengan debounce  
📁 lib/  
├── db.ts ← \[MODIFY\] Inisialisasi koneksi DB  
├── validations.ts ← \[NEW\] Schema validasi (Zod)  
📁 prisma/ (jika pakai Prisma)  
└── schema.prisma ← \[MODIFY\] Tambah model Shipment, Vehicle

**8.3 Environment Variables Template**

\# .env.local  
DATABASE_URL="postgresql://user:pass@host:5432/dbname"  
NEXTAUTH_SECRET="your-secret-key"  
ADMIN_USERNAME="admin"  
ADMIN_PASSWORD_HASH="\$2b\$10\$..." # bcrypt hash dari "password123"

**9\. CATATAN PENTING UNTUK TIM DEVELOPER**

• Fungsionalitas > Estetika: UI boleh sederhana, yang penting CRUDS berjalan dan database sinkron.

• Jangan hardcode data: Semua data harus dari database, bahkan untuk testing.

• Error handling wajib: Setiap API call harus handle error dan tampilkan pesan user-friendly.

• Test sebelum asistensi: Jalankan npm run dev lokal, pastikan tidak ada error console.

• Backup database: Sebelum deploy perubahan, backup data existing jika ada.

• Dokumentasi minimal: Tambahkan komentar di kode untuk logic kompleks (auto-generate resi, search query).

**🎯 Target Akhir: Saat asistensi 26 Mei 2026, aplikasi harus bisa:  
**1\. Login sebagai admin  
2\. Buka halaman admin → lihat data cargo dari DB  
3\. Tambah data baru → muncul di tabel  
4\. Edit status → berubah di DB  
5\. Hapus data → hilang dari UI dan DB  
6\. Cari berdasarkan no resi/nama → hasil sesuai  
7\. Tidak ada error 404/500 di console