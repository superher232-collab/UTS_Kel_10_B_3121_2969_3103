import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/auth'
import { z } from 'zod'

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Akses Ditolak. Sesi tidak valid.' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        emailNotif: true,
        smsNotif: true,
        role: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User tidak ditemukan.' }, { status: 404 })
    }

    return NextResponse.json({ data: user })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Terjadi kesalahan internal server' }, { status: 500 })
  }
}

const UpdateProfileSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  emailNotif: z.boolean().optional(),
  smsNotif: z.boolean().optional()
})

export async function PUT(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Akses Ditolak. Sesi tidak valid.' }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = UpdateProfileSchema.parse(body)

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name: validatedData.name,
        phone: validatedData.phone,
        address: validatedData.address,
        emailNotif: validatedData.emailNotif ?? true,
        smsNotif: validatedData.smsNotif ?? true
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        emailNotif: true,
        smsNotif: true
      }
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Profil berhasil diperbarui.',
      data: updatedUser 
    })
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validasi gagal: ' + err.issues[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: err.message || 'Gagal memperbarui profil' }, { status: 500 })
  }
}
