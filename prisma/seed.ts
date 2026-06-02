import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const main = async (): Promise<void> => {
  // Clear existing data to ensure idempotent seeding
  await prisma.shipment.deleteMany({})
  await prisma.vehicle.deleteMany({})
  await prisma.user.deleteMany({})

  // Hash passwords
  const adminPasswordHash = await bcrypt.hash('admin123', 10)
  const customerPasswordHash = await bcrypt.hash('customer123', 10)

  // Seed Users
  const admin = await prisma.user.create({
    data: {
      name: 'PrimeLog Admin',
      email: 'admin@primelog.com',
      password: adminPasswordHash,
      role: Role.ADMIN
    }
  })

  await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'customer@primelog.com',
      password: customerPasswordHash,
      role: Role.OPERATOR
    }
  })

  // Seed Vehicles (Tingkatan paket maritim: STANDAR, CEPAT, VVIP)
  const v1 = await prisma.vehicle.create({
    data: {
      name: 'KM NUSANTARA',
      type: 'STANDAR',
      plateNo: 'ID-SHIP-001',
      capacity: 5000.0,
      status: 'TERSEDIA'
    }
  })

  const v2 = await prisma.vehicle.create({
    data: {
      name: 'KM PELNI SINABUNG',
      type: 'CEPAT',
      plateNo: 'ID-SHIP-002',
      capacity: 3500.0,
      status: 'TERSEDIA'
    }
  })

  const v3 = await prisma.vehicle.create({
    data: {
      name: 'MV MERATUS JAYAPURA',
      type: 'VVIP',
      plateNo: 'ID-SHIP-003',
      capacity: 8000.0,
      status: 'TERSEDIA'
    }
  })

  // Seed initial sample shipment
  await prisma.shipment.create({
    data: {
      receiptNo: 'CRG-20260531-INIT',
      senderName: 'PT Globalindo Mandiri',
      receiverName: 'Sinar Logistics Batam',
      receiverTelp: '081234567890',
      origin: 'Jakarta',
      destination: 'Makassar',
      itemName: 'Suku Cadang Kompresor',
      weight: 4.5,
      tariff: 250000.0,
      shippingType: 'LAUT',
      status: 'DIPROSES',
      notes: 'Harap muat dengan hati-hati.',
      userId: admin.id,
      vehicleId: v1.id
    }
  })

  console.log('Seeding completed successfully.')
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e)
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
