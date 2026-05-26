-- SQL Schema for CRUDS Cargo System
-- Target: Neon PostgreSQL

CREATE TABLE IF NOT EXISTS shipments (
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
  jenis_kendaraan VARCHAR(20) NOT NULL, -- 'darat', 'udara', 'laut'
  jenis_pengiriman VARCHAR(20) NOT NULL, -- 'biasa', 'cepat', 'vvip'
  status_pengiriman VARCHAR(50) DEFAULT 'diproses', -- 'diproses', 'dalam_pengiriman', 'sampai_tujuan', 'pending', 'selesai'
  status_barang VARCHAR(50) DEFAULT 'aman', -- 'aman', 'rusak', 'hilang'
  status_transaksi VARCHAR(50) DEFAULT 'belum_bayar', -- 'belum_bayar', 'lunas'
  deskripsi TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
