'use client'

import React, { useState, useEffect, useCallback, startTransition } from 'react'

interface AnalyticsSummary {
  totalShipments: number
  totalRevenue: number
  completedShipments: number
  pendingShipments: number
  cancelledShipments: number
  avgTariff: number
}

interface ShipmentRecord {
  id: string
  receiptNo: string
  createdAt: string
  tariff: number
  status: string
  origin: string
  destination: string
  itemName: string
  paymentMethod: string
  senderName?: string
  receiverName?: string
  weight?: number
  quantity?: number
  shippingType?: string
  notes?: string
}

interface AnalyticsData {
  summary: AnalyticsSummary
  statusDistribution: Record<string, number>
  topRoutes: { route: string; count: number }[]
  recentShipments: ShipmentRecord[]
}

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)

const formatNumber = (n: number) =>
  new Intl.NumberFormat('id-ID').format(n)

const getBadgeStyle = (s: string) => {
  if (s === 'SELESAI') return { c: '#22C55E', l: 'SELESAI', bg: 'rgba(34,197,94,0.1)' }
  if (s === 'DALAM_PENGIRIMAN') return { c: '#3B82F6', l: 'DALAM PENGIRIMAN', bg: 'rgba(59,130,246,0.1)' }
  if (s === 'DIPROSES') return { c: '#06B6D4', l: 'DIPROSES', bg: 'rgba(6,182,212,0.1)' }
  if (s === 'PENDING') return { c: '#F59E0B', l: 'PENDING', bg: 'rgba(245,158,11,0.1)' }
  if (s === 'DIBATALKAN') return { c: '#EF4444', l: 'DIBATALKAN', bg: 'rgba(239,68,68,0.1)' }
  return { c: '#8B7BA8', l: s, bg: 'rgba(255,255,255,0.05)' }
}

function KPICard({ label, value, sub, color, icon }: {
  label: string; value: string; sub?: string; color: string; icon: string
}) {
  return (
    <div style={{
      background: '#0D0618',
      border: `1px solid ${color}33`,
      borderRadius: '12px',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      flex: '1',
      minWidth: '200px',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: `0 4px 20px rgba(0,0,0,0.4)`
    }}>
      <div style={{
        position: 'absolute', top: '10px', right: '10px',
        fontSize: '40px', opacity: 0.1, userSelect: 'none'
      }}>{icon}</div>
      <span style={{ fontSize: '10px', color: '#8B7BA8', fontFamily: 'monospace', letterSpacing: '1px', textTransform: 'uppercase' }}>{label}</span>
      <span style={{ fontSize: '32px', fontWeight: 'bold', color, fontFamily: 'monospace', letterSpacing: '-0.5px' }}>{value}</span>
      {sub && <span style={{ fontSize: '11px', color: '#6B5C83', fontFamily: 'monospace' }}>{sub}</span>}
    </div>
  )
}

function StatusBadge({ status, count, total }: { status: string; count: number; total: number }) {
  const { c, l } = getBadgeStyle(status)
  const pct = total > 0 ? ((count / total) * 100).toFixed(1) : '0'

  return (
    <div
      title={`${count} Kargo (${pct}%)`}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: `rgba(255,255,255,0.02)`,
        border: `1px solid ${c}44`,
        borderRadius: '6px',
        padding: '12px 16px',
        cursor: 'default',
        transition: 'background 0.2s',
      }}
      onMouseEnter={e => e.currentTarget.style.backgroundColor = `${c}11`}
      onMouseLeave={e => e.currentTarget.style.backgroundColor = `rgba(255,255,255,0.02)`}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: c, boxShadow: `0 0 6px ${c}` }} />
        <span style={{ fontSize: '11px', color: 'white', fontFamily: 'monospace', fontWeight: 'bold' }}>{l}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '14px', fontWeight: 'bold', color: c, fontFamily: 'monospace' }}>{count}</span>
        <span style={{ fontSize: '10px', color: '#8B7BA8', fontFamily: 'monospace', width: '35px', textAlign: 'right' }}>{pct}%</span>
      </div>
    </div>
  )
}

export function CustomerAnalyticsClient() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/analytics?period=overall`)
      if (res.ok) {
        const json = await res.json()
        setData(json)
      }
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    startTransition(() => {
      fetchData()
    })
  }, [fetchData])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: 'white', fontFamily: 'monospace', margin: '0' }}>
            📝 RINGKASAN RIWAYAT PENGIRIMAN
          </h2>
          <p style={{ fontSize: '11px', color: '#8B7BA8', fontFamily: 'monospace', margin: '4px 0 0' }}>
            Data total aktivitas kargo Anda secara keseluruhan. Arahkan kursor (hover) pada baris status untuk detail.
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[1].map(i => (
            <div key={i} style={{ height: '140px', background: '#0D0618', border: '1px solid rgba(168,85,247,0.1)', borderRadius: '12px', animation: 'pulse 1.5s infinite' }} />
          ))}
          <style>{`@keyframes pulse { 0%,100%{opacity:0.5} 50%{opacity:0.3} }`}</style>
        </div>
      ) : data ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* KPI Row */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <KPICard icon="📦" label="Total Kargo Dikirim" value={formatNumber(data.summary.totalShipments)} color="#C084FC" />
            <KPICard icon="💸" label="Total Biaya Pengeluaran" value={formatCurrency(data.summary.totalRevenue)} sub={`Rata-rata ${formatCurrency(data.summary.avgTariff)}/kargo`} color="#F59E0B" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            
            {/* Status Breakdown Section */}
            <div style={{
              background: '#0D0618',
              border: '1px solid rgba(168, 85, 247, 0.2)',
              borderRadius: '12px',
              padding: '24px',
            }}>
              <div style={{ fontSize: '11px', color: '#C084FC', fontFamily: 'monospace', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '16px', borderBottom: '1px dashed rgba(168,85,247,0.2)', paddingBottom: '8px' }}>
                RINCIAN STATUS KARGO
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {Object.entries(data.statusDistribution || {}).length > 0 ? (
                  Object.entries(data.statusDistribution)
                    .sort(([, a], [, b]) => b - a)
                    .map(([status, count]) => (
                      <StatusBadge key={status} status={status} count={count} total={data.summary.totalShipments} />
                    ))
                ) : (
                  <div style={{ fontSize: '11px', color: '#6B5C83', fontFamily: 'monospace', padding: '12px' }}>Belum ada data status kargo.</div>
                )}
              </div>
            </div>

            {/* Top Routes Section */}
            <div style={{
              background: '#0D0618',
              border: '1px solid rgba(168, 85, 247, 0.2)',
              borderRadius: '12px',
              padding: '24px',
            }}>
              <div style={{ fontSize: '11px', color: '#06B6D4', fontFamily: 'monospace', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '16px', borderBottom: '1px dashed rgba(6,182,212,0.2)', paddingBottom: '8px' }}>
                RUTE FAVORIT ANDA
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {data.topRoutes.length > 0 ? (
                  data.topRoutes.map((r, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(6,182,212,0.04)', border: '1px solid rgba(6,182,212,0.1)', borderRadius: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#06B6D4', fontFamily: 'monospace' }}>#{i + 1}</span>
                        <span style={{ fontSize: '11px', color: '#C7B8EA', fontFamily: 'monospace' }}>{r.route}</span>
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#22C55E', fontFamily: 'monospace' }}>
                        {r.count}x
                      </span>
                    </div>
                  ))
                ) : (
                  <div style={{ fontSize: '11px', color: '#6B5C83', fontFamily: 'monospace', padding: '12px' }}>Belum ada rute pengiriman.</div>
                )}
              </div>
            </div>

          </div>

          {/* Tabel Riwayat Detail Terbaru */}
          <div style={{
            background: '#0D0618',
            border: '1px solid rgba(168, 85, 247, 0.25)',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 25px rgba(0,0,0,0.6)',
            marginTop: '8px'
          }}>
            <div style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '1.5px', color: '#C084FC', marginBottom: '16px', borderBottom: '1px dashed rgba(168, 85, 247, 0.2)', paddingBottom: '12px' }}>
              DETAIL RIWAYAT TRANSAKSI TERBARU
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '11px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(168, 85, 247, 0.25)', color: '#8B7BA8', height: '32px' }}>
                    <th style={{ padding: '10px' }}>TANGGAL</th>
                    <th style={{ padding: '10px' }}>NO RESI</th>
                    <th style={{ padding: '10px' }}>NAMA BARANG</th>
                    <th style={{ padding: '10px' }}>RUTE (ASAL → TUJUAN)</th>
                    <th style={{ padding: '10px' }}>TARIF PENGELUARAN</th>
                    <th style={{ padding: '10px' }}>STATUS</th>
                    <th style={{ padding: '10px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentShipments && data.recentShipments.length > 0 ? (
                    data.recentShipments.map((shipment) => {
                      const { c, l, bg } = getBadgeStyle(shipment.status)
                      const isExpanded = expandedId === shipment.id
                      return (
                        <React.Fragment key={shipment.id}>
                          <tr 
                            onClick={() => setExpandedId(isExpanded ? null : shipment.id)}
                            style={{ 
                              borderBottom: isExpanded ? 'none' : '1px solid rgba(255, 255, 255, 0.04)', 
                              height: '42px',
                              transition: 'background 0.2s',
                              cursor: 'pointer',
                              backgroundColor: isExpanded ? 'rgba(168, 85, 247, 0.08)' : 'transparent'
                            }}
                            onMouseEnter={e => { if (!isExpanded) e.currentTarget.style.backgroundColor = 'rgba(168, 85, 247, 0.04)' }}
                            onMouseLeave={e => { if (!isExpanded) e.currentTarget.style.backgroundColor = 'transparent' }}
                          >
                            <td style={{ padding: '10px', color: '#8B7BA8', fontFamily: 'monospace' }}>
                              {new Date(shipment.createdAt).toLocaleDateString('id-ID')}
                            </td>
                            <td style={{ padding: '10px', fontWeight: 'bold', color: '#C084FC', fontFamily: 'monospace' }}>
                              <span style={{ borderBottom: '1px dashed #C084FC' }}>{shipment.receiptNo}</span>
                            </td>
                            <td style={{ padding: '10px', color: 'white' }}>
                              {shipment.itemName}
                            </td>
                            <td style={{ padding: '10px', color: '#C7B8EA' }}>
                              {shipment.origin} <span style={{ color: '#6B5C83' }}>→</span> {shipment.destination}
                            </td>
                            <td style={{ padding: '10px', fontWeight: 'bold', color: '#F59E0B', fontFamily: 'monospace' }}>
                              {formatCurrency(shipment.tariff)}
                            </td>
                            <td style={{ padding: '10px' }}>
                              <span style={{ 
                                background: bg, 
                                color: c, 
                                border: `1px solid ${c}55`, 
                                padding: '4px 8px', 
                                borderRadius: '4px', 
                                fontSize: '9px', 
                                fontWeight: 'bold',
                                whiteSpace: 'nowrap'
                              }}>
                                {l}
                              </span>
                            </td>
                            <td style={{ padding: '10px', textAlign: 'right' }}>
                              <span style={{ 
                                color: '#A855F7', 
                                fontSize: '14px',
                                display: 'inline-block',
                                transition: 'transform 0.2s',
                                transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)'
                              }}>
                                →
                              </span>
                            </td>
                          </tr>
                          {isExpanded && (
                            <tr style={{ background: '#0A0514', borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                              <td colSpan={7} style={{ padding: '0' }}>
                                <div style={{
                                  margin: '16px',
                                  padding: '24px',
                                  background: 'linear-gradient(135deg, rgba(20, 10, 36, 0.8) 0%, rgba(13, 6, 24, 0.9) 100%)',
                                  border: '1px solid rgba(168, 85, 247, 0.25)',
                                  borderRadius: '12px',
                                  boxShadow: 'inset 0 0 20px rgba(168, 85, 247, 0.05), 0 4px 15px rgba(0,0,0,0.5)',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '24px'
                                }}>
                                  
                                  {/* INVOICE HEADER */}
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed rgba(168, 85, 247, 0.3)', paddingBottom: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                      <div style={{ width: '40px', height: '40px', background: '#A855F7', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', boxShadow: '0 0 15px rgba(168,85,247,0.4)' }}>
                                        📄
                                      </div>
                                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontSize: '14px', color: 'white', fontWeight: 'bold', letterSpacing: '1px' }}>INVOICE PENGIRIMAN</span>
                                        <span style={{ fontSize: '10px', color: '#8B7BA8', fontFamily: 'monospace' }}>ID: {shipment.id.toUpperCase()}</span>
                                      </div>
                                    </div>
                                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                      <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#06B6D4', fontFamily: 'monospace' }}>
                                        {formatCurrency(shipment.tariff)}
                                      </span>
                                      <span style={{ fontSize: '9px', color: '#8B7BA8', fontWeight: 'bold', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px', display: 'inline-block' }}>
                                        💳 {shipment.paymentMethod || 'TUNAI'}
                                      </span>
                                    </div>
                                  </div>

                                  {/* INVOICE BODY: 3 Columns */}
                                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
                                    
                                    {/* Kolom 1: Pengirim & Penerima */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <span style={{ fontSize: '9px', color: '#A855F7', fontWeight: 'bold', letterSpacing: '1px' }}>PENGIRIM</span>
                                        <span style={{ fontSize: '12px', color: 'white', fontWeight: 'bold' }}>{shipment.senderName || '-'}</span>
                                        <span style={{ fontSize: '11px', color: '#C7B8EA' }}>Kota: {shipment.origin}</span>
                                      </div>
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <span style={{ fontSize: '9px', color: '#06B6D4', fontWeight: 'bold', letterSpacing: '1px' }}>PENERIMA</span>
                                        <span style={{ fontSize: '12px', color: 'white', fontWeight: 'bold' }}>{shipment.receiverName || '-'}</span>
                                        <span style={{ fontSize: '11px', color: '#C7B8EA' }}>Kota: {shipment.destination}</span>
                                      </div>
                                    </div>

                                    {/* Kolom 2: Detail Muatan */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderLeft: '1px dashed rgba(255,255,255,0.1)', paddingLeft: '24px' }}>
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <span style={{ fontSize: '9px', color: '#8B7BA8', fontWeight: 'bold', letterSpacing: '1px' }}>MUATAN (CARGO)</span>
                                        <span style={{ fontSize: '12px', color: 'white', fontWeight: 'bold' }}>{shipment.itemName}</span>
                                        <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                                          <span style={{ fontSize: '10px', color: '#C7B8EA', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>Berat: {shipment.weight || 0} kg</span>
                                          <span style={{ fontSize: '10px', color: '#C7B8EA', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>Jumlah: {shipment.quantity || 0} koli</span>
                                        </div>
                                      </div>
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <span style={{ fontSize: '9px', color: '#8B7BA8', fontWeight: 'bold', letterSpacing: '1px' }}>TANGGAL TRANSAKSI</span>
                                        <span style={{ fontSize: '11px', color: '#C7B8EA', fontFamily: 'monospace' }}>
                                          {new Date(shipment.createdAt).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Kolom 3: Info Tambahan */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderLeft: '1px dashed rgba(255,255,255,0.1)', paddingLeft: '24px' }}>
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <span style={{ fontSize: '9px', color: '#8B7BA8', fontWeight: 'bold', letterSpacing: '1px' }}>MODA TRANSPORTASI</span>
                                        <span style={{ fontSize: '11px', color: 'white', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                          {shipment.shippingType === 'LAUT' ? '🚢 LAUT' : shipment.shippingType || 'LAUT'}
                                        </span>
                                      </div>
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <span style={{ fontSize: '9px', color: '#8B7BA8', fontWeight: 'bold', letterSpacing: '1px' }}>CATATAN KHUSUS</span>
                                        <span style={{ fontSize: '11px', color: '#C7B8EA', fontStyle: 'italic' }}>
                                          {shipment.notes || 'Tidak ada catatan tambahan untuk kargo ini.'}
                                        </span>
                                      </div>
                                    </div>

                                  </div>

                                  {/* FOOTER */}
                                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                                     <button
                                      onClick={() => window.location.href = `/dashboard/cargo/${shipment.id}`}
                                      style={{
                                        background: 'rgba(168, 85, 247, 0.1)',
                                        border: '1px solid rgba(168, 85, 247, 0.4)',
                                        color: '#C084FC',
                                        padding: '8px 24px',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontSize: '10px',
                                        fontWeight: 'bold',
                                        fontFamily: 'monospace',
                                        transition: 'all 0.2s',
                                        boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                                      }}
                                      onMouseEnter={e => {
                                        e.currentTarget.style.background = 'rgba(168, 85, 247, 0.2)'
                                        e.currentTarget.style.borderColor = '#A855F7'
                                      }}
                                      onMouseLeave={e => {
                                        e.currentTarget.style.background = 'rgba(168, 85, 247, 0.1)'
                                        e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.4)'
                                      }}
                                    >
                                      BUKA HALAMAN PELACAKAN PENUH ➔
                                    </button>
                                  </div>

                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: '#8B7BA8' }}>
                        Belum ada riwayat transaksi kargo.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      ) : (
        <div style={{ padding: '40px', textAlign: 'center', color: '#EF4444', fontFamily: 'monospace', fontSize: '12px' }}>
          Gagal memuat data riwayat. Coba refresh halaman.
        </div>
      )}
    </div>
  )
}
