// src/app/api/kapal/route.js
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import { Role, VehicleStatus, VehicleType } from '@prisma/client';

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

    // Match user by name or email dynamically
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: username, mode: 'insensitive' } },
          { name: { equals: username, mode: 'insensitive' } }
        ],
        deletedAt: null
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Akun tidak ditemukan' },
        { status: 404 }
      );
    }

    const role = user.role === Role.ADMIN ? 'Admin' : 'User';

    // Retrieve vehicles from PostgreSQL via Prisma
    const vehicles = await prisma.vehicle.findMany({
      orderBy: { createdAt: 'asc' }
    });

    const mappedArmada = vehicles.map(v => {
      // Map statuses: TERSEDIA -> 'DI PELABUHAN', DIPAKAI -> 'DALAM PERJALANAN', PERBAIKAN -> 'PEMELIHARAAN', NONAKTIF -> 'OFFLINE'
      let statusStr = 'DALAM PERJALANAN';
      if (v.status === VehicleStatus.TERSEDIA) {
        statusStr = 'DI PELABUHAN';
      } else if (v.status === VehicleStatus.PERBAIKAN) {
        statusStr = 'PEMELIHARAAN';
      } else if (v.status === VehicleStatus.NONAKTIF) {
        statusStr = 'OFFLINE';
      }

      let locationStr = 'Pelabuhan';
      let destStr = 'Tujuan';
      if (v.currentRoute) {
        const parts = v.currentRoute.split('→');
        if (parts.length >= 2) {
          locationStr = parts[0].trim();
          destStr = parts[1].trim();
        } else {
          locationStr = v.currentRoute;
        }
      }

      return {
        id: v.id,
        name: v.name,
        type: v.type === VehicleType.KAPAL ? 'Kapal Petikemas' : v.type === VehicleType.TRUCK ? 'Truck Trailer' : 'Pesawat Cargo',
        status: statusStr,
        location: locationStr,
        destination: destStr,
        eta: v.eta ? v.eta.toLocaleString('id-ID') : 'Tiba',
        cargo: 'Cargo Umum',
        latitude: v.latitude || 300,
        longitude: v.longitude || 200
      };
    });

    return NextResponse.json({
      status: 'success',
      role,
      akses_crud: role === 'Admin',
      armada: mappedArmada,
      total: mappedArmada.length
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

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: username, mode: 'insensitive' } },
          { name: { equals: username, mode: 'insensitive' } }
        ],
        deletedAt: null
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'Akun tidak ditemukan' }, { status: 404 });
    }

    if (user.role !== Role.ADMIN) {
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

    let prismaStatus = VehicleStatus.TERSEDIA;
    if (status === 'DALAM PERJALANAN') {
      prismaStatus = VehicleStatus.DIPAKAI;
    } else if (status === 'PEMELIHARAAN') {
      prismaStatus = VehicleStatus.PERBAIKAN;
    }

    let vehicleType = VehicleType.KAPAL;
    if (type.toUpperCase().includes('TRUCK')) {
      vehicleType = VehicleType.TRUCK;
    } else if (type.toUpperCase().includes('PESAWAT')) {
      vehicleType = VehicleType.PESAWAT;
    }

    const newVehicle = await prisma.vehicle.create({
      data: {
        name,
        type: vehicleType,
        plateNo: 'REG-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
        capacity: 15000,
        status: prismaStatus,
        currentRoute: location && destination ? `${location} → ${destination}` : null,
        eta: eta ? new Date(eta) : null,
        latitude: 300,
        longitude: 200
      }
    });

    return NextResponse.json({
      status: 'success',
      kapal: {
        id: newVehicle.id,
        name: newVehicle.name,
        type: newVehicle.type === VehicleType.KAPAL ? 'Kapal Petikemas' : newVehicle.type === VehicleType.TRUCK ? 'Truck Trailer' : 'Pesawat Cargo',
        status: status,
        location: location || '',
        destination: destination || '',
        eta: eta || 'Tiba',
        cargo: cargo || 'Cargo Umum'
      }
    }, { status: 201 });

  } catch (error) {
    console.error('[POST /api/kapal]', error);
    return NextResponse.json(
      { error: 'Gagal menambah kapal', detail: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id       = searchParams.get('id');
    const username = searchParams.get('username');

    if (!username || username.trim() === '') {
      return NextResponse.json({ error: 'Username diperlukan' }, { status: 400 });
    }

    if (!id) {
      return NextResponse.json({ error: 'ID armada diperlukan' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: username, mode: 'insensitive' } },
          { name: { equals: username, mode: 'insensitive' } }
        ],
        deletedAt: null
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'Akun tidak ditemukan' }, { status: 404 });
    }

    if (user.role !== Role.ADMIN) {
      return NextResponse.json({ error: 'Hanya Admin yang bisa menghapus armada' }, { status: 403 });
    }

    const deleted = await prisma.vehicle.delete({
      where: { id }
    });

    return NextResponse.json({
      status: 'success',
      deleted: {
        id_kapal: deleted.id,
        nama_kapal: deleted.name
      }
    }, { status: 200 });

  } catch (error) {
    console.error('[DELETE /api/kapal]', error);
    return NextResponse.json(
      { error: 'Gagal menghapus armada', detail: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id       = searchParams.get('id');
    const username = searchParams.get('username');

    if (!username || username.trim() === '') {
      return NextResponse.json({ error: 'Username diperlukan' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: username, mode: 'insensitive' } },
          { name: { equals: username, mode: 'insensitive' } }
        ],
        deletedAt: null
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'Akun tidak ditemukan' }, { status: 404 });
    }

    if (user.role !== Role.ADMIN) {
      return NextResponse.json({ error: 'Hanya Admin yang bisa memperbarui armada' }, { status: 403 });
    }

    const body = await request.json();
    const finalId = id || body.id;

    if (!finalId) {
      return NextResponse.json({ error: 'ID armada diperlukan' }, { status: 400 });
    }

    const { name, type, status, location, destination, eta, cargo } = body;

    if (!name || !type || !status) {
      return NextResponse.json(
        { error: 'Field name, type, dan status wajib diisi' },
        { status: 400 }
      );
    }

    let prismaStatus = VehicleStatus.TERSEDIA;
    if (status === 'DALAM PERJALANAN') {
      prismaStatus = VehicleStatus.DIPAKAI;
    } else if (status === 'PEMELIHARAAN') {
      prismaStatus = VehicleStatus.PERBAIKAN;
    }

    let vehicleType = VehicleType.KAPAL;
    if (type.toUpperCase().includes('TRUCK')) {
      vehicleType = VehicleType.TRUCK;
    } else if (type.toUpperCase().includes('PESAWAT')) {
      vehicleType = VehicleType.PESAWAT;
    }

    const updated = await prisma.vehicle.update({
      where: { id: finalId },
      data: {
        name,
        type: vehicleType,
        status: prismaStatus,
        currentRoute: location && destination ? `${location} → ${destination}` : null,
        eta: eta ? new Date(eta) : null
      }
    });

    return NextResponse.json({
      status: 'success',
      kapal: {
        id: updated.id,
        name: updated.name,
        type: updated.type === VehicleType.KAPAL ? 'Kapal Petikemas' : updated.type === VehicleType.TRUCK ? 'Truck Trailer' : 'Pesawat Cargo',
        status: status,
        location: location || '',
        destination: destination || '',
        eta: eta || 'Tiba',
        cargo: cargo || 'Cargo Umum'
      }
    }, { status: 200 });

  } catch (error) {
    console.error('[PUT /api/kapal]', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui armada', detail: error.message },
      { status: 500 }
    );
  }
}