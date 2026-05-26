import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// ============================================================
// PUT — Update an Existing Cargo Shipment Record
// ============================================================
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Validate if the record exists
    const checkCargo = await sql`
      SELECT id FROM shipments WHERE id = ${id} LIMIT 1;
    `;

    if (checkCargo.rowCount === 0) {
      return NextResponse.json(
        { error: 'Cargo shipment tidak ditemukan' },
        { status: 404 }
      );
    }

    // Update cargo record in Neon Postgres
    const result = await sql`
      UPDATE shipments
      SET
        tanggal_kirim = ${tanggal_kirim},
        nama_pengirim = ${nama_pengirim},
        nama_penerima = ${nama_penerima},
        no_telepon = ${no_telepon || null},
        kota_asal = ${kota_asal || null},
        kota_tujuan = ${kota_tujuan || null},
        jenis_barang = ${jenis_barang || null},
        berat_kg = ${berat_kg ? parseFloat(berat_kg) : 0},
        harga_tarif = ${harga_tarif ? parseFloat(harga_tarif) : 0},
        jenis_kendaraan = ${jenis_kendaraan},
        jenis_pengiriman = ${jenis_pengiriman},
        status_pengiriman = ${status_pengiriman},
        status_barang = ${status_barang || 'aman'},
        status_transaksi = ${status_transaksi || 'belum_bayar'},
        deskripsi = ${deskripsi || null},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *;
    `;

    // Revalidate Next.js cache for the administration page
    revalidatePath('/admin/cargo');

    return NextResponse.json({
      status: 'success',
      data: result.rows[0]
    }, { status: 200 });

  } catch (error: any) {
    console.error(`[PUT /api/cargo/[id]] error for ID:`, error);
    return NextResponse.json(
      { error: 'Gagal memperbarui data cargo', detail: error.message },
      { status: 500 }
    );
  }
}

// ============================================================
// DELETE — Permanently Delete a Cargo Shipment Record
// ============================================================
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate if the record exists
    const checkCargo = await sql`
      SELECT id, no_resi FROM shipments WHERE id = ${id} LIMIT 1;
    `;

    if (checkCargo.rowCount === 0) {
      return NextResponse.json(
        { error: 'Cargo shipment tidak ditemukan' },
        { status: 404 }
      );
    }

    const resiNum = checkCargo.rows[0].no_resi;

    // Execute deletion from shipments
    await sql`
      DELETE FROM shipments WHERE id = ${id};
    `;

    return NextResponse.json({
      status: 'success',
      message: `Shipment dengan Resi ${resiNum} berhasil dihapus dari database`
    }, { status: 200 });

  } catch (error: any) {
    console.error(`[DELETE /api/cargo/[id]] error for ID:`, error);
    return NextResponse.json(
      { error: 'Gagal menghapus data cargo', detail: error.message },
      { status: 500 }
    );
  }
}
