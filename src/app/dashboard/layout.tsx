"use client";
import React, { useState, ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DashboardProvider } from '@/context/DashboardContext';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();

  return (
    <DashboardProvider>
      <div style={{
        width: '100%',
        minHeight: '100vh',
        background: 'var(--bg-page, #0A0414)',
        color: 'white',
        fontFamily: 'var(--font-body, monospace)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Top Navigation Bar */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          padding: '16px 24px',
          borderBottom: '1px solid var(--border-purple, rgba(168, 85, 247, 0.3))',
          background: 'rgba(10, 4, 20, 0.95)',
          position: 'sticky',
          top: 0,
          zIndex: 50
        }}>
          {/* Left: Logo & Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'white',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Image src="/logo.png" alt="Logo" width={32} height={32} style={{ objectFit: 'contain' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '16px', fontWeight: 'bold', letterSpacing: '1px' }}>KOMANDO SIWeb</span>
              <span style={{ fontSize: '10px', color: 'var(--text-muted, #8B7BA8)' }}>Monitoring Armada Dunia v2.0</span>
            </div>
          </div>

          {/* Center: Main Menu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* DASHBOARD with Dropdown */}
            <div 
              style={{ position: 'relative' }} 
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <div style={{
                background: pathname === '/dashboard' || pathname.startsWith('/dashboard/') ? 'linear-gradient(90deg, #A855F7 0%, #9249F2 50%, #7C3AED 100%)' : 'transparent',
                padding: '8px 16px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold',
                letterSpacing: '1px',
                boxShadow: pathname === '/dashboard' || pathname.startsWith('/dashboard/') ? '0 0 15px rgba(168, 85, 247, 0.4)' : 'none'
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                DASHBOARD
              </div>
              
              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  width: '200px',
                  background: 'rgba(20, 10, 36, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid var(--border-purple, rgba(168, 85, 247, 0.3))',
                  borderRadius: '4px',
                  padding: '8px 0',
                  display: 'flex',
                  flexDirection: 'column',
                  marginTop: '4px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                  zIndex: 100
                }}>
                  <button onClick={() => window.location.href='/dashboard?filter=semua'} style={{
                    padding: '10px 16px',
                    color: 'var(--text-light, #C7B8EA)',
                    textDecoration: 'none',
                    fontSize: '12px',
                    background: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    borderLeft: '2px solid transparent'
                  }}>Total Armada Aktif</button>
                  <button onClick={() => window.location.href='/dashboard?filter=berlayar'} style={{
                    padding: '10px 16px',
                    color: 'var(--text-light, #C7B8EA)',
                    textDecoration: 'none',
                    fontSize: '12px',
                    background: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    borderLeft: '2px solid transparent',
                    borderTop: '1px solid rgba(255,255,255,0.05)'
                  }}>Sedang Berlayar</button>
                  <button onClick={() => window.location.href='/dashboard?filter=sandar'} style={{
                    padding: '10px 16px',
                    color: 'var(--text-light, #C7B8EA)',
                    textDecoration: 'none',
                    fontSize: '12px',
                    background: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    borderLeft: '2px solid transparent',
                    borderTop: '1px solid rgba(255,255,255,0.05)'
                  }}>Tiba di Tujuan</button>
                </div>
              )}
            </div>

            <Link href="/dashboard/fleet" style={{
              background: pathname === '/dashboard/fleet' || pathname.startsWith('/dashboard/fleet/') ? 'linear-gradient(90deg, #A855F7 0%, #9249F2 50%, #7C3AED 100%)' : 'transparent',
              padding: '8px 16px',
              borderRadius: '4px',
              color: pathname === '/dashboard/fleet' || pathname.startsWith('/dashboard/fleet/') ? 'white' : 'var(--text-muted, #8B7BA8)',
              textDecoration: 'none',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 'bold',
              letterSpacing: '1px',
              boxShadow: pathname === '/dashboard/fleet' || pathname.startsWith('/dashboard/fleet/') ? '0 0 15px rgba(168, 85, 247, 0.4)' : 'none'
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                <line x1="4" y1="22" x2="4" y2="15"></line>
              </svg>
              ARMADA
            </Link>
            <Link href="/dashboard/map" style={{
              background: pathname === '/dashboard/map' || pathname.startsWith('/dashboard/map/') ? 'linear-gradient(90deg, #A855F7 0%, #9249F2 50%, #7C3AED 100%)' : 'transparent',
              padding: '8px 16px',
              borderRadius: '4px',
              color: pathname === '/dashboard/map' || pathname.startsWith('/dashboard/map/') ? 'white' : 'var(--text-muted, #8B7BA8)',
              textDecoration: 'none',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 'bold',
              letterSpacing: '1px',
              boxShadow: pathname === '/dashboard/map' || pathname.startsWith('/dashboard/map/') ? '0 0 15px rgba(168, 85, 247, 0.4)' : 'none'
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
                <line x1="9" y1="3" x2="9" y2="18"></line>
                <line x1="15" y1="6" x2="15" y2="21"></line>
              </svg>
              PETA
            </Link>
            <Link href="/dashboard/analytics" style={{
              background: pathname === '/dashboard/analytics' || pathname.startsWith('/dashboard/analytics/') ? 'linear-gradient(90deg, #A855F7 0%, #9249F2 50%, #7C3AED 100%)' : 'transparent',
              padding: '8px 16px',
              borderRadius: '4px',
              color: pathname === '/dashboard/analytics' || pathname.startsWith('/dashboard/analytics/') ? 'white' : 'var(--text-muted, #8B7BA8)',
              textDecoration: 'none',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 'bold',
              letterSpacing: '1px',
              boxShadow: pathname === '/dashboard/analytics' || pathname.startsWith('/dashboard/analytics/') ? '0 0 15px rgba(168, 85, 247, 0.4)' : 'none'
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
              ANALITIK
            </Link>
          </div>

          {/* Right: Status, Date, Exit */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(20, 10, 36, 0.8)',
              border: '1px solid rgba(168, 85, 247, 0.2)',
              padding: '8px 12px',
              borderRadius: '4px'
            }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 8px #22C55E' }}></div>
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted, #8B7BA8)' }}>SISTEM</span>
                <span style={{ fontSize: '10px', color: 'white', fontWeight: 'bold' }}>ONLINE</span>
              </div>
            </div>
            
            <div style={{ fontSize: '11px', color: 'var(--text-muted, #8B7BA8)', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: '1.4' }}>
              <span>14 Apr 2026,</span>
              <span>16.57</span>
            </div>

            <Link href="/login" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '8px 12px',
              borderRadius: '4px',
              color: 'var(--text-muted, #8B7BA8)',
              textDecoration: 'none',
              fontSize: '11px',
              transition: 'background 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              KELUAR
            </Link>
          </div>
        </nav>

       <main style={{ flex: 1, padding: '24px', width: '100%', boxSizing: 'border-box', overflowX: 'hidden' }}>
  {children}
</main>
      </div>
    </DashboardProvider>
  );
}
