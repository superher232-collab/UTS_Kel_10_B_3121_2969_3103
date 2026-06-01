// src/app/api/vehicles/route.ts
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { Role, VehicleStatus, VehicleType } from '@prisma/client'
import { z } from 'zod'

const VehicleCreateSchema = z.object({
  name: z.string().min(1, 'Nama armada wajib diisi'),
  type: z.string().min(1, 'Tipe armada (KAPAL/TRUCK/PESAWAT) wajib diisi'),
  plateNo: z.string().min(3, 'Nomor pelat/registrasi wajib diisi'),
  capacity: z.preprocess(
    (val) => (val === '' || val === null ? undefined : Number(val)),
    z.number({ message: 'Kapasitas wajib diisi' }).positive('Kapasitas harus lebih besar dari 0 kg')
  ),
  status: z.enum(['TERSEDIA', 'DIPAKAI', 'PERBAIKAN']).optional().default('TERSEDIA')
})

// GET /api/vehicles - retrieve all fleet vehicles (Admin/Staff only)
export async function GET() {
  try {
    const session = await auth()
    if (!session || (session.user as any)?.role !== Role.ADMIN) {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 })
    }

    const fleet = await prisma.vehicle.findMany({
      orderBy: { name: 'asc' }
    })

    return NextResponse.json({ data: fleet })
  } catch (error: unknown) {
    const err = error as Error
    return NextResponse.json({ error: 'Failed to fetch vehicles', message: err.message }, { status: 500 })
  }
}

// POST /api/vehicles - create a new vehicle (Admin only)
export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session || (session.user as any)?.role !== Role.ADMIN) {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const parsed = VehicleCreateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        errors: parsed.error.flatten().fieldErrors 
      }, { status: 400 })
    }

    const { name, type, plateNo, capacity, status } = parsed.data

    // Check duplicate plateNo
    const existing = await prisma.vehicle.findUnique({
      where: { plateNo }
    })

    if (existing) {
      return NextResponse.json({ 
        error: `Nomor pelat/registrasi ${plateNo} sudah terdaftar.` 
      }, { status: 400 })
    }

    const newVehicle = await prisma.vehicle.create({
      data: {
        name,
        type: type as VehicleType,
        plateNo,
        capacity,
        status: status as VehicleStatus
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Armada berhasil ditambahkan ke sistem PrimeLog.',
      data: newVehicle
    }, { status: 201 })

  } catch (error: unknown) {
    const err = error as Error
    return NextResponse.json({ error: 'Failed to create vehicle', message: err.message }, { status: 500 })
  }
}
