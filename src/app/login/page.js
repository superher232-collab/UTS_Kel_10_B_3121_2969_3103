"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

export default function Login() {
  const [role, setRole] = React.useState('admin');
  const [email, setEmail] = React.useState('admin@primelog.com');
  const [password, setPassword] = React.useState('admin123');
  const [errorMsg, setErrorMsg] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    
    // Frontend validation
    if (!email) {
      setErrorMsg('Email wajib diisi.');
      setLoading(false);
      return;
    }
    if (!email.includes('@')) {
      setErrorMsg('Email harus mengandung karakter "@"');
      setLoading(false);
      return;
    }
    if (!password) {
      setErrorMsg('Kata sandi wajib diisi.');
      setLoading(false);
      return;
    }

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      });

      if (result?.error) {
        setErrorMsg('Kredensial salah. Silakan coba lagi.');
      } else {
        localStorage.setItem('role', email === 'admin@primelog.com' ? 'Admin' : 'User');
        localStorage.setItem('username', email.split('@')[0]);
        // Redirection check: Admin -> /admin/cargo, User -> /dashboard
        window.location.href = email === 'admin@primelog.com' ? '/dashboard/cargo' : '/dashboard';
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
      background: 'var(--bg-page)'
    }}>
      {/* Background orbs */}
      <div className="ambient-orbs" aria-hidden="true">
        <div className="orb orb--1"></div>
        <div className="orb orb--2"></div>
      </div>

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
          boxShadow: '0 0 30px rgba(168, 85, 247, 0.4)',
          marginBottom: '20px'
        }}>
          <Image src="/logo.png" alt="Logo" width={60} height={60} style={{ objectFit: 'contain' }} priority />
        </div>
        <h1 style={{
          fontFamily: 'var(--font-body)',
          fontSize: '24px',
          color: 'white',
          letterSpacing: '2px',
          margin: '0 0 8px 0',
          fontWeight: '600'
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
        background: 'var(--bg-card, rgba(20, 10, 36, 0.7))',
        backdropFilter: 'blur(10px)',
        border: '1px solid var(--border-purple, rgba(168, 85, 247, 0.3))',
        borderRadius: '8px',
        padding: '40px',
        width: '90%',
        maxWidth: '440px',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
      }}>
        <h2 style={{
          color: 'white',
          fontFamily: 'var(--font-body)',
          fontSize: '18px',
          letterSpacing: '2px',
          margin: '0 0 10px 0',
          fontWeight: '600'
        }}>AKSES SISTEM</h2>
        <p style={{
          color: 'var(--text-muted, #8B7BA8)',
          fontFamily: 'var(--font-body)',
          fontSize: '14px',
          margin: '0 0 30px 0'
        }}>Masukkan kredensial Anda untuk melanjutkan</p>

        <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} onSubmit={(e) => e.preventDefault()}>
          {/* Role Selection */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{
              color: 'var(--text-white, white)',
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              letterSpacing: '1px'
            }}>PERAN</label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(0,0,0,0.4)',
              border: '1px solid var(--border-purple, rgba(168, 85, 247, 0.2))',
              borderRadius: '4px',
              padding: '12px 16px',
              gap: '12px',
              transition: 'border-color 0.3s ease'
            }}
            onFocus={(e) => e.currentTarget.style.border = '1px solid #A855F7'}
            onBlur={(e) => e.currentTarget.style.border = '1px solid var(--border-purple, rgba(168, 85, 247, 0.2))'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted, #8B7BA8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <select id="roleSelect"
                value={role}
                onChange={(e) => {
                  const selectedRole = e.target.value;
                  setRole(selectedRole);
                  if (selectedRole === 'admin') {
                    setEmail('admin@primelog.com');
                    setPassword('admin123');
                  } else {
                    setEmail('customer@primelog.com');
                    setPassword('customer123');
                  }
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
                <option value="admin" style={{ background: '#140A24', color: 'white' }}>Administrator</option>
                <option value="user" style={{ background: '#140A24', color: 'white' }}>Pengguna</option>
              </select>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted, #8B7BA8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ pointerEvents: 'none' }}>
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>

          {/* Username */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{
              color: 'var(--text-white, white)',
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              letterSpacing: '1px'
            }}>{role === 'admin' ? 'EMAIL ADMINISTRATOR' : 'EMAIL PENGGUNA'}</label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(0,0,0,0.4)',
              border: '1px solid var(--border-purple, rgba(168, 85, 247, 0.2))',
              borderRadius: '4px',
              padding: '12px 16px',
              gap: '12px',
              transition: 'border-color 0.3s ease'
            }}
            onFocus={(e) => e.currentTarget.style.border = '1px solid #A855F7'}
            onBlur={(e) => e.currentTarget.style.border = '1px solid var(--border-purple, rgba(168, 85, 247, 0.2))'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted, #8B7BA8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
              color: 'var(--text-white, white)',
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              letterSpacing: '1px'
            }}>KATA SANDI</label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(0,0,0,0.4)',
              border: '1px solid var(--border-purple, rgba(168, 85, 247, 0.2))',
              borderRadius: '4px',
              padding: '12px 16px',
              gap: '12px',
              transition: 'border-color 0.3s ease'
            }}
            onFocus={(e) => e.currentTarget.style.border = '1px solid #A855F7'}
            onBlur={(e) => e.currentTarget.style.border = '1px solid var(--border-purple, rgba(168, 85, 247, 0.2))'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted, #8B7BA8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid var(--text-muted, #8B7BA8)',
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
                    e.target.parentElement.style.background = '#A855F7';
                    e.target.parentElement.style.borderColor = '#A855F7';
                  } else {
                    checkmark.style.opacity = '0';
                    e.target.parentElement.style.background = 'rgba(0,0,0,0.4)';
                    e.target.parentElement.style.borderColor = 'var(--text-muted, #8B7BA8)';
                  }
                }}
                />
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0, pointerEvents: 'none', transition: 'opacity 0.2s' }}>
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span style={{ color: 'var(--text-light, #C7B8EA)', fontFamily: 'var(--font-body)', fontSize: '13px' }}>Ingat saya</span>
            </label>
            <a href="#" style={{ color: 'var(--purple-logo, #C084FC)', fontFamily: 'var(--font-body)', fontSize: '13px', textDecoration: 'none' }}>Lupa kata sandi?</a>
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
              ? 'rgba(168, 85, 247, 0.5)' 
              : 'linear-gradient(90deg, #A855F7 0%, #9249F2 50%, #7C3AED 100%)',
            border: 'none',
            borderRadius: '4px',
            color: 'white',
            fontFamily: 'var(--font-body)',
            fontWeight: '500',
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
            boxShadow: '0 4px 15px rgba(168, 85, 247, 0.3)',
            transition: 'all 0.3s ease',
            opacity: loading ? 0.7 : 1
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(168, 85, 247, 0.6)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(168, 85, 247, 0.3)';
              e.currentTarget.style.transform = 'translateY(0)';
            }
          }}
          >
            {loading ? 'MEMVERIFIKASI...' : 'AKSES SISTEM'}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ width: '16px', height: '16px' }}>
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </button>
        </form>

        {/* Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '40px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--green, #22C55E)', boxShadow: '0 0 8px var(--green, #22C55E)' }}></div>
          <span style={{ color: 'var(--text-muted, #8B7BA8)', fontFamily: 'var(--font-body)', fontSize: '12px' }}>Status Sistem: Online</span>
        </div>
      </div>

      <div style={{ zIndex: 10, marginTop: '30px' }}>
        <p style={{ color: 'var(--text-muted, #8B7BA8)', fontFamily: 'var(--font-body)', fontSize: '12px', textAlign: 'center' }}>Akses aman diperlukan. Semua aktivitas dipantau.</p>
      </div>
    </div>
  );
}
