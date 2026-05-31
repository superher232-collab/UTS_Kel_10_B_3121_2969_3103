// middleware.ts
import { NextResponse } from 'next/server'
import { auth } from './auth'

export default auth((req) => {
  const session = req.auth
  const { pathname } = req.nextUrl

  // Cek login untuk route protected
  const isProtected = pathname.startsWith('/dashboard') || pathname.startsWith('/admin')
  if (isProtected && !session?.user) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  // Cek role ADMIN khusus untuk route /admin/*
  if (pathname.startsWith('/admin')) {
    if (session?.user?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*']
}