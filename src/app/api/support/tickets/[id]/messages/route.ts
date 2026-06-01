// src/app/api/support/tickets/[id]/messages/route.ts
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { Role } from '@prisma/client'
import { z } from 'zod'

const MessageCreateSchema = z.object({
  message: z.string().min(1, 'Pesan tidak boleh kosong').max(500, 'Pesan maksimal 500 karakter')
})

// Secure HTML and script tag input sanitizer
function sanitizeInput(text: string): string {
  // Strip script tags case-insensitively, including attributes and contents
  let sanitized = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  // Encode remaining HTML entities
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
  }
  return sanitized.replace(/[&<>"'/]/g, (m) => map[m])
}

// POST /api/support/tickets/[id]/messages - send chat message into thread (BR-01)
export async function POST(
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

    // Fetch the ticket
    const ticket = await prisma.supportTicket.findUnique({
      where: { id }
    })

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
    }

    // Role-based thread access isolation check
    if (role !== Role.ADMIN && ticket.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden: Access denied' }, { status: 403 })
    }

    // Block additions to closed tickets
    if (ticket.status === 'CLOSED') {
      return NextResponse.json({ error: 'Forbidden: Cannot message in a CLOSED ticket' }, { status: 400 })
    }

    const body = await request.json()
    const parsed = MessageCreateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        errors: parsed.error.flatten().fieldErrors 
      }, { status: 400 })
    }

    const rawMessage = parsed.data.message
    const cleanMessage = sanitizeInput(rawMessage)

    // Append ChatMessage inside transactional boundaries
    const newMessage = await prisma.$transaction(async (tx) => {
      // 1. Create message
      const msg = await tx.chatMessage.create({
        data: {
          ticketId: id,
          senderId: userId,
          message: cleanMessage
        },
        include: {
          sender: {
            select: { id: true, name: true, email: true, role: true }
          }
        }
      })

      // 2. Automatically advance ticket state if customer sends a message to OPEN (if closed/resolved/etc., but wait: status update is typically handled by admins, let's keep status OPEN or advance OPEN to IN_PROGRESS when admin chats, let's do a simple state bump if needed)
      if (role === Role.ADMIN && ticket.status === 'OPEN') {
        await tx.supportTicket.update({
          where: { id },
          data: { status: 'IN_PROGRESS' }
        })
      }

      return msg
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Pesan terkirim', 
      data: newMessage 
    }, { status: 201 })

  } catch (error: unknown) {
    const err = error as Error
    return NextResponse.json({ error: 'Failed to send message', message: err.message }, { status: 500 })
  }
}
