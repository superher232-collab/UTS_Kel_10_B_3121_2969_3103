import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';


export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username || username.trim() === '') {
      return NextResponse.json(
        { error: 'Username diperlukan' },
        { status: 400 }
      );
    }

    const userCheck = await sql`
      SELECT role, id_pelanggan 
      FROM tb_akun 
      WHERE username = ${username}
      LIMIT 1;
    `;

    if (userCheck.rowCount === 0) {
      return NextResponse.json(
        { error: 'Akun tidak ditemukan' },
        { status: 404 }
      );
    }

    const { role, id_pelanggan } = userCheck.rows[0];

    let dataArmada;

    if (role === 'Admin') {
      dataArmada = await sql`
        SELECT 
          id_kapal          AS id,
          nama_kapal        AS name,
          jenis_kapal       AS type,
          status_pergerakan AS status,
          lokasi_terkini    AS location,
          tujuan            AS destination,
          eta,
          cargo,
          latitude,
          longitude
        FROM tb_kapal 
        ORDER BY id_kapal ASC;
      `;
    } else if (role === 'User') {
      dataArmada = await sql`
        SELECT 
          id_kapal          AS id,
          nama_kapal        AS name,
          jenis_kapal       AS type,
          status_pergerakan AS status,
          lokasi_terkini    AS location,
          tujuan            AS destination,
          eta,
          cargo,
          latitude,
          longitude
        FROM tb_kapal 
        ORDER BY id_kapal ASC;
      `;
    } else {
      return NextResponse.json(
        { error: `Role '${role}' tidak dikenali sistem` },
        { status: 403 }
      );
    }

    return NextResponse.json({
      status: 'success',
      role,
      akses_crud: role === 'Admin',
      armada: dataArmada.rows,
      total: dataArmada.rowCount
    }, { status: 200 });

  } catch (error) {
    console.error('[GET /api/kapal]', error);
    return NextResponse.json(
      { error: 'Gagal konek ke database', detail: error.message },
      { status: 500 }
    );
  }
}


export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username || username.trim() === '') {
      return NextResponse.json(
        { error: 'Username diperlukan' },
        { status: 400 }
      );
    }

    const userCheck = await sql`
      SELECT role FROM tb_akun WHERE username = ${username} LIMIT 1;
    `;

    if (userCheck.rowCount === 0) {
      return NextResponse.json({ error: 'Akun tidak ditemukan' }, { status: 404 });
    }

    if (userCheck.rows[0].role !== 'Admin') {
      return NextResponse.json({ error: 'Hanya Admin yang bisa menambah kapal' }, { status: 403 });
    }

    const body = await request.json();
    const { name, type, status, location, destination, eta, cargo } = body;

    if (!name || !type || !status) {
      return NextResponse.json(
        { error: 'Field name, type, dan status wajib diisi' },
        { status: 400 }
      );
    }

    // Sanitize empty strings to null to prevent invalid syntax casting (especially for timestamps)
    const finalLocation = (location && location.trim() !== '') ? location : null;
    const finalDestination = (destination && destination.trim() !== '') ? destination : null;
    const finalEta = (eta && eta.trim() !== '') ? eta : null;
    const finalCargo = (cargo && cargo.trim() !== '') ? cargo : null;

    // Auto-generate id_kapal (e.g. KPL-009) by finding maximum existing ID in tb_kapal
    const maxIdRes = await sql`
      SELECT id_kapal FROM tb_kapal 
      ORDER BY id_kapal DESC 
      LIMIT 1;
    `;
    let nextId = 'KPL-009';
    if (maxIdRes.rowCount > 0) {
      const lastId = maxIdRes.rows[0].id_kapal;
      const match = lastId.match(/KPL-(\d+)/i);
      if (match) {
        const nextNum = parseInt(match[1]) + 1;
        nextId = `KPL-${String(nextNum).padStart(3, '0')}`;
      }
    }

    const result = await sql`
      INSERT INTO tb_kapal (id_kapal, nama_kapal, jenis_kapal, status_pergerakan, lokasi_terkini, tujuan, eta, cargo)
      VALUES (
        ${nextId},
        ${name},
        ${type},
        ${status},
        ${finalLocation},
        ${finalDestination},
        ${finalEta},
        ${finalCargo}
      )
      RETURNING 
        id_kapal          AS id,
        nama_kapal        AS name,
        jenis_kapal       AS type,
        status_pergerakan AS status,
        lokasi_terkini    AS location,
        tujuan            AS destination,
        eta,
        cargo;
    `;

    return NextResponse.json({
      status: 'success',
      kapal: result.rows[0]
    }, { status: 201 });

  } catch (error) {
    console.error('[POST /api/kapal]', error);
    return NextResponse.json(
      { error: 'Gagal menambah kapal', detail: error.message },
      { status: 500 }
    );
  }
}

// ============================================================
// DELETE — Hapus kapal by ID (Admin only)
// ============================================================
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id       = searchParams.get('id');
    const username = searchParams.get('username');

    if (!username || username.trim() === '') {
      return NextResponse.json({ error: 'Username diperlukan' }, { status: 400 });
    }

    if (!id) {
      return NextResponse.json({ error: 'ID kapal diperlukan' }, { status: 400 });
    }

    const userCheck = await sql`
      SELECT role FROM tb_akun WHERE username = ${username} LIMIT 1;
    `;

    if (userCheck.rowCount === 0) {
      return NextResponse.json({ error: 'Akun tidak ditemukan' }, { status: 404 });
    }

    if (userCheck.rows[0].role !== 'Admin') {
      return NextResponse.json({ error: 'Hanya Admin yang bisa menghapus kapal' }, { status: 403 });
    }

    const kapalCheck = await sql`
      SELECT id_kapal FROM tb_kapal WHERE id_kapal = ${id} LIMIT 1;
    `;

    if (kapalCheck.rowCount === 0) {
      return NextResponse.json({ error: 'Kapal tidak ditemukan' }, { status: 404 });
    }

    const result = await sql`
      DELETE FROM tb_kapal WHERE id_kapal = ${id} RETURNING *;
    `;

    return NextResponse.json({
      status: 'success',
      deleted: result.rows[0]
    }, { status: 200 });

  } catch (error) {
    console.error('[DELETE /api/kapal]', error);
    return NextResponse.json(
      { error: 'Gagal menghapus kapal', detail: error.message },
      { status: 500 }
    );
  }
}

// ============================================================
// PUT — Update kapal by ID (Admin only)
// ============================================================
export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id       = searchParams.get('id');
    const username = searchParams.get('username');

    if (!username || username.trim() === '') {
      return NextResponse.json({ error: 'Username diperlukan' }, { status: 400 });
    }

    const userCheck = await sql`
      SELECT role FROM tb_akun WHERE username = ${username} LIMIT 1;
    `;

    if (userCheck.rowCount === 0) {
      return NextResponse.json({ error: 'Akun tidak ditemukan' }, { status: 404 });
    }

    if (userCheck.rows[0].role !== 'Admin') {
      return NextResponse.json({ error: 'Hanya Admin yang bisa memperbarui kapal' }, { status: 403 });
    }

    const body = await request.json();
    const finalId = id || body.id;

    if (!finalId) {
      return NextResponse.json({ error: 'ID kapal diperlukan' }, { status: 400 });
    }

    const { name, type, status, location, destination, eta, cargo } = body;

    if (!name || !type || !status) {
      return NextResponse.json(
        { error: 'Field name, type, dan status wajib diisi' },
        { status: 400 }
      );
    }

    // Sanitize empty strings to null to prevent invalid syntax casting (especially for timestamps)
    const finalLocation = (location && location.trim() !== '') ? location : null;
    const finalDestination = (destination && destination.trim() !== '') ? destination : null;
    const finalEta = (eta && eta.trim() !== '') ? eta : null;
    const finalCargo = (cargo && cargo.trim() !== '') ? cargo : null;

    const kapalCheck = await sql`
      SELECT id_kapal FROM tb_kapal WHERE id_kapal = ${finalId} LIMIT 1;
    `;

    if (kapalCheck.rowCount === 0) {
      return NextResponse.json({ error: 'Kapal tidak ditemukan' }, { status: 404 });
    }

    const result = await sql`
      UPDATE tb_kapal 
      SET 
        nama_kapal        = ${name},
        jenis_kapal       = ${type},
        status_pergerakan = ${status},
        lokasi_terkini    = ${finalLocation},
        tujuan            = ${finalDestination},
        eta               = ${finalEta},
        cargo             = ${finalCargo}
      WHERE id_kapal = ${finalId}
      RETURNING 
        id_kapal          AS id,
        nama_kapal        AS name,
        jenis_kapal       AS type,
        status_pergerakan AS status,
        lokasi_terkini    AS location,
        tujuan            AS destination,
        eta,
        cargo;
    `;

    return NextResponse.json({
      status: 'success',
      kapal: result.rows[0]
    }, { status: 200 });

  } catch (error) {
    console.error('[PUT /api/kapal]', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui kapal', detail: error.message },
      { status: 500 }
    );
  }
}