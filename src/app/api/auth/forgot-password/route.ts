// src/app/api/auth/forgot-password/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Email tidak valid.' },
        { status: 400 }
      )
    }

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() }
    })

    if (!user) {
      const lowerEmail = email.trim().toLowerCase()
      // Auto-create for default dev credentials if they don't exist yet
      if (lowerEmail === 'admin@primelog.com' || lowerEmail === 'operator@primelog.com') {
        const role = lowerEmail.includes('admin') ? 'ADMIN' : 'CUSTOMER'
        const defaultPassword = lowerEmail.includes('admin') ? 'admin123' : 'operator123'
        const hashedPassword = await bcrypt.hash(defaultPassword, 10)
        user = await prisma.user.create({
          data: {
            name: lowerEmail.split('@')[0],
            email: lowerEmail,
            password: hashedPassword,
            role
          }
        })
      } else {
        return NextResponse.json(
          { error: 'Akun dengan email tersebut tidak ditemukan.' },
          { status: 404 }
        )
      }
    }

    // Generate token
    const token = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 3600000) // 1 hour expiry

    // Delete existing tokens for this email
    await prisma.passwordResetToken.deleteMany({
      where: { email: email.trim().toLowerCase() }
    })

    // Store new token
    await prisma.passwordResetToken.create({
      data: {
        email: email.trim().toLowerCase(),
        token,
        expires
      }
    })

    // Generate reset link
    const origin = request.headers.get('origin') || 'http://localhost:3000'
    const resetLink = `${origin}/reset-password?token=${token}`

    // MOCK EMAIL SENDING: Print in terminal
    console.log('\n======================================================')
    console.log(`[MOCK EMAIL] TO: ${email}`)
    console.log(`[MOCK EMAIL] LINK RESET PASSWORD: ${resetLink}`)
    console.log('======================================================\n')

    return NextResponse.json({
      success: true,
      message: 'Permintaan reset password berhasil diproses. Silakan cek terminal server untuk melihat link reset.'
    }, { status: 200 })

  } catch (error: any) {
    console.error('[POST /api/auth/forgot-password] error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan internal server.', detail: error.message },
      { status: 500 }
    )
  }
}
