// src/app/forgot-password/page.tsx
'use client'

import React, { useState } from 'react'
import Image from 'next/image'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Terjadi kesalahan saat meminta reset password')
      }

      setSuccess(data.message || 'Permintaan berhasil! Cek terminal server untuk melihat link reset.')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      background: 'var(--bg-page, #07020E)',
      padding: '40px 20px'
    }}>
      {/* Background orbs */}
      <div className="ambient-orbs" aria-hidden="true">
        <div className="orb orb--1"></div>
        <div className="orb orb--2"></div>
      </div>

      {/* Header / Logo Area */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10, marginBottom: '30px' }}>
        <div style={{
          width: '70px',
          height: '70px',
          background: 'white',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 25px rgba(168, 85, 247, 0.4)',
          marginBottom: '15px'
        }}>
          <Image src="/logo.png" alt="Logo" width={50} height={50} style={{ objectFit: 'contain' }} priority />
        </div>
        <h1 style={{
          fontFamily: 'var(--font-body, monospace)',
          fontSize: '22px',
          color: 'white',
          letterSpacing: '2px',
          margin: '0 0 6px 0',
          fontWeight: '600'
        }}>PRIMELOG</h1>
        <p style={{
          fontFamily: 'var(--font-body, monospace)',
          color: 'var(--purple-logo, #C084FC)',
          fontSize: '12px',
          margin: 0,
          letterSpacing: '1px'
        }}>Fleet Command System v2.0</p>
      </div>

      {/* Card */}
      <div style={{
        background: 'var(--bg-card, rgba(20, 10, 36, 0.7))',
        backdropFilter: 'blur(10px)',
        border: '1px solid var(--border-purple, rgba(168, 85, 247, 0.3))',
        borderRadius: '8px',
        padding: '30px 40px',
        width: '95%',
        maxWidth: '440px',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
      }}>
        <h2 style={{
          color: 'white',
          fontFamily: 'var(--font-body, monospace)',
          fontSize: '16px',
          letterSpacing: '2px',
          margin: '0 0 8px 0',
          fontWeight: '600'
        }}>LUPA KATA SANDI</h2>
        <p style={{
          color: 'var(--text-muted, #8B7BA8)',
          fontFamily: 'var(--font-body, monospace)',
          fontSize: '13px',
          margin: '0 0 24px 0',
          lineHeight: '1.4'
        }}>
          Masukkan alamat email akun Anda. Kami akan mengirimkan tautan untuk menyetel ulang kata sandi Anda.
        </p>

        {error && (
          <div style={{
            color: '#EF4444',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '4px',
            padding: '10px',
            fontSize: '12px',
            fontFamily: 'var(--font-body, monospace)',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            color: '#22C55E',
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: '4px',
            padding: '10px',
            fontSize: '12px',
            fontFamily: 'var(--font-body, monospace)',
            marginBottom: '20px',
            textAlign: 'center',
            lineHeight: '1.4'
          }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{
              color: 'white',
              fontFamily: 'var(--font-body, monospace)',
              fontSize: '11px',
              letterSpacing: '1px'
            }}>EMAIL AKUN</label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(0,0,0,0.4)',
              border: '1px solid var(--border-purple, rgba(168, 85, 247, 0.2))',
              borderRadius: '4px',
              padding: '10px 14px',
              gap: '10px'
            }}>
              <input 
                type="email" 
                placeholder="Masukkan email terdaftar"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'white',
                  fontFamily: 'var(--font-body, monospace)',
                  fontSize: '13px',
                  width: '100%'
                }}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            style={{
              width: '100%',
              padding: '14px',
              background: loading 
                ? 'rgba(168, 85, 247, 0.5)' 
                : 'linear-gradient(90deg, #A855F7 0%, #9249F2 50%, #7C3AED 100%)',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              fontFamily: 'var(--font-body, monospace)',
              fontWeight: '500',
              fontSize: '14px',
              cursor: loading ? 'not-allowed' : 'pointer',
              textAlign: 'center',
              letterSpacing: '1px',
              marginTop: '12px',
              boxShadow: '0 4px 15px rgba(168, 85, 247, 0.3)',
              transition: 'all 0.3s ease',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'MEMPROSES...' : 'KIRIM LINK RESET'}
          </button>
        </form>

        <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '13px', color: '#8B7BA8', fontFamily: 'var(--font-body, monospace)' }}>
          Kembali ke halaman <a href="/login" style={{ color: 'var(--purple-logo, #C084FC)', textDecoration: 'none' }}>Login</a>
        </p>

        {/* System Online Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '30px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--green, #22C55E)', boxShadow: '0 0 8px var(--green, #22C55E)' }}></div>
          <span style={{ color: 'var(--text-muted, #8B7BA8)', fontFamily: 'var(--font-body, monospace)', fontSize: '12px' }}>Akses Terenkripsi Aktif</span>
        </div>
      </div>

      <div style={{ zIndex: 10, marginTop: '24px' }}>
        <p style={{ color: 'var(--text-muted, #8B7BA8)', fontFamily: 'var(--font-body, monospace)', fontSize: '12px', textAlign: 'center' }}>
          Semua aktivitas sistem dipantau demi keamanan.
        </p>
      </div>

      <style>{`
        input:focus-visible, select:focus-visible {
          outline: 2px solid #A855F7 !important;
          outline-offset: 2px !important;
          box-shadow: 0 0 12px rgba(168, 85, 247, 0.3) !important;
        }
        button:focus-visible {
          outline: 2px solid #A855F7;
          outline-offset: 2px;
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { transition: none !important; }
        }
      `}</style>
    </div>
  )
}
