// src/auth.ts
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string
        const password = credentials?.password as string

        if (!email || !email.includes('@') || !password) return null

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) return null

        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if (!isPasswordMatch) return null

        // ✅ Return user dengan role (pakai as any biar TypeScript nggak error)
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        } as any
      }
    })
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // ✅ Casting ke any biar bisa akses role
        const u = user as any
        token.id = u.id
        token.role = u.role
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        // ✅ Casting ke any biar bisa assign role
        const s = session.user as any
        const t = token as any
        s.id = t.id
        s.role = t.role
      }
      return session
    }
  },

  pages: {
    signIn: '/login'
  },

  session: {
    strategy: 'jwt'
  }
})