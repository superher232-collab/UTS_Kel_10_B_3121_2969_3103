// src/app/api/admin/audit-logs/route.ts
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { Role } from '@prisma/client'

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session || (session.user as any)?.role !== Role.ADMIN) {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '15', 10)
    const offset = (page - 1) * limit

    const userIdFilter = searchParams.get('userId')
    const resourceTypeFilter = searchParams.get('resourceType')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')

    const whereClause: any = {}

    if (userIdFilter) {
      whereClause.userId = userIdFilter
    }

    if (resourceTypeFilter) {
      whereClause.resourceType = resourceTypeFilter
    }

    if (dateFrom || dateTo) {
      whereClause.createdAt = {}
      if (dateFrom) {
        whereClause.createdAt.gte = new Date(dateFrom)
      }
      if (dateTo) {
        whereClause.createdAt.lte = new Date(dateTo)
      }
    }

    const total = await prisma.auditLog.count({ where: whereClause })
    const logs = await prisma.auditLog.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      skip: offset,
      take: limit,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      data: logs.map(l => ({
        ...l,
        metadata: l.metadata ? JSON.parse(l.metadata) : null
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error: unknown) {
    const err = error as Error
    return NextResponse.json({ error: 'Failed to retrieve audit logs', message: err.message }, { status: 500 })
  }
}
