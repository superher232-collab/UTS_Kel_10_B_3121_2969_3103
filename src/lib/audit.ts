// src/lib/audit.ts
import { prisma } from './db'

export async function logAudit({
  userId,
  action,
  resourceType,
  resourceId,
  metadata
}: {
  userId: string
  action: string
  resourceType: 'Shipment' | 'User' | 'Ticket' | 'Vehicle' | 'Settings'
  resourceId: string
  metadata?: any
}) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        resourceType,
        resourceId,
        metadata: metadata ? JSON.stringify(metadata) : null
      }
    })
  } catch (error) {
    console.error('Failed to write audit log:', error)
  }
}
