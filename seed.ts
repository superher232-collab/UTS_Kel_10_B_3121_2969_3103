import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Hash password
  const password = await bcrypt.hash('password123', 10)

  // Buat Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@test.com',
      password,
      role: 'ADMIN',
    },
  })

  // Buat Customer
  const customer = await prisma.user.upsert({
    where: { email: 'customer@test.com' },
    update: {},
    create: {
      name: 'Budi Customer',
      email: 'customer@test.com',
      password,
      role: 'CUSTOMER',
      phone: '08123456789',
      address: 'Jl. Test No. 123'
    },
  })

  console.log('✅ Berhasil membuat akun pengguna!')
  console.log('-----------------------------------')
  console.log('ADMIN')
  console.log('Email:', admin.email)
  console.log('Password: password123')
  console.log('-----------------------------------')
  console.log('OPERATOR')
  console.log('Email:', customer.email)
  console.log('Password: password123')
  console.log('-----------------------------------')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
