import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { name, email, password, role, phone, address } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create the user
    const userRole = role === 'ADMIN' ? 'ADMIN' : role === 'CUSTOMER' ? 'CUSTOMER' : 'OPERATOR'
    
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: userRole,
        phone: phone || null,
        address: address || null,
      }
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Registration successful',
      user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
    })
    
  } catch (error: any) {
    return NextResponse.json({ error: 'Server error', detail: error.message }, { status: 500 })
  }
}
