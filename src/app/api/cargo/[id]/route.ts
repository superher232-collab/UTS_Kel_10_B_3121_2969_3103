import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session: any = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const body = await request.json()
    const { action } = body // 'cancel' | 'update'

    // 1. Cek kepemilikan & status saat ini
    const shipment = await prisma.shipment.findUnique({
      where: { id },
      select: { userId: true, status: true }
    })
    
    if (!shipment) return NextResponse.json({ error: 'Shipment not found' }, { status: 404 })
    if (shipment.userId !== session.user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    if (shipment.status !== 'DIPROSES') return NextResponse.json({ error: 'Shipment already processed' }, { status: 400 })

    // 2. Eksekusi aksi
    if (action === 'cancel') {
      await prisma.shipment.update({
        where: { id },
        data: { status: 'DIBATALKAN' }
      })
      return NextResponse.json({ status: 'success', message: 'Shipment canceled' })
    }

    if (action === 'update' && body.deskripsi !== undefined) {
      await prisma.shipment.update({
        where: { id },
        data: { notes: body.deskripsi }
      })
      return NextResponse.json({ status: 'success', message: 'Description updated' })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ error: 'Server error', detail: error.message }, { status: 500 })
  }
}