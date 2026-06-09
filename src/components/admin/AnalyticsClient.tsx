'use client'

import React, { useState, useEffect, useCallback } from 'react'

type Period = 'daily' | 'weekly' | 'monthly' | 'overall'

interface AnalyticsSummary {
  totalShipments: number
  totalRevenue: number
  completedShipments: number
  pendingShipments: number
  cancelledShipments: number
  avgTariff: number
}

interface ChartPoint {
  label: string
  shipments: number
  revenue: number
}

interface AnalyticsData {
  period: Period
  summary: AnalyticsSummary
  chartData: ChartPoint[]
  topRoutes: { route: string; count: number }[]
  topCustomers: { name: string; count: number; revenue: number }[]
  modeDistribution: { LAUT: number }
  paymentMethodStats: { QRIS: number; TUNAI: number }
}

interface AnalyticsClientProps {
  role: 'ADMIN' | 'CUSTOMER'
}

const PERIOD_LABELS: Record<Period, string> = {
  daily: 'Harian',
  weekly: 'Mingguan',
  monthly: 'Bulanan',
  overall: 'Keseluruhan'
}

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)

const formatNumber = (n: number) =>
  new Intl.NumberFormat('id-ID').format(n)

function PureCSSBarChart({ data, valueKey, color, maxHeight = 180 }: {
  data: ChartPoint[]
  valueKey: 'shipments' | 'revenue'
  color: string
  maxHeight?: number
}) {
  const max = Math.max(...data.map(d => d[valueKey]), 1)

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: `${maxHeight + 32}px`, padding: '0 4px', overflowX: 'auto' }}>
      {data.map((point, i) => {
        const pct = point[valueKey] / max
        const barH = Math.max(pct * maxHeight, point[valueKey] > 0 ? 4 : 0)
        return (
          <div
            key={i}
            title={`${point.label}: ${valueKey === 'revenue' ? formatCurrency(point[valueKey]) : point[valueKey]}`}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flex: '1', minWidth: data.length > 20 ? '20px' : '28px' }}
          >
            <span style={{
              fontSize: '8px',
              color: '#8B7BA8',
              fontFamily: 'monospace',
              whiteSpace: 'nowrap',
              visibility: point[valueKey] > 0 ? 'visible' : 'hidden'
            }}>
              {valueKey === 'revenue'
                ? `${Math.round(point[valueKey] / 1000)}k`
                : point[valueKey]}
            </span>
            <div
              style={{
                width: '100%',
                height: `${barH}px`,
                background: color,
                borderRadius: '3px 3px 0 0',
                transition: 'height 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: point[valueKey] > 0 ? `0 0 8px ${color}55` : 'none',
                minHeight: '1px'
              }}
            />
            <span style={{
              fontSize: '7px',
              color: '#6B5C83',
              fontFamily: 'monospace',
              whiteSpace: 'nowrap',
              transform: data.length > 14 ? 'rotate(-45deg)' : 'none',
              transformOrigin: 'top center',
              display: 'block',
              maxWidth: '36px',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {point.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function KPICard({ label, value, sub, color, icon }: {
  label: string; value: string; sub?: string; color: string; icon: string
}) {
  return (
    <div style={{
      background: '#0D0618',
      border: `1px solid ${color}33`,
      borderRadius: '12px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      flex: '1',
      minWidth: '140px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute', top: '-10px', right: '-10px',
        fontSize: '60px', opacity: 0.04, userSelect: 'none'
      }}>{icon}</div>
      <span style={{ fontSize: '9px', color: '#8B7BA8', fontFamily: 'monospace', letterSpacing: '1px', textTransform: 'uppercase' }}>{label}</span>
      <span style={{ fontSize: '22px', fontWeight: 'bold', color, fontFamily: 'monospace', letterSpacing: '-0.5px' }}>{value}</span>
      {sub && <span style={{ fontSize: '9px', color: '#6B5C83', fontFamily: 'monospace' }}>{sub}</span>}
    </div>
  )
}

function HorizontalBar({ label, value, total, color, icon }: {
  label: string; value: number; total: number; color: string; icon: string
}) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '11px', color: '#C7B8EA', fontFamily: 'monospace' }}>{icon} {label}</span>
        <span style={{ fontSize: '10px', color, fontFamily: 'monospace', fontWeight: 'bold' }}>{value} ({pct}%)</span>
      </div>
      <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: color,
          borderRadius: '4px',
          transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: `0 0 8px ${color}66`
        }} />
      </div>
    </div>
  )
}

export function AnalyticsClient({ role }: AnalyticsClientProps) {
  const [period, setPeriod] = useState<Period>('daily')
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async (p: Period) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/analytics?period=${p}`)
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
    fetchData(period)
  }, [period, fetchData])

  const cardStyle: React.CSSProperties = {
    background: '#0D0618',
    border: '1px solid rgba(168, 85, 247, 0.2)',
    borderRadius: '12px',
    padding: '24px'
  }

  const sectionTitle: React.CSSProperties = {
    fontSize: '10px',
    color: '#8B7BA8',
    fontFamily: 'monospace',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>

      {/* Header + Period Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: 'white', fontFamily: 'monospace', margin: 0 }}>
            📊 PUSAT ANALITIK
          </h2>
          <p style={{ fontSize: '11px', color: '#8B7BA8', fontFamily: 'monospace', margin: '4px 0 0' }}>
            {role === 'ADMIN' ? 'Data operasional seluruh jaringan' : 'Ringkasan aktivitas Anda'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '4px', background: 'rgba(168,85,247,0.05)', border: '1px solid rgba(168,85,247,0.15)', borderRadius: '8px', padding: '4px' }}>
          {(Object.keys(PERIOD_LABELS) as Period[]).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              style={{
                padding: '7px 14px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '10px',
                fontWeight: 'bold',
                fontFamily: 'monospace',
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: period === p ? 'linear-gradient(135deg, #7C3AED, #A855F7)' : 'transparent',
                color: period === p ? 'white' : '#8B7BA8',
                boxShadow: period === p ? '0 0 12px rgba(168,85,247,0.4)' : 'none'
              }}
            >
              {PERIOD_LABELS[p]}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ height: '120px', background: '#0D0618', border: '1px solid rgba(168,85,247,0.1)', borderRadius: '12px', animation: 'pulse 1.5s infinite' }} />
          ))}
          <style>{`@keyframes pulse { 0%,100%{opacity:0.5} 50%{opacity:0.3} }`}</style>
        </div>
      ) : data ? (
        <>
          {/* KPI Cards */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <KPICard icon="📦" label="Total Kargo" value={formatNumber(data.summary.totalShipments)} color="#C084FC" />
            <KPICard icon="💰" label="Total Pendapatan" value={formatCurrency(data.summary.totalRevenue)} sub={`Rata-rata ${formatCurrency(data.summary.avgTariff)}/kargo`} color="#06B6D4" />
            <KPICard icon="✅" label="Selesai" value={formatNumber(data.summary.completedShipments)} color="#22C55E" />
            <KPICard icon="⏳" label="Aktif / Pending" value={formatNumber(data.summary.pendingShipments)} color="#F59E0B" />
            <KPICard icon="❌" label="Dibatalkan" value={formatNumber(data.summary.cancelledShipments)} color="#EF4444" />
          </div>

          {/* Charts Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Shipments Bar Chart */}
            <div style={cardStyle}>
              <div style={sectionTitle}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#A855F7', display: 'inline-block' }} />
                Volume Pengiriman
              </div>
              {data.chartData.every(d => d.shipments === 0) ? (
                <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B5C83', fontFamily: 'monospace', fontSize: '11px' }}>
                  Belum ada data untuk periode ini
                </div>
              ) : (
                <PureCSSBarChart data={data.chartData} valueKey="shipments" color="linear-gradient(to top, #7C3AED, #C084FC)" />
              )}
            </div>

            {/* Revenue Bar Chart */}
            <div style={cardStyle}>
              <div style={sectionTitle}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#06B6D4', display: 'inline-block' }} />
                Pendapatan (Rp)
              </div>
              {data.chartData.every(d => d.revenue === 0) ? (
                <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B5C83', fontFamily: 'monospace', fontSize: '11px' }}>
                  Belum ada data untuk periode ini
                </div>
              ) : (
                <PureCSSBarChart data={data.chartData} valueKey="revenue" color="linear-gradient(to top, #0E7490, #06B6D4)" />
              )}
            </div>
          </div>

          {/* Distribution Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Mode Distribution */}
            <div style={cardStyle}>
              <div style={sectionTitle}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#22C55E', display: 'inline-block' }} />
                Distribusi Moda Transportasi
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <HorizontalBar
                  label="LAUT" icon="🚢"
                  value={data.modeDistribution.LAUT}
                  total={data.summary.totalShipments}
                  color="#06B6D4"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div style={cardStyle}>
              <div style={sectionTitle}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#F59E0B', display: 'inline-block' }} />
                Metode Pembayaran
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <HorizontalBar
                  label="TUNAI" icon="💵"
                  value={data.paymentMethodStats.TUNAI}
                  total={data.summary.totalShipments}
                  color="#22C55E"
                />
                <HorizontalBar
                  label="QRIS" icon="📱"
                  value={data.paymentMethodStats.QRIS}
                  total={data.summary.totalShipments}
                  color="#F59E0B"
                />
              </div>
              <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(168,85,247,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                  {[
                    { label: 'TUNAI', val: data.paymentMethodStats.TUNAI, color: '#22C55E' },
                    { label: 'QRIS', val: data.paymentMethodStats.QRIS, color: '#F59E0B' }
                  ].map(item => (
                    <div key={item.label} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '28px', fontWeight: 'bold', color: item.color, fontFamily: 'monospace' }}>
                        {data.summary.totalShipments > 0
                          ? `${Math.round((item.val / data.summary.totalShipments) * 100)}%`
                          : '0%'}
                      </div>
                      <div style={{ fontSize: '9px', color: '#8B7BA8', fontFamily: 'monospace', marginTop: '4px' }}>{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tables Row */}
          <div style={{ display: 'grid', gridTemplateColumns: role === 'ADMIN' ? '1fr 1fr' : '1fr', gap: '16px' }}>
            {/* Top Routes */}
            <div style={cardStyle}>
              <div style={sectionTitle}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#C084FC', display: 'inline-block' }} />
                Top 5 Rute Tersibuk
              </div>
              {data.topRoutes.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: '#6B5C83', fontFamily: 'monospace', fontSize: '11px' }}>Belum ada data rute</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {data.topRoutes.map((r, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'rgba(168,85,247,0.04)', border: '1px solid rgba(168,85,247,0.1)', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#C084FC', fontFamily: 'monospace', width: '20px' }}>#{i + 1}</span>
                        <span style={{ fontSize: '11px', color: '#C7B8EA', fontFamily: 'monospace' }}>{r.route}</span>
                      </div>
                      <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#22C55E', fontFamily: 'monospace', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', padding: '2px 8px', borderRadius: '4px' }}>
                        {r.count} kargo
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Top Customers (Admin only) */}
            {role === 'ADMIN' && (
              <div style={cardStyle}>
                <div style={sectionTitle}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#06B6D4', display: 'inline-block' }} />
                  Top 5 Customer
                </div>
                {data.topCustomers.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: '#6B5C83', fontFamily: 'monospace', fontSize: '11px' }}>Belum ada data customer</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {data.topCustomers.map((op, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'rgba(6,182,212,0.04)', border: '1px solid rgba(6,182,212,0.1)', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#06B6D4', fontFamily: 'monospace', width: '20px' }}>#{i + 1}</span>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                            <span style={{ fontSize: '11px', color: '#C7B8EA', fontFamily: 'monospace' }}>{op.name}</span>
                            <span style={{ fontSize: '9px', color: '#8B7BA8', fontFamily: 'monospace' }}>{formatCurrency(op.revenue)}</span>
                          </div>
                        </div>
                        <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#06B6D4', fontFamily: 'monospace', background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', padding: '2px 8px', borderRadius: '4px' }}>
                          {op.count} kargo
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Last updated note */}
          <div style={{ textAlign: 'right', fontSize: '9px', color: '#6B5C83', fontFamily: 'monospace' }}>
            ↻ Data diperbarui otomatis · {new Date().toLocaleString('id-ID')}
          </div>
        </>
      ) : (
        <div style={{ padding: '40px', textAlign: 'center', color: '#EF4444', fontFamily: 'monospace', fontSize: '12px' }}>
          Gagal memuat data analitik. Coba refresh halaman.
        </div>
      )}
    </div>
  )
}
