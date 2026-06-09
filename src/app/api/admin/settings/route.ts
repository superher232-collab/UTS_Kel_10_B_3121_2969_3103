// src/app/api/admin/settings/route.ts
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { Role } from '@prisma/client'
import { z } from 'zod'
import { logAudit } from '@/lib/audit'

const UpdateSettingsSchema = z.object({
  key: z.string().min(1, 'Key wajib diisi'),
  value: z.any(),
  category: z.enum(['NOTIFICATION', 'TARIFF', 'FEATURE_FLAG']).optional()
})

const DEFAULT_SETTINGS = [
  {
    key: 'tariffRules',
    value: JSON.stringify({ LAUT: 1500, baseFee: 25000 }),
    category: 'TARIFF'
  },
  {
    key: 'notifTemplates',
    value: JSON.stringify({
      welcome: 'Halo {name}, selamat bergabung di PrimeLog!',
      shipmentUpdate: 'Kargo {receiptNo} Anda saat ini berstatus {status}.'
    }),
    category: 'NOTIFICATION'
  },
  {
    key: 'featureFlags',
    value: JSON.stringify({
      autoAssignArmada: true,
      enableCompensation: true
    }),
    category: 'FEATURE_FLAG'
  }
]

async function ensureDefaultSettings() {
  const count = await prisma.systemSettings.count()
  if (count === 0) {
    await prisma.systemSettings.createMany({
      data: DEFAULT_SETTINGS
    })
  }
}

export async function GET() {
  try {
    const session = await auth()
    if (!session || (session.user as any)?.role !== Role.ADMIN) {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 })
    }

    await ensureDefaultSettings()

    const settings = await prisma.systemSettings.findMany()
    const mappedSettings = settings.reduce((acc, curr) => {
      acc[curr.key] = {
        id: curr.id,
        value: JSON.parse(curr.value),
        category: curr.category,
        updatedAt: curr.updatedAt
      }
      return acc;
    }, {} as Record<string, any>)

    return NextResponse.json({ data: mappedSettings })
  } catch (error: unknown) {
    const err = error as Error
    return NextResponse.json({ error: 'Failed to retrieve settings', message: err.message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth()
    if (!session || (session.user as any)?.role !== Role.ADMIN) {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const parsed = UpdateSettingsSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({
        error: 'Validation failed',
        details: parsed.error.flatten().fieldErrors
      }, { status: 400 })
    }

    const { key, value, category } = parsed.data
    const stringifiedValue = typeof value === 'string' ? value : JSON.stringify(value)

    await ensureDefaultSettings()

    const existingSetting = await prisma.systemSettings.findUnique({
      where: { key }
    })

    let updatedSetting
    if (existingSetting) {
      updatedSetting = await prisma.systemSettings.update({
        where: { key },
        data: {
          value: stringifiedValue,
          ...(category && { category })
        }
      })
    } else {
      updatedSetting = await prisma.systemSettings.create({
        data: {
          key,
          value: stringifiedValue,
          category: category || 'FEATURE_FLAG'
        }
      })
    }

    const adminUserId = (session.user as any).id as string
    await logAudit({
      userId: adminUserId,
      action: 'SETTINGS_UPDATE',
      resourceType: 'Settings',
      resourceId: updatedSetting.id,
      metadata: { key, updatedValue: value }
    })

    return NextResponse.json({
      message: 'Setting updated successfully',
      data: {
        ...updatedSetting,
        value: JSON.parse(updatedSetting.value)
      }
    })
  } catch (error: unknown) {
    const err = error as Error
    return NextResponse.json({ error: 'Failed to update settings', message: err.message }, { status: 500 })
  }
}
