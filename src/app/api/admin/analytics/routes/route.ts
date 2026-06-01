// src/app/api/admin/analytics/routes/route.ts
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

    const data = await withCache('analytics_routes', async () => {
      // Get all shipments to compute routes aggregates programmatically
      const shipments = await prisma.shipment.findMany({
        select: {
          origin: true,
          destination: true,
          tariff: true,
          status: true,
          shipmentDate: true,
          actualArrival: true
        }
      })

      // Aggregate programmatically
      const routesMap = new Map<string, {
        origin: string
        destination: string
        count: number
        totalRevenue: number
        totalDeliveryTimeMs: number
        completedCount: number
      }>()

      for (const s of shipments) {
        const key = `${s.origin.trim()} -> ${s.destination.trim()}`
        let route = routesMap.get(key)
        if (!route) {
          route = {
            origin: s.origin,
            destination: s.destination,
            count: 0,
            totalRevenue: 0,
            totalDeliveryTimeMs: 0,
            completedCount: 0
          }
          routesMap.set(key, route)
        }

        route.count++
        route.totalRevenue += s.tariff

        if (s.status === ShipmentStatus.SELESAI && s.actualArrival) {
          const duration = new Date(s.actualArrival).getTime() - new Date(s.shipmentDate).getTime()
          if (duration > 0) {
            route.totalDeliveryTimeMs += duration
            route.completedCount++
          }
        }
      }

      // Convert to array and format
      const formattedRoutes = Array.from(routesMap.values()).map(r => {
        const avgDeliveryHours = r.completedCount > 0 
          ? parseFloat((r.totalDeliveryTimeMs / (1000 * 60 * 60 * r.completedCount)).toFixed(1))
          : 0

        return {
          origin: r.origin,
          destination: r.destination,
          routeString: `${r.origin} → ${r.destination}`,
          count: r.count,
          totalRevenue: r.totalRevenue,
          avgDeliveryHours
        }
      })

      // Sort by trip count desc, take top 10
      const topRoutes = [...formattedRoutes]
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)

      return {
        routes: formattedRoutes,
        topRoutes
      }
    })

    return NextResponse.json({ data })
  } catch (error: unknown) {
    const err = error as Error
    return NextResponse.json({ error: 'Failed to retrieve routes analytics', message: err.message }, { status: 500 })
  }
}
