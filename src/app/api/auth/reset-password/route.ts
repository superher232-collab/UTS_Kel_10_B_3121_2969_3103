// src/app/api/auth/reset-password/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json()

    if (!token || !password || password.length < 6) {
      return NextResponse.json(
        { error: 'Token tidak valid atau password terlalu pendek (minimal 6 karakter).' },
        { status: 400 }
      )
    }

    // Verify token
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token }
    })

    if (!resetToken) {
      return NextResponse.json(
        { error: 'Token reset password tidak valid atau sudah kedaluwarsa.' },
        { status: 400 }
      )
    }

    // Check expiration
    if (new Date() > resetToken.expires) {
      // Clean up expired token
      await prisma.passwordResetToken.delete({
        where: { id: resetToken.id }
      })
      return NextResponse.json(
        { error: 'Token reset password sudah kedaluwarsa.' },
        { status: 400 }
      )
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Update user's password
    await prisma.$transaction([
      prisma.user.update({
        where: { email: resetToken.email },
        data: { password: hashedPassword }
      }),
      // Clean up token after use
      prisma.passwordResetToken.delete({
        where: { id: resetToken.id }
      })
    ])

    return NextResponse.json({
      success: true,
      message: 'Password berhasil diubah. Silakan login kembali dengan password baru.'
    }, { status: 200 })

  } catch (error: any) {
    console.error('[POST /api/auth/reset-password] error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan internal server.', detail: error.message },
      { status: 500 }
    )
  }
}
