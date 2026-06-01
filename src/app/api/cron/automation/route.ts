// src/app/api/cron/automation/route.ts
import { NextResponse } from 'next/server'
import { runAutomation } from '@/lib/automation'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const secret = searchParams.get('secret') || request.headers.get('x-cron-secret')
    
    const cronSecret = process.env.CRON_SECRET || 'supersecret'
    if (secret !== cronSecret) {
      return NextResponse.json({ error: 'Unauthorized: Invalid cron key' }, { status: 401 })
    }

    const logs = await runAutomation()

    return NextResponse.json({
      success: true,
      message: 'Automasi background cron selesai.',
      logs
    })
  } catch (error: unknown) {
    const err = error as Error
    return NextResponse.json({ error: 'Cron automation failed', message: err.message }, { status: 500 })
  }
}
