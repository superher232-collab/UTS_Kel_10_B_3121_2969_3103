// src/app/api/vehicles/[id]/assign/route.ts
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { Role, VehicleStatus } from '@prisma/client'
import { z } from 'zod'
import { logAudit } from '@/lib/audit'

const AssignSchema = z.object({
  shipmentId: z.string().min(1, 'ID Pengiriman wajib diisi'),
  eta: z.string().min(1, 'ETA estimasi tiba wajib diisi').refine((val) => {
    const d = new Date(val)
    return !isNaN(d.getTime())
  }, { message: 'Format tanggal ETA tidak valid' })
})

// POST /api/vehicles/[id]/assign - assign a vehicle to a single shipment (BR-07, BR-02)
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || (session.user as any)?.role !== Role.ADMIN) {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 })
    }

    const { id: vehicleId } = await params
    const body = await request.json()
    const parsed = AssignSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        errors: parsed.error.flatten().fieldErrors 
      }, { status: 400 })
    }

    const { shipmentId, eta } = parsed.data
    const etaDate = new Date(eta)

    // Retrieve vehicle
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId }
    })

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    if (vehicle.status !== VehicleStatus.TERSEDIA) {
      return NextResponse.json({ 
        error: 'VEH-001: Armada tidak tersedia atau sedang beroperasi.' 
      }, { status: 400 })
    }

    // Retrieve shipment
    const shipment = await prisma.shipment.findUnique({
      where: { id: shipmentId }
    })

    if (!shipment) {
      return NextResponse.json({ error: 'Shipment not found' }, { status: 404 })
    }

    const adminUserId = (session.user as any).id as string

    // Dynamic transactional execution
    const updatedShipment = await prisma.$transaction(async (tx) => {
      // 1. Release prior vehicle if shipment had one
      if (shipment.vehicleId) {
        await tx.vehicle.update({
          where: { id: shipment.vehicleId },
          data: { status: VehicleStatus.TERSEDIA }
        })
      }

      // 2. Mark new vehicle as occupied
      await tx.vehicle.update({
        where: { id: vehicleId },
        data: { status: VehicleStatus.DIPAKAI }
      })

      // 3. Update shipment properties
      const s = await tx.shipment.update({
        where: { id: shipmentId },
        data: {
          vehicleId,
          eta: etaDate
        }
      })

      // 4. Log to history
      await tx.trackingHistory.create({
        data: {
          shipmentId,
          previousStatus: shipment.status,
          newStatus: shipment.status,
          notes: `Armada pengangkut ${vehicle.name} (${vehicle.plateNo}) dialokasikan. ETA: ${etaDate.toLocaleString('id-ID')}.`,
          changedBy: adminUserId
        }
      })

      return s
    })

    await logAudit({
      userId: adminUserId,
      action: 'SHIPMENT_ASSIGN_VEHICLE',
      resourceType: 'Shipment',
      resourceId: shipmentId,
      metadata: { vehicleId, eta }
    })

    await logAudit({
      userId: adminUserId,
      action: 'VEHICLE_ASSIGN',
      resourceType: 'Vehicle',
      resourceId: vehicleId,
      metadata: { shipmentId }
    })

    return NextResponse.json({
      success: true,
      message: `Armada ${vehicle.name} berhasil dialokasikan ke kargo ${shipment.receiptNo}`,
      data: updatedShipment
    })

  } catch (error: unknown) {
    const err = error as Error
    return NextResponse.json({ error: 'Failed to assign vehicle', message: err.message }, { status: 500 })
  }
}
