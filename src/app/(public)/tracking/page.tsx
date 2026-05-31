import React from 'react'
import { Metadata } from 'next'
import { prisma } from '@/lib/db'
import Link from 'next/link'

type Props = {
  searchParams: Promise<{ resi?: string }>
}

export const generateMetadata = async ({ searchParams }: Props): Promise<Metadata> => {
  const { resi } = await searchParams
  
  if (!resi) {
    return {
      title: 'Pelacakan Kargo Publik | PrimeLog',
      description: 'Lacak lokasi dan status pengiriman paket Anda secara real-time.'
    }
  }

  const shipment = await prisma.shipment.findUnique({
    where: { receiptNo: resi }
  })

  if (!shipment) {
    return {
      title: `Resi ${resi} Tidak Ditemukan`,
      description: 'Nomor resi kargo tidak terdaftar dalam database logistik kami.'
    }
  }

  return {
    title: `Lacak Resi: ${shipment.receiptNo} - [${shipment.status}]`,
    description: `Paket berisi ${shipment.itemName} dikirim dari ${shipment.origin} menuju ${shipment.destination}. Status terbaru: ${shipment.status}.`
  }
}

export default async function TrackingPage({ searchParams }: Props) {
  const { resi } = await searchParams
  
  let shipment = null
  let error = false

  if (resi) {
    try {
      shipment = await prisma.shipment.findUnique({
        where: { receiptNo: resi },
        include: { vehicle: true }
      })
      if (!shipment) {
        error = true
      }
    } catch (e) {
      console.error(e)
      error = true
    }
  }

  const timelineSteps = [
    { label: 'DIPROSES', icon: '📋', desc: 'Barang sedang dipersiapkan di gudang asal.' },
    { label: 'DALAM_PENGIRIMAN', icon: '🚛', desc: 'Barang sedang dalam perjalanan menuju tujuan.' },
    { label: 'SAMPAI', icon: '🏁', desc: 'Barang telah tiba di kota tujuan / transit hub.' },
    { label: 'SELESAI', icon: '✅', desc: 'Barang telah diterima oleh penerima.' }
  ]

  const getStepStatus = (stepLabel: string, currentStatus: string): 'completed' | 'active' | 'upcoming' => {
    const order = ['DIPROSES', 'DALAM_PENGIRIMAN', 'SAMPAI', 'SELESAI']
    const currentIndex = order.indexOf(currentStatus)
    const stepIndex = order.indexOf(stepLabel)

    if (currentStatus === 'PENDING') {
      if (stepLabel === 'DIPROSES' || stepLabel === 'DALAM_PENGIRIMAN') return 'completed'
      return 'upcoming'
    }

    if (stepIndex < currentIndex) return 'completed'
    if (stepIndex === currentIndex) return 'active'
    return 'upcoming'
  }

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      background: '#07020E',
      color: 'white',
      fontFamily: 'monospace',
      padding: '40px 20px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {/* Premium Header */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 'bold', color: 'white', letterSpacing: '2px', margin: '0 0 8px 0' }}>
          TRACKING KARGO PUBLIK
        </h1>
        <span style={{ fontSize: '10px', color: '#C084FC', fontWeight: 'bold', letterSpacing: '1px' }}>
          PRIMELOG LOGISTICS NETWORK
        </span>
      </div>

      {/* Search Input Box */}
      <div style={{
        background: '#0D0618',
        border: '1px solid rgba(168, 85, 247, 0.3)',
        borderRadius: '8px',
        padding: '24px',
        width: '90%',
        maxWidth: '560px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
        marginBottom: '24px'
      }}>
        <form action="/tracking" method="GET" style={{ display: 'flex', gap: '12px' }}>
          <input
            type="text"
            name="resi"
            defaultValue={resi || ''}
            placeholder="Masukkan Nomor Resi (e.g. CRG-YYYYMMDD-XXXX)"
            required
            style={{
              flex: 1,
              background: '#07020E',
              border: '1px solid rgba(168, 85, 247, 0.4)',
              borderRadius: '4px',
              padding: '12px',
              color: 'white',
              fontSize: '12px',
              outline: 'none',
              fontFamily: 'monospace'
            }}
          />
          <button
            type="submit"
            style={{
              background: 'linear-gradient(90deg, #A855F7 0%, #7C3AED 100%)',
              border: 'none',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '11px',
              boxShadow: '0 0 10px rgba(168, 85, 247, 0.3)'
            }}
          >
            LACAK
          </button>
        </form>
      </div>

      {/* Shipment Status Visualizer */}
      {shipment && (
        <div style={{
          background: '#0D0618',
          border: '1px solid rgba(168, 85, 247, 0.3)',
          borderRadius: '8px',
          padding: '32px',
          width: '90%',
          maxWidth: '560px',
          boxShadow: '0 10px 35px rgba(0,0,0,0.7)'
        }}>
          {/* Quick Header */}
          <div style={{ borderBottom: '1px dashed rgba(168, 85, 247, 0.2)', paddingBottom: '16px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '9px', color: '#8B7BA8', display: 'block' }}>NOMOR RESI</span>
              <span style={{ fontSize: '15px', color: 'white', fontWeight: 'bold' }}>{shipment.receiptNo}</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '9px', color: '#8B7BA8', display: 'block' }}>STATUS</span>
              <span style={{
                padding: '3px 8px',
                borderRadius: '4px',
                fontSize: '9px',
                fontWeight: 'bold',
                background: shipment.status === 'SELESAI' ? 'rgba(34, 197, 94, 0.1)' : shipment.status === 'PENDING' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(168, 85, 247, 0.1)',
                color: shipment.status === 'SELESAI' ? '#22C55E' : shipment.status === 'PENDING' ? '#F59E0B' : '#C084FC',
                border: `1px solid ${shipment.status === 'SELESAI' ? '#22C55E' : shipment.status === 'PENDING' ? '#F59E0B' : '#A855F7'}`
              }}>
                {shipment.status}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '6px', border: '1px solid rgba(168, 85, 247, 0.1)' }}>
            <div>
              <span style={{ fontSize: '8px', color: '#8B7BA8', display: 'block' }}>PENGIRIM</span>
              <span style={{ fontSize: '11px', color: 'white' }}>{shipment.senderName}</span>
            </div>
            <div>
              <span style={{ fontSize: '8px', color: '#8B7BA8', display: 'block' }}>PENERIMA</span>
              <span style={{ fontSize: '11px', color: 'white' }}>{shipment.receiverName}</span>
            </div>
            <div>
              <span style={{ fontSize: '8px', color: '#8B7BA8', display: 'block' }}>RUTE</span>
              <span style={{ fontSize: '11px', color: 'white' }}>{shipment.origin} ➔ {shipment.destination}</span>
            </div>
            <div>
              <span style={{ fontSize: '8px', color: '#8B7BA8', display: 'block' }}>NAMA BARANG</span>
              <span style={{ fontSize: '11px', color: 'white' }}>{shipment.itemName} ({shipment.weight} kg)</span>
            </div>
            <div>
              <span style={{ fontSize: '8px', color: '#8B7BA8', display: 'block' }}>MODA LAYANAN</span>
              <span style={{ fontSize: '11px', color: 'white' }}>{shipment.shippingType}</span>
            </div>
            <div>
              <span style={{ fontSize: '8px', color: '#8B7BA8', display: 'block' }}>ARMADA PENGANGKUT</span>
              <span style={{ fontSize: '11px', color: '#06B6D4' }}>{shipment.vehicle ? shipment.vehicle.name : 'Belum Ditugaskan'}</span>
            </div>
          </div>

          {/* Glowing Timeline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
            {/* Center connector line */}
            <div style={{
              position: 'absolute',
              left: '15px',
              top: '10px',
              bottom: '10px',
              width: '2px',
              background: 'rgba(168, 85, 247, 0.15)',
              zIndex: 1
            }}></div>

            {timelineSteps.map((step) => {
              const statusType = getStepStatus(step.label, shipment.status)
              
              let dotBg = '#07020E'
              let dotBorder = 'rgba(168, 85, 247, 0.3)'
              let textColor = '#8B7BA8'
              let glow = 'none'

              if (statusType === 'completed') {
                dotBg = '#A855F7'
                dotBorder = '#A855F7'
                textColor = 'white'
              } else if (statusType === 'active') {
                dotBg = '#07020E'
                dotBorder = '#C084FC'
                textColor = '#C084FC'
                glow = '0 0 10px #A855F7'
              }

              return (
                <div key={step.label} style={{ display: 'flex', gap: '16px', zIndex: 2, alignItems: 'flex-start' }}>
                  {/* Timeline Circle */}
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: dotBg,
                    border: `2px solid ${dotBorder}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    flexShrink: 0,
                    boxShadow: glow
                  }}>
                    {step.icon}
                  </div>
                  {/* Timeline description */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 'bold', color: textColor }}>{step.label.replace('_', ' ')}</span>
                    <span style={{ fontSize: '9px', color: '#8B7BA8', lineHeight: '1.4' }}>{step.desc}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid #EF4444',
          borderRadius: '8px',
          padding: '24px',
          width: '90%',
          maxWidth: '560px',
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(0,0,0,0.6)'
        }}>
          <span style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}>⚠️</span>
          <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#EF4444', display: 'block', marginBottom: '4px' }}>RESI TIDAK DITEMUKAN</span>
          <span style={{ fontSize: '10px', color: '#C7B8EA', lineHeight: '1.4' }}>
            Nomor resi **{resi}** tidak ditemukan dalam database logistik kami. Harap pastikan format kode resi sudah benar.
          </span>
        </div>
      )}

      {/* Back link */}
      <Link href="/" style={{ color: '#8B7BA8', fontSize: '11px', marginTop: '32px', textDecoration: 'none' }}>
        ➔ Kembali ke Beranda
      </Link>
    </div>
  )
}
