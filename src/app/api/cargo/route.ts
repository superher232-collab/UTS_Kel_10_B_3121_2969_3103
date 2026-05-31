// src/app/api/cargo/route.ts
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { ShipmentStatus, ShippingType, PaymentStatus } from '@prisma/client'

// Pre-defined shipping distance matrix for major Indonesian hubs (BR-05)
const PORT_DISTANCES: Record<string, Record<string, number>> = {
  jakarta: { surabaya: 800, makassar: 1400, medan: 1900, balikpapan: 1200 },
  surabaya: { jakarta: 800, makassar: 800, medan: 2500, balikpapan: 900 },
  makassar: { jakarta: 1400, surabaya: 800, medan: 3000, balikpapan: 600 },
  medan: { jakarta: 1900, surabaya: 2500, makassar: 3000, balikpapan: 2800 },
  balikpapan: { jakarta: 1200, surabaya: 900, makassar: 600, medan: 2800 }
}

const VEHICLE_COEFFICIENTS = {
  DARAT: 2000,
  LAUT: 1500,
  UDARA: 5000
}

function getDistance(origin: string, destination: string): number {
  const o = origin.trim().toLowerCase()
  const d = destination.trim().toLowerCase()
  if (o === d) return 0
  return PORT_DISTANCES[o]?.[d] || PORT_DISTANCES[d]?.[o] || 500 // Fallback distance: 500 km
}

function calculateTariff(weight: number, distanceKm: number, type: ShippingType): number {
  if (weight < 0.1) return 0
  const coeff = VEHICLE_COEFFICIENTS[type] || 1500
  const baseFee = 25000
  return Math.round((distanceKm * weight * coeff) + baseFee)
}

// Map database fields to API format (backward-compatible)
function mapShipmentToApi(s: any) {
  return {
    id: s.id,
    no_resi: s.receiptNo,
    tanggal_kirim: s.shipmentDate.toISOString().split('T')[0],
    nama_pengirim: s.senderName,
    nama_penerima: s.receiverName,
    no_telepon: s.receiverTelp,
    kota_asal: s.origin,
    kota_tujuan: s.destination,
    jenis_barang: s.itemName,
    berat_kg: s.weight,
    harga_tarif: s.tariff,
    jenis_kendaraan: s.shippingType,
    jenis_pengiriman: 'biasa',
    status_pengiriman: s.status.toLowerCase(),
    status_barang: 'aman',
    status_transaksi: s.paymentStatus.toLowerCase(),
    deskripsi: s.notes,
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
    userId: s.userId,
    vehicleId: s.vehicleId,
    vehicleName: s.vehicle?.name || null
  }
}

// ============================================================
// GET — Retrieve Cargo (Isolated by role, BR-01)
// ============================================================
export async function GET(request: Request) {
  try {
    const session: any = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized: Please login' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const searchQuery = searchParams.get('q') || ''
    const statusFilter = searchParams.get('status') || 'all'
    const modeFilter = searchParams.get('mode') || 'all'
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const offset = (page - 1) * limit

    const whereClause: any = {}

    // Enforce data isolation (BR-01)
    if (session.user.role !== 'ADMIN') {
      whereClause.userId = session.user.id
    }

    // Search filter
    if (searchQuery.trim() !== '') {
      whereClause.OR = [
        { receiptNo: { contains: searchQuery, mode: 'insensitive' } },
        { senderName: { contains: searchQuery, mode: 'insensitive' } },
        { receiverName: { contains: searchQuery, mode: 'insensitive' } },
        { itemName: { contains: searchQuery, mode: 'insensitive' } }
      ]
    }

    // Status filter
    if (statusFilter !== 'all') {
      const formattedStatus = statusFilter.toUpperCase() as ShipmentStatus
      if (Object.values(ShipmentStatus).includes(formattedStatus)) {
        whereClause.status = formattedStatus
      }
    }

    // Shipping Type filter
    if (modeFilter !== 'all') {
      const formattedType = modeFilter.toUpperCase() as ShippingType
      if (Object.values(ShippingType).includes(formattedType)) {
        whereClause.shippingType = formattedType
      }
    }

    // Execute queries
    const totalCount = await prisma.shipment.count({ where: whereClause })
    const shipments = await prisma.shipment.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
      include: {
        vehicle: {
          select: { name: true }
        }
      }
    })

    const mappedData = shipments.map(mapShipmentToApi)

    return NextResponse.json({
      status: 'success',
      data: mappedData,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit) || 1
      }
    }, { status: 200 })

  } catch (error: any) {
    console.error('[GET /api/cargo] error:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil data cargo dari database', detail: error.message },
      { status: 500 }
    )
  }
}

// ============================================================
// POST — Create Cargo (Role-compliant, auto pricing)
// ============================================================
export async function POST(request: Request) {
  try {
    const session: any = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized: Please login' }, { status: 401 })
    }

    const body = await request.json()
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
      deskripsi,
      targetUserId // Admins can book for other users (optional)
    } = body

    // Validation checks
    if (!tanggal_kirim || !nama_pengirim || !nama_penerima || !jenis_kendaraan || !kota_asal || !kota_tujuan) {
      return NextResponse.json(
        { error: 'Field tanggal_kirim, nama_pengirim, nama_penerima, jenis_kendaraan, kota_asal, dan kota_tujuan wajib diisi' },
        { status: 400 }
      )
    }

    const weight = berat_kg ? parseFloat(berat_kg) : 0
    if (weight < 0.1) {
      return NextResponse.json(
        { error: 'VAL-001: Berat minimal kargo adalah 0.1 kg', code: 'VAL-001' },
        { status: 400 }
      )
    }

    // Determine the user ownership
    let finalUserId = session.user.id
    if (session.user.role === 'ADMIN' && targetUserId) {
      finalUserId = targetUserId
    }

    // Validate transport type enum
    let shippingType: ShippingType = ShippingType.LAUT
    const uppercaseType = jenis_kendaraan.toUpperCase() as ShippingType
    if (Object.values(ShippingType).includes(uppercaseType)) {
      shippingType = uppercaseType
    }

    // Generate unique Resi Code (BR-06)
    const dateObj = new Date(tanggal_kirim)
    const yyyy = dateObj.getFullYear()
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0')
    const dd = String(dateObj.getDate()).padStart(2, '0')
    const dateStr = `${yyyy}${mm}${dd}`
    const randomSuffix = String(Math.floor(1000 + Math.random() * 9000))
    const receiptNo = `CRG-${dateStr}-${randomSuffix}`

    // Calculate rates automatically (BR-05)
    let tariff = harga_tarif ? parseFloat(harga_tarif) : 0
    if (tariff <= 0) {
      const distance = getDistance(kota_asal, kota_tujuan)
      tariff = calculateTariff(weight, distance, shippingType)
    }

    // Save shipment into database
    const shipment = await prisma.shipment.create({
      data: {
        receiptNo,
        shipmentDate: dateObj,
        senderName: nama_pengirim,
        receiverName: nama_penerima,
        receiverTelp: no_telepon || '',
        origin: kota_asal,
        destination: kota_tujuan,
        itemName: jenis_barang || 'Cargo Package',
        weight,
        tariff,
        shippingType,
        status: ShipmentStatus.DIPROSES,
        paymentStatus: PaymentStatus.BELUM_BAYAR,
        notes: deskripsi || null,
        userId: finalUserId
      },
      include: {
        vehicle: true
      }
    })

    return NextResponse.json({
      status: 'success',
      data: mapShipmentToApi(shipment)
    }, { status: 201 })

  } catch (error: any) {
    console.error('[POST /api/cargo] error:', error)
    return NextResponse.json(
      { error: 'Gagal menambahkan cargo shipment baru', detail: error.message },
      { status: 500 }
    )
  }
}