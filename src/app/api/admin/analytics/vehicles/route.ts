// src/app/api/admin/analytics/vehicles/route.ts
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { Role, VehicleStatus } from '@prisma/client'
import { withCache } from '@/lib/cache'

export async function GET() {
  try {
    const session = await auth()
    if (!session || (session.user as any)?.role !== Role.ADMIN) {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 })
    }

    const data = await withCache('analytics_vehicles', async () => {
      const totalVehicles = await prisma.vehicle.count()
      const statusCounts = await prisma.vehicle.groupBy({
        by: ['status'],
        _count: { id: true }
      })

      const statusMap = {
        TERSEDIA: 0,
        DIPAKAI: 0,
        PERBAIKAN: 0,
        NONAKTIF: 0
      } as Record<string, number>

      for (const item of statusCounts) {
        statusMap[item.status] = item._count.id
      }

      const activeCount = statusMap.DIPAKAI || 0
      const repairCount = statusMap.PERBAIKAN || 0
      const availableCount = statusMap.TERSEDIA || 0

      const utilizationRate = totalVehicles > 0 
        ? parseFloat(((activeCount / totalVehicles) * 100).toFixed(1))
        : 0

      // Get vehicles with their trip count (shipments count)
      const vehicles = await prisma.vehicle.findMany({
        select: {
          id: true,
          name: true,
          plateNo: true,
          type: true,
          status: true,
          _count: {
            select: { shipments: true }
          }
        }
      })

      const vehicleStats = vehicles.map(v => ({
        id: v.id,
        name: v.name,
        plateNo: v.plateNo,
        type: v.type,
        status: v.status,
        tripCount: v._count.shipments
      }))

      // Sort by trip count desc to find top utilized vehicles
      const topVehicles = [...vehicleStats]
        .sort((a, b) => b.tripCount - a.tripCount)
        .slice(0, 10)

      return {
        totalVehicles,
        activeCount,
        repairCount,
        availableCount,
        utilizationRate,
        topVehicles,
        allVehicles: vehicleStats
      }
    })

    return NextResponse.json({ data })
  } catch (error: unknown) {
    const err = error as Error
    return NextResponse.json({ error: 'Failed to retrieve vehicles analytics', message: err.message }, { status: 500 })
  }
}
