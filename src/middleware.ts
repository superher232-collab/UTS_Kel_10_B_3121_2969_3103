// middleware.ts
import NextAuth from 'next-auth'
import { NextResponse } from 'next/server'
import { authConfig } from './auth.config'

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const session = req.auth
  const { pathname } = req.nextUrl

  // Jika user belum login, lempar ke /login
  if (!session?.user) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  // Proteksi /admin: Hanya role ADMIN yang boleh masuk
  if (pathname.startsWith('/admin')) {
    if (session.user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
    }
  }

  // Proteksi /dashboard: ADMIN tidak boleh masuk ke /dashboard customer
  if (pathname === '/dashboard' || pathname.startsWith('/dashboard/')) {
    if (session.user.role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', req.nextUrl))
    }
  }

  return NextResponse.next()
})

export const config = {
  // Melindungi seluruh route aplikasi KECUALI route auth, aset publik, dan file Next.js internal
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico|login|register|forgot-password|reset-password).*)']
}