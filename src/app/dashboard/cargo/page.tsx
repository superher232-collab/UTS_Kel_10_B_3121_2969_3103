import React from 'react'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { CargoDashboardClient } from '@/components/cargo/CargoDashboardClient'

type PageProps = {
  searchParams: Promise<{
    q?: string
    status?: string
    mode?: string
    page?: string
  }>
}

export default async function DashboardCargoPage({ searchParams }: PageProps) {
  // 1. Session Otorisasi Guard
  const session = await auth()
  
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        background: '#07020E',
        color: 'white',
        fontFamily: 'monospace',
        padding: '24px',
        boxSizing: 'border-box'
      }}>
        <div style={{
          background: '#0D0618',
          border: '1px solid #EF4444',
          borderRadius: '12px',
          padding: '40px',
          width: '90%',
          maxWidth: '520px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 20px rgba(239, 68, 68, 0.2)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div style={{ fontSize: '48px' }}>⚠️</div>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '2px', color: '#EF4444', margin: 0 }}>AKSES DITOLAK / UNAUTHORIZED</h2>
          <p style={{ color: '#C7B8EA', fontSize: '12px', lineHeight: '1.6', margin: 0 }}>
            Halaman pusat kontrol kargo multi-modal memerlukan hak akses **Administrator**. Anda tidak diizinkan masuk ke ruang kendali data.
          </p>
        </div>
      </div>
    )
  }

  // 2. Await search params in Next.js 15/16 App Router
  const params = await searchParams
  const q = params.q || ''
  const status = params.status || 'all'
  const mode = params.mode || 'all'
  const page = params.page || '1'

  const pageNum = parseInt(page, 10) || 1
  const limit = 10
  const offset = (pageNum - 1) * limit

  // 3. Build Prisma Filter clause
  const whereClause: any = {}

  if (q.trim() !== '') {
    whereClause.OR = [
      { receiptNo: { contains: q, mode: 'insensitive' } },
      { senderName: { contains: q, mode: 'insensitive' } },
      { receiverName: { contains: q, mode: 'insensitive' } },
      { itemName: { contains: q, mode: 'insensitive' } }
    ]
  }

  if (status !== 'all') {
    whereClause.status = status.toUpperCase()
  }

  if (mode !== 'all') {
    whereClause.shippingType = mode.toUpperCase()
  }

  let total = 0
  let shipments: any[] = []

  let ships: any[] = []

  try {
    // 4. Fetch data from PostgreSQL using indexed query
    total = await prisma.shipment.count({ where: whereClause })
    shipments = await prisma.shipment.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
      include: {
        vehicle: true
      }
    })

    // 5. Fetch available ships for CargoForm dropdown
    ships = await prisma.vehicle.findMany({
      where: { type: 'KAPAL' },
      orderBy: { name: 'asc' }
    })
  } catch (error) {
    console.error('[DashboardCargoPage] DB Error caught:', error)
    // Throw error so error.tsx handles DB failures
    throw new Error('Gagal menghubungkan ke database kargo PostgreSQL.')
  }

  // 6. Map DB Shipment fields to camelCase/snakeCase expected by legacy frontend
  const mappedShipments = shipments.map((s) => ({
    id: s.id,
    no_resi: s.receiptNo,
    tanggal_kirim: s.shipmentDate.toISOString(),
    nama_pengirim: s.senderName,
    nama_penerima: s.receiverName,
    no_telepon: s.receiverTelp,
    kota_asal: s.origin,
    kota_tujuan: s.destination,
    jenis_barang: s.itemName,
    berat_kg: s.weight,
    harga_tarif: s.tariff,
    jenis_kendaraan: s.shippingType.toLowerCase(),
    vehicleId: s.vehicleId || '',
    vehicleName: (s as any).vehicle?.name || '',
    jenis_pengiriman: 'biasa',
    status_pengiriman: s.status.toLowerCase(),
    status_barang: 'aman',
    status_transaksi: 'belum_bayar',
    deskripsi: s.notes || ''
  }))

  // 7. Serialize ships for client component
  const serializedShips = ships.map((v) => ({
    id: v.id,
    name: v.name,
    type: v.type,
    plateNo: v.plateNo,
    capacity: v.capacity,
    status: v.status
  }))

  return (
    <CargoDashboardClient
      initialShipments={mappedShipments}
      ships={serializedShips}
      pagination={{
        total,
        page: pageNum,
        limit,
        totalPages: Math.ceil(total / limit) || 1
      }}
    />
  )
}
