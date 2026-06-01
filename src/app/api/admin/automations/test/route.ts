// src/app/api/admin/automations/test/route.ts
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { Role } from '@prisma/client'
import { runAutomation } from '@/lib/automation'

export async function POST() {
  try {
    const session = await auth()
    if (!session || (session.user as any)?.role !== Role.ADMIN) {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 })
    }

    const logs = await runAutomation()

    return NextResponse.json({
      success: true,
      message: 'Automasi berhasil dijalankan secara manual.',
      logs
    })
  } catch (error: unknown) {
    const err = error as Error
    return NextResponse.json({ error: 'Failed to run manual automation override', message: err.message }, { status: 500 })
  }
}
