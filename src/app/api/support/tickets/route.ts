// src/app/api/support/tickets/route.ts
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { TicketSeverity, Role } from '@prisma/client'

const TicketCreateSchema = z.object({
  title: z.string().min(3, 'Judul tiket minimal 3 karakter'),
  description: z.string().min(10, 'Deskripsi permasalahan minimal 10 karakter'),
  type: z.enum(['COMPLAINT', 'INQUIRY', 'FEEDBACK']),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  shipmentId: z.string().nullable().optional()
})

const generateTicketNo = (): string => {
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `TKT-${randomStr}`
}

// GET /api/support/tickets - list tickets (customer: own only, admin: all, BR-01)
export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized: Please login' }, { status: 401 })
    }

    const role = (session.user as any).role as Role
    const userId = (session.user as any).id as string

    // Dynamic filtering based on active role
    const whereClause: any = role === Role.ADMIN ? {} : { userId }

    const url = new URL(request.url)
    const statusParam = url.searchParams.get('status')
    if (statusParam) {
      whereClause.status = statusParam.toUpperCase()
    }

    const tickets = await prisma.supportTicket.findMany({
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

    return NextResponse.json({ data: tickets })
  } catch (error: unknown) {
    const err = error as Error
    return NextResponse.json({ error: 'Failed to retrieve tickets', message: err.message }, { status: 500 })
  }
}

// POST /api/support/tickets - create a new support ticket
export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized: Please login' }, { status: 401 })
    }

    const userId = (session.user as any).id as string

    const body = await request.json()
    const parsed = TicketCreateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        errors: parsed.error.flatten().fieldErrors 
      }, { status: 400 })
    }

    const { title, description, type, severity, shipmentId } = parsed.data
    const ticketNo = generateTicketNo()

    const newTicket = await prisma.supportTicket.create({
      data: {
        ticketNo,
        title,
        description,
        type,
        severity: severity as TicketSeverity,
        userId,
        shipmentId: shipmentId || null,
        status: 'OPEN'
      }
    })

    return NextResponse.json({ 
      success: true, 
      message: `Tiket ${ticketNo} berhasil dibuat`, 
      data: newTicket 
    }, { status: 201 })

  } catch (error: unknown) {
    const err = error as Error
    return NextResponse.json({ error: 'Failed to create support ticket', message: err.message }, { status: 500 })
  }
}
