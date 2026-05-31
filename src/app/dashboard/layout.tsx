"use client";
import React, { useState, ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { DashboardProvider, useDashboard } from '@/context/DashboardContext';

function NavigationMenu() {
  const pathname = usePathname();
  const { armada, errorSignal, simulateFailure, setSimulateFailure } = useDashboard();
  
  // Track open megamenu panel
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Stats for menu badges
  const total = armada?.length || 0;
  const moving = armada?.filter((s: any) => s.status?.toLowerCase().includes('perjalanan')).length || 0;
  const inPort = armada?.filter((s: any) => s.status?.toLowerCase().includes('pelabuhan')).length || 0;
  const delayed = armada?.filter((s: any) => s.status?.toLowerCase().includes('terlambat')).length || 0;
  const maint = armada?.filter((s: any) => s.status?.toLowerCase().includes('pemeliharaan')).length || 0;

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '16px',
      padding: '16px 32px',
      borderBottom: '1px solid rgba(168, 85, 247, 0.4)',
      background: 'rgba(10, 4, 20, 0.95)',
      backdropFilter: 'blur(15px)',
      boxShadow: '0 4px 30px rgba(0,0,0,0.8), 0 0 15px rgba(168, 85, 247, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Left: Brand Identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: '42px',
          height: '42px',
          background: 'white',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(168, 85, 247, 0.5)',
          overflow: 'hidden'
        }}>
          <Image src="/logo.png" alt="Logo" width={34} height={34} style={{ objectFit: 'contain' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '16px', fontWeight: 'bold', letterSpacing: '2px', color: 'white', fontFamily: 'var(--font-body)' }}>PRIMELOG</span>
          <span style={{ fontSize: '9px', color: '#C084FC', letterSpacing: '1px', fontWeight: 'bold' }}>FLEET COMMAND SYSTEM v2.0</span>
        </div>
      </div>

      {/* Center: Topbar Megamenu (Hover-activated Dropdowns) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
        
        {/* MENU 1: FLEET COMMAND */}
        <div 
          style={{ position: 'relative' }}
          onMouseEnter={() => setActiveMenu('fleet')}
          onMouseLeave={() => setActiveMenu(null)}
        >
          <div style={{
            background: pathname === '/dashboard' || pathname === '/dashboard/fleet' ? 'rgba(168, 85, 247, 0.15)' : 'transparent',
            border: pathname === '/dashboard' || pathname === '/dashboard/fleet' ? '1px solid rgba(168, 85, 247, 0.5)' : '1px solid transparent',
            padding: '10px 20px',
            borderRadius: '6px',
            color: pathname === '/dashboard' || pathname === '/dashboard/fleet' ? '#C084FC' : '#8B7BA8',
            fontSize: '12px',
            fontWeight: 'bold',
            letterSpacing: '1.5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s ease',
            fontFamily: 'var(--font-body)'
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
              <line x1="4" y1="22" x2="4" y2="15"></line>
            </svg>
            ARMADA COMAND
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ transform: activeMenu === 'fleet' ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>

          {/* MEGAMENU PANEL: FLEET */}
          {activeMenu === 'fleet' && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: '0',
              width: '380px',
              background: 'rgba(20, 10, 36, 0.98)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(168, 85, 247, 0.5)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.8), 0 0 20px rgba(168, 85, 247, 0.2)',
              borderRadius: '8px',
              padding: '20px',
              marginTop: '6px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              zIndex: 200,
              animation: 'menuFadeIn 0.2s ease-out'
            }}>
              <div style={{ gridColumn: '1 / -1', fontSize: '10px', color: '#A855F7', fontWeight: 'bold', borderBottom: '1px solid rgba(168, 85, 247, 0.2)', paddingBottom: '6px', letterSpacing: '1px' }}>
                STATUS ARMADA REAL-TIME
              </div>
              
              <Link href="/dashboard" style={{ textDecoration: 'none' }}>
                <div style={megamenuItemStyle}>
                  <span style={{ fontSize: '11px', color: 'white' }}>Tinjauan Utama</span>
                  <span style={{ fontSize: '9px', color: '#8B7BA8' }}>Dashboard Overview</span>
                </div>
              </Link>
              
              <Link href="/dashboard/fleet" style={{ textDecoration: 'none' }}>
                <div style={megamenuItemStyle}>
                  <span style={{ fontSize: '11px', color: 'white' }}>Semua Kapal ({total})</span>
                  <span style={{ fontSize: '9px', color: '#8B7BA8' }}>Daftar Lengkap</span>
                </div>
              </Link>

              <Link href="/dashboard/fleet?filter=berlayar" style={{ textDecoration: 'none' }}>
                <div style={{ ...megamenuItemStyle, borderLeft: '3px solid #22C55E' }}>
                  <span style={{ fontSize: '11px', color: '#22C55E', fontWeight: 'bold' }}>Berlayar ({moving})</span>
                  <span style={{ fontSize: '9px', color: '#8B7BA8' }}>Sedang En Route</span>
                </div>
              </Link>

              <Link href="/dashboard/fleet?filter=sandar" style={{ textDecoration: 'none' }}>
                <div style={{ ...megamenuItemStyle, borderLeft: '3px solid #3B82F6' }}>
                  <span style={{ fontSize: '11px', color: '#3B82F6', fontWeight: 'bold' }}>Sandar ({inPort})</span>
                  <span style={{ fontSize: '9px', color: '#8B7BA8' }}>Tiba di Pelabuhan</span>
                </div>
              </Link>

              <Link href="/dashboard/fleet?filter=terlambat" style={{ textDecoration: 'none' }}>
                <div style={{ ...megamenuItemStyle, borderLeft: '3px solid #F59E0B' }}>
                  <span style={{ fontSize: '11px', color: '#F59E0B', fontWeight: 'bold' }}>Terlambat ({delayed})</span>
                  <span style={{ fontSize: '9px', color: '#8B7BA8' }}>Hambatan Cuaca</span>
                </div>
              </Link>

              <Link href="/dashboard/fleet?filter=pemeliharaan" style={{ textDecoration: 'none' }}>
                <div style={{ ...megamenuItemStyle, borderLeft: '3px solid #EF4444' }}>
                  <span style={{ fontSize: '11px', color: '#EF4444', fontWeight: 'bold' }}>Perawatan ({maint})</span>
                  <span style={{ fontSize: '9px', color: '#8B7BA8' }}>Dok Galangan</span>
                </div>
              </Link>

              {/* CARGO MANAGEMENT SEPARATOR */}
              <div style={{ gridColumn: '1 / -1', fontSize: '10px', color: '#06B6D4', fontWeight: 'bold', borderBottom: '1px solid rgba(6, 182, 212, 0.2)', borderTop: '1px solid rgba(168, 85, 247, 0.15)', paddingBottom: '6px', paddingTop: '10px', marginTop: '4px', letterSpacing: '1px' }}>
                MANAJEMEN KARGO
              </div>

              <Link href="/dashboard/cargo" style={{ textDecoration: 'none', gridColumn: '1 / -1' }}>
                <div style={{ ...megamenuItemStyle, borderLeft: '3px solid #06B6D4', flexDirection: 'row', gap: '10px', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px' }}>📦</span>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '11px', color: '#06B6D4', fontWeight: 'bold' }}>Pusat Kontrol Cargo</span>
                    <span style={{ fontSize: '9px', color: '#8B7BA8' }}>CRUD Prisma · Server Actions · Tracking</span>
                  </div>
                </div>
              </Link>
            </div>
          )}
        </div>

        {/* MENU 2: CYBER MAP */}
        <div 
          style={{ position: 'relative' }}
          onMouseEnter={() => setActiveMenu('map')}
          onMouseLeave={() => setActiveMenu(null)}
        >
          <div style={{
            background: pathname === '/dashboard/map' ? 'rgba(168, 85, 247, 0.15)' : 'transparent',
            border: pathname === '/dashboard/map' ? '1px solid rgba(168, 85, 247, 0.5)' : '1px solid transparent',
            padding: '10px 20px',
            borderRadius: '6px',
            color: pathname === '/dashboard/map' ? '#C084FC' : '#8B7BA8',
            fontSize: '12px',
            fontWeight: 'bold',
            letterSpacing: '1.5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s ease',
            fontFamily: 'var(--font-body)'
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
              <line x1="9" y1="3" x2="9" y2="18"></line>
              <line x1="15" y1="6" x2="15" y2="21"></line>
            </svg>
            MAP COMMAND
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ transform: activeMenu === 'map' ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>

          {/* MEGAMENU PANEL: MAP */}
          {activeMenu === 'map' && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: '-80px',
              width: '320px',
              background: 'rgba(20, 10, 36, 0.98)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(168, 85, 247, 0.5)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.8), 0 0 20px rgba(168, 85, 247, 0.2)',
              borderRadius: '8px',
              padding: '20px',
              marginTop: '6px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              zIndex: 200,
              animation: 'menuFadeIn 0.2s ease-out'
            }}>
              <div style={{ fontSize: '10px', color: '#A855F7', fontWeight: 'bold', borderBottom: '1px solid rgba(168, 85, 247, 0.2)', paddingBottom: '6px', letterSpacing: '1px' }}>
                NAVIGASI PETA GLOBAL
              </div>
              <Link href="/dashboard/map" style={{ textDecoration: 'none' }}>
                <div style={megamenuItemStyle}>
                  <span style={{ fontSize: '11px', color: 'white', fontWeight: 'bold' }}>Peta Cyber Live</span>
                  <span style={{ fontSize: '9px', color: '#8B7BA8' }}>Visualisasi SVG interaktif perairan Indonesia</span>
                </div>
              </Link>
              <div style={{ padding: '8px', background: 'rgba(168, 85, 247, 0.05)', borderRadius: '4px', border: '1px solid rgba(168, 85, 247, 0.1)' }}>
                <span style={{ fontSize: '9px', color: '#C7B8EA', display: 'block', marginBottom: '4px' }}>Pelabuhan Strategis Utama:</span>
                <span style={{ fontSize: '9px', color: '#8B7BA8', lineHeight: '1.4', display: 'block' }}>
                  Belawan • Batam • Merak • Tj. Priok • Tj. Emas • Tj. Perak • Makassar • Sorong
                </span>
              </div>
            </div>
          )}
        </div>

        {/* MENU 3: ANALYTICS */}
        <div 
          style={{ position: 'relative' }}
          onMouseEnter={() => setActiveMenu('analytics')}
          onMouseLeave={() => setActiveMenu(null)}
        >
          <div style={{
            background: pathname === '/dashboard/analytics' ? 'rgba(168, 85, 247, 0.15)' : 'transparent',
            border: pathname === '/dashboard/analytics' ? '1px solid rgba(168, 85, 247, 0.5)' : '1px solid transparent',
            padding: '10px 20px',
            borderRadius: '6px',
            color: pathname === '/dashboard/analytics' ? '#C084FC' : '#8B7BA8',
            fontSize: '12px',
            fontWeight: 'bold',
            letterSpacing: '1.5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s ease',
            fontFamily: 'var(--font-body)'
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
            ANALYTICS COMMAND
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ transform: activeMenu === 'analytics' ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>

          {/* MEGAMENU PANEL: ANALYTICS */}
          {activeMenu === 'analytics' && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: '-80px',
              width: '320px',
              background: 'rgba(20, 10, 36, 0.98)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(168, 85, 247, 0.5)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.8), 0 0 20px rgba(168, 85, 247, 0.2)',
              borderRadius: '8px',
              padding: '20px',
              marginTop: '6px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              zIndex: 200,
              animation: 'menuFadeIn 0.2s ease-out'
            }}>
              <div style={{ fontSize: '10px', color: '#A855F7', fontWeight: 'bold', borderBottom: '1px solid rgba(168, 85, 247, 0.2)', paddingBottom: '6px', letterSpacing: '1px' }}>
                DOKUMENTASI & KINERJA
              </div>
              <Link href="/dashboard/analytics" style={{ textDecoration: 'none' }}>
                <div style={megamenuItemStyle}>
                  <span style={{ fontSize: '11px', color: 'white', fontWeight: 'bold' }}>Metrik & Bar Chart</span>
                  <span style={{ fontSize: '9px', color: '#8B7BA8' }}>Grafik batang distribusi pelabuhan</span>
                </div>
              </Link>
              <Link href="/dashboard/analytics" style={{ textDecoration: 'none' }}>
                <div style={megamenuItemStyle}>
                  <span style={{ fontSize: '11px', color: 'white', fontWeight: 'bold' }}>Logbook Aktivitas Lengkap</span>
                  <span style={{ fontSize: '9px', color: '#8B7BA8' }}>Riwayat transisi status maritim</span>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Right: Connection status, Simulated error toggler, and Exit */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        
        {/* SATELIT CONTROLLER (Simulation Toggler) */}
        <button
          onClick={() => setSimulateFailure(!simulateFailure)}
          style={{
            background: simulateFailure ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.1)',
            border: `1px solid ${simulateFailure ? '#EF4444' : 'rgba(34, 197, 94, 0.4)'}`,
            borderRadius: '4px',
            color: simulateFailure ? '#EF4444' : '#22C55E',
            padding: '6px 10px',
            fontSize: '9px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontFamily: 'monospace',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
          title="Klik untuk mensimulasikan kegagalan koneksi satelit secara instan."
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
            <path d="M1.42 9a16 16 0 0 1 21.16 0"></path>
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
            <line x1="12" y1="20" x2="12.01" y2="20" strokeWidth="4"></line>
          </svg>
          {simulateFailure ? 'SIMULASI GAGAL: ON' : 'SIMULASI GAGAL: OFF'}
        </button>

        {/* STATUS KONEKSI MARITIM GLOBAL */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: errorSignal ? 'rgba(239, 68, 68, 0.15)' : 'rgba(20, 10, 36, 0.8)',
          border: errorSignal ? '1px solid #EF4444' : '1px solid rgba(168, 85, 247, 0.3)',
          padding: '6px 12px',
          borderRadius: '4px',
          boxShadow: errorSignal ? '0 0 10px rgba(239, 68, 68, 0.3)' : 'none'
        }}>
          <div style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: errorSignal ? '#EF4444' : '#22C55E',
            boxShadow: errorSignal ? '0 0 8px #EF4444' : '0 0 8px #22C55E',
            animation: 'pulse 1.5s infinite'
          }}></div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
            <span style={{ fontSize: '8px', color: '#8B7BA8', fontWeight: 'bold', letterSpacing: '0.5px' }}>TELEMETRI SATELIT</span>
            <span style={{ fontSize: '9px', color: errorSignal ? '#EF4444' : '#22C55E', fontWeight: 'bold', letterSpacing: '0.5px' }}>
              {errorSignal ? 'SINYAL TERPUTUS' : 'ONLINE'}
            </span>
          </div>
        </div>

        {/* EXIT / OUTBOUND BUTTON */}
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            padding: '8px 12px',
            borderRadius: '4px',
            color: '#8B7BA8',
            background: 'transparent',
            fontSize: '11px',
            fontWeight: 'bold',
            transition: 'all 0.2s',
            cursor: 'pointer',
            fontFamily: 'monospace'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
            e.currentTarget.style.color = '#EF4444';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
            e.currentTarget.style.color = '#8B7BA8';
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          KELUAR
        </button>
      </div>

      <style>{`
        @keyframes menuFadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </nav>
  );
}

// Reusable styling objects
const megamenuItemStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  padding: '10px 12px',
  background: 'rgba(255, 255, 255, 0.02)',
  border: '1px solid rgba(168, 85, 247, 0.1)',
  borderRadius: '4px',
  cursor: 'pointer',
  transition: 'all 0.2s',
  fontFamily: 'monospace'
};

// Inline hover effect simulation is handled via CSS in React layout
if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    .ship-node:hover {
      filter: drop-shadow(0 0 12px #A855F7);
    }
  `;
  document.head.appendChild(style);
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardProvider>
      <div style={{
        width: '100%',
        minHeight: '100vh',
        background: '#07020E', // Dark Futuristic Purple deep dark
        color: 'white',
        fontFamily: 'var(--font-roboto-mono), Roboto Mono, monospace',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Integrated Command Topbar */}
        <NavigationMenu />

        {/* Fullscreen commanded container */}
        <main style={{ flex: 1, padding: '24px', width: '100%', boxSizing: 'border-box', overflowX: 'hidden' }}>
          {children}
        </main>
      </div>
    </DashboardProvider>
  );
}
