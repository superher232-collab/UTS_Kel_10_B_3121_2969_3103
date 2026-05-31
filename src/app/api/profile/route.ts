import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export async function GET() {
  try {
    const session: any = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const userId = session.user.id

    // Data user
    const user = await sql.query('SELECT name, email, role, created_at FROM "User" WHERE id = $1', [userId])
    
    // Riwayat billing (group by bulan)
    const invoices = await sql.query(`
      SELECT 
        DATE_TRUNC('month', created_at) as bulan,
        COUNT(*) as jumlah_paket,
        SUM(harga_tarif) as total_bayar,
        STRING_AGG(DISTINCT status_transaksi, ', ') as status_pembayaran
      FROM shipments 
      WHERE user_id = $1 
      GROUP BY 1 
      ORDER BY 1 DESC
    `, [userId])

    return NextResponse.json({
      profile: user.rows[0],
      invoices: invoices.rows
    })
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to load profile', detail: error.message }, { status: 500 })
  }
}