// src/app/api/admin/analytics/overview/route.ts
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { Role, ShipmentStatus } from '@prisma/client'
import { withCache } from '@/lib/cache'

export async function GET() {
  try {
    const session = await auth()
    if (!session || (session.user as any)?.role !== Role.ADMIN) {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 })
    }

    const data = await withCache('analytics_overview', async () => {
      const totalCount = await prisma.shipment.count()
      const revenueAgg = await prisma.shipment.aggregate({
        _sum: { tariff: true }
      })
      const pendingCount = await prisma.shipment.count({
        where: { status: ShipmentStatus.DIPROSES }
      })
      const delayedCount = await prisma.shipment.count({
        where: {
          status: { in: [ShipmentStatus.DALAM_PENGIRIMAN, ShipmentStatus.PENDING] },
          eta: { lt: new Date() }
        }
      })
      const completedCount = await prisma.shipment.count({
        where: { status: ShipmentStatus.SELESAI }
      })

      // Revenue by shipping type
      const revenueByType = await prisma.shipment.groupBy({
        by: ['shippingType'],
        _sum: { tariff: true },
        _count: { id: true }
      })

      return {
        totalShipments: totalCount,
        totalRevenue: revenueAgg._sum.tariff || 0,
        pendingShipments: pendingCount,
        delayedShipments: delayedCount,
        completedShipments: completedCount,
        revenueByType: revenueByType.map(r => ({
          type: r.shippingType,
          revenue: r._sum.tariff || 0,
          count: r._count.id
        }))
      }
    })

    return NextResponse.json({ data })
  } catch (error: unknown) {
    const err = error as Error
    return NextResponse.json({ error: 'Failed to retrieve analytics', message: err.message }, { status: 500 })
  }
}
