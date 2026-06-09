// src/app/dashboard/support/page.tsx
import React from 'react'
import Link from 'next/link'
import { auth } from '@/auth'

export default async function SupportDashboardPage() {
  const session = await auth()
  
  if (!session?.user) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', background: '#07020E', color: 'white', fontFamily: 'monospace', padding: '24px' }}>
        <div style={{ background: '#0D0618', border: '1px solid #EF4444', borderRadius: '12px', padding: '40px', maxWidth: '520px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px' }}>🔐</div>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#EF4444', margin: '16px 0' }}>LOGIN DIBUTUHKAN</h2>
          <p style={{ color: '#C7B8EA', fontSize: '12px' }}>Silakan login untuk mengakses pusat bantuan.</p>
        </div>
      </div>
    )
  }

  const faqs = [
    {
      q: "Bagaimana cara melacak kargo saya secara real-time?",
      a: "Anda dapat melihat kargo Anda pada menu 'Pusat Kontrol Cargo' atau tab 'TRACK'. Di sana tertera status kargo, ETA, lokasi terakhir kargo berupa teks, dan armada penyeberangan yang dialokasikan oleh admin secara berkala."
    },
    {
      q: "Mengapa status pengiriman saya tertulis PENDING?",
      a: "Status PENDING biasanya muncul akibat faktor eksternal di perjalanan seperti kendala cuaca buruk di laut atau proses antrean pemuatan di pelabuhan. Admin kami akan memperbarui status secara berkala demi akurasi pelacakan."
    },
    {
      q: "Berapa lama estimasi pengiriman kargo antarpulau?",
      a: "Estimasi pengiriman kargo tergantung pada moda transportasi yang Anda pilih. Moda DARAT dan LAUT berkisar antara 3 - 7 hari kerja, sedangkan moda UDARA dapat tiba dalam waktu 1 - 2 hari kerja."
    },
    {
      q: "Bagaimana cara melakukan pembayaran atau pelunasan?",
      a: "Sistem PrimeLog akan secara otomatis menerbitkan rincian tagihan invoice secara digital saat status pengiriman Anda dinyatakan SELESAI. Anda dapat melunasi tagihan melalui transfer bank resmi kami."
    }
  ]

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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <h1 style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '2px', margin: 0 }}>
            PUSAT BANTUAN & FAQ PRIMELOG
          </h1>
          <span style={{ fontSize: '9px', color: '#A855F7', fontWeight: 'bold', letterSpacing: '1px' }}>
            LAYANAN PELANGGAN DAN PUSAT TIKET PERMASALAHAN INTEGRAL
          </span>
        </div>

        <Link
          href="/dashboard/support/tickets"
          style={{
            background: 'linear-gradient(90deg, #A855F7 0%, #7C3AED 100%)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: 'bold',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 0 15px rgba(168, 85, 247, 0.4)'
          }}
        >
          🎟️ TIKET PERNYATAAN / COMPLAINT
        </Link>
      </div>

      {/* Main Grid Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '24px',
        alignItems: 'start'
      }}>
        
        {/* Left Side: FAQs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{
            background: '#0D0618',
            border: '1px solid rgba(168, 85, 247, 0.2)',
            borderRadius: '10px',
            padding: '24px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.6)'
          }}>
            <h2 style={{ fontSize: '14px', fontWeight: 'bold', color: 'white', marginBottom: '16px', letterSpacing: '1px' }}>
              ❓ FAQ - PERTANYAAN POPULER
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {faqs.map((faq, idx) => (
                <div key={idx} style={{
                  padding: '16px',
                  background: 'rgba(168, 85, 247, 0.02)',
                  border: '1px solid rgba(168, 85, 247, 0.08)',
                  borderRadius: '6px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <span style={{ fontWeight: 'bold', fontSize: '11px', color: '#C084FC' }}>
                    Q: {faq.q}
                  </span>
                  <span style={{ fontSize: '10px', color: '#C7B8EA', lineHeight: '1.5' }}>
                    A: {faq.a}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Contact Fallback & Tickets CTA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Live chat fallback / info card */}
          <div style={{
            background: '#0D0618',
            border: '1px solid rgba(168, 85, 247, 0.2)',
            borderRadius: '10px',
            padding: '24px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            <h2 style={{ fontSize: '13px', fontWeight: 'bold', color: 'white', borderBottom: '1px solid rgba(168, 85, 247, 0.15)', paddingBottom: '8px', margin: 0 }}>
              📞 TELEPON & KONTAK DARURAT
            </h2>
            <p style={{ fontSize: '10px', color: '#C7B8EA', lineHeight: '1.4' }}>
              Jika Anda memerlukan penanganan kargo segera di luar jam kerja logistik utama:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '10px', padding: '12px', background: 'rgba(168, 85, 247, 0.05)', borderRadius: '6px', border: '1px solid rgba(168, 85, 247, 0.1)' }}>
              <div>
                <span style={{ color: '#8B7BA8', display: 'block' }}>EMAIL FALLBACK</span>
                <span style={{ color: '#06B6D4', fontWeight: 'bold' }}>support@primelog-fleet.id</span>
              </div>
              <div>
                <span style={{ color: '#8B7BA8', display: 'block' }}>CUSTOMER CARE</span>
                <span style={{ color: 'white', fontWeight: 'bold' }}>+62 (21) 8080-9090 (24/7)</span>
              </div>
            </div>
          </div>

          {/* Ticket System Intro */}
          <div style={{
            background: '#0D0618',
            border: '1px solid rgba(168, 85, 247, 0.2)',
            borderRadius: '10px',
            padding: '24px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            <h2 style={{ fontSize: '13px', fontWeight: 'bold', color: 'white', borderBottom: '1px solid rgba(168, 85, 247, 0.15)', paddingBottom: '8px', margin: 0 }}>
              🎟️ HUB TIKET LAYANAN
            </h2>
            <p style={{ fontSize: '10px', color: '#C7B8EA', lineHeight: '1.4' }}>
              Memiliki permasalahan kargo rusak, salah rute, atau mengajukan klaim kompensasi pengiriman? 
            </p>
            <p style={{ fontSize: '10px', color: '#C7B8EA', lineHeight: '1.4' }}>
              Buka tiket baru untuk langsung terhubung dengan admin support kami dalam live chat interaktif berbasis polling sinyal real-time.
            </p>
            <Link 
              href="/dashboard/support/tickets"
              style={{
                background: 'rgba(168, 85, 247, 0.1)',
                border: '1px solid rgba(168, 85, 247, 0.4)',
                borderRadius: '6px',
                padding: '10px',
                color: '#C084FC',
                fontWeight: 'bold',
                textAlign: 'center',
                textDecoration: 'none',
                fontSize: '11px',
                transition: 'all 0.2s',
                display: 'block'
              }}
            >
              MASUK KE MANAGEMENT TIKET
            </Link>
          </div>

        </div>

      </div>

    </div>
  )
}
