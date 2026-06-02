// src/app/dashboard/cargo/[id]/page.tsx
import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { ShipmentStatus, PaymentStatus, ShippingType } from '@prisma/client'

type PageProps = {
  params: Promise<{ id: string }>
}

// Helper: format rupiah currency
function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount)
}

// Helper: format standard date time
function formatDateTime(date: Date | null | undefined) {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Helper: get standard badge styles
const getStatusBadgeStyle = (status: string) => {
  const base = {
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '10px',
    fontWeight: 'bold',
    fontFamily: 'monospace',
    letterSpacing: '1px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    border: '1px solid'
  }

  const text = (status || '').toLowerCase()
  if (text === 'selesai' || text === 'lunas') {
    return {
      ...base,
      background: 'rgba(34, 197, 94, 0.08)',
      borderColor: '#22C55E',
      color: '#22C55E',
      boxShadow: '0 0 10px rgba(34, 197, 94, 0.15)'
    }
  } else if (text === 'dalam_pengiriman') {
    return {
      ...base,
      background: 'rgba(6, 182, 212, 0.08)',
      borderColor: '#06B6D4',
      color: '#06B6D4',
      boxShadow: '0 0 10px rgba(6, 182, 212, 0.15)'
    }
  } else if (text === 'diproses') {
    return {
      ...base,
      background: 'rgba(168, 85, 247, 0.08)',
      borderColor: '#A855F7',
      color: '#A855F7',
      boxShadow: '0 0 10px rgba(168, 85, 247, 0.15)'
    }
  } else if (text === 'pending' || text === 'belum_bayar') {
    return {
      ...base,
      background: 'rgba(245, 158, 11, 0.08)',
      borderColor: '#F59E0B',
      color: '#F59E0B',
      boxShadow: '0 0 10px rgba(245, 158, 11, 0.15)'
    }
  } else {
    return {
      ...base,
      background: 'rgba(239, 68, 68, 0.08)',
      borderColor: '#EF4444',
      color: '#EF4444',
      boxShadow: '0 0 10px rgba(239, 68, 68, 0.15)'
    }
  }
}

// Icons based on status
const getStatusIcon = (status: string) => {
  const text = (status || '').toLowerCase()
  if (text === 'selesai') return '✅'
  if (text === 'dalam_pengiriman') return '🚢'
  if (text === 'diproses') return '📋'
  if (text === 'pending') return '⏳'
  if (text === 'dibatalkan') return '❌'
  return '📦'
}

export default async function ShipmentDetailPage({ params }: PageProps) {
  const session = await auth()
  
  if (!session?.user) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', background: '#07020E', color: 'white', fontFamily: 'monospace', padding: '24px' }}>
        <div style={{ background: '#0D0618', border: '1px solid #EF4444', borderRadius: '12px', padding: '40px', maxWidth: '520px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px' }}>🔐</div>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#EF4444', margin: '16px 0' }}>LOGIN DIBUTUHKAN</h2>
          <p style={{ color: '#C7B8EA', fontSize: '12px' }}>Silakan login untuk melacak data detail pengiriman ini.</p>
        </div>
      </div>
    )
  }

  const { id } = await params
  const role = (session.user as any).role as 'ADMIN' | 'OPERATOR' | 'CUSTOMER'
  const userId = (session.user as any).id as string

  // Fetch shipment from DB including relations
  const shipment = await prisma.shipment.findUnique({
    where: { id },
    include: {
      vehicle: true,
      trackingHistory: {
        orderBy: { changedAt: 'desc' }
      }
    }
  })

  if (!shipment) {
    notFound()
  }

  // HARD RULE: Shippers can only query logs belonging to their own shipments (BR-01)
  if (role !== 'ADMIN' && shipment.userId !== userId) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', background: '#07020E', color: 'white', fontFamily: 'monospace', padding: '24px' }}>
        <div style={{ background: '#0D0618', border: '1px solid #EF4444', borderRadius: '12px', padding: '40px', maxWidth: '520px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px' }}>🚫</div>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#EF4444', margin: '16px 0' }}>AKSES DITOLAK</h2>
          <p style={{ color: '#C7B8EA', fontSize: '12px' }}>Anda tidak diperbolehkan mengakses detail pelacakan pengiriman milik pengguna lain.</p>
          <div style={{ marginTop: '24px' }}>
            <Link
              href="/dashboard/cargo"
              style={{
                background: 'linear-gradient(90deg, #A855F7 0%, #7C3AED 100%)',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '11px',
                fontWeight: 'bold'
              }}
            >
              KEMBALI KE RUANG KONTROL
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', boxSizing: 'border-box', color: 'white', fontFamily: 'monospace' }}>
      
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        borderBottom: '1px dashed rgba(168, 85, 247, 0.25)',
        paddingBottom: '16px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link 
              href="/dashboard/cargo" 
              style={{ 
                color: '#A855F7', 
                textDecoration: 'none', 
                fontSize: '18px', 
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              ◀
            </Link>
            <h1 style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '2px', margin: 0 }}>
              PELACAKAN CARGO: {shipment.receiptNo}
            </h1>
          </div>
          <span style={{ fontSize: '9px', color: '#A855F7', fontWeight: 'bold', letterSpacing: '1px' }}>
            STATUS INFORMASI & TIMELINE DETAIL LOG SELESAI SECARA IMMUTABLE
          </span>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            style={{
              background: 'rgba(168, 85, 247, 0.1)',
              border: '1px solid rgba(168, 85, 247, 0.4)',
              color: '#C084FC',
              padding: '10px 18px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '10px',
              fontWeight: 'bold',
            }}
          >
            🖨️ CETAK RESI
          </button>
        </div>
      </div>

      {/* Main Grid: Detail Cards & Tracking Timeline */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(320px, 2fr) minmax(300px, 1fr)',
        gap: '24px',
        alignItems: 'start'
      }}>
        
        {/* Left Side: Shipment details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Status Bar */}
          <div style={{
            background: '#0D0618',
            border: '1px solid rgba(168, 85, 247, 0.25)',
            borderRadius: '10px',
            padding: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '9px', color: '#8B7BA8' }}>STATUS PENGIRIMAN</span>
              <span style={getStatusBadgeStyle(shipment.status)}>
                {getStatusIcon(shipment.status)} {shipment.status.replace('_', ' ')}
              </span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '9px', color: '#8B7BA8' }}>STATUS PEMBAYARAN</span>
              <span style={getStatusBadgeStyle(shipment.paymentStatus)}>
                💳 {shipment.paymentStatus.replace('_', ' ')}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '9px', color: '#8B7BA8' }}>MODA TRANSPORTASI</span>
              <span style={{
                background: 'rgba(6, 182, 212, 0.08)',
                border: '1px solid #06B6D4',
                color: '#06B6D4',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '10px',
                fontWeight: 'bold',
                boxShadow: '0 0 10px rgba(6, 182, 212, 0.15)'
              }}>
                {shipment.shippingType === 'LAUT' ? '🚢 LAUT' : shipment.shippingType === 'DARAT' ? '🚛 DARAT' : '✈️ UDARA'}
              </span>
            </div>
          </div>

          {/* Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            
            {/* Rute & Jadwal */}
            <div style={{
              background: '#0D0618',
              border: '1px solid rgba(168, 85, 247, 0.15)',
              borderRadius: '8px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}>
              <span style={{ fontSize: '10px', color: '#A855F7', fontWeight: 'bold', borderBottom: '1px solid rgba(168, 85, 247, 0.15)', paddingBottom: '6px' }}>
                📍 ASAL & TUJUAN
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <span style={{ fontSize: '9px', color: '#8B7BA8', display: 'block' }}>KOTA ASAL</span>
                  <span style={{ color: 'white', fontWeight: 'bold', fontSize: '12px' }}>{shipment.origin}</span>
                </div>
                <div>
                  <span style={{ fontSize: '9px', color: '#8B7BA8', display: 'block' }}>KOTA TUJUAN</span>
                  <span style={{ color: 'white', fontWeight: 'bold', fontSize: '12px' }}>{shipment.destination}</span>
                </div>
                <div>
                  <span style={{ fontSize: '9px', color: '#8B7BA8', display: 'block' }}>TANGGAL PENGIRIMAN</span>
                  <span>{formatDateTime(shipment.shipmentDate).slice(0, -6)}</span>
                </div>
              </div>
            </div>

            {/* Kontak detail */}
            <div style={{
              background: '#0D0618',
              border: '1px solid rgba(168, 85, 247, 0.15)',
              borderRadius: '8px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}>
              <span style={{ fontSize: '10px', color: '#A855F7', fontWeight: 'bold', borderBottom: '1px solid rgba(168, 85, 247, 0.15)', paddingBottom: '6px' }}>
                👥 PENGIRIM & PENERIMA
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <span style={{ fontSize: '9px', color: '#8B7BA8', display: 'block' }}>PENGIRIM</span>
                  <span style={{ color: 'white', fontWeight: 'bold' }}>{shipment.senderName}</span>
                </div>
                <div>
                  <span style={{ fontSize: '9px', color: '#8B7BA8', display: 'block' }}>PENERIMA</span>
                  <span style={{ color: 'white', fontWeight: 'bold' }}>{shipment.receiverName}</span>
                </div>
                <div>
                  <span style={{ fontSize: '9px', color: '#8B7BA8', display: 'block' }}>KONTAK PENERIMA</span>
                  <span style={{ color: '#06B6D4' }}>📞 {shipment.receiverTelp}</span>
                </div>
              </div>
            </div>

            {/* Detail Barang */}
            <div style={{
              background: '#0D0618',
              border: '1px solid rgba(168, 85, 247, 0.15)',
              borderRadius: '8px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}>
              <span style={{ fontSize: '10px', color: '#A855F7', fontWeight: 'bold', borderBottom: '1px solid rgba(168, 85, 247, 0.15)', paddingBottom: '6px' }}>
                📦 MUATAN CARGO
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div>
                  <span style={{ fontSize: '9px', color: '#8B7BA8', display: 'block' }}>NAMA BARANG</span>
                  <span style={{ color: 'white', fontWeight: 'bold' }}>{shipment.itemName}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <span style={{ fontSize: '9px', color: '#8B7BA8', display: 'block' }}>BERAT</span>
                    <span>{shipment.weight} kg</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '9px', color: '#8B7BA8', display: 'block' }}>JUMLAH</span>
                    <span>{shipment.quantity} Koli</span>
                  </div>
                </div>
                {shipment.dimensions && (
                  <div>
                    <span style={{ fontSize: '9px', color: '#8B7BA8', display: 'block' }}>DIMENSI</span>
                    <span>{shipment.dimensions} cm</span>
                  </div>
                )}
                {shipment.notes && (
                  <div>
                    <span style={{ fontSize: '9px', color: '#8B7BA8', display: 'block' }}>CATATAN TAMBAHAN</span>
                    <span style={{ color: '#C7B8EA', fontSize: '10px' }}>{shipment.notes}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Invoice & Biaya */}
            <div style={{
              background: '#0D0618',
              border: '1px solid rgba(168, 85, 247, 0.15)',
              borderRadius: '8px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}>
              <span style={{ fontSize: '10px', color: '#A855F7', fontWeight: 'bold', borderBottom: '1px solid rgba(168, 85, 247, 0.15)', paddingBottom: '6px' }}>
                💵 RINCIAN BIAYA TARIFF
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', height: '100%', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '9px', color: '#8B7BA8', display: 'block' }}>TOTAL TARIFF</span>
                  <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#06B6D4' }}>{formatCurrency(shipment.tariff)}</span>
                </div>
                <div style={{ fontSize: '9px', color: '#C7B8EA', lineHeight: '1.4' }}>
                  Biaya dihitung otomatis berdasarkan berat kargo, moda pengiriman, dan matrix jarak rute pelabuhan.
                </div>
              </div>
            </div>

          </div>

          {/* Vehicle card & Current Location */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            
            {/* Vehicle Details */}
            <div style={{
              background: '#0D0618',
              border: '1px solid rgba(168, 85, 247, 0.15)',
              borderRadius: '8px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}>
              <span style={{ fontSize: '10px', color: '#A855F7', fontWeight: 'bold', borderBottom: '1px solid rgba(168, 85, 247, 0.15)', paddingBottom: '6px' }}>
                🚢 ARMADA & ESTIMASI TIBA
              </span>
              {shipment.vehicle ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div>
                    <span style={{ fontSize: '9px', color: '#8B7BA8', display: 'block' }}>NAMA ARMADA</span>
                    <span style={{ color: 'white', fontWeight: 'bold' }}>{shipment.vehicle.name} ({shipment.vehicle.plateNo})</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div>
                      <span style={{ fontSize: '9px', color: '#8B7BA8', display: 'block' }}>TIPE ARMADA</span>
                      <span>{shipment.vehicle.type}</span>
                    </div>
                    <div>
                      <span style={{ fontSize: '9px', color: '#8B7BA8', display: 'block' }}>STATUS</span>
                      <span style={{ color: '#22C55E' }}>{shipment.vehicle.status}</span>
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '9px', color: '#8B7BA8', display: 'block' }}>ESTIMASI TIBA (ETA)</span>
                    <span style={{ color: '#F59E0B', fontWeight: 'bold' }}>{formatDateTime(shipment.eta || shipment.vehicle.eta)}</span>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '16px 0', color: '#8B7BA8', fontSize: '10px', textAlign: 'center', border: '1px dashed rgba(168, 85, 247, 0.2)', borderRadius: '6px' }}>
                  Armada pengangkut belum dialokasikan oleh operator admin.
                </div>
              )}
            </div>

            {/* Current simple Location */}
            <div style={{
              background: '#0D0618',
              border: '1px solid rgba(168, 85, 247, 0.15)',
              borderRadius: '8px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}>
              <span style={{ fontSize: '10px', color: '#A855F7', fontWeight: 'bold', borderBottom: '1px solid rgba(168, 85, 247, 0.15)', paddingBottom: '6px' }}>
                🌍 LOKASI TERAKHIR CARGO
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center', height: '100%' }}>
                <div>
                  <span style={{ fontSize: '9px', color: '#8B7BA8', display: 'block' }}>LOKASI SEKARANG</span>
                  <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#06B6D4' }}>
                    {shipment.currentLocation || 'GUDANG ASAL SORTIR'}
                  </span>
                </div>
                <div style={{ fontSize: '9px', color: '#8B7BA8', lineHeight: '1.4' }}>
                  Posisi diperbarui manual oleh kru operator kargo demi ketepatan data. Telemetri koordinat GPS ditiadakan atas dasar isolasi keamanan.
                </div>
              </div>
            </div>

          </div>

          {/* Proof of Delivery (POD) Panel */}
          <div style={{
            background: '#0D0618',
            border: '1px solid rgba(168, 85, 247, 0.15)',
            borderRadius: '8px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <span style={{ fontSize: '10px', color: '#A855F7', fontWeight: 'bold', borderBottom: '1px solid rgba(168, 85, 247, 0.15)', paddingBottom: '6px' }}>
              📸 BUKTI PENERIMAAN CARGO (PROOF OF DELIVERY)
            </span>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              {/* Photo POD */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '9px', color: '#8B7BA8' }}>FOTO PENERIMAAN</span>
                {shipment.proofPhotoUrl ? (
                  <div style={{ position: 'relative', height: '160px', width: '100%', background: '#07020E', border: '1px solid rgba(168, 85, 247, 0.25)', borderRadius: '6px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={shipment.proofPhotoUrl} 
                      alt="Proof of Delivery Photo" 
                      style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                    />
                  </div>
                ) : (
                  <div style={{ 
                    height: '160px', 
                    border: '1px dashed rgba(168, 85, 247, 0.25)', 
                    borderRadius: '6px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    gap: '6px',
                    color: '#8B7BA8',
                    fontSize: '9px'
                  }}>
                    <span>📷 Belum Ada Foto</span>
                    <span>Status paket belum diserahkan ke penerima</span>
                  </div>
                )}
              </div>

              {/* Signature POD */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '9px', color: '#8B7BA8' }}>TANDA TANGAN PENERIMA</span>
                {shipment.proofSignature ? (
                  <div style={{ position: 'relative', height: '160px', width: '100%', background: '#07020E', border: '1px solid rgba(168, 85, 247, 0.25)', borderRadius: '6px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={shipment.proofSignature} 
                      alt="Recipient Signature" 
                      style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', filter: 'invert(1)' }}
                    />
                  </div>
                ) : (
                  <div style={{ 
                    height: '160px', 
                    border: '1px dashed rgba(168, 85, 247, 0.25)', 
                    borderRadius: '6px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    gap: '6px',
                    color: '#8B7BA8',
                    fontSize: '9px'
                  }}>
                    <span>✍️ Belum Ada Tanda Tangan</span>
                    <span>Konfirmasi tanda tangan belum ditandatangani</span>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Tracking History Timeline Stepper */}
        <div style={{
          background: '#0D0618',
          border: '1px solid rgba(168, 85, 247, 0.2)',
          borderRadius: '10px',
          padding: '24px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div style={{ borderBottom: '1px solid rgba(168, 85, 247, 0.15)', paddingBottom: '10px' }}>
            <h2 style={{ fontSize: '13px', color: 'white', fontWeight: 'bold', letterSpacing: '1px', margin: 0 }}>
              TIMELINE PELACAKAN CARGO
            </h2>
            <span style={{ fontSize: '8px', color: '#8B7BA8', fontWeight: 'bold' }}>LOG CHRONOLOGICAL HISTORY (SORTED DESC)</span>
          </div>

          {shipment.trackingHistory && shipment.trackingHistory.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0px', position: 'relative', paddingLeft: '8px' }}>
              {/* Central vertical track line */}
              <div style={{
                position: 'absolute',
                top: '12px',
                bottom: '12px',
                left: '21px',
                width: '1px',
                borderLeft: '1px dashed rgba(168, 85, 247, 0.3)'
              }} />

              {shipment.trackingHistory.map((history, idx) => (
                <div 
                  key={history.id}
                  style={{
                    display: 'flex',
                    gap: '20px',
                    paddingBottom: idx === shipment.trackingHistory.length - 1 ? '0px' : '24px',
                    position: 'relative'
                  }}
                >
                  {/* Timeline point */}
                  <div style={{
                    zIndex: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: '#07020E',
                    border: `2px solid ${
                      history.newStatus === 'SELESAI' ? '#22C55E' : 
                      history.newStatus === 'DIBATALKAN' ? '#EF4444' : 
                      history.newStatus === 'DALAM_PENGIRIMAN' ? '#06B6D4' : '#A855F7'
                    }`,
                    fontSize: '12px'
                  }}>
                    {getStatusIcon(history.newStatus)}
                  </div>

                  {/* Event content box */}
                  <div style={{
                    flex: 1,
                    background: 'rgba(168, 85, 247, 0.02)',
                    border: '1px solid rgba(168, 85, 247, 0.08)',
                    borderRadius: '6px',
                    padding: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '4px' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '11px', color: 'white' }}>
                        {history.newStatus.replace('_', ' ')}
                      </span>
                      <span style={{ fontSize: '8px', color: '#8B7BA8', fontFamily: 'monospace' }}>
                        {formatDateTime(history.changedAt)}
                      </span>
                    </div>

                    {history.notes && (
                      <span style={{ fontSize: '10px', color: '#C7B8EA', lineHeight: '1.4' }}>
                        {history.notes}
                      </span>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontSize: '8px', color: '#A855F7', fontWeight: 'bold', fontFamily: 'monospace' }}>OPERATOR ID:</span>
                      <span style={{ fontSize: '8px', color: '#8B7BA8', fontFamily: 'monospace' }}>
                        {history.changedBy || 'SYSTEM'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '32px 16px', textAlign: 'center', border: '1px dashed rgba(168, 85, 247, 0.2)', borderRadius: '6px', color: '#8B7BA8', fontSize: '10px' }}>
              Belum ada riwayat pelacakan terekam untuk kargo ini.
            </div>
          )}

        </div>

      </div>

    </div>
  )
}
