// src/app/api/admin/users/route.ts
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
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const search = searchParams.get('search') || ''
    const offset = (page - 1) * limit

    const whereClause: any = {
      deletedAt: null // Soft delete check: exclude soft-deleted users
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }

    const total = await prisma.user.count({ where: whereClause })
    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        address: true,
        createdAt: true
      },
      skip: offset,
      take: limit,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      data: users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error: unknown) {
    const err = error as Error
    return NextResponse.json({ error: 'Failed to retrieve users', message: err.message }, { status: 500 })
  }
}
