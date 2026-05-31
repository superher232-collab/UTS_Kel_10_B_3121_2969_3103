'use client'

import React, { useEffect } from 'react'

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      background: '#0D0618',
      border: '1px solid #EF4444',
      borderRadius: '12px',
      boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 20px rgba(239, 68, 68, 0.15)',
      textAlign: 'center',
      maxWidth: '560px',
      margin: '40px auto',
      fontFamily: 'monospace'
    }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
      <h2 style={{ color: '#EF4444', letterSpacing: '2px', fontSize: '16px', fontWeight: 'bold', margin: '0 0 12px 0' }}>
        TERJADI KESALAHAN SISTEM KARGO!
      </h2>
      <p style={{ color: '#C7B8EA', fontSize: '11px', lineHeight: '1.6', margin: '0 0 24px 0' }}>
        {error.message || 'Gagal memproses data operasional kargo atau koneksi database terputus.'}
      </p>
      <button
        onClick={() => reset()}
        style={{
          padding: '12px 32px',
          background: 'linear-gradient(90deg, #EF4444 0%, #DC2626 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '11px',
          letterSpacing: '1px',
          boxShadow: '0 0 15px rgba(239, 68, 68, 0.3)',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 0 22px rgba(239, 68, 68, 0.6)'}
        onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 0 15px rgba(239, 68, 68, 0.3)'}
      >
        COBA LAGI
      </button>
    </div>
  )
}
