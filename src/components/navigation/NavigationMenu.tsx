"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useDashboard } from '@/context/DashboardContext';
import { motion } from 'framer-motion';

export default function NavigationMenu() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Hook directly into SWR telemetry
  const { cuaca, updateCuaca, armada } = useDashboard();
  const activeTab = searchParams.get('tab') || 'komando';

  useEffect(() => {
    setIsAdmin(localStorage.getItem('role') === 'Admin');
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (pathname?.startsWith('/admin')) {
      const titles: Record<string, string> = {
        komando: 'Ruang Komando — PrimeLog Admin',
        fleet: 'Manajemen Armada — PrimeLog Admin',
        map: 'Peta Maritim — PrimeLog Admin',
        analytics: 'Analitik Performa — PrimeLog Admin',
        cargo: 'Kontrol Cargo — PrimeLog Admin',
        settings: 'Konfigurasi Sistem — PrimeLog Admin',
        users: 'Direktori User — PrimeLog Admin',
        audit: 'Audit Trail — PrimeLog Admin'
      };
      document.title = titles[activeTab] || 'Command Hub — PrimeLog Admin';
    } else {
      const titles: Record<string, string> = {
        '/dashboard': 'Dashboard Portal — PrimeLog Customer',
        '/dashboard/map': 'Radar Maritim — PrimeLog Customer',
        '/dashboard/cargo': 'Pusat Kargo — PrimeLog Customer',
        '/dashboard/analytics': 'Analitik Personal — PrimeLog Customer',
        '/dashboard/support': 'Pusat Dukungan Tiket — PrimeLog',
        '/dashboard/pemeliharaan': 'Pemeliharaan Armada — PrimeLog',
        '/dashboard/peringatan': 'Pusat Peringatan — PrimeLog',
        '/dashboard/stats': 'Statistik Pengiriman — PrimeLog'
      };
      document.title = titles[pathname] || 'Portal Customer — PrimeLog';
    }
  }, [pathname, activeTab]);

  const isAdminView = pathname?.startsWith('/admin');

  // Helper checking active tab on admin page
  const isAdminTabActive = (tab: string) => {
    return activeTab === tab;
  };

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '16px',
      padding: '16px 32px',
      borderBottom: '1px solid rgba(124, 58, 237, 0.2)',
      background: 'rgba(13, 11, 20, 0.9)',
      backdropFilter: 'blur(8px)',
      boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      fontFamily: 'monospace',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      
      {/* ─────────────────────────────────────────────────────────────
          LEFT: BRAND IDENTITY
          ───────────────────────────────────────────────────────────── */}
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
          <span style={{ fontSize: '15px', fontWeight: 'bold', letterSpacing: '2px', color: 'white' }}>PRIMELOG</span>
          <span style={{ fontSize: '8px', color: '#C084FC', letterSpacing: '0.5px', fontWeight: 'bold' }}>
            {isAdminView ? 'ADMIN COMMAND HUB' : 'CUSTOMER PORTAL'}
          </span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          CENTER & RIGHT: CONDITIONAL NAVIGATION LAYOUTS
          ───────────────────────────────────────────────────────────── */}
      {isAdminView ? (
        // =============================================================
        // 🛠️ ADMIN PORTAL NAVBAR LAYOUT (Cleans up customer duplicate links)
        // =============================================================
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          
          {/* Link: Ruang Komando */}
          <Link href="/admin?tab=komando" style={{ textDecoration: 'none' }}>
            <div
              className="nav-link-item"
              style={{
                position: 'relative',
                background: 'transparent',
                padding: '10px 16px',
                color: isAdminTabActive('komando') ? '#A855F7' : '#9B99A8',
                fontSize: '11px',
                fontWeight: 'bold',
                letterSpacing: '1px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              🎛️ KOMANDO
              {isAdminTabActive('komando') && (
                <motion.div
                  layoutId="adminActiveUnderline"
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: '#A855F7',
                    boxShadow: '0 0 8px #A855F7'
                  }}
                />
              )}
            </div>
          </Link>

          {/* Megamenu Category: Fleet */}
          <div className="megamenu-trigger" style={{ position: 'relative', display: 'inline-block' }}>
            <Link href="/admin?tab=fleet" style={{ textDecoration: 'none' }}>
              <div className="megamenu-tab" style={{
                position: 'relative',
                padding: '10px 16px',
                background: 'transparent',
                color: isAdminTabActive('fleet') ? '#A855F7' : '#9B99A8',
                fontSize: '11px',
                fontWeight: 'bold',
                letterSpacing: '1px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                🚢 FLEET <span style={{ fontSize: '8px' }}>▼</span>
                {isAdminTabActive('fleet') && (
                  <motion.div
                    layoutId="adminActiveUnderline"
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: '#A855F7',
                      boxShadow: '0 0 8px #A855F7'
                    }}
                  />
                )}
              </div>
            </Link>

            <div className="megamenu-content">
              <div style={{ borderRight: '1px solid rgba(168, 85, 247, 0.2)', paddingRight: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#C084FC', letterSpacing: '1px' }}>FLEET TELEMETRY</span>
                <span style={{ fontSize: '8px', color: '#8B7BA8', lineHeight: '1.4' }}>Pemantauan real-time satelit dari seluruh armada kapal kargo di perairan kepulauan Indonesia.</span>
                <div style={{ background: 'rgba(34, 197, 94, 0.05)', border: '1px solid rgba(34, 197, 94, 0.3)', padding: '8px', borderRadius: '4px' }}>
                  <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#22C55E', display: 'block' }}>● TELEMETRI ONLINE</span>
                  <span style={{ fontSize: '8px', color: '#8B7BA8' }}>Menerima telemetri dari {armada?.length || 10} armada aktif.</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#8B7BA8', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px' }}>SHIP GPS BEACONS</span>
                {(armada || []).slice(0, 3).map((ship: any) => {
                  const isBerlayar = ship.status?.toUpperCase().includes('PERJALANAN') || ship.status?.toUpperCase().includes('BERLAYAR');
                  const isDock = ship.status?.toUpperCase().includes('PELABUHAN') || ship.status?.toUpperCase().includes('SANDAR');
                  const isDelayed = ship.status?.toUpperCase().includes('TERLAMBAT');
                  const color = isBerlayar ? '#22C55E' : isDock ? '#3B82F6' : isDelayed ? '#F59E0B' : '#EF4444';
                  return (
                    <div key={ship.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '9px' }}>
                      <span style={{ fontWeight: 'bold', color: 'white' }}>{ship.name}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '6px', height: '6px', background: color, borderRadius: '50%', boxShadow: `0 0 6px ${color}` }}></span>
                        <span style={{ color: color, fontSize: '8px', fontWeight: 'bold' }}>{ship.status}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Megamenu Category: Map */}
          <div className="megamenu-trigger" style={{ position: 'relative', display: 'inline-block' }}>
            <Link href="/admin?tab=map" style={{ textDecoration: 'none' }}>
              <div className="megamenu-tab" style={{
                position: 'relative',
                padding: '10px 16px',
                background: 'transparent',
                color: isAdminTabActive('map') ? '#A855F7' : '#9B99A8',
                fontSize: '11px',
                fontWeight: 'bold',
                letterSpacing: '1px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                🗺️ MAP <span style={{ fontSize: '8px' }}>▼</span>
                {isAdminTabActive('map') && (
                  <motion.div
                    layoutId="adminActiveUnderline"
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: '#A855F7',
                      boxShadow: '0 0 8px #A855F7'
                    }}
                  />
                )}
              </div>
            </Link>

            <div className="megamenu-content">
              <div style={{ borderRight: '1px solid rgba(168, 85, 247, 0.2)', paddingRight: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#C084FC', letterSpacing: '1px' }}>MAP TRACKING</span>
                <span style={{ fontSize: '8px', color: '#8B7BA8', lineHeight: '1.4' }}>Pemetaan visual koordinat GPS kapal kargo, jalur pelayaran maritim, and indikator cuaca dinamis.</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="radar-ping"></span>
                  <span style={{ fontSize: '8px', color: '#EF4444', fontWeight: 'bold' }}>RADAR SCAN ACTIVE</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#8B7BA8', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px' }}>AKSI PETA & CUACA</span>
                <Link href="/admin?tab=map" style={{ textDecoration: 'none', color: '#06B6D4', fontSize: '10px', fontWeight: 'bold' }}>
                  ➔ MONITOR PETA UTAMA
                </Link>
                
                {/* Weather Overrides for Admins */}
                <div style={{ borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ color: '#8B7BA8', fontSize: '8px', fontWeight: 'bold' }}>OVERRIDE STATUS CUACA (ADMIN):</span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {['Normal', 'Badai Ekstrem', 'Terik Gersang'].map(w => {
                      const isActive = cuaca === w;
                      return (
                        <button
                          key={w}
                          onClick={() => updateCuaca && updateCuaca(w)}
                          style={{
                            background: isActive ? '#A855F7' : 'rgba(255,255,255,0.05)',
                            border: `1px solid ${isActive ? '#C084FC' : 'rgba(255,255,255,0.1)'}`,
                            color: isActive ? 'white' : '#8B7BA8',
                            fontSize: '8px',
                            padding: '4px 6px',
                            borderRadius: '3px',
                            cursor: 'pointer',
                            fontFamily: 'monospace',
                            fontWeight: 'bold',
                            transition: 'all 0.15s'
                          }}
                        >
                          {w.split(' ')[0].toUpperCase()}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Megamenu Category: Analytics */}
          <div className="megamenu-trigger" style={{ position: 'relative', display: 'inline-block' }}>
            <Link href="/admin?tab=analytics" style={{ textDecoration: 'none' }}>
              <div className="megamenu-tab" style={{
                position: 'relative',
                padding: '10px 16px',
                background: 'transparent',
                color: isAdminTabActive('analytics') ? '#A855F7' : '#9B99A8',
                fontSize: '11px',
                fontWeight: 'bold',
                letterSpacing: '1px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                📊 ANALYTICS <span style={{ fontSize: '8px' }}>▼</span>
                {isAdminTabActive('analytics') && (
                  <motion.div
                    layoutId="adminActiveUnderline"
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: '#A855F7',
                      boxShadow: '0 0 8px #A855F7'
                    }}
                  />
                )}
              </div>
            </Link>

            <div className="megamenu-content">
              <div style={{ borderRight: '1px solid rgba(168, 85, 247, 0.2)', paddingRight: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#C084FC', letterSpacing: '1px' }}>ANALYTICS PANEL</span>
                <span style={{ fontSize: '8px', color: '#8B7BA8', lineHeight: '1.4' }}>Matriks performa logistik rute pengiriman kargo, utilisasi armada aktif, and tren pendapatan bulanan.</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '9px' }}>
                <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#8B7BA8', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px' }}>PERFORMA OPERASIONAL</span>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#8B7BA8' }}>UTILISASI ARMADA:</span>
                  <span style={{ color: '#3B82F6', fontWeight: 'bold' }}>85.4%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#8B7BA8' }}>RERATA DURASI:</span>
                  <span style={{ color: '#22C55E', fontWeight: 'bold' }}>42 Jam</span>
                </div>
                <Link href="/admin?tab=analytics" style={{ textDecoration: 'none', color: '#06B6D4', fontSize: '9px', fontWeight: 'bold', borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '6px', marginTop: '4px' }}>
                  ➔ LIHAT GRAFIK DETAIL
                </Link>
              </div>
            </div>
          </div>

          {/* Megamenu Category: Cargo */}
          <div className="megamenu-trigger" style={{ position: 'relative', display: 'inline-block' }}>
            <Link href="/admin?tab=cargo" style={{ textDecoration: 'none' }}>
              <div className="megamenu-tab" style={{
                position: 'relative',
                padding: '10px 16px',
                background: 'transparent',
                color: isAdminTabActive('cargo') ? '#A855F7' : '#9B99A8',
                fontSize: '11px',
                fontWeight: 'bold',
                letterSpacing: '1px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                📦 CARGO <span style={{ fontSize: '8px' }}>▼</span>
                {isAdminTabActive('cargo') && (
                  <motion.div
                    layoutId="adminActiveUnderline"
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: '#A855F7',
                      boxShadow: '0 0 8px #A855F7'
                    }}
                  />
                )}
              </div>
            </Link>

            <div className="megamenu-content">
              <div style={{ borderRight: '1px solid rgba(168, 85, 247, 0.2)', paddingRight: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#C084FC', letterSpacing: '1px' }}>KONTROL CARGO</span>
                <span style={{ fontSize: '8px', color: '#8B7BA8', lineHeight: '1.4' }}>Alur CRUD komando pengiriman, validasi state-machine status kargo, dan penugasan armada massal.</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '9px' }}>
                <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#8B7BA8', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px' }}>PINTASAN KONTROL</span>
                <Link href="/admin?tab=cargo" style={{ textDecoration: 'none', color: '#06B6D4', fontWeight: 'bold' }}>
                  ➔ TABEL KONTROL CARGO (CRUD)
                </Link>
              </div>
            </div>
          </div>

          {/* Megamenu Category: Controls */}
          <div className="megamenu-trigger" style={{ position: 'relative', display: 'inline-block' }}>
            <Link href="/admin?tab=settings" style={{ textDecoration: 'none' }}>
              <div className="megamenu-tab" style={{
                position: 'relative',
                padding: '10px 16px',
                background: 'transparent',
                color: (isAdminTabActive('settings') || isAdminTabActive('users') || isAdminTabActive('audit')) ? '#A855F7' : '#9B99A8',
                fontSize: '11px',
                fontWeight: 'bold',
                letterSpacing: '1px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                ⚙️ CONTROLS <span style={{ fontSize: '8px' }}>▼</span>
                {(isAdminTabActive('settings') || isAdminTabActive('users') || isAdminTabActive('audit')) && (
                  <motion.div
                    layoutId="adminActiveUnderline"
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: '#A855F7',
                      boxShadow: '0 0 8px #A855F7'
                    }}
                  />
                )}
              </div>
            </Link>

            <div className="megamenu-content" style={{ width: '500px' }}>
              <div style={{ borderRight: '1px solid rgba(168, 85, 247, 0.2)', paddingRight: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#C084FC', letterSpacing: '1px' }}>SISTEM OPERASI</span>
                <span style={{ fontSize: '8px', color: '#8B7BA8', lineHeight: '1.4' }}>Pusat parameter aturan sistem, otorisasi direktori akun, dan audit ledger digital.</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '9px' }}>
                <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#8B7BA8', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px', gridColumn: '1 / -1' }}>MODUL ADMINISTRATIF</span>
                <Link href="/admin?tab=users" style={{ textDecoration: 'none', color: '#06B6D4', fontWeight: 'bold' }}>➔ DIREKTORI USER</Link>
                <Link href="/admin?tab=audit" style={{ textDecoration: 'none', color: '#06B6D4', fontWeight: 'bold' }}>➔ LOG AUDIT TRAIL</Link>
                <Link href="/admin?tab=settings" style={{ textDecoration: 'none', color: '#C084FC', fontWeight: 'bold' }}>➔ CONFIG ATURAN</Link>
                <Link href="/admin?tab=settings" style={{ textDecoration: 'none', color: '#EF4444', fontWeight: 'bold' }}>➔ RUN AUTOMATION</Link>
              </div>
            </div>
          </div>

        </div>
      ) : (
        // =============================================================
        // 🚢 CUSTOMER PORTAL NAVBAR LAYOUT
        // =============================================================
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          
          {/* Link: Dashboard */}
          <Link href="/dashboard" style={{ textDecoration: 'none' }}>
            <div
              className="nav-link-item"
              style={{
                position: 'relative',
                background: 'transparent',
                padding: '10px 16px',
                color: pathname === '/dashboard' ? '#A855F7' : '#9B99A8',
                fontSize: '11px',
                fontWeight: 'bold',
                letterSpacing: '1px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              🎛️ DASHBOARD
              {pathname === '/dashboard' && (
                <motion.div
                  layoutId="customerActiveUnderline"
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: '#A855F7',
                    boxShadow: '0 0 8px #A855F7'
                  }}
                />
              )}
            </div>
          </Link>

          {/* Megamenu Category: Map & Fleet */}
          <div className="megamenu-trigger" style={{ position: 'relative', display: 'inline-block' }}>
            <Link href="/dashboard/map" style={{ textDecoration: 'none' }}>
              <div className="megamenu-tab" style={{
                position: 'relative',
                padding: '10px 16px',
                background: 'transparent',
                color: pathname === '/dashboard/map' ? '#A855F7' : '#9B99A8',
                fontSize: '11px',
                fontWeight: 'bold',
                letterSpacing: '1px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                🗺️ MAP & FLEET <span style={{ fontSize: '8px' }}>▼</span>
                {pathname === '/dashboard/map' && (
                  <motion.div
                    layoutId="customerActiveUnderline"
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: '#A855F7',
                      boxShadow: '0 0 8px #A855F7'
                    }}
                  />
                )}
              </div>
            </Link>

            <div className="megamenu-content">
              <div style={{ borderRight: '1px solid rgba(168, 85, 247, 0.2)', paddingRight: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#C084FC', letterSpacing: '1px' }}>MAP TRACKING</span>
                <span style={{ fontSize: '8px', color: '#8B7BA8', lineHeight: '1.4' }}>Pemetaan visual koordinat GPS kapal kargo, jalur pelayaran maritim, and indikator cuaca dinamis.</span>
                <Link href="/dashboard/map" style={{ textDecoration: 'none', color: '#06B6D4', fontSize: '10px', fontWeight: 'bold', marginTop: '8px' }}>
                  ➔ MONITOR PETA UTAMA
                </Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#8B7BA8', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px' }}>FLEET STATUS</span>
                {(armada || []).slice(0, 3).map((ship: any) => {
                  const isBerlayar = ship.status?.toUpperCase().includes('PERJALANAN') || ship.status?.toUpperCase().includes('BERLAYAR');
                  const isDock = ship.status?.toUpperCase().includes('PELABUHAN') || ship.status?.toUpperCase().includes('SANDAR');
                  const isDelayed = ship.status?.toUpperCase().includes('TERLAMBAT');
                  const color = isBerlayar ? '#22C55E' : isDock ? '#3B82F6' : isDelayed ? '#F59E0B' : '#EF4444';
                  return (
                    <div key={ship.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '9px' }}>
                      <span style={{ fontWeight: 'bold', color: 'white' }}>{ship.name}</span>
                      <span style={{ color: color, fontSize: '8px', fontWeight: 'bold' }}>{ship.status}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Megamenu Category: Cargo */}
          <div className="megamenu-trigger" style={{ position: 'relative', display: 'inline-block' }}>
            <Link href="/dashboard/cargo" style={{ textDecoration: 'none' }}>
              <div className="megamenu-tab" style={{
                position: 'relative',
                padding: '10px 16px',
                background: 'transparent',
                color: pathname?.startsWith('/dashboard/cargo') ? '#A855F7' : '#9B99A8',
                fontSize: '11px',
                fontWeight: 'bold',
                letterSpacing: '1px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                📦 CARGO <span style={{ fontSize: '8px' }}>▼</span>
                {pathname?.startsWith('/dashboard/cargo') && (
                  <motion.div
                    layoutId="customerActiveUnderline"
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: '#A855F7',
                      boxShadow: '0 0 8px #A855F7'
                    }}
                  />
                )}
              </div>
            </Link>

            <div className="megamenu-content">
              <div style={{ borderRight: '1px solid rgba(168, 85, 247, 0.2)', paddingRight: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#C084FC', letterSpacing: '1px' }}>KONTROL CARGO</span>
                <span style={{ fontSize: '8px', color: '#8B7BA8', lineHeight: '1.4' }}>Lihat status pengiriman kargo, edit alamat pengiriman, atau lakukan pembatalan kargo aktif.</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '9px' }}>
                <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#8B7BA8', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px' }}>AKSES CEPAT</span>
                <Link href="/dashboard/cargo" style={{ textDecoration: 'none', color: '#06B6D4', fontWeight: 'bold' }}>
                  ➔ PUSAT KONTROL CARGO
                </Link>
              </div>
            </div>
          </div>

          {/* Megamenu Category: Analytics */}
          <div className="megamenu-trigger" style={{ position: 'relative', display: 'inline-block' }}>
            <Link href="/dashboard/analytics" style={{ textDecoration: 'none' }}>
              <div className="megamenu-tab" style={{
                position: 'relative',
                padding: '10px 16px',
                background: 'transparent',
                color: pathname?.startsWith('/dashboard/analytics') ? '#A855F7' : '#9B99A8',
                fontSize: '11px',
                fontWeight: 'bold',
                letterSpacing: '1px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                📊 ANALYTICS <span style={{ fontSize: '8px' }}>▼</span>
                {pathname?.startsWith('/dashboard/analytics') && (
                  <motion.div
                    layoutId="customerActiveUnderline"
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: '#A855F7',
                      boxShadow: '0 0 8px #A855F7'
                    }}
                  />
                )}
              </div>
            </Link>

            <div className="megamenu-content">
              <div style={{ borderRight: '1px solid rgba(168, 85, 247, 0.2)', paddingRight: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#C084FC', letterSpacing: '1px' }}>ANALYTICS PANEL</span>
                <span style={{ fontSize: '8px', color: '#8B7BA8', lineHeight: '1.4' }}>Pantau telemetri armada real-time, status logistik perutean, dan indikator utilisasi.</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '9px' }}>
                <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#8B7BA8', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px' }}>AKSES CEPAT</span>
                <Link href="/dashboard/analytics" style={{ textDecoration: 'none', color: '#06B6D4', fontWeight: 'bold' }}>
                  ➔ MONITOR ANALYTICS UTAMA
                </Link>
              </div>
            </div>
          </div>

          {/* Megamenu Category: Profile Settings */}
          <div className="megamenu-trigger" style={{ position: 'relative', display: 'inline-block' }}>
            <Link href="/dashboard/settings" style={{ textDecoration: 'none' }}>
              <div className="megamenu-tab" style={{
                position: 'relative',
                padding: '10px 16px',
                background: 'transparent',
                color: pathname?.startsWith('/dashboard/settings') ? '#A855F7' : '#9B99A8',
                fontSize: '11px',
                fontWeight: 'bold',
                letterSpacing: '1px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                ⚙️ SETTINGS <span style={{ fontSize: '8px' }}>▼</span>
                {pathname?.startsWith('/dashboard/settings') && (
                  <motion.div
                    layoutId="customerActiveUnderline"
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: '#A855F7',
                      boxShadow: '0 0 8px #A855F7'
                    }}
                  />
                )}
              </div>
            </Link>

            <div className="megamenu-content">
              <div style={{ borderRight: '1px solid rgba(168, 85, 247, 0.2)', paddingRight: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#C084FC', letterSpacing: '1px' }}>PROFIL PERSONAL</span>
                <span style={{ fontSize: '8px', color: '#8B7BA8', lineHeight: '1.4' }}>Atur data personal, alamat pengiriman default, dan preferensi notifikasi Anda.</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '9px' }}>
                <span style={{ fontSize: '9px', fontWeight: 'bold', color: '#8B7BA8', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px' }}>AKSES CEPAT</span>
                <Link href="/dashboard/settings" style={{ textDecoration: 'none', color: '#06B6D4', fontWeight: 'bold' }}>
                  ➔ PENGATURAN PROFIL
                </Link>
              </div>
            </div>
          </div>


          {/* Link: Ruang Komando Admin (Only visible if Admin role) */}
          {isAdmin && (
            <Link href="/admin" style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'linear-gradient(90deg, #A855F7 0%, #7C3AED 100%)',
                border: '1px solid rgba(168, 85, 247, 0.5)',
                padding: '10px 16px',
                borderRadius: '6px',
                color: 'white',
                fontSize: '11px',
                fontWeight: 'bold',
                letterSpacing: '1.5px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 0 10px rgba(168,85,247,0.3)'
              }}>
                🛠️ KOMANDO ADMIN
              </div>
            </Link>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          RIGHT: OUTBOUND ACTION BUTTON
          ───────────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
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

      {/* Embedded CSS style tag for pure transitions and triggers */}
      <style>{`
        .megamenu-content {
          visibility: hidden;
          opacity: 0;
          position: absolute;
          top: 100%;
          left: 0;
          width: 480px;
          background: rgba(7, 2, 14, 0.98);
          border: 1px solid rgba(168, 85, 247, 0.6);
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.9), 0 0 15px rgba(168, 85, 247, 0.2);
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          transform: translateY(12px);
          z-index: 1000;
          display: grid;
          grid-template-columns: 1.2fr 1.3fr;
          gap: 16px;
          pointer-events: none;
        }
        
        .megamenu-trigger:hover .megamenu-content {
          visibility: visible;
          opacity: 1;
          transform: translateY(8px);
          pointer-events: auto;
        }

        .nav-link-item:hover,
        .megamenu-trigger:hover .megamenu-tab {
          color: #A855F7 !important;
        }

        .radar-ping {
          width: 6px;
          height: 6px;
          background: #EF4444;
          border-radius: 50%;
          box-shadow: 0 0 6px #EF4444;
          display: inline-block;
          animation: pulse 1s infinite;
        }
      `}</style>
    </nav>
  );
}
