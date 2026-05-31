import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export async function GET() {
  try {
    const session: any = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const userId = session.user.id

    // 1. Hitung statistik per status
    const stats = await sql.query(`
      SELECT status_pengiriman, COUNT(*) as total 
      FROM shipments 
      WHERE user_id = $1 
      GROUP BY status_pengiriman
    `, [userId])

    // 2. Hitung total biaya & tagihan belum lunas
    const billing = await sql.query(`
      SELECT 
        SUM(harga_tarif) as total_biaya,
        SUM(harga_tarif) FILTER (WHERE status_transaksi = 'belum_bayar') as tagihan_pending
      FROM shipments 
      WHERE user_id = $1
    `, [userId])

    // 3. Ambil 5 shipment terbaru
    const recent = await sql.query(`
      SELECT no_resi, status_pengiriman, tujuan, created_at 
      FROM shipments 
      WHERE user_id = $1 
      ORDER BY created_at DESC LIMIT 5
    `, [userId])

    // Format response
    const statMap: Record<string, number> = {}
    stats.rows.forEach((r: any) => statMap[r.status_pengiriman] = parseInt(r.total))

    return NextResponse.json({
      stats: {
        active: statMap['dalam_pengiriman'] || 0,
        pending: statMap['diproses'] || 0,
        completed: statMap['selesai'] || 0,
        canceled: statMap['dibatalkan'] || 0
      },
      billing: billing.rows[0],
      recentShipments: recent.rows
    })
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to load dashboard', detail: error.message }, { status: 500 })
  }
}