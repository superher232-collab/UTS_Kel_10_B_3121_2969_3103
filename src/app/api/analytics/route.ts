// src/app/api/analytics/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/auth'
import { ShipmentStatus } from '@prisma/client'

type Period = 'daily' | 'weekly' | 'monthly' | 'overall'

function getDateRange(period: Period): { start: Date; end: Date } {
  const now = new Date()
  const end = new Date(now)
  end.setHours(23, 59, 59, 999)

  switch (period) {
    case 'daily': {
      const start = new Date(now)
      start.setHours(0, 0, 0, 0)
      return { start, end }
    }
    case 'weekly': {
      const start = new Date(now)
      start.setDate(start.getDate() - 6)
      start.setHours(0, 0, 0, 0)
      return { start, end }
    }
    case 'monthly': {
      const start = new Date(now)
      start.setDate(1)
      start.setMonth(start.getMonth() - 11)
      start.setHours(0, 0, 0, 0)
      return { start, end }
    }
    case 'overall':
    default:
      return { start: new Date(0), end }
  }
}

function formatLabel(date: Date, period: Period): string {
  if (period === 'daily') {
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  }
  if (period === 'weekly') {
    return date.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })
  }
  if (period === 'monthly') {
    return date.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' })
  }
  return date.getFullYear().toString()
}

function groupByPeriod(shipments: any[], period: Period) {
  const groups: Record<string, { shipments: number; revenue: number }> = {}

  const now = new Date()

  if (period === 'daily') {
    // Group by hour (0-23)
    for (let h = 0; h < 24; h++) {
      const label = `${String(h).padStart(2, '0')}:00`
      groups[label] = { shipments: 0, revenue: 0 }
    }
    shipments.forEach(s => {
      const h = new Date(s.createdAt).getHours()
      const label = `${String(h).padStart(2, '0')}:00`
      if (groups[label]) {
        groups[label].shipments += 1
        groups[label].revenue += s.tariff || 0
      }
    })
  } else if (period === 'weekly') {
    // Last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const label = d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' })
      groups[label] = { shipments: 0, revenue: 0 }
    }
    shipments.forEach(s => {
      const d = new Date(s.createdAt)
      const label = d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' })
      if (groups[label]) {
        groups[label].shipments += 1
        groups[label].revenue += s.tariff || 0
      }
    })
  } else if (period === 'monthly') {
    // Last 12 months
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(1)
      d.setMonth(d.getMonth() - i)
      const label = d.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' })
      groups[label] = { shipments: 0, revenue: 0 }
    }
    shipments.forEach(s => {
      const d = new Date(s.createdAt)
      const label = d.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' })
      if (groups[label]) {
        groups[label].shipments += 1
        groups[label].revenue += s.tariff || 0
      }
    })
  } else {
    // Overall: group by year
    const years = new Set(shipments.map(s => new Date(s.createdAt).getFullYear()))
    const sortedYears = Array.from(years).sort()
    if (sortedYears.length === 0) {
      const yr = now.getFullYear()
      groups[yr.toString()] = { shipments: 0, revenue: 0 }
    }
    sortedYears.forEach(y => {
      groups[y.toString()] = { shipments: 0, revenue: 0 }
    })
    shipments.forEach(s => {
      const y = new Date(s.createdAt).getFullYear().toString()
      if (groups[y]) {
        groups[y].shipments += 1
        groups[y].revenue += s.tariff || 0
      }
    })
  }

  return Object.entries(groups).map(([label, data]) => ({ label, ...data }))
}

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const role = (session.user as any).role as string
  const userId = (session.user as any).id as string

  const { searchParams } = new URL(req.url)
  const period = (searchParams.get('period') || 'daily') as Period

  const { start, end } = getDateRange(period)

  // Base where clause — operator only sees own data
  const baseWhere: any = {
    createdAt: { gte: start, lte: end }
  }
  if (role === 'OPERATOR') {
    baseWhere.userId = userId
  }

  try {
    const [allShipments, completedCount, pendingCount, cancelledCount] = await Promise.all([
      prisma.shipment.findMany({
        where: baseWhere,
        select: {
          id: true,
          createdAt: true,
          tariff: true,
          status: true,
          shippingType: true,
          origin: true,
          destination: true,
          paymentMethod: true,
          user: { select: { name: true } }
        },
        orderBy: { createdAt: 'asc' }
      }),
      prisma.shipment.count({ where: { ...baseWhere, status: ShipmentStatus.SELESAI } }),
      prisma.shipment.count({ where: { ...baseWhere, status: { in: [ShipmentStatus.DIPROSES, ShipmentStatus.PENDING, ShipmentStatus.DALAM_PENGIRIMAN] } } }),
      prisma.shipment.count({ where: { ...baseWhere, status: ShipmentStatus.DIBATALKAN } })
    ])

    const totalShipments = allShipments.length
    const totalRevenue = allShipments.reduce((sum, s) => sum + (s.tariff || 0), 0)
    const avgTariff = totalShipments > 0 ? Math.round(totalRevenue / totalShipments) : 0

    // Chart data
    const chartData = groupByPeriod(allShipments, period)

    // Mode distribution
    const modeDistribution = { LAUT: 0, DARAT: 0, UDARA: 0 }
    allShipments.forEach(s => {
      if (s.shippingType === 'LAUT') modeDistribution.LAUT++
      else if (s.shippingType === 'DARAT') modeDistribution.DARAT++
      else if (s.shippingType === 'UDARA') modeDistribution.UDARA++
    })

    // Payment method stats
    const paymentMethodStats = { QRIS: 0, TUNAI: 0 }
    allShipments.forEach(s => {
      const m = (s.paymentMethod || 'TUNAI').toUpperCase()
      if (m === 'QRIS') paymentMethodStats.QRIS++
      else paymentMethodStats.TUNAI++
    })

    // Top routes
    const routeMap: Record<string, number> = {}
    allShipments.forEach(s => {
      const key = `${s.origin} → ${s.destination}`
      routeMap[key] = (routeMap[key] || 0) + 1
    })
    const topRoutes = Object.entries(routeMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([route, count]) => ({ route, count }))

    // Top operators (admin only)
    let topOperators: any[] = []
    if (role === 'ADMIN') {
      const operatorMap: Record<string, { name: string; count: number; revenue: number }> = {}
      allShipments.forEach(s => {
        const name = s.user?.name || 'Unknown'
        if (!operatorMap[name]) operatorMap[name] = { name, count: 0, revenue: 0 }
        operatorMap[name].count++
        operatorMap[name].revenue += s.tariff || 0
      })
      topOperators = Object.values(operatorMap)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
    }

    return NextResponse.json({
      period,
      summary: {
        totalShipments,
        totalRevenue,
        completedShipments: completedCount,
        pendingShipments: pendingCount,
        cancelledShipments: cancelledCount,
        avgTariff
      },
      chartData,
      topRoutes,
      topOperators,
      modeDistribution,
      paymentMethodStats
    })
  } catch (error: any) {
    console.error('Analytics fetch error:', error)
    return NextResponse.json({ error: 'Gagal mengambil data analitik' }, { status: 500 })
  }
}
