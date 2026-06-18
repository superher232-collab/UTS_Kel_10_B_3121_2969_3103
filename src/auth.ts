// src/auth.ts
import NextAuth, { type DefaultSession } from 'next-auth'
import { type JWT } from 'next-auth/jwt'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { authConfig } from './auth.config'

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
  ...authConfig,
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
          throw new Error('Kredensial salah. Email tidak terdaftar.')
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        
        if (!isPasswordValid) {
          throw new Error('Kredensial salah. Kata sandi tidak cocok.')
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role as 'ADMIN' | 'CUSTOMER'
        }
      }
    })
  ]
})