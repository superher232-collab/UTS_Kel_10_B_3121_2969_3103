// src/app/api/cargo/route.ts
import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'
import { auth } from '@/auth'

// ============================================================
// DATABASE INITIALIZATION
// Pastikan tabel shipments ada sebelum query
// ============================================================
async function ensureTableExists() {
  try {
    await sql`
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
        jenis_kendaraan VARCHAR(20) NOT NULL,
        jenis_pengiriman VARCHAR(20) NOT NULL,
        status_pengiriman VARCHAR(50) DEFAULT 'diproses',
        status_barang VARCHAR(50) DEFAULT 'aman',
        status_transaksi VARCHAR(50) DEFAULT 'belum_bayar',
        deskripsi TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;
    await sql`ALTER TABLE shipments ADD COLUMN IF NOT EXISTS status_barang VARCHAR(50) DEFAULT 'aman';`;
    await sql`ALTER TABLE shipments ADD COLUMN IF NOT EXISTS status_transaksi VARCHAR(50) DEFAULT 'belum_bayar';`;
  } catch (error) {
    console.error('[DATABASE INIT ERROR]:', error);
    throw error;
  }
}

// ============================================================
// GET — Retrieve Cargo (Public Read)
// ============================================================
export async function GET(request: Request) {
  try {
    await ensureTableExists();

    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('q') || '';
    const statusFilter = searchParams.get('status') || 'all';
    const modeFilter = searchParams.get('mode') || 'all';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = (page - 1) * limit;

    let sqlQuery = `SELECT * FROM shipments WHERE 1=1`;
    let countQuery = `SELECT COUNT(*) FROM shipments WHERE 1=1`;
    const params: (string | number)[] = [];
    let paramIndex = 1;

    // Search filter (ILIKE untuk case-insensitive)
    if (searchQuery.trim() !== '') {
      sqlQuery += ` AND (no_resi ILIKE $${paramIndex} OR nama_pengirim ILIKE $${paramIndex} OR nama_penerima ILIKE $${paramIndex} OR jenis_barang ILIKE $${paramIndex})`;
      countQuery += ` AND (no_resi ILIKE $${paramIndex} OR nama_pengirim ILIKE $${paramIndex} OR nama_penerima ILIKE $${paramIndex} OR jenis_barang ILIKE $${paramIndex})`;
      params.push(`%${searchQuery}%`);
      paramIndex++;
    }

    // Status filter
    if (statusFilter !== 'all') {
      sqlQuery += ` AND status_pengiriman = $${paramIndex}`;
      countQuery += ` AND status_pengiriman = $${paramIndex}`;
      params.push(statusFilter);
      paramIndex++;
    }

    // Mode/Vehicle filter
    if (modeFilter !== 'all') {
      sqlQuery += ` AND jenis_kendaraan = $${paramIndex}`;
      countQuery += ` AND jenis_kendaraan = $${paramIndex}`;
      params.push(modeFilter);
      paramIndex++;
    }

    // Get total count for pagination
    const totalResult = await sql.query(countQuery, params);
    const totalCount = parseInt(totalResult.rows[0]?.count ?? '0', 10);

    // Add pagination
    sqlQuery += ` ORDER BY id DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const cargoResult = await sql.query(sqlQuery, params);

    return NextResponse.json({
      status: 'success',
      data: cargoResult.rows,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit) || 1
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error('[GET /api/cargo] error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data cargo dari database', detail: error.message },
      { status: 500 }
    );
  }
}

// ============================================================
// POST — Create Cargo (ADMIN ONLY)
// ============================================================
export async function POST(request: Request) {
  try {
    // ✅ Auth check - pakai 'as any' biar TypeScript nggak error soal role
    const session: any = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized: Please login' }, { status: 401 });
    }
    
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    await ensureTableExists();

    const body = await request.json();
    const {
      tanggal_kirim,
      nama_pengirim,
      nama_penerima,
      no_telepon,
      kota_asal,
      kota_tujuan,
      jenis_barang,
      berat_kg,
      harga_tarif,
      jenis_kendaraan,
      jenis_pengiriman,
      status_pengiriman,
      status_barang,
      status_transaksi,
      deskripsi
    } = body;

    // Validasi required fields
    if (!tanggal_kirim || !nama_pengirim || !nama_penerima || !jenis_kendaraan || !jenis_pengiriman) {
      return NextResponse.json(
        { error: 'Field tanggal_kirim, nama_pengirim, nama_penerima, jenis_kendaraan, dan jenis_pengiriman wajib diisi' },
        { status: 400 }
      );
    }

    // Generate unique Resi Code: RESI-YYYYMMDD-XXX-RANDOM
    const dateObj = new Date(tanggal_kirim);
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dd = String(dateObj.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}${mm}${dd}`;

    const countResult = await sql.query(
      `SELECT COUNT(*) FROM shipments WHERE tanggal_kirim = $1`,
      [tanggal_kirim]
    );
    const sequenceNum = parseInt(countResult.rows[0]?.count ?? '0', 10) + 1;
    const randomSuffix = String(Math.floor(100 + Math.random() * 900));
    const no_resi = `RESI-${dateStr}-${String(sequenceNum).padStart(3, '0')}${randomSuffix}`;

    // Default values
    const finalStatus = status_pengiriman || 'diproses';
    const finalStatusBarang = status_barang || 'aman';
    const finalStatusTransaksi = status_transaksi || 'belum_bayar';

    // Insert dengan parameterized query (anti SQL injection)
    const result = await sql.query(
      `INSERT INTO shipments (
        no_resi, tanggal_kirim, nama_pengirim, nama_penerima,
        no_telepon, kota_asal, kota_tujuan, jenis_barang,
        berat_kg, harga_tarif, jenis_kendaraan, jenis_pengiriman,
        status_pengiriman, status_barang, status_transaksi, deskripsi
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *`,
      [
        no_resi,
        tanggal_kirim,
        nama_pengirim,
        nama_penerima,
        no_telepon || null,
        kota_asal || null,
        kota_tujuan || null,
        jenis_barang || null,
        berat_kg ? parseFloat(berat_kg) : 0,
        harga_tarif ? parseFloat(harga_tarif) : 0,
        jenis_kendaraan,
        jenis_pengiriman,
        finalStatus,
        finalStatusBarang,
        finalStatusTransaksi,
        deskripsi || null
      ]
    );

    return NextResponse.json({
      status: 'success',
      data: result.rows[0]
    }, { status: 201 });

  } catch (error: any) {
    console.error('[POST /api/cargo] error:', error);
    return NextResponse.json(
      { error: 'Gagal menambahkan cargo shipment baru', detail: error.message },
      { status: 500 }
    );
  }
}