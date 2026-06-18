import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized: Please login' }, { status: 401 })
    }

    const { id } = await params
    const shipment = await prisma.shipment.findUnique({
      where: { id }
    })

    if (!shipment) {
      return NextResponse.json({ error: 'Shipment not found' }, { status: 404 })
    }

    // Pengecekan data ownership untuk customer
    if (session.user.role !== 'ADMIN' && shipment.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden: Access denied' }, { status: 403 })
    }

    // Validasi utama: Cetak resi HANYA diizinkan jika statusnya SELESAI
    if (shipment.status !== 'SELESAI') {
      return NextResponse.json({ 
        error: 'Pencetakan ditolak: Resi resmi hanya dapat dicetak setelah status kargo SELESAI.' 
      }, { status: 400 })
    }

    // Jika lolos validasi, kembalikan response sukses
    return NextResponse.json({ status: 'success', message: 'Print authorized' }, { status: 200 })

  } catch (error: any) {
    console.error('[GET /api/cargo/[id]/print] error:', error)
    return NextResponse.json({ error: 'Server error', detail: error.message }, { status: 500 })
  }
}
