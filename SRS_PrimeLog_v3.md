**SOFTWARE REQUIREMENTS SPECIFICATION**

Sistem Manajemen Logistik PrimeLog

*Analisis Kritis & Rekomendasi*

**Versi 3.0 - REVISI**

Fokus: Cargo Tracking, Bukan Ship Monitoring

Tanggal: 31 Mei 2026

**Status: Approved for Development**
# **Daftar Isi**
1\. Pendahuluan

2\. Deskripsi Umum

3\. Matriks Peran & Akses

4\. Spesifikasi Fitur per Role

5\. Aturan Bisnis & Validasi

6\. Keamanan & Otorisasi

7\. Alur Pengalaman Pengguna (UX Flow)

8\. Penanganan Error & Pesan

9\. Lampiran
# **1. Pendahuluan**
## **1.1 Tujuan Dokumen**
Dokumen ini mendefinisikan kebutuhan fungsional dan non-fungsional untuk sistem manajemen pengiriman cargo dengan otentikasi berbasis peran (ADMIN vs CUSTOMER). Sistem ini berfokus pada tracking pengiriman, bukan monitoring armada secara real-time.
## **1.2 Ruang Lingkup**
- Manajemen pengiriman cargo (shipment) dari pembuatan hingga selesai
- Tracking status pengiriman sederhana (bukan GPS real-time)
- Assign armada ke shipment (hanya untuk keperluan informasi)
- Proteksi rute berbasis role
- Isolasi data customer
## **1.3 Prinsip Arsitektur**
- Cargo-Centric: Fokus pada status pengiriman, bukan posisi kapal
- Simplicity: Tidak ada GPS tracking manual atau real-time telemetry
- Data Isolation: Customer hanya lihat shipment mereka
- Server-Side Validation: Semua validasi di backend
# **2. Analisis Kritis: Fitur Monitoring Kapal**
## **2.1 Kesimpulan**
**FITUR INI PERLU DIPERTAHANKAN TAPI DISEDERHANAKAN**
## **2.2 Yang PERLU Dipertahankan**

|**Fitur**|**Alasan**|**Kompatibilitas**|
| :- | :- | :- |
|**Status Kapal**|Penting untuk ETA & tracking cargo|✅ High - Core feature|
|**Assign Kapal**|Customer perlu tahu cargo di kapal apa|✅ High - Requirement SRS|
|**Informasi ETA & Lokasi**|Customer tracking & delay notification|✅ High - Customer requirement|
|**Kapasitas & Tipe Kapal**|Matching cargo dengan kapal sesuai|✅ Medium - Operational need|

## **2.3 Yang TIDAK PERLU (Over-engineered)**

|**Fitur**|**Alasan Penghapusan**|
| :- | :- |
|**Real-time GPS Coordinates**|Sistem ini bukan maritime tracking. GPS otomatis butuh IoT integration kompleks|
|**Fleet Management Dashboard**|Bukan core business. Admin hanya perlu tahu availability, bukan navigasi|
|**Manual Position Update**|Tidak realistis. Kapal tidak update posisi manual setiap saat|
|**Detailed Vessel Telemetry**|Di luar scope logistics management (speed, heading, fuel)|

***Alasan Utama: Core business adalah CARGO DELIVERY, bukan SHIP MONITORING. Sistem harus simple & fokus pada tracking pengiriman, bukan posisi kapal real-time.***
# **3. Deskripsi Umum Sistem**
## **3.1 Definisi Peran**

|**Role**|**Deskripsi**|**POV Utama**|
| :- | :- | :- |
|**ADMIN**|Pengelola pengiriman yang membuat shipment, assign kapal, dan update status|Operator Logistik → Mengelola A-Z|
|**CUSTOMER**|Pengguna layanan yang membuat pengiriman dan memantau statusnya|Pengirim Barang → Tracking cargo mereka|

## **3.2 Konsep Sistem**
**CARGO DELIVERY SYSTEM (Bukan Ship Monitoring)**

- ✅ Status pengiriman (DIPROSES → DIKIRIM → SAMPAI)
- ✅ Informasi ETA estimasi
- ✅ Assign kapal untuk info customer
- ✅ Tracking sederhana (kota asal → tujuan)
- ❌ GPS coordinates real-time
- ❌ Manual position update
- ❌ Fleet telemetry dashboard
- ❌ Ship speed/heading monitoring
# **4. Matriks Peran & Akses**
## **4.1 Matriks Fitur (Simplified)**

|**Fitur / Endpoint**|**Admin**|**Customer**|**Catatan**|
| :- | :- | :- | :- |
|**AUTHENTICATION**||||
|Login / Logout|✅|✅|Via /login|
|Ganti Password|✅|✅||
|**SHIPMENT**||||
|Buat shipment baru|✅|✅|Untuk sendiri|
|Lihat semua shipment|✅|❌|Customer: filter by userId|
|Edit shipment|✅|✅\*|\*Hanya DIPROSES|
|Cancel shipment|✅|✅\*|\*Hanya DIPROSES|
|**ASSIGN KAPAL**||||
|Assign kapal|✅|❌|Info tracking saja|
|**STATUS TRACKING**||||
|Update status pengiriman|✅|❌|Admin update manual|
|Set ETA|✅|Read-only|Estimasi tiba|

## **4.2 Data Isolation**
**QUERY UNTUK CUSTOMER:**

SELECT \* FROM Shipment WHERE userId = currentUserId

**QUERY UNTUK ADMIN:**

SELECT \* FROM Shipment (no filter)

**VEHICLE ACCESS:**

- Admin: SELECT \* FROM Vehicle
- Customer: SELECT \* FROM Vehicle WHERE id IN (SELECT vehicleId FROM Shipment WHERE userId = currentUserId)
# **5. Spesifikasi Fitur per Role**
## **5.1 ADMIN**
### **Dashboard Admin**
*Fungsi: Monitoring operasional pengiriman*

**Fitur:**

- Total shipment: Diproses, Dalam Pengiriman, Selesai, Terlambat
- Pendapatan bulan ini
- Shipment yang perlu di-assign kapal
- Notifikasi shipment mendekati ETA

*TIDAK PERLU: ❌ Map monitoring real-time, ❌ GPS coordinates, ❌ Fleet telemetry*
### **Manajemen Shipment**
*Fungsi: Mengelola pengiriman dari awal sampai selesai*

**Alur Proses:**

1. BUAT SHIPMENT - Input pengirim, penerima, asal, tujuan, detail barang
1. ASSIGN KAPAL (Opsional) - Pilih kapal tersedia, set ETA
1. UPDATE STATUS - Flow: DIPROSES → DALAM\_PENGIRIMAN → SAMPAI → SELESAI
1. CANCEL SHIPMENT (jika DIPROSES) - Wajib isi alasan
## **5.2 CUSTOMER**
### **Dashboard Customer**
*Fungsi: Monitoring pengiriman pribadi*

**Fitur:**

- Total shipment aktif
- Shipment dalam perjalanan
- Shipment selesai bulan ini
- Tagihan belum lunas
### **Buat & Kelola Shipment**
1. BUAT SHIPMENT BARU - Form data penerima, alamat tujuan, detail barang
1. EDIT/CANCEL - Hanya jika status DIPROSES
1. TRACKING - Lihat status, info kapal, ETA, rute
# **6. Aturan Bisnis & Validasi**
## **6.1 Status Flow Shipment**
**DIPROSES → DALAM\_PENGIRIMAN → SAMPAI → SELESAI**

Alternative: DIPROSES → DIBATALKAN (jika ada alasan)
## **6.2 Business Rules**

|**ID**|**Aturan**|**Validasi**|
| :- | :- | :- |
|**BR-01**|Customer hanya lihat sendiri|WHERE userId = currentUserId|
|**BR-02**|Edit hanya saat DIPROSES|Check status sebelum update|
|**BR-03**|Cancel wajib alasan|reason required, min 10 chars|
|**BR-04**|Berat minimal 0.1 kg|weight >= 0.1|
|**BR-05**|Tarif auto-calculate|Based on weight & distance|
|**BR-06**|No resi unik|Database unique constraint|
|**BR-07**|Assign kapal hanya tersedia|WHERE status = 'TERSEDIA'|
|**BR-08**|Invoice auto-generate|Saat status SELESAI|
|**BR-09**|Customer tidak update status|Server-side role check|
|**BR-10**|Email unik|Database unique constraint|

# **7. Keamanan & Otorisasi**
## **7.1 Authentication**
1. Login dengan email & password
1. Server validasi & buat sesi dengan role
1. Session disimpan di HTTP-only cookie
1. Setiap request validasi session
## **7.2 Middleware Protection**
**PUBLIC ROUTES:**

- /login
- /register
- /api/auth/\*

**PROTECTED ROUTES (Need Login):**

- /dashboard/\*
- /admin/\*

**ADMIN ONLY:**

- /admin/users
- /admin/fleet (untuk assign)
- /admin/analytics
## **7.3 API Security**
**ENDPOINT PROTECTION:**

GET /api/shipments:

- Admin: Return semua shipments
- Customer: Return WHERE userId = currentUserId

POST /api/shipments:

- Admin: Bisa buat untuk userId siapa saja
- Customer: userId otomatis dari session

PATCH /api/shipments/[id]/status:

- Admin: ✅ Allowed
- Customer: ❌ Forbidden (403)
# **8. Alur Pengalaman Pengguna (UX Flow)**
## **8.1 ADMIN Journey**
1. LOGIN
1. DASHBOARD - Lihat shipment yang perlu diproses
1. BUAT/ASSIGN - Input shipment, pilih kapal, set ETA
1. UPDATE STATUS - DIPROSES → DALAM\_PENGIRIMAN → SAMPAI
1. SELESAI - Invoice auto-generated, customer dapat notifikasi
## **8.2 CUSTOMER Journey**
1. LOGIN
1. DASHBOARD - Lihat shipment aktif
1. BUAT SHIPMENT - Isi form, submit → Status: DIPROSES
1. TRACKING - Lihat status: 'Dalam Pengiriman', info kapal, ETA
1. SELESAI - Download invoice, lihat riwayat
# **9. Penanganan Error & Pesan**

|**Kode**|**Skenario**|**Pesan (ID)**|
| :- | :- | :- |
|**AUTH-001**|Login gagal|Email atau password salah|
|**PERM-001**|Customer akses admin|Akses ditolak. Diperlukan administrator|
|**SHIP-001**|Edit shipment sudah dikirim|Shipment sudah dikirim, tidak dapat diedit|
|**SHIP-002**|Cancel shipment selesai|Shipment sudah selesai, tidak dibatalkan|
|**VEH-001**|Assign kapal tidak tersedia|Kapal tidak tersedia|
|**VAL-001**|Berat < 0.1 kg|Berat minimal 0.1 kg|

# **10. Lampiran: Database Schema**
**SIMPLIFIED PRISMA SCHEMA:**

model User {

`  `id        String   @id @default(uuid())

`  `email     String   @unique

`  `password  String

`  `role      Role     @default(CUSTOMER)

`  `name      String

`  `phone     String?

`  `shipments Shipment[]

}

model Vehicle {

`  `id        String   @id @default(uuid())

`  `name      String

`  `type      String   // KAPAL, TRUCK, PESAWAT

`  `plateNo   String   @unique

`  `capacity  Float

`  `status    String   // TERSEDIA, DIPAKAI, PERBAIKAN

}

model Shipment {

`  `id            String   @id @default(uuid())

`  `receiptNo     String   @unique

`  `userId        String

`  `senderName    String

`  `receiverName  String

`  `origin        String

`  `destination   String

`  `itemName      String

`  `weight        Float

`  `status        String   // DIPROSES, DALAM\_PENGIRIMAN, SAMPAI, SELESAI

`  `eta           DateTime?

`  `vehicleId     String?

`  `createdAt     DateTime @default(now())

}

enum Role {

`  `ADMIN

`  `CUSTOMER

}
# **11. API Endpoints Summary**

|**Method**|**Endpoint**|**Admin**|**Customer**|**Deskripsi**|
| :- | :- | :- | :- | :- |
|POST|/api/auth/login|✅|✅|Login|
|GET|/api/shipments|Semua|Sendiri|List shipments|
|POST|/api/shipments|✅|✅\*|New shipment|
|PATCH|/api/shipments/[id]|✅|Limited|Edit shipment|
|POST|/api/shipments/[id]/assign-vehicle|✅|❌|Assign kapal|
|PATCH|/api/shipments/[id]/status|✅|❌|Update status|
|GET|/api/vehicles|✅ All|✅ Assigned|List vehicles|

# **12. Kesimpulan & Rekomendasi**
## **12.1 Yang DIHAPUS**
- ❌ Real-time GPS tracking (latitude/longitude)
- ❌ Manual position update oleh admin
- ❌ Fleet monitoring dashboard dengan telemetry
- ❌ Ship speed, heading, fuel monitoring
- ❌ Complex map tracking dengan coordinates
## **12.2 Yang DIPERTAHANKAN**
- ✅ Assign kapal ke shipment (untuk info customer)
- ✅ Status pengiriman (DIPROSES → DIKIRIM → SAMPAI)
- ✅ ETA estimasi (manual set oleh admin)
- ✅ Customer tracking sederhana (status + info kapal)
- ✅ Dashboard dengan statistik shipment
## **12.3 Alasan Strategis**
- Core business adalah CARGO DELIVERY, bukan SHIP MONITORING
- Sistem harus SIMPLE & FOKUS pada tracking pengiriman
- GPS real-time butuh IoT integration yang kompleks & di luar scope
- Customer hanya perlu tahu: Status apa? Di kapal apa? Kapan tiba?

**Dokumen Disetujui untuk Development**

Version 3.0 - SIMPLIFIED

*Tanggal: 31 Mei 2026*
Page [#]
