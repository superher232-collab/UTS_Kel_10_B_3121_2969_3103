// src/app/api/vehicles/route.ts
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { Role, VehicleStatus, VehicleType } from '@prisma/client'
import { z } from 'zod'



// GET /api/vehicles - retrieve all fleet vehicles (Admin/Staff only)
export async function GET() {
  try {
    const session = await auth()
    if (!session || (session.user as any)?.role !== Role.ADMIN) {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 })
    }

    const fleet = await prisma.vehicle.findMany({
      orderBy: { name: 'asc' }
    })

    return NextResponse.json({ data: fleet })
  } catch (error: unknown) {
    const err = error as Error
    return NextResponse.json({ error: 'Failed to fetch vehicles', message: err.message }, { status: 500 })
  }
}

