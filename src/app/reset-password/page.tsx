// src/app/reset-password/page.tsx
'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!token) {
      setError('Token reset password tidak ditemukan di URL. Silakan minta tautan baru.')
    }
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) {
      setError('Token tidak valid.')
      return
    }

    if (password.length < 6) {
      setError('Password minimal harus 6 karakter.')
      return
    }

    if (password !== confirmPassword) {
      setError('Konfirmasi password tidak cocok.')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, password })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Terjadi kesalahan saat mereset password')
      }

      setSuccess('Password berhasil diubah! Mengarahkan Anda ke halaman login...')
      setTimeout(() => {
        router.push('/login')
      }, 3000)
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
        }}>SETEL ULANG SANDI</h2>
        <p style={{
          color: 'var(--text-muted, #8B7BA8)',
          fontFamily: 'var(--font-body, monospace)',
          fontSize: '13px',
          margin: '0 0 24px 0'
        }}>Silakan masukkan kata sandi baru untuk akun Anda</p>

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
            textAlign: 'center',
            lineHeight: '1.4'
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
            textAlign: 'center'
          }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Password */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{
              color: 'white',
              fontFamily: 'var(--font-body, monospace)',
              fontSize: '11px',
              letterSpacing: '1px'
            }}>PASSWORD BARU</label>
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
                type="password" 
                placeholder="Minimal 6 karakter"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                disabled={!token}
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

          {/* Confirm Password */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{
              color: 'white',
              fontFamily: 'var(--font-body, monospace)',
              fontSize: '11px',
              letterSpacing: '1px'
            }}>KONFIRMASI PASSWORD</label>
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
                type="password" 
                placeholder="Ulangi password baru"
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
                disabled={!token}
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
            disabled={loading || !token} 
            style={{
              width: '100%',
              padding: '14px',
              background: (loading || !token)
                ? 'rgba(168, 85, 247, 0.5)' 
                : 'linear-gradient(90deg, #A855F7 0%, #9249F2 50%, #7C3AED 100%)',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              fontFamily: 'var(--font-body, monospace)',
              fontWeight: '500',
              fontSize: '14px',
              cursor: (loading || !token) ? 'not-allowed' : 'pointer',
              textAlign: 'center',
              letterSpacing: '1px',
              marginTop: '12px',
              boxShadow: '0 4px 15px rgba(168, 85, 247, 0.3)',
              transition: 'all 0.3s ease',
              opacity: (loading || !token) ? 0.7 : 1
            }}
          >
            {loading ? 'MENYIMPAN...' : 'SIMPAN PASSWORD BARU'}
          </button>
        </form>

        <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '13px', color: '#8B7BA8', fontFamily: 'var(--font-body, monospace)' }}>
          Kembali ke halaman <a href="/login" style={{ color: 'var(--purple-logo, #C084FC)', textDecoration: 'none' }}>Login</a>
        </p>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#07020E', color: 'white', fontFamily: 'monospace' }}>
        Memuat Halaman Reset Password...
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}
