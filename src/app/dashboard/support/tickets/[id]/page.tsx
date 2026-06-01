// src/app/dashboard/support/tickets/[id]/page.tsx
import React from 'react'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { Role } from '@prisma/client'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChatThreadClient } from '@/components/support/ChatThreadClient'

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function SupportTicketDetailPage({ params }: PageProps) {
  const session = await auth()
  
  if (!session?.user) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', background: '#07020E', color: 'white', fontFamily: 'monospace', padding: '24px' }}>
        <div style={{ background: '#0D0618', border: '1px solid #EF4444', borderRadius: '12px', padding: '40px', maxWidth: '520px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px' }}>🔐</div>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#EF4444', margin: '16px 0' }}>LOGIN DIBUTUHKAN</h2>
          <p style={{ color: '#C7B8EA', fontSize: '12px' }}>Silakan login untuk melacak kargo atau berinteraksi dengan admin.</p>
        </div>
      </div>
    )
  }

  const { id } = await params
  const role = (session.user as any).role as Role
  const userId = (session.user as any).id as string

  // Fetch ticket details
  const ticket = await prisma.supportTicket.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, name: true, email: true, role: true }
      },
      shipment: {
        select: { id: true, receiptNo: true, origin: true, destination: true, status: true }
      },
      messages: {
        orderBy: { createdAt: 'asc' },
        include: {
          sender: {
            select: { id: true, name: true, email: true, role: true }
          }
        }
      }
    }
  })

  if (!ticket) {
    notFound()
  }

  // Security data isolation check: Customers cannot access tickets belonging to other users (BR-01)
  if (role !== Role.ADMIN && ticket.userId !== userId) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', background: '#07020E', color: 'white', fontFamily: 'monospace', padding: '24px' }}>
        <div style={{ background: '#0D0618', border: '1px solid #EF4444', borderRadius: '12px', padding: '40px', maxWidth: '520px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px' }}>🚫</div>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#EF4444', margin: '16px 0' }}>AKSES DITOLAK</h2>
          <p style={{ color: '#C7B8EA', fontSize: '12px' }}>Anda tidak memiliki hak akses untuk membaca thread chat tiket ini.</p>
          <div style={{ marginTop: '24px' }}>
            <Link
              href="/dashboard/support/tickets"
              style={{
                background: 'linear-gradient(90deg, #A855F7 0%, #7C3AED 100%)',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '11px',
                fontWeight: 'bold'
              }}
            >
              KEMBALI KE TICKETS
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Serialize datasets cleanly
  const serializedTicket = {
    id: ticket.id,
    ticketNo: ticket.ticketNo,
    title: ticket.title,
    description: ticket.description,
    type: ticket.type,
    severity: ticket.severity,
    status: ticket.status,
    resolution: ticket.resolution,
    compensation: ticket.compensation,
    compensationType: ticket.compensationType,
    createdAt: ticket.createdAt.toISOString(),
    creatorName: ticket.user.name,
    creatorEmail: ticket.user.email,
    shipmentReceiptNo: ticket.shipment ? ticket.shipment.receiptNo : null
  }

  const serializedMessages = ticket.messages.map(m => ({
    id: m.id,
    message: m.message,
    senderId: m.senderId,
    senderName: m.sender.name,
    senderRole: m.sender.role,
    createdAt: m.createdAt.toISOString()
  }))

  return (
    <ChatThreadClient
      role={role}
      userId={userId}
      ticket={serializedTicket}
      initialMessages={serializedMessages}
    />
  )
}
