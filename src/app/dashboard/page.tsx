// src/app/dashboard/page.tsx
import React from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import { InteractiveMap } from '@/components/map/InteractiveMap';
import { DashboardStatsGrid } from '@/components/dashboard/DashboardStatsGrid';
import { DashboardMapWrapper } from '@/components/dashboard/DashboardMapWrapper';

export const metadata = {
  title: 'Dashboard - PrimeLog',
  description: 'Ruang kendali PrimeLog. Kelola dan daftarkan pengiriman kargo, lacak armada live satelit, dan ajukan complaint support.'
}

export default async function CustomerDashboardPage() {
  const session = await auth();

  // 1. Strict server-side role gating (BR-01, BR-09)
  if (!session?.user) {
    redirect('/login');
  }

  if (session.user.role === 'ADMIN') {
    redirect('/admin');
  }

  const userId = (session.user as any).id as string;

  // 2. Query 3 dynamic metrics for Customer role:
  // - aktif: status DIPROSES or PENDING
  // - dalam perjalanan: status DALAM_PENGIRIMAN or SAMPAI
  // - selesai: status SELESAI
  const [aktifCount, perjalananCount, selesaiCount, recentShipments, activeTickets] = await Promise.all([
    prisma.shipment.count({
      where: {
        userId,
        status: { in: ['DIPROSES', 'PENDING'] }
      }
    }),
    prisma.shipment.count({
      where: {
        userId,
        status: { in: ['DALAM_PENGIRIMAN', 'SAMPAI'] }
      }
    }),
    prisma.shipment.count({
      where: {
        userId,
        status: 'SELESAI'
      }
    }),
    // Fetch latest 5 shipments for this customer
    prisma.shipment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        vehicle: {
          select: { name: true }
        }
      }
    }),
    // Fetch latest 3 support tickets
    prisma.supportTicket.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 3
    })
  ]);

  // Helper format currency
  function formatCurrency(val: number) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  }

  return (
    <div style={{
      padding: '40px 24px',
      background: 'var(--bg-void)',
      minHeight: '100vh',
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-body)',
      boxSizing: 'border-box'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '32px'
      }}>
        
        {/* Welcome Profile Header Panel */}
        <div style={{
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--bg-surface)',
          padding: '24px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--accent)', fontWeight: 600, letterSpacing: '1px' }}>Portal Pelanggan</span>
            <h1 style={{ fontSize: 'var(--text-2xl)', color: 'var(--text-primary)', margin: 0, fontWeight: 700 }}>
              Selamat Datang, {session.user.name || session.user.email}
            </h1>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Kelola pengiriman kargo, lacak armada maritim, dan ajukan dukungan di satu platform.</span>
          </div>
        </div>

        {/* 3 Metrics Dashboard Grid */}
        <DashboardStatsGrid 
          aktifCount={aktifCount} 
          perjalananCount={perjalananCount} 
          selesaiCount={selesaiCount} 
        />

        {/* Integrated Real-time Maritime Map */}
        <DashboardMapWrapper>
          <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
            Peta Armada Live
          </h2>
          <InteractiveMap compact={true} />
        </DashboardMapWrapper>

        {/* Shortcuts & Quick Actions Dashboard Hub */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
            Aksi Cepat
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {[
              { title: 'Kargo', desc: 'Kelola detail pengiriman kargo, edit alamat, atau batalkan order.', href: '/dashboard/cargo', label: 'Buka Kargo' },
              { title: 'Lacak Kiriman', desc: 'Lacak riwayat pengiriman banyak resi sekaligus.', href: '/dashboard/cargo', label: 'Mulai Melacak' },
              { title: 'Dukungan', desc: 'Ajukan tiket keluhan atau chat dengan admin.', href: '/dashboard/support', label: 'Buka Dukungan' }
            ].map(shortcut => (
              <div key={shortcut.title} style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{shortcut.title}</h3>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>{shortcut.desc}</p>
                </div>
                <Link
                  href={shortcut.href}
                  className="btn-secondary"
                  style={{
                    textAlign: 'center',
                    fontSize: 'var(--text-sm)',
                    padding: '8px'
                  }}
                >
                  {shortcut.label}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Shipments List Table */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px'
        }}>
          <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                Kiriman Terbaru
              </h2>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Menampilkan hingga 5 riwayat pengiriman terbaru</span>
            </div>
            <Link href="/dashboard/cargo" style={{ fontSize: 'var(--text-sm)', color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>Lihat Semua</Link>
          </div>

          {recentShipments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
              Belum ada kiriman. Mulai dengan membuat kargo baru.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-tertiary)', fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <th style={{ padding: '10px 8px' }}>No Resi</th>
                    <th style={{ padding: '10px 8px' }}>Nama Barang</th>
                    <th style={{ padding: '10px 8px' }}>Rute</th>
                    <th style={{ padding: '10px 8px' }}>Armada</th>
                    <th style={{ padding: '10px 8px' }}>Tarif</th>
                    <th style={{ padding: '10px 8px' }}>Status</th>
                    <th style={{ padding: '10px 8px', textAlign: 'right' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {recentShipments.map((s) => {
                    const isDiproses = s.status === 'DIPROSES';
                    let statusColor = 'var(--success)';
                    if (s.status === 'DIPROSES' || s.status === 'PENDING') statusColor = 'var(--accent)';
                    if (s.status === 'SAMPAI' || s.status === 'SELESAI') statusColor = 'var(--info)';
                    if (s.status === 'DIBATALKAN') statusColor = 'var(--danger)';

                    return (
                      <tr key={s.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '12px 8px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{s.receiptNo}</td>
                        <td style={{ padding: '12px 8px' }}>{s.itemName}</td>
                        <td style={{ padding: '12px 8px' }}>{s.origin} → {s.destination}</td>
                        <td style={{ padding: '12px 8px', color: 'var(--accent)' }}>{s.vehicle?.name || 'Belum Diassign'}</td>
                        <td style={{ padding: '12px 8px', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{formatCurrency(s.tariff)}</td>
                        <td style={{ padding: '12px 8px' }}>
                          <span className="badge" style={{
                            background: `${statusColor}15`,
                            border: `1px solid ${statusColor}`,
                            color: statusColor,
                          }}>{s.status}</span>
                        </td>
                        <td style={{ padding: '12px 8px', textAlign: 'right', display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <Link href={`/dashboard/cargo?q=${s.receiptNo}`} className="btn-secondary" style={{ padding: '4px 8px', fontSize: 'var(--text-xs)', textDecoration: 'none' }}>Lacak</Link>
                          <Link href={`/dashboard/cargo/${s.id}`} className="btn-secondary" style={{ padding: '4px 8px', fontSize: 'var(--text-xs)', textDecoration: 'none' }}>Detail</Link>
                          {isDiproses ? (
                            <Link href="/dashboard/cargo" className="btn-secondary" style={{ padding: '4px 8px', fontSize: 'var(--text-xs)', textDecoration: 'none', borderColor: 'var(--danger)', color: 'var(--danger)' }}>Batal</Link>
                          ) : (
                            <span className="btn-secondary" style={{ padding: '4px 8px', fontSize: 'var(--text-xs)', cursor: 'not-allowed', opacity: 0.5 }}>Kunci</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Support active tickets & FAQs Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px', alignItems: 'start' }}>
          
          {/* Active Support Tickets List */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px'
          }}>
            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '16px' }}>
              <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                Tiket Bantuan Aktif
              </h2>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Daftar status tiket keluhan yang telah Anda ajukan</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {activeTickets.map(t => (
                <div key={t.id} style={{
                  padding: '12px',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', maxWidth: '70%' }}>
                    <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{t.ticketNo}</span>
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{t.title}</span>
                  </div>

                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span className="badge badge-accent">{t.status}</span>
                    <Link href="/dashboard/support" style={{ fontSize: 'var(--text-xs)', color: 'var(--success)', textDecoration: 'none', fontWeight: 600 }}>Buka Chat</Link>
                  </div>
                </div>
              ))}

              {activeTickets.length === 0 && (
                <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                  Tidak ada tiket keluhan aktif.
                </div>
              )}
            </div>
          </div>

          {/* FAQ Accordion */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px'
          }}>
            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '16px' }}>
              <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                FAQ & Panduan
              </h2>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Panduan singkat dan aturan operasional platform</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { q: 'Bagaimana cara melacak kargo saya?', a: 'Gunakan nomor resi kargo Anda di menu Lacak Kiriman. Peta di atas juga akan menampilkan posisi armada kapal yang mengangkut kargo Anda.' },
                { q: 'Kapan saya bisa mengedit atau membatalkan kargo?', a: 'Pengubahan atau pembatalan kargo hanya dapat dilakukan jika status masih "DIPROSES" di sortir hub.' },
                { q: 'Bagaimana penghitungan tarif kargo?', a: 'Tarif dihitung berdasarkan berat kargo (kg) dikalikan tarif moda pengiriman ditambah biaya dasar sistem.' },
                { q: 'Bagaimana jika pengiriman terlambat?', a: 'Jika kargo terlambat (melewati ETA), status akan ditandai terlambat otomatis. Silakan buka Dukungan untuk mengajukan keluhan.' }
              ].map((faq, i) => (
                <details key={i} style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px',
                  cursor: 'pointer'
                }}>
                  <summary style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{faq.q}</span>
                    <span style={{ color: 'var(--accent)', fontSize: 'var(--text-xs)' }}>▼</span>
                  </summary>
                  <p style={{ margin: '12px 0 0 0', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: '1.5', cursor: 'default' }}>
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}