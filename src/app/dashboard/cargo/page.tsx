// src/app/dashboard/cargo/page.tsx
import React from 'react'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { CargoDashboardClient } from '@/components/cargo/CargoDashboardClient'
import { ShipmentStatus, ShippingType, VehicleType } from '@prisma/client'

export type CargoShipment = {
  id: string
  no_resi: string
  tanggal_kirim: string
  nama_pengirim: string
  nama_penerima: string
  no_telepon: string
  kota_asal: string
  kota_tujuan: string
  jenis_barang: string
  berat_kg: number
  harga_tarif: number
  jenis_kendaraan: string
  vehicleId: string | null
  vehicleName: string | null
  jenis_pengiriman: string
  status_pengiriman: string
  status_barang: string
  status_transaksi: string
  deskripsi: string | null
  eta?: string | null
  currentLocation?: string | null
  metode_pembayaran?: string | null
}

export type VehicleOption = {
  id: string
  name: string
  type: VehicleType
  plateNo: string
  capacity: number
  status: string
}

export type PaginationMeta = {
  total: number
  page: number
  limit: number
  totalPages: number
}

type PageProps = {
  searchParams: Promise<{
    q?: string
    status?: string
    mode?: string
    page?: string
  }>
}

// ─────────────────────────────────────────────────────────────
// HELPER: Map Prisma Shipment → Frontend Format
// ─────────────────────────────────────────────────────────────
function mapShipmentToCargo(s: any): CargoShipment {
  return {
    id: s.id,
    no_resi: s.receiptNo,
    tanggal_kirim: s.shipmentDate.toISOString(),
    nama_pengirim: s.senderName,
    nama_penerima: s.receiverName,
    no_telepon: s.receiverTelp || '',
    kota_asal: s.origin,
    kota_tujuan: s.destination,
    jenis_barang: s.itemName,
    berat_kg: s.weight,
    harga_tarif: s.tariff,
    jenis_kendaraan: s.shippingType.toLowerCase(),
    vehicleId: s.vehicleId,
    vehicleName: s.vehicle?.name || null,
    jenis_pengiriman: 'biasa', // Bisa diextend nanti
    status_pengiriman: s.status.toLowerCase(),
    status_barang: 'aman', // Default, bisa diextend
    status_transaksi: s.paymentStatus?.toLowerCase() || 'belum_bayar',
    metode_pembayaran: s.paymentMethod || 'TUNAI',
    deskripsi: s.notes || null,
    eta: s.eta?.toISOString() || null,
    currentLocation: s.currentLocation || null
  }
}

// ─────────────────────────────────────────────────────────────
// HELPER: Map Prisma Vehicle → Frontend Option
// ─────────────────────────────────────────────────────────────
function mapVehicleToOption(v: any): VehicleOption {
  return {
    id: v.id,
    name: v.name,
    type: v.type,
    plateNo: v.plateNo,
    capacity: v.capacity,
    status: v.status
  }
}

// ─────────────────────────────────────────────────────────────
// MAIN SERVER COMPONENT
// ─────────────────────────────────────────────────────────────
export default async function DashboardCargoPage({ searchParams }: PageProps) {
  // 1. Session & Role Check
  const session = await auth()
  
  if (!session?.user) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', background: '#07020E', color: 'white', fontFamily: 'monospace', padding: '24px' }}>
        <div style={{ background: '#0D0618', border: '1px solid #EF4444', borderRadius: '12px', padding: '40px', maxWidth: '520px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px' }}>🔐</div>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#EF4444', margin: '16px 0' }}>LOGIN DIBUTUHKAN</h2>
          <p style={{ color: '#C7B8EA', fontSize: '12px' }}>Silakan login untuk mengakses dashboard kargo.</p>
        </div>
      </div>
    )
  }

  const role = (session.user as any).role as 'ADMIN' | 'CUSTOMER'
  const userId = (session.user as any).id as string

  // 2. Parse Search Params (Next.js 15/16 App Router)
  const params = await searchParams
  const q = params.q || ''
  const statusFilter = params.status || 'all'
  const modeFilter = params.mode || 'all'
  const pageParam = params.page || '1'

  const pageNum = Math.max(1, parseInt(pageParam, 10) || 1)
  const limit = 10
  const offset = (pageNum - 1) * limit

  // 3. Build Prisma Where Clause
  const whereClause: any = {}

  // ✅ Customer hanya lihat data sendiri, Admin lihat semua
  if (role !== 'ADMIN') {
    whereClause.userId = userId
  }

  // Search filter supporting bulk tracking (multiple comma/space/semicolon separated receipt numbers)
  if (q.trim() !== '') {
    const qList = q.split(/[\s,;]+/).map(item => item.trim()).filter(item => item.length > 0)
    // If the query contains multiple items, perform an exact IN match on receiptNo (Bulk Tracking)
    if (qList.length > 1) {
      whereClause.receiptNo = { in: qList }
    } else {
      whereClause.OR = [
        { receiptNo: { contains: q, mode: 'insensitive' as const } },
        { senderName: { contains: q, mode: 'insensitive' as const } },
        { receiverName: { contains: q, mode: 'insensitive' as const } },
        { itemName: { contains: q, mode: 'insensitive' as const } }
      ]
    }
  }

  // Status filter (pakai enum Prisma)
  if (statusFilter !== 'all' && Object.values(ShipmentStatus).includes(statusFilter.toUpperCase() as ShipmentStatus)) {
    whereClause.status = statusFilter.toUpperCase() as ShipmentStatus
  }

  // Shipping type filter (pakai enum Prisma)
  if (modeFilter !== 'all' && Object.values(ShippingType).includes(modeFilter.toUpperCase() as ShippingType)) {
    whereClause.shippingType = modeFilter.toUpperCase() as ShippingType
  }

  // 4. Fetch Data dari Database
  let total = 0
  let laut = 0
  let selesai = 0
  let shipments: any[] = []
  let vehicles: any[] = []

  try {
    // Count stats (untuk metrics panel) in parallel (respecting search and role parameters)
    const [
      totalCount,
      lautCount,
      selesaiCount
    ] = await Promise.all([
      prisma.shipment.count({ where: whereClause }),
      prisma.shipment.count({ where: { ...whereClause, shippingType: 'LAUT' } }),
      prisma.shipment.count({ where: { ...whereClause, status: 'SELESAI' } })
    ])

    total = totalCount
    laut = lautCount
    selesai = selesaiCount

    // Fetch shipments with vehicle relation
    shipments = await prisma.shipment.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
      include: {
        vehicle: {
          select: {
            id: true,
            name: true,
            type: true,
            plateNo: true,
            capacity: true,
            status: true,
            latitude: true,
            longitude: true
          }
        }
      }
    })

    // Fetch vehicles untuk dropdown form (hanya ADMIN yang butuh)
    if (role === 'ADMIN') {
      vehicles = await prisma.vehicle.findMany({
        where: { status: 'TERSEDIA' }, // Hanya yang available
        orderBy: { name: 'asc' }
      })
    }
  } catch (error: any) {
    console.error('[DashboardCargoPage] Database error:', error)
    // Return error UI yang user-friendly
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', background: '#07020E', color: 'white', fontFamily: 'monospace', padding: '24px' }}>
        <div style={{ background: '#0D0618', border: '1px solid #F59E0B', borderRadius: '12px', padding: '40px', maxWidth: '520px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px' }}>⚠️</div>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#F59E0B', margin: '16px 0' }}>KONEKSI DATABASE GAGAL</h2>
          <p style={{ color: '#C7B8EA', fontSize: '12px' }}>Tidak dapat memuat data kargo. Silakan coba beberapa saat lagi.</p>
          <details style={{ marginTop: '16px', textAlign: 'left', fontSize: '10px', color: '#6B7280' }}>
            <summary>Debug Info (Development Only)</summary>
            <pre style={{ whiteSpace: 'pre-wrap', marginTop: '8px' }}>{error.message}</pre>
          </details>
        </div>
      </div>
    )
  }

  // 5. Map Data ke Format Frontend
  const mappedShipments = shipments.map(mapShipmentToCargo)
  const serializedVehicles = vehicles.map(mapVehicleToOption)

  // 6. Render Client Component
  return (
    <CargoDashboardClient
      role={role}
      initialShipments={mappedShipments}
      ships={serializedVehicles}
      stats={{
        total,
        laut,
        selesai
      }}
      pagination={{
        total,
        page: pageNum,
        limit,
        totalPages: Math.ceil(total / limit) || 1
      }}
    />
  )
}