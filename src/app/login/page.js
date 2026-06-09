"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

export default function Login() {
  const [role, setRole] = React.useState('admin');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errorMsg, setErrorMsg] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    
    // No bypass mode. Require actual input
    const finalEmail = email.trim();
    const finalPassword = password;

    if (!finalEmail || !finalPassword) {
      setErrorMsg('Email dan Password tidak boleh kosong.');
      setLoading(false);
      return;
    }

    try {
      const result = await signIn('credentials', {
        email: finalEmail,
        password: finalPassword,
        redirect: false
      });

      if (result?.error) {
        setErrorMsg('Kredensial salah. Silakan coba lagi.');
      } else {
        localStorage.setItem('role', finalEmail.includes('admin') 
          ? 'Admin' 
          : 'Customer');
        localStorage.setItem('username', finalEmail.split('@')[0]);
        // Redirection check: Admin -> /admin, User -> /dashboard
        window.location.href = finalEmail.includes('admin') ? '/admin' : '/dashboard';
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Terjadi kesalahan koneksi sistem.');
    } finally {
      setLoading(false);
    }
  };

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
      background: '#0D0B14'
    }}>

      {/* Header / Logo Area */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10, marginBottom: '40px' }}>
        <div style={{
          width: '80px',
          height: '80px',
          background: 'white',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px'
        }}>
          <Image src="/logo.png" alt="Logo" width={60} height={60} style={{ objectFit: 'contain' }} priority />
        </div>
        <h1 style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: '24px',
          color: '#F1F0F5',
          letterSpacing: '2px',
          margin: '0 0 8px 0',
          fontWeight: '700'
        }}>PRIMELOG</h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          color: 'var(--purple-logo, #C084FC)',
          fontSize: '14px',
          margin: 0,
          letterSpacing: '1px'
        }}>Fleet Command System v2.0</p>
      </div>

      {/* Login Card */}
      <div style={{
        background: '#12101A',
        border: '1px solid #2A2740',
        borderRadius: '8px',
        padding: '40px',
        width: '90%',
        maxWidth: '440px',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <h2 style={{
          color: '#F1F0F5',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: '18px',
          letterSpacing: '1px',
          margin: '0 0 10px 0',
          fontWeight: '600'
        }}>AKSES SISTEM</h2>
        <p style={{
          color: '#9B99A8',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: '14px',
          margin: '0 0 30px 0'
        }}>Masukkan kredensial Anda untuk melanjutkan</p>

        <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} onSubmit={(e) => e.preventDefault()}>
          {/* Role Selection */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{
              color: '#9B99A8',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: '12px',
              letterSpacing: '1px',
              fontWeight: 500
            }}>PERAN</label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: '#1A1825',
              border: '1px solid #3D3A52',
              borderRadius: '4px',
              padding: '12px 16px',
              gap: '12px',
              transition: 'all 0.3s ease'
            }}
            onFocus={(e) => {
              e.currentTarget.style.border = '1px solid #7C3AED';
              e.currentTarget.style.boxShadow = '0 0 5px rgba(124, 58, 237, 0.3)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.border = '1px solid #3D3A52';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9B99A8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <select id="roleSelect"
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                  setEmail('');
                  setPassword('');
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'white',
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  width: '100%',
                  appearance: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="admin" style={{ background: '#12101A', color: '#F1F0F5' }}>Administrator</option>
                <option value="customer" style={{ background: '#12101A', color: '#F1F0F5' }}>Customer (Pelanggan)</option>
              </select>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9B99A8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ pointerEvents: 'none' }}>
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>

          {/* Username */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{
              color: '#9B99A8',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: '12px',
              letterSpacing: '1px',
              fontWeight: 500
            }}>{role === 'admin' ? 'EMAIL ADMINISTRATOR' : 'EMAIL PENGGUNA'}</label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: '#1A1825',
              border: '1px solid #3D3A52',
              borderRadius: '4px',
              padding: '12px 16px',
              gap: '12px',
              transition: 'all 0.3s ease'
            }}
            onFocus={(e) => {
              e.currentTarget.style.border = '1px solid #7C3AED';
              e.currentTarget.style.boxShadow = '0 0 5px rgba(124, 58, 237, 0.3)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.border = '1px solid #3D3A52';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9B99A8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <input 
                id="usernameInput"
                type="email" 
                placeholder={role === 'admin' ? 'Masukkan email admin' : 'Masukkan email pengguna'} 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'white',
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  width: '100%'
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{
              color: '#9B99A8',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: '12px',
              letterSpacing: '1px',
              fontWeight: 500
            }}>KATA SANDI</label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: '#1A1825',
              border: '1px solid #3D3A52',
              borderRadius: '4px',
              padding: '12px 16px',
              gap: '12px',
              transition: 'all 0.3s ease'
            }}
            onFocus={(e) => {
              e.currentTarget.style.border = '1px solid #7C3AED';
              e.currentTarget.style.boxShadow = '0 0 5px rgba(124, 58, 237, 0.3)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.border = '1px solid #3D3A52';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9B99A8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <input 
                type="password" 
                placeholder="Masukkan kata sandi" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'white',
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  width: '100%'
                }}
              />
            </div>
          </div>

          {/* Options */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <div style={{
                width: '16px',
                height: '16px',
                background: '#1A1825',
                border: '1px solid #3D3A52',
                borderRadius: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                <input type="checkbox" style={{
                  position: 'absolute',
                  opacity: 0,
                  cursor: 'pointer',
                  width: '100%',
                  height: '100%',
                  margin: 0
                }}
                onChange={(e) => {
                  const checkmark = e.target.nextElementSibling;
                  if (e.target.checked) {
                    checkmark.style.opacity = '1';
                    e.target.parentElement.style.background = '#7C3AED';
                    e.target.parentElement.style.borderColor = '#7C3AED';
                  } else {
                    checkmark.style.opacity = '0';
                    e.target.parentElement.style.background = '#1A1825';
                    e.target.parentElement.style.borderColor = '#3D3A52';
                  }
                }}
                />
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0, pointerEvents: 'none', transition: 'opacity 0.2s' }}>
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span style={{ color: '#9B99A8', fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '13px' }}>Ingat saya</span>
            </label>
            <Link href="/forgot-password" style={{ color: '#7C3AED', fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '13px', textDecoration: 'none' }}>Lupa kata sandi?</Link>
          </div>

          {errorMsg && (
            <div style={{
              color: '#EF4444',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '4px',
              padding: '10px',
              fontSize: '12px',
              fontFamily: 'var(--font-body)',
              marginTop: '10px',
              textAlign: 'center'
            }}>
              {errorMsg}
            </div>
          )}

          {/* Submit Button */}
          <button type="button" onClick={handleLogin} disabled={loading} style={{
            background: loading 
              ? 'rgba(124, 58, 237, 0.5)' 
              : '#7C3AED',
            border: 'none',
            borderRadius: '4px',
            color: 'white',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontWeight: '600',
            fontSize: '14px',
            padding: '14px',
            cursor: loading ? 'not-allowed' : 'pointer',
            textAlign: 'center',
            textDecoration: 'none',
            marginTop: '10px',
            letterSpacing: '1px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease',
            opacity: loading ? 0.7 : 1
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.background = '#A855F7';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.currentTarget.style.background = '#7C3AED';
            }
          }}
          >
            {loading ? 'MEMVERIFIKASI...' : 'AKSES SISTEM'}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ width: '16px', height: '16px' }}>
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </button>
        </form>

        <p style={{ marginTop: '20px', marginBottom: '10px', textAlign: 'center', fontSize: '13px', color: '#9B99A8', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          Belum punya akun? <Link href="/register" style={{ color: '#7C3AED', textDecoration: 'none' }}>Daftar di sini</Link>
        </p>

        {/* Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '40px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }}></div>
          <span style={{ color: '#9B99A8', fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '12px' }}>Status Sistem: Online</span>
        </div>
      </div>

      <div style={{ zIndex: 10, marginTop: '30px' }}>
        <p style={{ color: '#9B99A8', fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '12px', textAlign: 'center' }}>Akses aman diperlukan. Semua aktivitas dipantau.</p>
      </div>
    </div>
  );
}
