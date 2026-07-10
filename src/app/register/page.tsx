'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CUSTOMER',
    phone: '',
    address: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Terjadi kesalahan saat registrasi')
      }

      setSuccess('Pendaftaran berhasil! Mengarahkan ke halaman login...')
      setTimeout(() => {
        router.push('/login')
      }, 2000)
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

      {/* Register Card */}
      <div style={{
        background: 'var(--bg-card, rgba(20, 10, 36, 0.7))',
        backdropFilter: 'blur(10px)',
        border: '1px solid var(--border-purple, rgba(168, 85, 247, 0.3))',
        borderRadius: '8px',
        padding: '30px 40px',
        width: '95%',
        maxWidth: '480px',
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
        }}>PENDAFTARAN AKUN</h2>
        <p style={{
          color: 'var(--text-muted, #8B7BA8)',
          fontFamily: 'var(--font-body, monospace)',
          fontSize: '13px',
          margin: '0 0 24px 0'
        }}>Silakan buat akun baru untuk mengakses platform</p>

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
            textAlign: 'center'
          }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Full Name */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{
              color: 'white',
              fontFamily: 'var(--font-body, monospace)',
              fontSize: '11px',
              letterSpacing: '1px'
            }}>NAMA LENGKAP</label>
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
                type="text" 
                name="name" 
                placeholder="Masukkan nama lengkap Anda"
                value={formData.name} 
                onChange={handleChange} 
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

          {/* Email */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{
              color: 'white',
              fontFamily: 'var(--font-body, monospace)',
              fontSize: '11px',
              letterSpacing: '1px'
            }}>EMAIL</label>
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
                name="email" 
                placeholder="Masukkan email Anda"
                value={formData.email} 
                onChange={handleChange} 
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

          {/* Password */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{
              color: 'white',
              fontFamily: 'var(--font-body, monospace)',
              fontSize: '11px',
              letterSpacing: '1px'
            }}>KATA SANDI</label>
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
                name="password" 
                placeholder="Buat kata sandi minimal 6 karakter"
                value={formData.password} 
                onChange={handleChange} 
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

          {/* Phone (Additional field) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{
              color: 'white',
              fontFamily: 'var(--font-body, monospace)',
              fontSize: '11px',
              letterSpacing: '1px'
            }}>NOMOR TELEPON (OPSIONAL)</label>
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
                type="text" 
                name="phone" 
                placeholder="Masukkan nomor telepon"
                value={formData.phone} 
                onChange={handleChange} 
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

          {/* Address (Additional field) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{
              color: 'white',
              fontFamily: 'var(--font-body, monospace)',
              fontSize: '11px',
              letterSpacing: '1px'
            }}>ALAMAT (OPSIONAL)</label>
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
                type="text" 
                name="address" 
                placeholder="Masukkan alamat lengkap"
                value={formData.address} 
                onChange={handleChange} 
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

          {/* Role */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{
              color: 'white',
              fontFamily: 'var(--font-body, monospace)',
              fontSize: '11px',
              letterSpacing: '1px'
            }}>DAFTAR SEBAGAI</label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(0,0,0,0.4)',
              border: '1px solid var(--border-purple, rgba(168, 85, 247, 0.2))',
              borderRadius: '4px',
              padding: '10px 14px',
              gap: '10px'
            }}>
              <select 
                name="role" 
                value={formData.role} 
                onChange={handleChange} 
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'white',
                  fontFamily: 'var(--font-body, monospace)',
                  fontSize: '13px',
                  width: '100%',
                  cursor: 'pointer'
                }}
              >
                <option value="CUSTOMER" style={{ background: '#140A24', color: 'white' }}>Customer (Pelanggan)</option>
                <option value="ADMIN" style={{ background: '#140A24', color: 'white' }}>Admin</option>
              </select>
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
            {loading ? 'MENDAFTARKAN...' : 'DAFTAR SEKARANG'}
          </button>
        </form>

        <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '13px', color: '#8B7BA8', fontFamily: 'var(--font-body, monospace)' }}>
          Sudah punya akun? <a href="/login" style={{ color: 'var(--purple-logo, #C084FC)', textDecoration: 'none' }}>Login di sini</a>
        </p>

        {/* Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '30px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--green, #22C55E)', boxShadow: '0 0 8px var(--green, #22C55E)' }}></div>
          <span style={{ color: 'var(--text-muted, #8B7BA8)', fontFamily: 'var(--font-body, monospace)', fontSize: '12px' }}>Status Sistem: Online</span>
        </div>
      </div>

      <div style={{ zIndex: 10, marginTop: '24px' }}>
        <p style={{ color: 'var(--text-muted, #8B7BA8)', fontFamily: 'var(--font-body, monospace)', fontSize: '12px', textAlign: 'center' }}>Akses aman diperlukan. Semua aktivitas dipantau.</p>
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
