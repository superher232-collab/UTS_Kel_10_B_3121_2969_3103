import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

// ============================================================
// DATABASE INITIALIZATION HELPER
// Ensures the `shipments` table exists before executing operations
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
        jenis_kendaraan VARCHAR(20) NOT NULL, -- 'darat', 'udara', 'laut'
        jenis_pengiriman VARCHAR(20) NOT NULL, -- 'biasa', 'cepat', 'vvip'
        status_pengiriman VARCHAR(50) DEFAULT 'diproses', -- 'diproses', 'dalam_pengiriman', 'sampai_tujuan', 'pending', 'selesai'
        deskripsi TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;
  } catch (error) {
    console.error('[DATABASE INIT ERROR]:', error);
    throw error;
  }
}

// ============================================================
// GET — Retrieve Paginated, Filtered and Searched Cargo Shipments
// ============================================================
export async function GET(request: Request) {
  try {
    // Ensure table exists before querying
    await ensureTableExists();

    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('q') || '';
    const statusFilter = searchParams.get('status') || 'all';
    const modeFilter = searchParams.get('mode') || 'all';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = (page - 1) * limit;

    // Build dynamic SQL queries securely using standard parameterized values
    let sqlQuery = `SELECT * FROM shipments WHERE 1=1`;
    let countQuery = `SELECT COUNT(*) FROM shipments WHERE 1=1`;
    const params: any[] = [];
    let paramIndex = 1;

    // Search Query (ILIKE on multiple columns)
    if (searchQuery.trim() !== '') {
      sqlQuery += ` AND (no_resi ILIKE $${paramIndex} OR nama_pengirim ILIKE $${paramIndex} OR nama_penerima ILIKE $${paramIndex} OR jenis_barang ILIKE $${paramIndex})`;
      countQuery += ` AND (no_resi ILIKE $${paramIndex} OR nama_pengirim ILIKE $${paramIndex} OR nama_penerima ILIKE $${paramIndex} OR jenis_barang ILIKE $${paramIndex})`;
      params.push(`%${searchQuery}%`);
      paramIndex++;
    }

    // Status Filter
    if (statusFilter !== 'all') {
      sqlQuery += ` AND status_pengiriman = $${paramIndex}`;
      countQuery += ` AND status_pengiriman = $${paramIndex}`;
      params.push(statusFilter);
      paramIndex++;
    }

    // Vehicle/Mode Filter
    if (modeFilter !== 'all') {
      sqlQuery += ` AND jenis_kendaraan = $${paramIndex}`;
      countQuery += ` AND jenis_kendaraan = $${paramIndex}`;
      params.push(modeFilter);
      paramIndex++;
    }

    // Retrieve total count for pagination
    const totalResult = await sql.query(countQuery, params);
    const totalCount = parseInt(totalResult.rows[0].count, 10);

    // Add ordering and pagination limits
    sqlQuery += ` ORDER BY id DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    // Fetch the shipments matching filters
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
// POST — Create a New Cargo Shipment with Unique Resi Code
// ============================================================
export async function POST(request: Request) {
  try {
    // Ensure table exists before inserting
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
      deskripsi
    } = body;

    // Validate Required Inputs
    if (!tanggal_kirim || !nama_pengirim || !nama_penerima || !jenis_kendaraan || !jenis_pengiriman) {
      return NextResponse.json(
        { error: 'Field tanggal_kirim, nama_pengirim, nama_penerima, jenis_kendaraan, dan jenis_pengiriman wajib diisi' },
        { status: 400 }
      );
    }

    // Auto-generate unique Resi Code (RESI-YYYYMMDD-XXXX where XXXX is a unique numeric stamp)
    const dateObj = new Date(tanggal_kirim);
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dd = String(dateObj.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}${mm}${dd}`;

    // Get number of shipments on that day to use as suffix or random sequence
    const countCheck = await sql`
      SELECT COUNT(*) FROM shipments WHERE DATE(tanggal_kirim) = ${tanggal_kirim};
    `;
    const sequenceNum = parseInt(countCheck.rows[0].count, 10) + 1;
    const randomSuffix = String(Math.floor(100 + Math.random() * 900)); // Adds high randomness to prevent resi collision
    const no_resi = `RESI-${dateStr}-${String(sequenceNum).padStart(3, '0')}${randomSuffix}`;

    // Default status to 'diproses' if not provided
    const finalStatus = status_pengiriman || 'diproses';

    // Insert new cargo record
    const result = await sql`
      INSERT INTO shipments (
        no_resi,
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
        deskripsi
      )
      VALUES (
        ${no_resi},
        ${tanggal_kirim},
        ${nama_pengirim},
        ${nama_penerima},
        ${no_telepon || null},
        ${kota_asal || null},
        ${kota_tujuan || null},
        ${jenis_barang || null},
        ${berat_kg ? parseFloat(berat_kg) : 0},
        ${harga_tarif ? parseFloat(harga_tarif) : 0},
        ${jenis_kendaraan},
        ${jenis_pengiriman},
        ${finalStatus},
        ${deskripsi || null}
      )
      RETURNING *;
    `;

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
