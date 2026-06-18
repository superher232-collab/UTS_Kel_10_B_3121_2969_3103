// middleware.ts
import { NextResponse } from 'next/server'
import { auth } from './auth'

export default auth((req) => {
  const session = req.auth
  const { pathname } = req.nextUrl

  // Jika user belum login, lempar ke /login
  if (!session?.user) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  // Cek role ADMIN khusus untuk route /admin/*
  if (pathname.startsWith('/admin')) {
    if (session.user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
    }
  }

  return NextResponse.next()
})

export const config = {
  // Melindungi seluruh route aplikasi KECUALI route auth, aset publik, dan file Next.js internal
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico|login|register|forgot-password|reset-password).*)']
}