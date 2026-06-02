// src/app/api/admin/users/[id]/route.ts
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { Role } from '@prisma/client'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { logAudit } from '@/lib/audit'

const UserMutationSchema = z.object({
  role: z.enum([Role.ADMIN, Role.OPERATOR, Role.CUSTOMER]).optional(),
  password: z.string().min(6, 'Password minimal 6 karakter').optional(),
  softDelete: z.boolean().optional()
})

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || (session.user as any)?.role !== Role.ADMIN) {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()
    const parsed = UserMutationSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({
        error: 'Validation failed',
        details: parsed.error.flatten().fieldErrors
      }, { status: 400 })
    }

    const targetUser = await prisma.user.findUnique({ where: { id } })
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const updateData: any = {}
    const auditMetadata: any = {}

    if (parsed.data.role !== undefined) {
      updateData.role = parsed.data.role
      auditMetadata.role = parsed.data.role
    }

    if (parsed.data.password !== undefined) {
      updateData.password = await bcrypt.hash(parsed.data.password, 10)
      auditMetadata.passwordReset = true
    }

    if (parsed.data.softDelete !== undefined) {
      updateData.deletedAt = parsed.data.softDelete ? new Date() : null
      auditMetadata.softDelete = parsed.data.softDelete
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        address: true,
        deletedAt: true
      }
    })

    const adminUserId = (session.user as any).id as string
    await logAudit({
      userId: adminUserId,
      action: 'USER_MUTATION',
      resourceType: 'User',
      resourceId: updatedUser.id,
      metadata: auditMetadata
    })

    return NextResponse.json({
      message: 'User updated successfully',
      data: updatedUser
    })
  } catch (error: unknown) {
    const err = error as Error
    return NextResponse.json({ error: 'Failed to update user', message: err.message }, { status: 500 })
  }
}
