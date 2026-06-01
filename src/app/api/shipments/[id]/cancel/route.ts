// src/app/api/shipments/[id]/cancel/route.ts
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { ShipmentStatus } from '@prisma/client'
import { z } from 'zod'
import { logAudit } from '@/lib/audit'

const CancelSchema = z.object({
  reason: z.string().min(10, 'VAL-003: Alasan pembatalan wajib diisi minimal 10 karakter.')
})

// POST cancel shipment (strictly gate to DIPROSES, BR-02 & BR-03)
export async function POST(
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

      // BR-02: Cancel is strictly allowed only when status is 'DIPROSES'
      if (shipment.status !== ShipmentStatus.DIPROSES) {
        return NextResponse.json({
          error: 'Cancellation rejected',
          message: 'SHIP-002: Kargo sudah dikirim atau selesai. Tidak dapat dibatalkan.'
        }, { status: 400 })
      }
    } else {
      // Admins cannot cancel completed shipments either
      if (shipment.status === ShipmentStatus.SELESAI) {
        return NextResponse.json({
          error: 'Cancellation rejected',
          message: 'Shipment sudah selesai. Tidak dapat dibatalkan.'
        }, { status: 400 })
      }
    }

    const body: unknown = await request.json()
    const validated = CancelSchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json({
        error: 'Validation failed',
        details: validated.error.flatten().fieldErrors
      }, { status: 400 })
    }

    const { reason } = validated.data
    const updatedNotes = `[BATAL: ${reason.trim()}] ${shipment.notes || ''}`

    const updatedShipment = await prisma.$transaction(async (tx) => {
      // Release allocated vehicle back to available if cancelled (BR-07)
      if (shipment.vehicleId) {
        await tx.vehicle.update({
          where: { id: shipment.vehicleId },
          data: { status: 'TERSEDIA' }
        })
      }

      return await tx.shipment.update({
        where: { id },
        data: {
          status: ShipmentStatus.DIBATALKAN,
          notes: updatedNotes
        }
      })
    })

    await logAudit({
      userId: session.user.id,
      action: 'SHIPMENT_CANCEL',
      resourceType: 'Shipment',
      resourceId: updatedShipment.id,
      metadata: { reason }
    })

    return NextResponse.json({
      message: 'Shipment cancelled successfully',
      data: updatedShipment
    })
  } catch (error: unknown) {
    const err = error as Error
    return NextResponse.json({ error: 'Cancellation failed', message: err.message }, { status: 500 })
  }
}
