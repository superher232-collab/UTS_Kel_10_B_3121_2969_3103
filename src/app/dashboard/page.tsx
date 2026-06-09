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
      background: '#0D0B14',
      minHeight: '100vh',
      color: '#F1F0F5',
      fontFamily: 'system-ui, -apple-system, sans-serif',
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
          border: '1px solid #2A2740',
          borderRadius: '12px',
          background: '#12101A',
          padding: '24px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '10px', color: '#7C3AED', fontWeight: 'bold', letterSpacing: '2px', fontFamily: '"Roboto Mono", monospace' }}>PORTAL PELANGGAN PRIMELOG</span>
            <h1 style={{ fontSize: '24px', color: '#F1F0F5', letterSpacing: '1px', margin: 0, fontWeight: 'bold' }}>
              SELAMAT DATANG, {session.user.name?.toUpperCase() || session.user.email?.toUpperCase()}
            </h1>
            <span style={{ fontSize: '13px', color: '#9B99A8' }}>Kelola pengiriman kargo, lacak armada maritim, dan ajukan complaint support di satu platform terpadu.</span>
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
          <h2 style={{ fontSize: '14px', fontWeight: 'bold', color: '#F1F0F5', letterSpacing: '1px', margin: 0 }}>
            🛰️ SATELIT MONITORING ARMADA LIVE
          </h2>
          <InteractiveMap compact={true} />
        </DashboardMapWrapper>

        {/* Shortcuts & Quick Actions Dashboard Hub */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 'bold', color: '#F1F0F5', letterSpacing: '1px', margin: 0 }}>
            ⚡ PINTASAN AKSI CEPAT ADMIN
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {[
              { title: '📦 KONTROL CARGO UTAMA', desc: 'Kelola detail pengiriman kargo, edit alamat, atau batalkan order pengiriman.', href: '/dashboard/cargo', label: 'BUKA CARGO CENTER' },
              { title: '🔍 LACAK RESI MASSAL', desc: 'Lacak riwayat pengiriman banyak resi sekaligus menggunakan bulk-tracking.', href: '/dashboard/cargo', label: 'MULAI LACAK MASSAL' },
              { title: '💬 LIVE CHAT SUPPORT', desc: 'Ajukan complaint support tiket atau chat live secara interaktif dengan Admin.', href: '/dashboard/support', label: 'BUKA SUPPORT CENTER' }
            ].map(shortcut => (
              <div key={shortcut.title} style={{
                background: '#12101A',
                border: '1px solid #2A2740',
                borderRadius: '8px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <h3 style={{ fontSize: '13px', fontWeight: 'bold', color: '#F1F0F5', margin: 0 }}>{shortcut.title}</h3>
                  <p style={{ fontSize: '12px', color: '#9B99A8', margin: 0, lineHeight: '1.4' }}>{shortcut.desc}</p>
                </div>
                <Link
                  href={shortcut.href}
                  style={{
                    background: '#1A1825',
                    border: '1px solid #3D3A52',
                    color: '#F1F0F5',
                    padding: '8px',
                    borderRadius: '4px',
                    textAlign: 'center',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    textDecoration: 'none',
                    transition: 'all 0.2s'
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
          background: '#12101A',
          border: '1px solid #2A2740',
          borderRadius: '10px',
          padding: '24px'
        }}>
          <div style={{ borderBottom: '1px solid #2A2740', paddingBottom: '12px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '14px', fontWeight: 'bold', color: '#F1F0F5', letterSpacing: '1px', margin: 0 }}>
                📋 DAFTAR PENGIRIMAN KARGO TERBARU
              </h2>
              <span style={{ fontSize: '12px', color: '#9B99A8' }}>Menampilkan hingga 5 riwayat pengiriman kargo terbaru Anda</span>
            </div>
            <Link href="/dashboard/cargo" style={{ fontSize: '12px', color: '#A855F7', textDecoration: 'none', fontWeight: 'bold' }}>LIHAT SEMUA KARGO ➔</Link>
          </div>

          {recentShipments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px', color: '#9B99A8', fontSize: '13px' }}>
              Belum ada transaksi kargo tercatat. Silakan buat kargo baru untuk memulai pelacakan.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #2A2740', color: '#9B99A8', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <th style={{ padding: '10px 8px' }}>NO RESI</th>
                    <th style={{ padding: '10px 8px' }}>NAMA BARANG</th>
                    <th style={{ padding: '10px 8px' }}>RUTE</th>
                    <th style={{ padding: '10px 8px' }}>ARMADA</th>
                    <th style={{ padding: '10px 8px' }}>TARIF</th>
                    <th style={{ padding: '10px 8px' }}>STATUS</th>
                    <th style={{ padding: '10px 8px', textAlign: 'right' }}>AKSI CEPAT</th>
                  </tr>
                </thead>
                <tbody>
                  {recentShipments.map((s) => {
                    const isDiproses = s.status === 'DIPROSES';
                    let statusColor = '#22C55E';
                    if (s.status === 'DIPROSES' || s.status === 'PENDING') statusColor = '#A855F7';
                    if (s.status === 'SAMPAI' || s.status === 'SELESAI') statusColor = '#3B82F6';
                    if (s.status === 'DIBATALKAN') statusColor = '#EF4444';

                    return (
                      <tr key={s.id} style={{ borderBottom: '1px solid #2A2740' }}>
                        <td style={{ padding: '12px 8px', fontWeight: 'bold', color: '#F1F0F5', fontFamily: '"Roboto Mono", monospace' }}>{s.receiptNo}</td>
                        <td style={{ padding: '12px 8px' }}>{s.itemName}</td>
                        <td style={{ padding: '12px 8px' }}>{s.origin} ➔ {s.destination}</td>
                        <td style={{ padding: '12px 8px', color: '#7C3AED' }}>{s.vehicle?.name || 'BELUM DIASIGN'}</td>
                        <td style={{ padding: '12px 8px', fontWeight: 'bold', fontFamily: '"Roboto Mono", monospace' }}>{formatCurrency(s.tariff)}</td>
                        <td style={{ padding: '12px 8px' }}>
                          <span style={{
                            background: `${statusColor}15`,
                            border: `1px solid ${statusColor}`,
                            color: statusColor,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '9px',
                            fontWeight: 'bold',
                            boxShadow: `0 0 6px ${statusColor}20`
                          }}>{s.status}</span>
                        </td>
                        <td style={{ padding: '12px 8px', textAlign: 'right', display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <Link href={`/dashboard/cargo?q=${s.receiptNo}`} style={{ background: 'transparent', border: '1px solid #3D3A52', color: '#F1F0F5', padding: '4px 8px', borderRadius: '4px', textDecoration: 'none', fontSize: '11px', fontWeight: 'bold' }}>LACAK 🔍</Link>
                          <Link href={`/dashboard/cargo/${s.id}`} style={{ background: 'transparent', border: '1px solid #3D3A52', color: '#F1F0F5', padding: '4px 8px', borderRadius: '4px', textDecoration: 'none', fontSize: '11px', fontWeight: 'bold' }}>DETAIL 📋</Link>
                          
                          {/* Cancel actions enabled strictly ONLY if status is DIPROSES (BR-02/BR-03) */}
                          {isDiproses ? (
                            <Link href="/dashboard/cargo" style={{ background: 'transparent', border: '1px solid #EF4444', color: '#EF4444', padding: '4px 8px', borderRadius: '4px', textDecoration: 'none', fontSize: '11px', fontWeight: 'bold' }}>BATAL ❌</Link>
                          ) : (
                            <span style={{ border: '1px solid #3D3A52', color: '#9B99A8', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', cursor: 'not-allowed', fontWeight: 'bold' }}>KUNCI 🔒</span>
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
            background: '#12101A',
            border: '1px solid #2A2740',
            borderRadius: '10px',
            padding: '24px'
          }}>
            <div style={{ borderBottom: '1px solid #2A2740', paddingBottom: '12px', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '14px', fontWeight: 'bold', color: '#F1F0F5', letterSpacing: '1px', margin: 0 }}>
                🎟️ ADUAN & TIKET BAN AKTIF
              </h2>
              <span style={{ fontSize: '12px', color: '#9B99A8' }}>Daftar status tiket keluhan yang telah Anda ajukan ke Admin</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {activeTickets.map(t => (
                <div key={t.id} style={{
                  padding: '12px',
                  background: '#1A1825',
                  border: '1px solid #3D3A52',
                  borderRadius: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', maxWidth: '70%' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '13px', color: '#F1F0F5', fontFamily: '"Roboto Mono", monospace' }}>{t.ticketNo}</span>
                    <span style={{ fontSize: '12px', color: '#9B99A8', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{t.title}</span>
                  </div>

                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{
                      background: 'transparent',
                      border: '1px solid #7C3AED',
                      color: '#A855F7',
                      fontSize: '10px',
                      padding: '2px 5px',
                      borderRadius: '4px',
                      fontWeight: 'bold',
                      display: 'inline-block'
                    }}>{t.status}</span>
                    <Link href="/dashboard/support" style={{ fontSize: '10px', color: '#10B981', textDecoration: 'none', fontWeight: 'bold' }}>MASUK CHAT 💬</Link>
                  </div>
                </div>
              ))}

              {activeTickets.length === 0 && (
                <div style={{ textAlign: 'center', padding: '24px', color: '#9B99A8', fontSize: '12px' }}>
                  Tidak ada tiket keluhan aktif terekam.
                </div>
              )}
            </div>
          </div>

          {/* Cyber FAQ Accordion Bantuan */}
          <div style={{
            background: '#12101A',
            border: '1px solid #2A2740',
            borderRadius: '10px',
            padding: '24px'
          }}>
            <div style={{ borderBottom: '1px solid #2A2740', paddingBottom: '12px', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '14px', fontWeight: 'bold', color: '#F1F0F5', letterSpacing: '1px', margin: 0 }}>
                💡 FAQ & PANDUAN PENGIRIMAN
              </h2>
              <span style={{ fontSize: '12px', color: '#9B99A8' }}>Panduan singkat dan aturan operasional platform PrimeLog</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { q: 'Bagaimana cara melacak kargo saya secara real-time?', a: 'Gunakan nomor resi kargo Anda di menu Lacak Resi. Peta satelit di atas juga akan otomatis menampilkan titik koordinat armada kapal yang mengangkut kargo Anda.' },
                { q: 'Kapan saya bisa mengedit atau membatalkan kargo?', a: 'Sesuai dengan aturan bisnis PrimeLog (BR-02/BR-03), pengubahan atau pembatalan kargo HANYA dapat dilakukan jika status pengiriman kargo Anda masih berada dalam status "DIPROSES" di sortir hub.' },
                { q: 'Bagaimana penghitungan tarif kargo dilakukan?', a: 'Tarif dihitung berdasarkan berat kargo (kg) dikalikan tarif moda pengiriman yang aktif (Laut) ditambah dengan biaya dasar (Base Fee) sistem.' },
                { q: 'Bagaimana jika pengiriman kargo terlambat?', a: 'Jika kargo terlambat (melewati ETA), status akan ditandai terlambat secara otomatis. Silakan buka Support Center untuk mengajukan keluhan dan mencairkan refund kompensasi apabila fitur kompensasi sistem diaktifkan oleh Admin.' }
              ].map((faq, i) => (
                <details key={i} style={{
                  background: '#1A1825',
                  border: '1px solid #3D3A52',
                  borderRadius: '4px',
                  padding: '12px',
                  cursor: 'pointer'
                }}>
                  <summary style={{ fontSize: '13px', fontWeight: 'bold', color: '#F1F0F5', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>❓ {faq.q}</span>
                    <span style={{ color: '#A855F7', fontSize: '10px' }}>▼</span>
                  </summary>
                  <p style={{ margin: '12px 0 0 0', fontSize: '12px', color: '#9B99A8', lineHeight: '1.5', cursor: 'default' }}>
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