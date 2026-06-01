// src/app/api/support/tickets/[id]/route.ts
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { Role, TicketStatus, TicketSeverity } from '@prisma/client'
import { z } from 'zod'

const TicketUpdateSchema = z.object({
  status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'ESCALATED']).optional(),
  resolution: z.string().nullable().optional(),
  compensation: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
    z.number().nonnegative().optional()
  ),
  compensationType: z.enum(['REFUND', 'DISCOUNT', 'RESHIP', 'NONE']).optional()
})

// GET /api/support/tickets/[id] - retrieve ticket detail and chat messages thread (BR-01)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized: Please login' }, { status: 401 })
    }

    const role = (session.user as any).role as Role
    const userId = (session.user as any).id as string
    const { id } = await params

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
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
    }

    // Customer isolation guard
    if (role !== Role.ADMIN && ticket.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden: Access denied' }, { status: 403 })
    }

    return NextResponse.json({ data: ticket })
  } catch (error: unknown) {
    const err = error as Error
    return NextResponse.json({ error: 'Failed to retrieve ticket', message: err.message }, { status: 500 })
  }
}

// PATCH /api/support/tickets/[id] - update support ticket parameters (status, resolution, compensation)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized: Please login' }, { status: 401 })
    }

    const role = (session.user as any).role as Role
    const userId = (session.user as any).id as string
    const { id } = await params

    const ticket = await prisma.supportTicket.findUnique({
      where: { id }
    })

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
    }

    // Role safety isolation check
    if (role !== Role.ADMIN && ticket.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden: Access denied' }, { status: 403 })
    }

    const body = await request.json()
    const parsed = TicketUpdateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        errors: parsed.error.flatten().fieldErrors 
      }, { status: 400 })
    }

    const { status, resolution, compensation, compensationType } = parsed.data

    // If customer attempts to change values restricted to admins
    if (role !== Role.ADMIN) {
      if (resolution !== undefined || compensation !== undefined || compensationType !== undefined || (status && status !== 'CLOSED')) {
        return NextResponse.json({ 
          error: 'Forbidden: Customers can only transition tickets to CLOSED status.' 
        }, { status: 403 })
      }
    }

    const updateData: any = {}
    if (status !== undefined) updateData.status = status as TicketStatus
    if (resolution !== undefined) updateData.resolution = resolution
    if (compensation !== undefined) updateData.compensation = compensation
    if (compensationType !== undefined) updateData.compensationType = compensationType

    if (status === 'RESOLVED' || status === 'CLOSED') {
      updateData.resolvedAt = new Date()
    }

    const updatedTicket = await prisma.supportTicket.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Tiket berhasil diperbarui', 
      data: updatedTicket 
    })

  } catch (error: unknown) {
    const err = error as Error
    return NextResponse.json({ error: 'Failed to update support ticket', message: err.message }, { status: 500 })
  }
}
