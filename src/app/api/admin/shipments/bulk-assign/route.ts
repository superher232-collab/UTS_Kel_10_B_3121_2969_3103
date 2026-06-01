// src/app/api/admin/shipments/bulk-assign/route.ts
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { Role, VehicleStatus } from '@prisma/client'
import { z } from 'zod'
import { logAudit } from '@/lib/audit'

const BulkAssignSchema = z.object({
  shipmentIds: z.array(z.string().min(1)).min(1, 'Pilih minimal satu kargo pengiriman'),
  vehicleId: z.string().min(1, 'ID Armada wajib diisi'),
  eta: z.string().min(1, 'ETA estimasi tiba wajib diisi').refine((val) => {
    const d = new Date(val)
    return !isNaN(d.getTime())
  }, { message: 'Format tanggal ETA tidak valid' })
})

// POST /api/admin/shipments/bulk-assign - bind multiple shipments to one vehicle (BR-07, BR-02)
export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session || (session.user as any)?.role !== Role.ADMIN) {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const parsed = BulkAssignSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        errors: parsed.error.flatten().fieldErrors 
      }, { status: 400 })
    }

    const { shipmentIds, vehicleId, eta } = parsed.data
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

    // Retrieve all shipments
    const shipments = await prisma.shipment.findMany({
      where: { id: { in: shipmentIds } }
    })

    if (shipments.length !== shipmentIds.length) {
      return NextResponse.json({ error: 'One or more shipments not found' }, { status: 404 })
    }

    // Capacity validation (BR-07: Validate vehicle capacity vs total weight)
    const totalWeight = shipments.reduce((sum, s) => sum + s.weight, 0)
    if (totalWeight > vehicle.capacity) {
      return NextResponse.json({ 
        error: `KAP-001: Muatan kargo berlebih. Total berat (${totalWeight.toFixed(1)} kg) melampaui kapasitas maksimal armada ${vehicle.name} (${vehicle.capacity.toFixed(1)} kg).` 
      }, { status: 400 })
    }

    const adminUserId = (session.user as any).id as string

    // Dynamic multi-step transaction
    const results = await prisma.$transaction(async (tx) => {
      // 1. Release prior vehicles for these shipments if any
      const vehicleIdsToRelease = shipments
        .map(s => s.vehicleId)
        .filter((vId): vId is string => vId !== null && vId !== vehicleId)

      if (vehicleIdsToRelease.length > 0) {
        await tx.vehicle.updateMany({
          where: { id: { in: vehicleIdsToRelease } },
          data: { status: VehicleStatus.TERSEDIA }
        })
      }

      // 2. Mark target vehicle as occupied
      await tx.vehicle.update({
        where: { id: vehicleId },
        data: { status: VehicleStatus.DIPAKAI }
      })

      // 3. Assign vehicle and eta to shipments
      await tx.shipment.updateMany({
        where: { id: { in: shipmentIds } },
        data: {
          vehicleId,
          eta: etaDate
        }
      })

      // 4. Log immutable status logs for all shipments
      await Promise.all(shipments.map(s => 
        tx.trackingHistory.create({
          data: {
            shipmentId: s.id,
            previousStatus: s.status,
            newStatus: s.status,
            notes: `Armada pengangkut massal ${vehicle.name} (${vehicle.plateNo}) dialokasikan secara bulk. ETA: ${etaDate.toLocaleString('id-ID')}.`,
            changedBy: adminUserId
          }
        })
      ))

      return await tx.shipment.findMany({
        where: { id: { in: shipmentIds } }
      })
    })

    await Promise.all(shipments.map(s =>
      logAudit({
        userId: adminUserId,
        action: 'SHIPMENT_ASSIGN_VEHICLE',
        resourceType: 'Shipment',
        resourceId: s.id,
        metadata: { vehicleId, eta }
      })
    ))

    await logAudit({
      userId: adminUserId,
      action: 'VEHICLE_ASSIGN_BULK',
      resourceType: 'Vehicle',
      resourceId: vehicleId,
      metadata: { shipmentIds }
    })

    return NextResponse.json({
      success: true,
      message: `Sukses mengalokasikan secara massal ${shipments.length} kargo ke armada ${vehicle.name}`,
      data: results
    })

  } catch (error: unknown) {
    const err = error as Error
    return NextResponse.json({ error: 'Failed to execute bulk assignment', message: err.message }, { status: 500 })
  }
}
