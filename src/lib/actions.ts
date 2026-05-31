'use server'

import { prisma } from './db'
import { revalidatePath } from 'next/cache'
import { notFound } from 'next/navigation'
import { ShipmentStatus, ShippingType } from '@prisma/client'
import { validateStatusTransition } from './state-machine'
import { auth } from '@/auth'
import { z } from 'zod'

const ShipmentSchema = z.object({
  senderName: z.string().min(1, 'Nama pengirim wajib diisi'),
  receiverName: z.string().min(1, 'Nama penerima wajib diisi'),
  receiverTelp: z.string().regex(/^\+?[0-9\s-]{6,16}$/, 'Format nomor telepon tidak valid'),
  origin: z.string().min(1, 'Kota asal wajib diisi'),
  destination: z.string().min(1, 'Kota tujuan wajib diisi'),
  itemName: z.string().min(1, 'Nama barang wajib diisi'),
  weight: z.preprocess(
    (val) => (val === '' || val === null ? undefined : Number(val)),
    z.number({ message: 'Berat wajib diisi' }).positive('Berat barang harus lebih besar dari 0 kg')
  ),
  tariff: z.preprocess(
    (val) => (val === '' || val === null ? undefined : Number(val)),
    z.number({ message: 'Tarif wajib diisi' }).nonnegative('Tarif pengiriman tidak boleh bernilai negatif')
  ),
  shippingType: z.enum(['LAUT'], { message: 'Moda transportasi hanya boleh Laut' }),
  shipmentDate: z.string().min(1, 'Tanggal kirim wajib diisi').refine((val) => {
    const d = new Date(val);
    return !isNaN(d.getTime());
  }, { message: 'Format tanggal kirim tidak valid' }).refine((val) => {
    const [year, month, day] = val.split('-').map(Number);
    const selectedLocalDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedLocalDate >= today;
  }, { message: 'Tanggal kirim tidak boleh di masa lalu' }),
  vehicleId: z.string().nullable().optional(),
  notes: z.string().optional().nullable()
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
  // 1. Session Auth validation
  const session = await auth()
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return {
      success: false,
      message: 'AKSES DITOLAK: Anda harus masuk sebagai Administrator untuk melakukan mutasi data.'
    }
  }

  const userId = (session.user as any).id as string

  // 2. Extract and Validate inputs via Zod
  const rawData = {
    senderName: formData.get('senderName') as string,
    receiverName: formData.get('receiverName') as string,
    receiverTelp: formData.get('receiverTelp') as string,
    origin: formData.get('origin') as string,
    destination: formData.get('destination') as string,
    itemName: formData.get('itemName') as string,
    weight: formData.get('weight') as string,
    tariff: formData.get('tariff') as string,
    shippingType: formData.get('shippingType') as ShippingType,
    shipmentDate: formData.get('shipmentDate') as string,
    vehicleId: (formData.get('vehicleId') as string) || null,
    notes: formData.get('notes') as string
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
    tariff,
    shippingType,
    shipmentDate,
    vehicleId,
    notes
  } = validatedFields.data

  const [year, month, day] = shipmentDate.split('-').map(Number)
  const shipmentDateObj = new Date(year, month - 1, day)

  try {
    const receiptNo = generateReceiptNo()

    const shipment = await prisma.shipment.create({
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
        tariff,
        shippingType,
        status: ShipmentStatus.DIPROSES,
        vehicleId,
        notes,
        userId
      }
    })

    revalidatePath('/dashboard/cargo')
    return { success: true, message: `Sukses mendaftarkan cargo ${receiptNo}`, data: shipment }
  } catch (error) {
    console.error('Failed to create shipment:', error)
    // Throw error so error.tsx gets triggered for high-level DB failures
    throw new Error('Gagal menyimpan data kargo ke database.')
  }
}

export const updateShipment = async (
  id: string,
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> => {
  // 1. Session Auth validation
  const session = await auth()
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return {
      success: false,
      message: 'AKSES DITOLAK: Anda harus masuk sebagai Administrator untuk melakukan mutasi data.'
    }
  }

  // 2. Extract and Validate inputs via Zod
  const rawData = {
    senderName: formData.get('senderName') as string,
    receiverName: formData.get('receiverName') as string,
    receiverTelp: formData.get('receiverTelp') as string,
    origin: formData.get('origin') as string,
    destination: formData.get('destination') as string,
    itemName: formData.get('itemName') as string,
    weight: formData.get('weight') as string,
    tariff: formData.get('tariff') as string,
    shippingType: formData.get('shippingType') as ShippingType,
    shipmentDate: formData.get('shipmentDate') as string,
    vehicleId: (formData.get('vehicleId') as string) || null,
    notes: formData.get('notes') as string
  }

  const validatedFields = ShipmentSchema.safeParse(rawData)

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Gagal memvalidasi revisi form kargo.'
    }
  }

  const nextStatus = formData.get('status') as ShipmentStatus

  try {
    const currentShipment = await prisma.shipment.findUnique({
      where: { id }
    })

    if (!currentShipment) {
      notFound()
    }

    // 3. State Machine transition check (if status is changing)
    if (nextStatus && currentShipment.status !== nextStatus) {
      const isValidTransition = validateStatusTransition(currentShipment.status, nextStatus)
      if (!isValidTransition) {
        return {
          success: false,
          message: `Transisi status dari ${currentShipment.status} ke ${nextStatus} tidak diperbolehkan.`
        }
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
      tariff,
      shippingType,
      shipmentDate,
      vehicleId,
      notes
    } = validatedFields.data

    const [year, month, day] = shipmentDate.split('-').map(Number)
    const shipmentDateObj = new Date(year, month - 1, day)

    const updatedShipment = await prisma.shipment.update({
      where: { id },
      data: {
        senderName,
        receiverName,
        receiverTelp,
        origin,
        destination,
        itemName,
        weight,
        tariff,
        shippingType,
        shipmentDate: shipmentDateObj,
        status: nextStatus || currentShipment.status,
        vehicleId,
        notes
      }
    })

    revalidatePath('/dashboard/cargo')
    return { success: true, message: `Sukses memperbarui cargo ${updatedShipment.receiptNo}`, data: updatedShipment }
  } catch (error) {
    console.error('Failed to update shipment:', error)
    throw new Error('Gagal merubah data kargo di database.')
  }
}

export const updateShipmentStatus = async (id: string, nextStatus: ShipmentStatus): Promise<ActionState> => {
  // Session Auth check
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

    const updated = await prisma.shipment.update({
      where: { id },
      data: { status: nextStatus }
    })

    revalidatePath('/dashboard/cargo')
    return { success: true, message: `Status berhasil diubah ke ${nextStatus}`, data: updated }
  } catch (error) {
    console.error('Failed to update shipment status:', error)
    throw new Error('Gagal memperbarui status kargo di database.')
  }
}

export const deleteShipment = async (id: string): Promise<ActionState> => {
  // Session Auth check
  const session = await auth()
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return {
      success: false,
      message: 'AKSES DITOLAK: Hak akses Admin diperlukan.'
    }
  }

  try {
    const shipment = await prisma.shipment.findUnique({ where: { id } })
    if (!shipment) {
      notFound()
    }

    await prisma.shipment.delete({ where: { id } })
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
