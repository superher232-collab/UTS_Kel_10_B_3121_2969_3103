import React from 'react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      background: '#0D0618',
      border: '1px solid rgba(168, 85, 247, 0.4)',
      borderRadius: '12px',
      boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 20px rgba(168, 85, 247, 0.15)',
      textAlign: 'center',
      maxWidth: '560px',
      margin: '40px auto',
      fontFamily: 'monospace'
    }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
      <h2 style={{ color: '#C084FC', letterSpacing: '2px', fontSize: '16px', fontWeight: 'bold', margin: '0 0 12px 0' }}>
        DATA KARGO TIDAK DITEMUKAN
      </h2>
      <p style={{ color: '#C7B8EA', fontSize: '11px', lineHeight: '1.6', margin: '0 0 24px 0' }}>
        Nomor resi atau ID kargo yang Anda cari tidak terdaftar dalam database logistik PrimeLog.
      </p>
      <Link
        href="/dashboard/cargo"
        style={{
          padding: '12px 32px',
          background: 'linear-gradient(90deg, #A855F7 0%, #7C3AED 100%)',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '11px',
          letterSpacing: '1px',
          boxShadow: '0 0 15px rgba(168, 85, 247, 0.3)',
          transition: 'all 0.2s',
          display: 'inline-block'
        }}
      >
        KEMBALI KE MANAJEMEN KARGO
      </Link>
    </div>
  )
}
