import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const session: any = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const userId = session.user.id
    const { searchParams } = new URL(request.url)
    const shipmentId = searchParams.get('shipmentId')

    const whereClause: any = { userId }
    if (shipmentId) {
      whereClause.id = shipmentId
    }

    const shipments = await prisma.shipment.findMany({
      where: whereClause,
      select: {
        id: true,
        receiptNo: true,
        status: true,
        origin: true,
        destination: true,
        vehicle: {
          select: {
            name: true,
            latitude: true,
            longitude: true,
            lastUpdate: true
          }
        }
      }
    })
    
    if (shipments.length === 0) {
      return NextResponse.json({ error: 'No tracking data found' }, { status: 404 })
    }

    return NextResponse.json({
      status: 'success',
      data: shipments.map((s: any) => ({
        shipmentId: s.id,
        resi: s.receiptNo,
        status: s.status,
        route: `${s.origin} → ${s.destination}`,
        vehicle: s.vehicle?.name || 'Belum ditugaskan',
        coordinates: s.vehicle?.latitude && s.vehicle?.longitude ? { lat: s.vehicle.latitude, lng: s.vehicle.longitude } : null,
        lastUpdate: s.vehicle?.lastUpdate
      }))
    })
  } catch (error: any) {
    return NextResponse.json({ error: 'Tracking failed', detail: error.message }, { status: 500 })
  }
}