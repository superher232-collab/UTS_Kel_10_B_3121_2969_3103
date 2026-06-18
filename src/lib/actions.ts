// src/lib/actions.ts
'use server'

import { prisma } from './db'
import { revalidatePath } from 'next/cache'
import { notFound } from 'next/navigation'
import { ShipmentStatus, ShippingType, PaymentStatus, Role } from '@prisma/client'
import { validateStatusTransition } from './state-machine'
import { auth } from '@/auth'
import { z } from 'zod'

// Pre-defined shipping distance matrix for major hubs (BR-05)
const PORT_DISTANCES: Record<string, Record<string, number>> = {
  jakarta: { surabaya: 800, makassar: 1400, medan: 1900, balikpapan: 1200 },
  surabaya: { jakarta: 800, makassar: 800, medan: 2500, balikpapan: 900 },
  makassar: { jakarta: 1400, surabaya: 800, medan: 3000, balikpapan: 600 },
  medan: { jakarta: 1900, surabaya: 2500, makassar: 3000, balikpapan: 2800 },
  balikpapan: { jakarta: 1200, surabaya: 900, makassar: 600, medan: 2800 }
}

const VEHICLE_COEFFICIENTS = {
  DARAT: 2000,
  LAUT: 1500,
  UDARA: 5000
}

function getDistance(origin: string, destination: string): number {
  const o = origin.trim().toLowerCase()
  const d = destination.trim().toLowerCase()
  if (o === d) return 0
  return PORT_DISTANCES[o]?.[d] || PORT_DISTANCES[d]?.[o] || 500
}

export async function calculateTariff(weight: number, distanceKm: number, type: ShippingType): Promise<number> {
  if (weight < 0.1) return 0
  const coeff = VEHICLE_COEFFICIENTS[type] || 1500
  const baseFee = 25000
  return Math.round((distanceKm * weight * coeff) + baseFee)
}

const ShipmentSchema = z.object({
  senderName: z.string().min(1, 'Nama pengirim wajib diisi'),
  receiverName: z.string().min(1, 'Nama penerima wajib diisi'),
  receiverTelp: z.string().regex(/^\+?[0-9\s-]{6,16}$/, 'Format nomor telepon tidak valid'),
  origin: z.string().min(1, 'Kota asal wajib diisi'),
  destination: z.string().min(1, 'Kota tujuan wajib diisi'),
  itemName: z.string().min(1, 'Nama barang wajib diisi'),
  weight: z.preprocess(
    (val) => (val === '' || val === null ? undefined : Number(val)),
    z.number({ message: 'Berat wajib diisi' }).positive('Berat barang harus lebih besar dari 0 kg').refine(w => w >= 0.1, {
      message: 'VAL-001: Berat minimal kargo adalah 0.1 kg'
    })
  ),
  tariff: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? 0 : Number(val)),
    z.number().nonnegative().optional().default(0)
  ),
  shippingType: z.enum(['LAUT', 'DARAT', 'UDARA'], { message: 'Moda transportasi tidak valid' }),
  shipmentDate: z.string().min(1, 'Tanggal kirim wajib diisi').refine((val) => {
    const d = new Date(val);
    return !isNaN(d.getTime());
  }, { message: 'Format tanggal kirim tidak valid' }),
  vehicleId: z.string().nullable().optional(),
  notes: z.string().optional().nullable(),
  paymentMethod: z.string().optional().nullable(),
  targetUserId: z.string().optional().nullable()
}).refine((data) => data.origin.trim().toLowerCase() !== data.destination.trim().toLowerCase(), {
  message: 'Kota asal dan tujuan tidak boleh sama',
  path: ['destination']
})

export type ActionState = {
  success: boolean
  errors?: Record<string, string[]>
  message?: string
  data?: any
}

const generateReceiptNo = (): string => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `CRG-${dateStr}-${randomStr}`
}

export const createShipment = async (prevState: ActionState | null, formData: FormData): Promise<ActionState> => {
  const session = await auth()
  if (!session?.user) {
    return {
      success: false,
      message: 'AKSES DITOLAK: Silakan masuk terlebih dahulu.'
    }
  }

  const role = (session.user as any).role as Role
  const currentUserId = (session.user as any).id as string

  const rawData = {
    senderName: formData.get('senderName') as string,
    receiverName: formData.get('receiverName') as string,
    receiverTelp: formData.get('receiverTelp') as string,
    origin: formData.get('origin') as string,
    destination: formData.get('destination') as string,
    itemName: formData.get('itemName') as string,
    weight: formData.get('weight') as string,
    tariff: formData.get('tariff') as string,
    shippingType: formData.get('shippingType') as string,
    shipmentDate: formData.get('shipmentDate') as string,
    vehicleId: (formData.get('vehicleId') as string) || null,
    notes: formData.get('notes') as string,
    paymentMethod: formData.get('paymentMethod') as string,
    targetUserId: formData.get('targetUserId') as string
  }

  const validatedFields = ShipmentSchema.safeParse(rawData)

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Gagal memvalidasi form kargo.'
    }
  }

  const {
    senderName,
    receiverName,
    receiverTelp,
    origin,
    destination,
    itemName,
    weight,
    tariff: inputTariff,
    shippingType,
    shipmentDate,
    vehicleId,
    notes,
    paymentMethod,
    targetUserId
  } = validatedFields.data

  const [year, month, day] = shipmentDate.split('-').map(Number)
  const shipmentDateObj = new Date(year, month - 1, day)

  try {
    const receiptNo = generateReceiptNo()

    let assignedUserId = currentUserId
    if (role === Role.ADMIN && targetUserId) {
      const customer = await prisma.user.findUnique({ where: { id: targetUserId } })
      if (!customer || customer.role !== Role.CUSTOMER) {
        return { success: false, message: 'VAL-CUST: Customer ID tidak valid atau tidak ditemukan.' }
      }
      assignedUserId = customer.id
    }

    let finalTariff = inputTariff
    if (finalTariff <= 0) {
      const distance = getDistance(origin, destination)
      finalTariff = await calculateTariff(weight, distance, shippingType as ShippingType)
    }

    const shipment = await prisma.$transaction(async (tx) => {
      // Validate & occupy vehicle (BR-07)
      if (role === Role.ADMIN && vehicleId) {
        const vehicle = await tx.vehicle.findUnique({ where: { id: vehicleId } })
        if (!vehicle || vehicle.status !== 'TERSEDIA') {
          throw new Error('VEH-001: Kapal tidak tersedia atau sedang beroperasi.')
        }
        await tx.vehicle.update({
          where: { id: vehicleId },
          data: { status: 'DIPAKAI' }
        })
      }

      const newShipment = await tx.shipment.create({
        data: {
          receiptNo,
          shipmentDate: shipmentDateObj,
          senderName,
          receiverName,
          receiverTelp,
          origin,
          destination,
          itemName,
          weight,
          tariff: finalTariff,
          shippingType: shippingType as ShippingType,
          status: ShipmentStatus.DIPROSES,
          paymentStatus: PaymentStatus.BELUM_BAYAR,
          paymentMethod: paymentMethod || 'TUNAI',
          vehicleId: role === Role.ADMIN ? vehicleId : null,
          notes,
          userId: assignedUserId
        }
      })

      await tx.trackingHistory.create({
        data: {
          shipmentId: newShipment.id,
          previousStatus: null,
          newStatus: 'DIPROSES',
          notes: 'Cargo berhasil didaftarkan.',
          changedBy: currentUserId
        }
      })

      return newShipment
    })

    revalidatePath('/dashboard/cargo')
    return { success: true, message: `Sukses mendaftarkan cargo ${receiptNo}`, data: shipment }
  } catch (error: any) {
    console.error('Failed to create shipment:', error)
    return {
      success: false,
      message: error.message || 'Gagal menyimpan data kargo ke database.'
    }
  }
}

export const updateShipment = async (
  id: string,
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> => {
  const session = await auth()
  if (!session?.user) {
    return {
      success: false,
      message: 'AKSES DITOLAK: Silakan masuk terlebih dahulu.'
    }
  }

  const role = (session.user as any).role as Role
  const currentUserId = (session.user as any).id as string

  const rawData = {
    senderName: formData.get('senderName') as string,
    receiverName: formData.get('receiverName') as string,
    receiverTelp: formData.get('receiverTelp') as string,
    origin: formData.get('origin') as string,
    destination: formData.get('destination') as string,
    itemName: formData.get('itemName') as string,
    weight: formData.get('weight') as string,
    tariff: formData.get('tariff') as string,
    shippingType: formData.get('shippingType') as string,
    shipmentDate: formData.get('shipmentDate') as string,
    vehicleId: (formData.get('vehicleId') as string) || null,
    notes: formData.get('notes') as string,
    paymentMethod: formData.get('paymentMethod') as string,
    targetUserId: formData.get('targetUserId') as string
  }

  const validatedFields = ShipmentSchema.safeParse(rawData)

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Gagal memvalidasi revisi form kargo.'
    }
  }

  const {
    senderName,
    receiverName,
    receiverTelp,
    origin,
    destination,
    itemName,
    weight,
    tariff: inputTariff,
    shippingType,
    shipmentDate,
    vehicleId,
    notes,
    paymentMethod,
    targetUserId
  } = validatedFields.data

  const nextStatus = formData.get('status') as ShipmentStatus

  try {
    const currentShipment = await prisma.shipment.findUnique({
      where: { id }
    })

    if (!currentShipment) {
      notFound()
    }

    // Protect against non-admin editing other user's cargo
    if (role !== Role.ADMIN) {
      if (currentShipment.userId !== currentUserId) {
        return {
          success: false,
          message: 'AKSES DITOLAK: Anda hanya diperbolehkan mengedit shipment pribadi Anda.'
        }
      }
      if (currentShipment.status !== ShipmentStatus.DIPROSES) {
        return {
          success: false,
          message: 'SHIP-001: Kargo sudah dikirim atau selesai. Tidak dapat diedit.',
          errors: { status: ['Kargo sudah dikirim atau selesai. Tidak dapat diedit.'] }
        }
      }
    }

    let updatedUserId = currentShipment.userId;
    if (role === Role.ADMIN && targetUserId && targetUserId !== currentShipment.userId) {
      const customer = await prisma.user.findUnique({ where: { id: targetUserId } })
      if (!customer || customer.role !== Role.CUSTOMER) {
        return { success: false, message: 'VAL-CUST: Customer ID tidak valid atau tidak ditemukan.' }
      }
      updatedUserId = customer.id;
    }

    // State Machine validation
    if (nextStatus && currentShipment.status !== nextStatus) {
      if (role !== Role.ADMIN) {
        return {
          success: false,
          message: 'AKSES DITOLAK: Hanya administrator yang diperbolehkan mengubah status pengiriman.'
        }
      }

      const isValidTransition = validateStatusTransition(currentShipment.status, nextStatus)
      if (!isValidTransition) {
        return {
          success: false,
          message: `Transisi status dari ${currentShipment.status} ke ${nextStatus} tidak diperbolehkan.`
        }
      }
    }


    const [year, month, day] = shipmentDate.split('-').map(Number)
    const shipmentDateObj = new Date(year, month - 1, day)

    let finalTariff = currentShipment.tariff;
    if (currentShipment.status === ShipmentStatus.DIPROSES) {
      finalTariff = inputTariff;
      if (finalTariff <= 0) {
        const distance = getDistance(origin, destination)
        finalTariff = await calculateTariff(weight, distance, shippingType as ShippingType)
      }
    } else if (inputTariff !== currentShipment.tariff && inputTariff > 0) {
      // If user passed a different tariff but status is not DIPROSES, reject it (unless they passed 0/empty, which means default)
      return {
        success: false,
        message: 'Tarif harga tidak dapat diubah karena status kargo sudah tidak Diproses.',
        errors: { tariff: ['Tarif terkunci'] }
      }
    }

    const updatedShipment = await prisma.$transaction(async (tx) => {
      // Manage vehicle allocations & release (BR-07)
      if (role === Role.ADMIN && vehicleId !== currentShipment.vehicleId) {
        // Release old vehicle
        if (currentShipment.vehicleId) {
          await tx.vehicle.update({
            where: { id: currentShipment.vehicleId },
            data: { status: 'TERSEDIA' }
          })
        }
        // Occupy new vehicle
        if (vehicleId) {
          const vehicle = await tx.vehicle.findUnique({ where: { id: vehicleId } })
          if (!vehicle || vehicle.status !== 'TERSEDIA') {
            throw new Error('VEH-001: Kapal baru tidak tersedia atau sedang beroperasi.')
          }
          await tx.vehicle.update({
            where: { id: vehicleId },
            data: { status: 'DIPAKAI' }
          })
        }
      }

      // Auto invoice billing on completed status transition (BR-08)
      const isSelesaiTransition = role === Role.ADMIN && nextStatus === ShipmentStatus.SELESAI
      const paymentStatusToUse = isSelesaiTransition ? PaymentStatus.LUNAS : currentShipment.paymentStatus
      const actualArrivalToUse = isSelesaiTransition ? new Date() : undefined

      const shipmentAfterUpdate = await tx.shipment.update({
        where: { id },
        data: {
          userId: updatedUserId,
          senderName,
          receiverName,
          receiverTelp,
          origin,
          destination,
          itemName,
          weight,
          tariff: finalTariff,
          shippingType: shippingType as ShippingType,
          status: nextStatus || currentShipment.status,
          vehicleId: role === Role.ADMIN ? vehicleId : currentShipment.vehicleId,
          paymentStatus: paymentStatusToUse,
          paymentMethod: paymentMethod || currentShipment.paymentMethod,
          actualArrival: actualArrivalToUse,
          notes
        }
      })

      const statusChanged = nextStatus && nextStatus !== currentShipment.status
      if (statusChanged) {
        await tx.trackingHistory.create({
          data: {
            shipmentId: id,
            previousStatus: currentShipment.status,
            newStatus: nextStatus,
            notes: `Status diperbarui menjadi ${nextStatus}.`,
            changedBy: currentUserId
          }
        })
      }

      return shipmentAfterUpdate
    })

    revalidatePath('/dashboard/cargo')
    return { success: true, message: `Sukses memperbarui cargo ${updatedShipment.receiptNo}`, data: updatedShipment }
  } catch (error: any) {
    console.error('Failed to update shipment:', error)
    return {
      success: false,
      message: error.message || 'Gagal merubah data kargo di database.'
    }
  }
}

export const updateShipmentStatus = async (id: string, nextStatus: ShipmentStatus): Promise<ActionState> => {
  const session = await auth()
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return {
      success: false,
      message: 'AKSES DITOLAK: Hak akses Admin diperlukan.'
    }
  }

  try {
    const currentShipment = await prisma.shipment.findUnique({ where: { id } })
    if (!currentShipment) {
      notFound()
    }

    const isValid = validateStatusTransition(currentShipment.status, nextStatus)
    if (!isValid) {
      return {
        success: false,
        message: `Transisi status dari ${currentShipment.status} ke ${nextStatus} tidak diperbolehkan.`
      }
    }

    // Auto invoice billing on completed status transition (BR-08)
    const updateData: any = { status: nextStatus }
    if (nextStatus === ShipmentStatus.SELESAI) {
      updateData.actualArrival = new Date()
      updateData.paymentStatus = PaymentStatus.LUNAS
    }

    const currentUserId = (session.user as any).id as string

    const updated = await prisma.$transaction(async (tx) => {
      // If completed, release vehicle back to available
      if (nextStatus === ShipmentStatus.SELESAI && currentShipment.vehicleId) {
        await tx.vehicle.update({
          where: { id: currentShipment.vehicleId },
          data: { status: 'TERSEDIA' }
        })
      }

      const shipmentAfterUpdate = await tx.shipment.update({
        where: { id },
        data: updateData
      })

      await tx.trackingHistory.create({
        data: {
          shipmentId: id,
          previousStatus: currentShipment.status,
          newStatus: nextStatus,
          notes: `Status diperbarui menjadi ${nextStatus}.`,
          changedBy: currentUserId
        }
      })

      return shipmentAfterUpdate
    })

    revalidatePath('/dashboard/cargo')
    return { success: true, message: `Status berhasil diubah ke ${nextStatus}`, data: updated }
  } catch (error) {
    console.error('Failed to update shipment status:', error)
    throw new Error('Gagal memperbarui status kargo di database.')
  }
}

// Dedicated Shipment Cancellation with reason validation (BR-03 & BR-02)
export const cancelShipment = async (id: string, reason: string): Promise<ActionState> => {
  const session = await auth()
  if (!session?.user) {
    return {
      success: false,
      message: 'AKSES DITOLAK: Silakan masuk terlebih dahulu.'
    }
  }

  const role = (session.user as any).role as Role
  const currentUserId = (session.user as any).id as string

  if (!reason || reason.trim().length < 10) {
    return {
      success: false,
      message: 'VAL-003: Alasan pembatalan wajib diisi minimal 10 karakter.'
    }
  }

  try {
    const shipment = await prisma.shipment.findUnique({ where: { id } })
    if (!shipment) {
      notFound()
    }

    // Enforce role isolation (BR-01, BR-02)
    if (role !== Role.ADMIN) {
      if (shipment.userId !== currentUserId) {
        return {
          success: false,
          message: 'AKSES DITOLAK: Anda hanya diperbolehkan membatalkan shipment pribadi Anda.'
        }
      }
      if (shipment.status !== ShipmentStatus.DIPROSES) {
        return {
          success: false,
          message: 'SHIP-002: Kargo sudah dikirim atau selesai. Tidak dapat dibatalkan.'
        }
      }
    } else {
      // Admins cannot cancel completed shipments either
      if (shipment.status === ShipmentStatus.SELESAI) {
        return {
          success: false,
          message: 'SHIP-002: Shipment sudah selesai, tidak dapat dibatalkan.'
        }
      }
    }

    const isCustomer = role === Role.CUSTOMER
    const targetStatus = isCustomer ? ShipmentStatus.MENUNGGU_PEMBATALAN : ShipmentStatus.DIBATALKAN
    const prefix = isCustomer ? 'MENUNGGU BATAL' : 'BATAL'
    const cancelNotes = `[${prefix}: ${reason.trim()}] ${shipment.notes || ''}`

    const updated = await prisma.$transaction(async (tx) => {
      // Release vehicle if cancel active allocation AND it is fully cancelled by Admin
      if (!isCustomer && shipment.vehicleId) {
        await tx.vehicle.update({
          where: { id: shipment.vehicleId },
          data: { status: 'TERSEDIA' }
        })
      }

      const shipmentAfterUpdate = await tx.shipment.update({
        where: { id },
        data: {
          status: targetStatus,
          notes: cancelNotes
        }
      })

      await tx.trackingHistory.create({
        data: {
          shipmentId: id,
          previousStatus: shipment.status,
          newStatus: targetStatus,
          notes: isCustomer 
            ? `Pengajuan pembatalan diajukan oleh Customer. Alasan: ${reason.trim()}`
            : `Pengiriman dibatalkan oleh Admin. Alasan: ${reason.trim()}`,
          changedBy: currentUserId
        }
      })

      return shipmentAfterUpdate
    })

    revalidatePath('/dashboard/cargo')
    const successMsg = isCustomer 
      ? `Pengajuan pembatalan cargo ${shipment.receiptNo} berhasil dikirim.` 
      : `Sukses membatalkan pengiriman cargo ${shipment.receiptNo}`
    return { success: true, message: successMsg, data: updated }
  } catch (error: any) {
    console.error('Failed to cancel shipment:', error)
    return {
      success: false,
      message: 'Gagal memproses pembatalan kargo.'
    }
  }
}

export const deleteShipment = async (id: string): Promise<ActionState> => {
  const session = await auth()
  if (!session?.user) {
    return {
      success: false,
      message: 'AKSES DITOLAK: Silakan masuk terlebih dahulu.'
    }
  }

  const role = (session.user as any).role as Role
  const currentUserId = (session.user as any).id as string

  try {
    const shipment = await prisma.shipment.findUnique({ where: { id } })
    if (!shipment) {
      notFound()
    }

    if (role !== Role.ADMIN) {
      if (shipment.userId !== currentUserId) {
        return {
          success: false,
          message: 'AKSES DITOLAK: Anda hanya diperbolehkan menghapus shipment pribadi Anda.'
        }
      }
      if (shipment.status !== ShipmentStatus.DIPROSES) {
        return {
          success: false,
          message: 'Gagal: Kargo sudah dikirim atau selesai. Tidak dapat dihapus.'
        }
      }
    }

    await prisma.$transaction(async (tx) => {
      if (shipment.vehicleId) {
        await tx.vehicle.update({
          where: { id: shipment.vehicleId },
          data: { status: 'TERSEDIA' }
        })
      }
      await tx.shipment.delete({ where: { id } })
    })

    revalidatePath('/dashboard/cargo')
    return { success: true, message: 'Sukses menghapus data kargo.' }
  } catch (error) {
    console.error('Failed to delete shipment:', error)
    throw new Error('Gagal menghapus data kargo di database.')
  }
}

export const searchShipments = async (query: string): Promise<any[]> => {
  try {
    return await prisma.shipment.findMany({
      where: {
        OR: [
          { receiptNo: { contains: query, mode: 'insensitive' } },
          { senderName: { contains: query, mode: 'insensitive' } },
          { receiverName: { contains: query, mode: 'insensitive' } },
          { itemName: { contains: query, mode: 'insensitive' } }
        ]
      },
      include: {
        vehicle: true,
        user: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  } catch (error) {
    console.error('Search failed:', error)
    throw new Error('Terjadi kesalahan saat mencari data kargo di database.')
  }
}

export async function confirmShipmentPayment(id: string): Promise<ActionState> {
  const session = await auth()
  if (!session?.user) {
    return {
      success: false,
      message: 'AKSES DITOLAK: Silakan masuk terlebih dahulu.'
    }
  }

  try {
    const shipment = await prisma.shipment.findUnique({ where: { id } })
    if (!shipment) {
      return { success: false, message: 'Kargo tidak ditemukan.' }
    }

    const updated = await prisma.shipment.update({
      where: { id },
      data: {
        paymentStatus: PaymentStatus.LUNAS,
        paidAt: new Date()
      }
    })

    revalidatePath('/dashboard/cargo')
    revalidatePath('/admin')
    return {
      success: true,
      message: `Pembayaran kargo resi ${shipment.receiptNo} berhasil dikonfirmasi LUNAS.`
    }
  } catch (error: any) {
    console.error('Failed to confirm payment:', error)
    return {
      success: false,
      message: `Gagal mengonfirmasi pembayaran: ${error.message}`
    }
  }
}
