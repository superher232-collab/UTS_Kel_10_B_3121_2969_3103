// src/app/api/vehicles/[id]/route.ts
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { Role, VehicleStatus } from '@prisma/client'
import { z } from 'zod'

const VehicleUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  type: z.string().min(1).optional(),
  plateNo: z.string().min(3).optional(),
  capacity: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
    z.number().positive()
  ).optional(),
  status: z.enum(['TERSEDIA', 'DIPAKAI', 'PERBAIKAN']).optional()
})

// PATCH /api/vehicles/[id] - update vehicle status or details (Admin only, BR-02)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || (session.user as any)?.role !== Role.ADMIN) {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()
    const parsed = VehicleUpdateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        errors: parsed.error.flatten().fieldErrors 
      }, { status: 400 })
    }

    const vehicle = await prisma.vehicle.findUnique({ where: { id } })
    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    const updated = await prisma.vehicle.update({
      where: { id },
      data: parsed.data as any
    })

    return NextResponse.json({
      success: true,
      message: 'Status armada berhasil diperbarui.',
      data: updated
    })

  } catch (error: unknown) {
    const err = error as Error
    return NextResponse.json({ error: 'Failed to update vehicle', message: err.message }, { status: 500 })
  }
}

// DELETE /api/vehicles/[id] - delete a vehicle from system
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || (session.user as any)?.role !== Role.ADMIN) {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 })
    }

    const { id } = await params
    const vehicle = await prisma.vehicle.findUnique({ where: { id } })
    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    // Check if vehicle is currently active (DIPAKAI)
    if (vehicle.status === VehicleStatus.DIPAKAI) {
      return NextResponse.json({ 
        error: 'Forbidden: Armada sedang dipakai bertugas. Lepaskan dari kargo sebelum menghapus.' 
      }, { status: 400 })
    }

    await prisma.vehicle.delete({ where: { id } })

    return NextResponse.json({
      success: true,
      message: 'Armada berhasil dihapus dari pusat command.'
    })

  } catch (error: unknown) {
    const err = error as Error
    return NextResponse.json({ error: 'Failed to delete vehicle', message: err.message }, { status: 500 })
  }
}
