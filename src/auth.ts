import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export const { handlers, auth, signIn, signOut } = NextAuth({
  // ✅ Gunakan AUTH_SECRET (NextAuth v5 standard)
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

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role // ✅ Pastikan enum di DB: 'ADMIN' atau 'CUSTOMER'
        }
      }
    })
  ],

  callbacks: {
    // ✅ Simpan role & id ke JWT token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },

    // ✅ Restore role & id dari token ke session
    async session({ session, token }) {
      if (session.user && token.id && token.role) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    }
  },

  pages: {
    signIn: '/login'
  },

  session: {
    strategy: 'jwt' // ✅ Wajib untuk credentials provider
  }
})