// src/app/api/shipments/[id]/tracking/route.ts
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'

// GET shipment tracking history log (strictly isolated by role, sorted DESC, BR-01)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized: Please login' }, { status: 401 })
    }

    const { id } = await params
    const shipment = await prisma.shipment.findUnique({
      where: { id }
    })

    if (!shipment) {
      return NextResponse.json({ error: 'Shipment not found' }, { status: 404 })
    }

    // HARD RULE: Shippers can only query logs belonging to their own shipments
    if (session.user.role !== 'ADMIN' && shipment.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden: Access denied' }, { status: 403 })
    }

    const history = await prisma.trackingHistory.findMany({
      where: { shipmentId: id },
      orderBy: { changedAt: 'desc' }
    })

    return NextResponse.json({ data: history })
  } catch (error: unknown) {
    const err = error as Error
    return NextResponse.json({ error: 'Tracking retrieval failed', message: err.message }, { status: 500 })
  }
}
