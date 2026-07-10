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
      setErrorMsg('Email and password cannot be empty.');
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
        setErrorMsg('Invalid credentials. Please try again.');
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
      setErrorMsg('A system connection error occurred.');
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
        background: 'rgba(18, 16, 26, 0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(168, 85, 247, 0.2)',
        borderRadius: '12px',
        padding: '40px',
        width: '90%',
        maxWidth: '440px',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
      }}>
        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '18px',
          letterSpacing: '1px',
          margin: '0 0 10px 0',
          fontWeight: '600',
          background: 'linear-gradient(135deg, #F1F0F5 0%, #A855F7 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>SYSTEM ACCESS</h2>
        <p style={{
          fontFamily: 'var(--font-body)',
          color: '#8B7BA8',
          fontSize: '14px',
          margin: '0 0 30px 0'
        }}>Enter your credentials to continue</p>

        <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} onSubmit={(e) => e.preventDefault()}>
          {/* Role Selection */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{
              color: '#8B7BA8',
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              fontWeight: 500
            }}>ROLE</label>
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
                <option value="customer" style={{ background: '#12101A', color: '#F1F0F5' }}>Customer</option>
              </select>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9B99A8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ pointerEvents: 'none' }}>
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>

          {/* Username */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{
              color: '#8B7BA8',
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              fontWeight: 500
            }}>{role === 'admin' ? 'ADMIN EMAIL' : 'USER EMAIL'}</label>
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
                placeholder={role === 'admin' ? 'Enter admin email' : 'Enter user email'} 
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
              color: '#8B7BA8',
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              fontWeight: 500
            }}>PASSWORD</label>
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
                placeholder="Enter your password" 
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
              <span style={{ color: '#8B7BA8', fontFamily: 'var(--font-body)', fontSize: '13px' }}>Remember me</span>
            </label>
            <Link href="/forgot-password" style={{ color: '#C084FC', fontFamily: 'var(--font-body)', fontSize: '13px', textDecoration: 'none' }}>Forgot password?</Link>
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
          <button type="button" onClick={handleLogin} disabled={loading} className="btn-inner" style={{
            justifyContent: 'center',
            width: '100%',
            marginTop: '10px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.background = 'linear-gradient(135deg, #A855F7 0%, #9249F2 100%)';
              e.currentTarget.style.boxShadow = '0 0 40px rgba(168,85,247,0.5)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.currentTarget.style.background = 'linear-gradient(135deg, #A855F7 0%, #7C3AED 100%)';
              e.currentTarget.style.boxShadow = '0 0 24px rgba(168,85,247,0.25)';
            }
          }}
          >
            {loading ? 'VERIFYING...' : 'ACCESS SYSTEM'}
            <span className="icon-wrap">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </button>
        </form>

        <p style={{ marginTop: '20px', marginBottom: '10px', textAlign: 'center', fontSize: '13px', color: '#8B7BA8', fontFamily: 'var(--font-body)' }}>
          Don't have an account? <Link href="/register" style={{ color: '#C084FC', textDecoration: 'none' }}>Register here</Link>
        </p>

        {/* Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '40px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 8px #22C55E' }}></div>
          <span style={{ color: '#8B7BA8', fontFamily: 'var(--font-body)', fontSize: '12px' }}>System Status: Online</span>
        </div>
      </div>

      <div style={{ zIndex: 10, marginTop: '30px' }}>
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
  );
}
