// src/app/api/shipments/route.ts
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { ShipmentStatus, ShippingType, PaymentStatus, Role } from '@prisma/client'
import { z } from 'zod'
import { logAudit } from '@/lib/audit'

// Pre-defined shipping distance matrix for major hubs (BR-05)
const PORT_DISTANCES: Record<string, Record<string, number>> = {
  jakarta: { surabaya: 800, makassar: 1400, medan: 1900, balikpapan: 1200 },
  surabaya: { jakarta: 800, makassar: 800, medan: 2500, balikpapan: 900 },
  makassar: { jakarta: 1400, surabaya: 800, medan: 3000, balikpapan: 600 },
  medan: { jakarta: 1900, surabaya: 2500, makassar: 3000, balikpapan: 2800 },
  balikpapan: { jakarta: 1200, surabaya: 900, makassar: 600, medan: 2800 }
}

const VEHICLE_COEFFICIENTS = {
  LAUT: 1500
}

function getDistance(origin: string, destination: string): number {
  const o = origin.trim().toLowerCase()
  const d = destination.trim().toLowerCase()
  if (o === d) return 0
  return PORT_DISTANCES[o]?.[d] || PORT_DISTANCES[d]?.[o] || 500
}

function calculateTariff(weight: number, distanceKm: number, type: ShippingType): number {
  if (weight < 0.1) return 0
  const coeff = VEHICLE_COEFFICIENTS[type] || 1500
  const baseFee = 25000
  return Math.round((distanceKm * weight * coeff) + baseFee)
}

const CreateShipmentSchema = z.object({
  senderName: z.string().min(1, 'Nama pengirim wajib diisi'),
  receiverName: z.string().min(1, 'Nama penerima wajib diisi'),
  receiverTelp: z.string().regex(/^\+?[0-9\s-]{6,16}$/, 'Format nomor telepon tidak valid'),
  origin: z.string().min(1, 'Kota asal wajib diisi'),
  destination: z.string().min(1, 'Kota tujuan wajib diisi'),
  itemName: z.string().min(1, 'Nama barang wajib diisi'),
  weight: z.number().refine(w => w >= 0.1, {
    message: 'VAL-001: Berat minimal kargo adalah 0.1 kg'
  }),
  shippingType: z.enum(['LAUT']),
  notes: z.string().optional().nullable()
}).refine((data) => data.origin.trim().toLowerCase() !== data.destination.trim().toLowerCase(), {
  message: 'Kota asal dan tujuan tidak boleh sama',
  path: ['destination']
})

const generateReceiptNo = (): string => {
  const year = new Date().getFullYear().toString()
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `PM-${year}-${randomStr}`
}

// GET list of shipments (paginated and status filtered, isolated by session role, BR-01)
export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized: Please login' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const statusFilter = searchParams.get('status') || 'all'
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const offset = (page - 1) * limit

    const whereClause: {
      userId?: string
      status?: ShipmentStatus
    } = {}

    // HARD RULE: Customer queries are strictly isolated
    if (session.user.role !== 'ADMIN') {
      whereClause.userId = session.user.id
    }

    if (statusFilter !== 'all') {
      whereClause.status = statusFilter.toUpperCase() as ShipmentStatus
    }

    const total = await prisma.shipment.count({ where: whereClause })
    const shipments = await prisma.shipment.findMany({
      where: whereClause,
      skip: offset,
      take: limit,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      data: shipments,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error: unknown) {
    const err = error as Error
    return NextResponse.json({ error: 'Retrieval failed', message: err.message }, { status: 500 })
  }
}

// POST create shipment (auto-receipt and auto-pricing calculation)
export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized: Please login' }, { status: 401 })
    }

    const body: unknown = await request.json()
    const validated = CreateShipmentSchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json({
        error: 'Validation failed',
        details: validated.error.flatten().fieldErrors
      }, { status: 400 })
    }

    const {
      senderName,
      receiverName,
      receiverTelp,
      origin,
      destination,
      itemName,
      weight,
      shippingType,
      notes
    } = validated.data

    const distance = getDistance(origin, destination)
    const computedTariff = calculateTariff(weight, distance, shippingType as ShippingType)
    const receiptNo = generateReceiptNo()

    const shipment = await prisma.shipment.create({
      data: {
        receiptNo,
        senderName,
        receiverName,
        receiverTelp,
        origin,
        destination,
        itemName,
        weight,
        tariff: computedTariff,
        shippingType: shippingType as ShippingType,
        status: ShipmentStatus.DIPROSES,
        paymentStatus: PaymentStatus.BELUM_BAYAR,
        notes,
        userId: session.user.id
      }
    })

    await logAudit({
      userId: session.user.id,
      action: 'SHIPMENT_CREATE',
      resourceType: 'Shipment',
      resourceId: shipment.id,
      metadata: { receiptNo: shipment.receiptNo }
    })

    return NextResponse.json({
      message: 'Shipment created successfully',
      data: shipment
    }, { status: 201 })
  } catch (error: unknown) {
    const err = error as Error
    return NextResponse.json({ error: 'Creation failed', message: err.message }, { status: 500 })
  }
}
