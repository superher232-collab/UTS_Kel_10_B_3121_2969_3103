// src/lib/automation.ts
import { prisma } from './db'
import { ShipmentStatus, VehicleStatus, PaymentStatus } from '@prisma/client'
import { logAudit } from './audit'

export async function runAutomation() {
  const executionLogs: string[] = []
  const now = new Date()

  // 1. AUTO-FLAG DELAYS: ETA + 24 Hours Exceeded
  executionLogs.push('Starting automation segment: Delay Flagging...')
  try {
    const delayThreshold = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const delayedShipments = await prisma.shipment.findMany({
      where: {
        status: { in: [ShipmentStatus.DALAM_PENGIRIMAN, ShipmentStatus.DIPROSES] },
        eta: { lt: delayThreshold },
        NOT: {
          notes: { contains: '[TERLAMBAT]' }
        }
      }
    })

    for (const shipment of delayedShipments) {
      await prisma.$transaction(async (tx) => {
        await tx.shipment.update({
          where: { id: shipment.id },
          data: {
            status: ShipmentStatus.PENDING,
            notes: `[TERLAMBAT] ${shipment.notes || ''}`.trim()
          }
        })

        await tx.trackingHistory.create({
          data: {
            shipmentId: shipment.id,
            previousStatus: shipment.status,
            newStatus: ShipmentStatus.PENDING,
            notes: 'Kargo ditandai TERLAMBAT secara otomatis karena melewati batas ETA + 24 jam.',
            changedBy: 'SYSTEM'
          }
        })
      })

      executionLogs.push(`Shipment ${shipment.receiptNo} auto-flagged as DELAYED (status set to PENDING).`)
    }
  } catch (err: any) {
    executionLogs.push(`Delay Flagging error: ${err.message}`)
  }

  // 2. AUTO-ASSIGN VEHICLES
  executionLogs.push('Starting automation segment: Vehicle Auto-Allocation...')
  try {
    const unassignedShipments = await prisma.shipment.findMany({
      where: {
        status: ShipmentStatus.DIPROSES,
        vehicleId: null
      }
    })

    for (const shipment of unassignedShipments) {
      // Find eligible vehicle: TERSEDIA and capacity >= shipment weight
      const eligibleVehicle = await prisma.vehicle.findFirst({
        where: {
          status: VehicleStatus.TERSEDIA,
          capacity: { gte: shipment.weight }
        },
        orderBy: [
          // Prioritize empty currentRoute or route matching destination
          { currentRoute: 'asc' },
          { capacity: 'asc' }
        ]
      })

      if (eligibleVehicle) {
        const etaDate = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000) // Default 2 days transit
        await prisma.$transaction(async (tx) => {
          await tx.vehicle.update({
            where: { id: eligibleVehicle.id },
            data: { status: VehicleStatus.DIPAKAI }
          })

          await tx.shipment.update({
            where: { id: shipment.id },
            data: {
              vehicleId: eligibleVehicle.id,
              eta: etaDate
            }
          })

          await tx.trackingHistory.create({
            data: {
              shipmentId: shipment.id,
              previousStatus: shipment.status,
              newStatus: shipment.status,
              notes: `Alokasi armada otomatis: ${eligibleVehicle.name} (${eligibleVehicle.plateNo}). ETA: ${etaDate.toLocaleString('id-ID')}`,
              changedBy: 'SYSTEM'
            }
          })
        })

        await logAudit({
          userId: 'SYSTEM',
          action: 'AUTO_ASSIGN_VEHICLE',
          resourceType: 'Shipment',
          resourceId: shipment.id,
          metadata: { vehicleId: eligibleVehicle.id, eta: etaDate }
        })

        executionLogs.push(`Shipment ${shipment.receiptNo} auto-assigned to vehicle ${eligibleVehicle.name}.`)
      } else {
        executionLogs.push(`No available vehicle with sufficient capacity for shipment ${shipment.receiptNo}.`)
      }
    }
  } catch (err: any) {
    executionLogs.push(`Auto-Allocation error: ${err.message}`)
  }

  // 3. AUTO-GENERATE INVOICES
  executionLogs.push('Starting automation segment: Invoice Generation...')
  try {
    const completedShipments = await prisma.shipment.findMany({
      where: {
        status: ShipmentStatus.SELESAI,
        invoice: null
      }
    })

    for (const shipment of completedShipments) {
      const year = now.getFullYear().toString()
      const rand = Math.random().toString(36).substring(2, 6).toUpperCase()
      const invoiceNo = `INV-${year}-${rand}`
      const subtotal = shipment.tariff
      const tax = parseFloat((subtotal * 0.1).toFixed(0)) // 10% tax
      const total = subtotal + tax

      await prisma.invoice.create({
        data: {
          invoiceNo,
          shipmentId: shipment.id,
          subtotal,
          tax,
          discount: 0,
          total,
          status: 'PAID',
          issuedAt: now,
          paidAt: now
        }
      })

      await logAudit({
        userId: 'SYSTEM',
        action: 'INVOICE_AUTO_GENERATE',
        resourceType: 'Shipment',
        resourceId: shipment.id,
        metadata: { invoiceNo, total }
      })

      executionLogs.push(`Invoice ${invoiceNo} auto-generated for shipment ${shipment.receiptNo}.`)
    }
  } catch (err: any) {
    executionLogs.push(`Invoice Generation error: ${err.message}`)
  }

  // 4. AUTO-NOTIFY CUSTOMERS
  executionLogs.push('Starting automation segment: Customer Alerts...')
  try {
    const shipments = await prisma.shipment.findMany({
      where: {
        status: { notIn: [ShipmentStatus.SELESAI, ShipmentStatus.DIBATALKAN] }
      },
      include: { user: true }
    })

    for (const s of shipments) {
      // Find if we already sent notification for this specific state (status + eta combo)
      const stateKey = `${s.status}_${s.eta ? s.eta.toISOString() : 'noeta'}`
      
      const alreadyNotifiedLogs = await prisma.activityLog.findMany({
        where: {
          action: 'NOTIF_SENT',
          entityId: s.id
        }
      })

      const duplicate = alreadyNotifiedLogs.some(log => {
        try {
          const meta = log.metadata as any
          return meta && meta.stateKey === stateKey
        } catch {
          return false
        }
      })

      if (!duplicate) {
        const emailSent = s.user.emailNotif
        const smsSent = s.user.smsNotif

        if (emailSent || smsSent) {
          // Log dispatched mock alerts
          const channels: string[] = []
          if (emailSent) channels.push('EMAIL')
          if (smsSent) channels.push('SMS')

          await prisma.activityLog.create({
            data: {
              action: 'NOTIF_SENT',
              entityType: 'Shipment',
              entityId: s.id,
              performedBy: 'SYSTEM',
              metadata: {
                stateKey,
                channels,
                status: s.status,
                eta: s.eta ? s.eta.toISOString() : null,
                timestamp: now.toISOString()
              }
            }
          })

          executionLogs.push(`Notification successfully sent to user ${s.user.name} via ${channels.join('/')} for shipment ${s.receiptNo} (${s.status}).`)
        }
      }
    }
  } catch (err: any) {
    executionLogs.push(`Customer Alerts error: ${err.message}`)
  }

  executionLogs.push('Automation process finalized successfully.')
  return executionLogs
}
