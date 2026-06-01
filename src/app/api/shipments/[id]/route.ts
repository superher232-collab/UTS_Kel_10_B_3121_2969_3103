// src/app/api/shipments/[id]/route.ts
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { ShipmentStatus, ShippingType } from '@prisma/client'
import { z } from 'zod'
import { logAudit } from '@/lib/audit'

const UpdateShipmentSchema = z.object({
  receiverName: z.string().min(1, 'Nama penerima wajib diisi').optional(),
  receiverTelp: z.string().regex(/^\+?[0-9\s-]{6,16}$/, 'Format nomor telepon tidak valid').optional(),
  notes: z.string().optional().nullable()
})

// GET shipment detail (fully secured via role-based data isolation, BR-01)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized: Please login' }, { status: 401 })
    }

    const { id } = await params
    const whereClause: {
      id: string
      userId?: string
    } = { id }

    // HARD RULE: Customers can only fetch their own data
    if (session.user.role !== 'ADMIN') {
      whereClause.userId = session.user.id
    }

    const shipment = await prisma.shipment.findUnique({
      where: whereClause as any // Safe unique mapping with composite fields
    })

    if (!shipment) {
      return NextResponse.json({ error: 'Shipment not found' }, { status: 404 })
    }

    // Double check manual query isolation for extra redundancy
    if (session.user.role !== 'ADMIN' && shipment.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden: Access denied' }, { status: 403 })
    }

    return NextResponse.json({ data: shipment })
  } catch (error: unknown) {
    const err = error as Error
    return NextResponse.json({ error: 'Retrieval failed', message: err.message }, { status: 500 })
  }
}

// PATCH shipment updates (Strictly edit non-status fields only, BR-02)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized: Please login' }, { status: 401 })
    }

    const { id } = await params
    const shipment = await prisma.shipment.findUnique({
      where: { id }
    })

    if (!shipment) {
      return NextResponse.json({ error: 'Shipment not found' }, { status: 404 })
    }

    // Role check and Data Isolation check
    if (session.user.role !== 'ADMIN') {
      if (shipment.userId !== session.user.id) {
        return NextResponse.json({ error: 'Forbidden: Access denied' }, { status: 403 })
      }
      
      // BR-02: Edit is strictly allowed only when status is 'DIPROSES'
      if (shipment.status !== ShipmentStatus.DIPROSES) {
        return NextResponse.json({
          error: 'Update rejected',
          message: 'Edit hanya diperbolehkan saat status kargo masih DIPROSES.'
        }, { status: 400 })
      }
    }

    const body: unknown = await request.json()
    const validated = UpdateShipmentSchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json({
        error: 'Validation failed',
        details: validated.error.flatten().fieldErrors
      }, { status: 400 })
    }

    const updatedShipment = await prisma.shipment.update({
      where: { id },
      data: validated.data
    })

    await logAudit({
      userId: session.user.id,
      action: 'SHIPMENT_UPDATE',
      resourceType: 'Shipment',
      resourceId: updatedShipment.id,
      metadata: { changedFields: Object.keys(validated.data) }
    })

    return NextResponse.json({
      message: 'Shipment updated successfully',
      data: updatedShipment
    })
  } catch (error: unknown) {
    const err = error as Error
    return NextResponse.json({ error: 'Update failed', message: err.message }, { status: 500 })
  }
}
