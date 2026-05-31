import { NextResponse } from 'next/server'
import { auth } from './auth'

export default auth((req) => {
  const session = req.auth
  const isLoggedIn = !!session?.user
  const { pathname } = req.nextUrl

  // 1. Cek protected routes (login required)
  const isProtected = pathname.startsWith('/dashboard') || pathname.startsWith('/admin')
  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login?callbackUrl=' + encodeURIComponent(pathname), req.nextUrl))
  }

  // 2. ✅ TAMBAHAN: Cek admin routes (role required)
  const isAdminRoute = pathname.startsWith('/admin')
  if (isAdminRoute && session?.user?.role !== 'ADMIN') {
    // Redirect ke dashboard atau halaman unauthorized
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
    // Atau: return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return NextResponse.next()
})

export const config = {
  // ✅ Pastikan matcher mencakup root path juga
  matcher: ['/dashboard/:path*', '/admin/:path*', '/dashboard', '/admin']
}