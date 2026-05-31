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

        if (!email || !email.includes('@')) {
          return null
        }

        if (!password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email }
        })

        if (!user) {
          return null
        }

        const isPasswordMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (isPasswordMatch) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        }

        return null
      }
    })
  ],

  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.role = (user as any).role
        token.id = user.id
      }
      return token
    },

    session: async ({ session, token }) => {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id as string
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
