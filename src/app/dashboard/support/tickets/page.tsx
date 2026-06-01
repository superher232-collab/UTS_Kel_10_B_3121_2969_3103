// src/app/dashboard/support/tickets/page.tsx
import React from 'react'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { Role } from '@prisma/client'
import { TicketsClient } from '@/components/support/TicketsClient'

export default async function SupportTicketsPage() {
  const session = await auth()
  
  if (!session?.user) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', background: '#07020E', color: 'white', fontFamily: 'monospace', padding: '24px' }}>
        <div style={{ background: '#0D0618', border: '1px solid #EF4444', borderRadius: '12px', padding: '40px', maxWidth: '520px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px' }}>🔐</div>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#EF4444', margin: '16px 0' }}>LOGIN DIBUTUHKAN</h2>
          <p style={{ color: '#C7B8EA', fontSize: '12px' }}>Silakan login untuk melacak atau membuat tiket bantuan.</p>
        </div>
      </div>
    )
  }

  const role = (session.user as any).role as Role
  const userId = (session.user as any).id as string

  // Fetch support tickets matching role data isolation limits (BR-01)
  const whereClause: any = role === Role.ADMIN ? {} : { userId }

  let tickets: any[] = []
  let shipments: any[] = []

  try {
    tickets = await prisma.supportTicket.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true }
        },
        shipment: {
          select: { receiptNo: true }
        }
      }
    })

    // Fetch user shipments to link to tickets in modal
    shipments = await prisma.shipment.findMany({
      where: role === Role.ADMIN ? {} : { userId },
      select: { id: true, receiptNo: true, itemName: true },
      orderBy: { createdAt: 'desc' }
    })
  } catch (error) {
    console.error('Failed to load tickets in server component:', error)
  }

  // Serialize models correctly for client component consumption
  const serializedTickets = tickets.map(t => ({
    id: t.id,
    ticketNo: t.ticketNo,
    title: t.title,
    description: t.description,
    type: t.type,
    severity: t.severity,
    status: t.status,
    createdAt: t.createdAt.toISOString(),
    resolvedAt: t.resolvedAt ? t.resolvedAt.toISOString() : null,
    creatorName: t.user.name,
    creatorEmail: t.user.email,
    shipmentReceiptNo: t.shipment ? t.shipment.receiptNo : null
  }))

  const serializedShipments = shipments.map(s => ({
    id: s.id,
    receiptNo: s.receiptNo,
    itemName: s.itemName
  }))

  return (
    <TicketsClient
      role={role}
      userId={userId}
      initialTickets={serializedTickets}
      shipments={serializedShipments}
    />
  )
}
