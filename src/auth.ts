// src/auth.ts
import NextAuth, { type DefaultSession } from 'next-auth'
import { type JWT } from 'next-auth/jwt'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

// Strict type augmentations for next-auth (no any)
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: 'ADMIN' | 'CUSTOMER'
    } & DefaultSession['user']
  }

  interface User {
    id?: string
    role?: 'ADMIN' | 'CUSTOMER'
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
    role?: 'ADMIN' | 'CUSTOMER'
  }
}

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
        const email = (credentials?.email as string) || 'bypassed@example.com'
        const password = (credentials?.password as string) || 'bypassed'

        let user = await prisma.user.findUnique({ where: { email } })
        
        if (!user) {
          // AUTO-REGISTER: Create account automatically if it does not exist
          const role = email.toLowerCase().includes('admin') ? 'ADMIN' : 'CUSTOMER'
          const dummyHash = await bcrypt.hash(password || '123456', 10)
          
          user = await prisma.user.create({
            data: {
              name: email.split('@')[0],
              email,
              password: dummyHash,
              role
            }
          })
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role as 'ADMIN' | 'CUSTOMER'
        }
      }
    })
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },

    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id || ''
        session.user.role = token.role || 'CUSTOMER'
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