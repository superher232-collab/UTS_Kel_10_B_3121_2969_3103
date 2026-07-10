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
        throw new Error(data.error || 'An error occurred during registration')
      }

      setSuccess('Registration successful! Redirecting to login...')
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
        background: 'rgba(18, 16, 26, 0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(168, 85, 247, 0.2)',
        borderRadius: '12px',
        padding: '30px 40px',
        width: '95%',
        maxWidth: '480px',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
      }}>
        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '16px',
          letterSpacing: '2px',
          margin: '0 0 8px 0',
          fontWeight: '600',
          background: 'linear-gradient(135deg, #F1F0F5 0%, #A855F7 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>ACCOUNT REGISTRATION</h2>
        <p style={{
          fontFamily: 'var(--font-body)',
          color: '#8B7BA8',
          fontSize: '13px',
          margin: '0 0 24px 0'
        }}>Create a new account to access the platform</p>

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
              color: '#8B7BA8',
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              letterSpacing: '1.5px'
            }}>FULL NAME</label>
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
                placeholder="Enter your full name"
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
              color: '#8B7BA8',
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              letterSpacing: '1.5px'
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
                placeholder="Enter your email"
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
              color: '#8B7BA8',
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              letterSpacing: '1.5px'
            }}>PASSWORD</label>
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
                placeholder="Create a password (min 6 characters)"
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
              color: '#8B7BA8',
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              letterSpacing: '1.5px'
            }}>PHONE NUMBER (OPTIONAL)</label>
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
                placeholder="Enter phone number"
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
              color: '#8B7BA8',
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              letterSpacing: '1.5px'
            }}>ADDRESS (OPTIONAL)</label>
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
                placeholder="Enter your address"
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
              color: '#8B7BA8',
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              letterSpacing: '1.5px'
            }}>REGISTER AS</label>
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
                <option value="CUSTOMER" style={{ background: '#140A24', color: 'white' }}>Customer</option>
                <option value="ADMIN" style={{ background: '#140A24', color: 'white' }}>Admin</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="btn-inner"
            style={{
              width: '100%',
              justifyContent: 'center',
              marginTop: '12px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'REGISTERING...' : 'REGISTER NOW'}
            <span className="icon-wrap">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </button>
        </form>

        <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '13px', color: '#8B7BA8', fontFamily: 'var(--font-body)' }}>
          Already have an account? <a href="/login" style={{ color: '#C084FC', textDecoration: 'none' }}>Login here</a>
        </p>

        {/* Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '30px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 8px #22C55E' }}></div>
          <span style={{ color: '#8B7BA8', fontFamily: 'var(--font-body)', fontSize: '12px' }}>System Status: Online</span>
        </div>
      </div>

      <div style={{ zIndex: 10, marginTop: '24px' }}>
        <p style={{ color: '#8B7BA8', fontFamily: 'var(--font-body)', fontSize: '12px', textAlign: 'center' }}>Secure access required. All activities are monitored.</p>
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
