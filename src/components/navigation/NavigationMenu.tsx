"use client";

import React, { useState, useEffect, startTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useDashboard } from '@/context/DashboardContext';
import { motion } from 'framer-motion';
import { 
  CommandLineIcon, TruckIcon, MapIcon, ChartBarIcon, 
  CubeIcon, Cog6ToothIcon, UsersIcon, ClipboardDocumentListIcon,
  ArrowRightIcon, ChevronDownIcon, ArrowRightStartOnRectangleIcon
} from '@heroicons/react/24/outline';

export default function NavigationMenu() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Hook directly into SWR telemetry
  const { cuaca, updateCuaca, armada } = useDashboard();
  const activeTab = searchParams.get('tab') || 'komando';

  useEffect(() => {
    startTransition(() => {
      setIsAdmin(localStorage.getItem('role') === 'Admin');
    });
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
      borderBottom: '1px solid var(--border)',
      background: 'rgba(6,6,8,0.9)',
      backdropFilter: 'blur(8px)',
      boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      fontFamily: 'var(--font-body)',
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
          boxShadow: '0 0 15px rgba(0,229,255,0.3)',
          overflow: 'hidden'
        }}>
          <Image src="/logo.png" alt="Logo" width={34} height={34} style={{ objectFit: 'contain' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '1px', color: 'var(--text-primary)' }}>PRIMELOG</span>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--accent)', fontWeight: 600 }}>
            {isAdminView ? 'Admin Portal' : 'Customer Portal'}
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
                color: isAdminTabActive('komando') ? 'var(--accent)' : 'var(--text-tertiary)',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                letterSpacing: '0.5px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <CommandLineIcon style={{ width: '14px', height: '14px', flexShrink: 0 }} /> Dashboard
              {isAdminTabActive('komando') && (
                <motion.div
                  layoutId="adminActiveUnderline"
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'var(--accent)',
                    boxShadow: '0 0 8px var(--accent-glow)'
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
                color: isAdminTabActive('fleet') ? 'var(--accent)' : 'var(--text-tertiary)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'bold',
                letterSpacing: '1px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <TruckIcon style={{ width: '14px', height: '14px', flexShrink: 0 }} /> FLEET <ChevronDownIcon style={{ width: '10px', height: '10px' }} />
                {isAdminTabActive('fleet') && (
                  <motion.div
                    layoutId="adminActiveUnderline"
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: 'var(--accent)',
                      boxShadow: '0 0 8px var(--accent)'
                    }}
                  />
                )}
              </div>
            </Link>

            <div className="megamenu-content">
              <div style={{ borderRight: '1px solid rgba(168, 85, 247, 0.2)', paddingRight: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', color: 'var(--accent-secondary)', letterSpacing: '1px' }}>FLEET TELEMETRY</span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: '1.4' }}>Pemantauan real-time satelit dari seluruh armada kapal kargo di perairan kepulauan Indonesia.</span>
                <div style={{ background: 'rgba(34, 197, 94, 0.05)', border: '1px solid rgba(34, 197, 94, 0.3)', padding: '8px', borderRadius: '4px' }}>
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', color: '#22C55E', display: 'block' }}>● TELEMETRI ONLINE</span>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Menerima telemetri dari {armada?.length || 10} armada aktif.</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--text-secondary)', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px' }}>SHIP GPS BEACONS</span>
                {(armada || []).slice(0, 3).map((ship: any) => {
                  const isBerlayar = ship.status?.toUpperCase().includes('PERJALANAN') || ship.status?.toUpperCase().includes('BERLAYAR');
                  const isDock = ship.status?.toUpperCase().includes('PELABUHAN') || ship.status?.toUpperCase().includes('SANDAR');
                  const isDelayed = ship.status?.toUpperCase().includes('TERLAMBAT');
                  const color = isBerlayar ? '#22C55E' : isDock ? '#3B82F6' : isDelayed ? '#F59E0B' : '#EF4444';
                  return (
                    <div key={ship.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'var(--text-xs)' }}>
                      <span style={{ fontWeight: 'bold', color: 'white' }}>{ship.name}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '6px', height: '6px', background: color, borderRadius: '50%', boxShadow: `0 0 6px ${color}` }}></span>
                        <span style={{ color: color, fontSize: 'var(--text-xs)', fontWeight: 'bold' }}>{ship.status}</span>
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
                color: isAdminTabActive('map') ? 'var(--accent)' : 'var(--text-tertiary)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'bold',
                letterSpacing: '1px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <MapIcon style={{ width: '14px', height: '14px', flexShrink: 0 }} /> MAP <ChevronDownIcon style={{ width: '10px', height: '10px' }} />
                {isAdminTabActive('map') && (
                  <motion.div
                    layoutId="adminActiveUnderline"
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: 'var(--accent)',
                      boxShadow: '0 0 8px var(--accent)'
                    }}
                  />
                )}
              </div>
            </Link>

            <div className="megamenu-content">
              <div style={{ borderRight: '1px solid rgba(168, 85, 247, 0.2)', paddingRight: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', color: 'var(--accent-secondary)', letterSpacing: '1px' }}>MAP TRACKING</span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: '1.4' }}>Pemetaan visual koordinat GPS kapal kargo, jalur pelayaran maritim, and indikator cuaca dinamis.</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="radar-ping"></span>
                  <span style={{ fontSize: 'var(--text-xs)', color: '#EF4444', fontWeight: 'bold' }}>RADAR SCAN ACTIVE</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--text-secondary)', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px' }}>AKSI PETA & CUACA</span>
                <Link href="/admin?tab=map" style={{ textDecoration: 'none', color: 'var(--accent)', fontSize: 'var(--text-xs)', fontWeight: 'bold' }}>
                  ➔ MONITOR PETA UTAMA
                </Link>
                
                {/* Weather Overrides for Admins */}
                <div style={{ borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)', fontWeight: 'bold' }}>OVERRIDE STATUS CUACA (ADMIN):</span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {['Normal', 'Badai Ekstrem', 'Terik Gersang'].map(w => {
                      const isActive = cuaca === w;
                      return (
                        <button
                          key={w}
                          onClick={() => updateCuaca && updateCuaca(w)}
                          style={{
                            background: isActive ? 'var(--accent)' : 'rgba(255,255,255,0.05)',
                            border: `1px solid ${isActive ? 'var(--accent-secondary)' : 'rgba(255,255,255,0.1)'}`,
                            color: isActive ? 'white' : 'var(--text-secondary)',
                            fontSize: 'var(--text-xs)',
                            padding: '4px 6px',
                            borderRadius: '3px',
                            cursor: 'pointer',
                            fontFamily: 'var(--font-body)',
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
                color: isAdminTabActive('analytics') ? 'var(--accent)' : 'var(--text-tertiary)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'bold',
                letterSpacing: '1px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <ChartBarIcon style={{ width: '14px', height: '14px', flexShrink: 0 }} /> ANALYTICS <ChevronDownIcon style={{ width: '10px', height: '10px' }} />
                {isAdminTabActive('analytics') && (
                  <motion.div
                    layoutId="adminActiveUnderline"
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: 'var(--accent)',
                      boxShadow: '0 0 8px var(--accent)'
                    }}
                  />
                )}
              </div>
            </Link>

            <div className="megamenu-content">
              <div style={{ borderRight: '1px solid rgba(168, 85, 247, 0.2)', paddingRight: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', color: 'var(--accent-secondary)', letterSpacing: '1px' }}>ANALYTICS PANEL</span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: '1.4' }}>Matriks performa logistik rute pengiriman kargo, utilisasi armada aktif, and tren pendapatan bulanan.</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: 'var(--text-xs)' }}>
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--text-secondary)', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px' }}>PERFORMA OPERASIONAL</span>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>UTILISASI ARMADA:</span>
                  <span style={{ color: '#3B82F6', fontWeight: 'bold' }}>85.4%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>RERATA DURASI:</span>
                  <span style={{ color: '#22C55E', fontWeight: 'bold' }}>42 Jam</span>
                </div>
                <Link href="/admin?tab=analytics" style={{ textDecoration: 'none', color: 'var(--accent)', fontSize: 'var(--text-xs)', fontWeight: 'bold', borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '6px', marginTop: '4px' }}>
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
                color: isAdminTabActive('cargo') ? 'var(--accent)' : 'var(--text-tertiary)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'bold',
                letterSpacing: '1px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <CubeIcon style={{ width: '14px', height: '14px', flexShrink: 0 }} /> CARGO <ChevronDownIcon style={{ width: '10px', height: '10px' }} />
                {isAdminTabActive('cargo') && (
                  <motion.div
                    layoutId="adminActiveUnderline"
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: 'var(--accent)',
                      boxShadow: '0 0 8px var(--accent)'
                    }}
                  />
                )}
              </div>
            </Link>

            <div className="megamenu-content">
              <div style={{ borderRight: '1px solid rgba(168, 85, 247, 0.2)', paddingRight: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', color: 'var(--accent-secondary)', letterSpacing: '1px' }}>KONTROL CARGO</span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: '1.4' }}>Alur CRUD komando pengiriman, validasi state-machine status kargo, dan penugasan armada massal.</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: 'var(--text-xs)' }}>
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--text-secondary)', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px' }}>PINTASAN KONTROL</span>
                <Link href="/admin?tab=cargo" style={{ textDecoration: 'none', color: 'var(--accent)', fontWeight: 'bold' }}>
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
                color: (isAdminTabActive('settings') || isAdminTabActive('users') || isAdminTabActive('audit')) ? 'var(--accent)' : 'var(--text-tertiary)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'bold',
                letterSpacing: '1px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Cog6ToothIcon style={{ width: '14px', height: '14px', flexShrink: 0 }} /> CONTROLS <ChevronDownIcon style={{ width: '10px', height: '10px' }} />
                {(isAdminTabActive('settings') || isAdminTabActive('users') || isAdminTabActive('audit')) && (
                  <motion.div
                    layoutId="adminActiveUnderline"
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: 'var(--accent)',
                      boxShadow: '0 0 8px var(--accent)'
                    }}
                  />
                )}
              </div>
            </Link>

            <div className="megamenu-content" style={{ width: '500px' }}>
              <div style={{ borderRight: '1px solid rgba(168, 85, 247, 0.2)', paddingRight: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', color: 'var(--accent-secondary)', letterSpacing: '1px' }}>SISTEM OPERASI</span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: '1.4' }}>Pusat parameter aturan sistem, otorisasi direktori akun, dan audit ledger digital.</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: 'var(--text-xs)' }}>
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--text-secondary)', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px', gridColumn: '1 / -1' }}>MODUL ADMINISTRATIF</span>
                <Link href="/admin?tab=users" style={{ textDecoration: 'none', color: 'var(--accent)', fontWeight: 'bold' }}>➔ DIREKTORI USER</Link>
                <Link href="/admin?tab=audit" style={{ textDecoration: 'none', color: 'var(--accent)', fontWeight: 'bold' }}>➔ LOG AUDIT TRAIL</Link>
                <Link href="/admin?tab=settings" style={{ textDecoration: 'none', color: 'var(--accent-secondary)', fontWeight: 'bold' }}>➔ CONFIG ATURAN</Link>
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
                color: pathname === '/dashboard' ? 'var(--accent)' : 'var(--text-tertiary)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'bold',
                letterSpacing: '1px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <CommandLineIcon style={{ width: '14px', height: '14px', flexShrink: 0 }} /> DASHBOARD
              {pathname === '/dashboard' && (
                <motion.div
                  layoutId="customerActiveUnderline"
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'var(--accent)',
                    boxShadow: '0 0 8px var(--accent)'
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
                color: pathname === '/dashboard/map' ? 'var(--accent)' : 'var(--text-tertiary)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'bold',
                letterSpacing: '1px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <MapIcon style={{ width: '14px', height: '14px', flexShrink: 0 }} /> MAP & FLEET <ChevronDownIcon style={{ width: '10px', height: '10px' }} />
                {pathname === '/dashboard/map' && (
                  <motion.div
                    layoutId="customerActiveUnderline"
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: 'var(--accent)',
                      boxShadow: '0 0 8px var(--accent)'
                    }}
                  />
                )}
              </div>
            </Link>

            <div className="megamenu-content">
              <div style={{ borderRight: '1px solid rgba(168, 85, 247, 0.2)', paddingRight: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', color: 'var(--accent-secondary)', letterSpacing: '1px' }}>MAP TRACKING</span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: '1.4' }}>Pemetaan visual koordinat GPS kapal kargo, jalur pelayaran maritim, and indikator cuaca dinamis.</span>
                <Link href="/dashboard/map" style={{ textDecoration: 'none', color: 'var(--accent)', fontSize: 'var(--text-xs)', fontWeight: 'bold', marginTop: '8px' }}>
                  ➔ MONITOR PETA UTAMA
                </Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--text-secondary)', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px' }}>FLEET STATUS</span>
                {(armada || []).slice(0, 3).map((ship: any) => {
                  const isBerlayar = ship.status?.toUpperCase().includes('PERJALANAN') || ship.status?.toUpperCase().includes('BERLAYAR');
                  const isDock = ship.status?.toUpperCase().includes('PELABUHAN') || ship.status?.toUpperCase().includes('SANDAR');
                  const isDelayed = ship.status?.toUpperCase().includes('TERLAMBAT');
                  const color = isBerlayar ? '#22C55E' : isDock ? '#3B82F6' : isDelayed ? '#F59E0B' : '#EF4444';
                  return (
                    <div key={ship.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'var(--text-xs)' }}>
                      <span style={{ fontWeight: 'bold', color: 'white' }}>{ship.name}</span>
                      <span style={{ color: color, fontSize: 'var(--text-xs)', fontWeight: 'bold' }}>{ship.status}</span>
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
                color: pathname?.startsWith('/dashboard/cargo') ? 'var(--accent)' : 'var(--text-tertiary)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'bold',
                letterSpacing: '1px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <CubeIcon style={{ width: '14px', height: '14px', flexShrink: 0 }} /> CARGO <ChevronDownIcon style={{ width: '10px', height: '10px' }} />
                {pathname?.startsWith('/dashboard/cargo') && (
                  <motion.div
                    layoutId="customerActiveUnderline"
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: 'var(--accent)',
                      boxShadow: '0 0 8px var(--accent)'
                    }}
                  />
                )}
              </div>
            </Link>

            <div className="megamenu-content">
              <div style={{ borderRight: '1px solid rgba(168, 85, 247, 0.2)', paddingRight: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', color: 'var(--accent-secondary)', letterSpacing: '1px' }}>KONTROL CARGO</span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: '1.4' }}>Lihat status pengiriman kargo, edit alamat pengiriman, atau lakukan pembatalan kargo aktif.</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: 'var(--text-xs)' }}>
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--text-secondary)', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px' }}>AKSES CEPAT</span>
                <Link href="/dashboard/cargo" style={{ textDecoration: 'none', color: 'var(--accent)', fontWeight: 'bold' }}>
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
                color: pathname?.startsWith('/dashboard/analytics') ? 'var(--accent)' : 'var(--text-tertiary)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'bold',
                letterSpacing: '1px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <ChartBarIcon style={{ width: '14px', height: '14px', flexShrink: 0 }} /> ANALYTICS <ChevronDownIcon style={{ width: '10px', height: '10px' }} />
                {pathname?.startsWith('/dashboard/analytics') && (
                  <motion.div
                    layoutId="customerActiveUnderline"
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: 'var(--accent)',
                      boxShadow: '0 0 8px var(--accent)'
                    }}
                  />
                )}
              </div>
            </Link>

            <div className="megamenu-content">
              <div style={{ borderRight: '1px solid rgba(168, 85, 247, 0.2)', paddingRight: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', color: 'var(--accent-secondary)', letterSpacing: '1px' }}>ANALYTICS PANEL</span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: '1.4' }}>Pantau telemetri armada real-time, status logistik perutean, dan indikator utilisasi.</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: 'var(--text-xs)' }}>
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--text-secondary)', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px' }}>AKSES CEPAT</span>
                <Link href="/dashboard/analytics" style={{ textDecoration: 'none', color: 'var(--accent)', fontWeight: 'bold' }}>
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
                color: pathname?.startsWith('/dashboard/settings') ? 'var(--accent)' : 'var(--text-tertiary)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'bold',
                letterSpacing: '1px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Cog6ToothIcon style={{ width: '14px', height: '14px', flexShrink: 0 }} /> SETTINGS <ChevronDownIcon style={{ width: '10px', height: '10px' }} />
                {pathname?.startsWith('/dashboard/settings') && (
                  <motion.div
                    layoutId="customerActiveUnderline"
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: 'var(--accent)',
                      boxShadow: '0 0 8px var(--accent)'
                    }}
                  />
                )}
              </div>
            </Link>

            <div className="megamenu-content">
              <div style={{ borderRight: '1px solid rgba(168, 85, 247, 0.2)', paddingRight: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', color: 'var(--accent-secondary)', letterSpacing: '1px' }}>PROFIL PERSONAL</span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: '1.4' }}>Atur data personal, alamat pengiriman default, dan preferensi notifikasi Anda.</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: 'var(--text-xs)' }}>
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--text-secondary)', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px' }}>AKSES CEPAT</span>
                <Link href="/dashboard/settings" style={{ textDecoration: 'none', color: 'var(--accent)', fontWeight: 'bold' }}>
                  ➔ PENGATURAN PROFIL
                </Link>
              </div>
            </div>
          </div>


          {/* Link: Ruang Komando Admin (Only visible if Admin role) */}
          {isAdmin && (
            <Link href="/admin" style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'var(--accent)',
                border: '1px solid var(--accent)',
                padding: '10px 16px',
                borderRadius: 'var(--radius-md)',
                color: 'var(--bg-void)',
                fontSize: 'var(--text-sm)',
                fontWeight: 700,
                letterSpacing: '0.5px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}>
                <CommandLineIcon style={{ width: '14px', height: '14px', flexShrink: 0 }} /> Admin
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
            border: '1px solid var(--border)',
            padding: '8px 12px',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-tertiary)',
            background: 'transparent',
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            transition: 'all 0.2s',
            cursor: 'pointer',
            fontFamily: 'var(--font-body)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 23, 68, 0.15)';
            e.currentTarget.style.borderColor = 'var(--danger)';
            e.currentTarget.style.color = 'var(--danger)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = 'var(--border)';
            e.currentTarget.style.color = 'var(--text-tertiary)';
          }}
        >
          <ArrowRightStartOnRectangleIcon style={{ width: '14px', height: '14px', flexShrink: 0 }} />
          Keluar
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
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 20px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.9);
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
          color: var(--accent) !important;
        }

        .megamenu-tab:focus-visible,
        .nav-link-item:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 2px;
          border-radius: 4px;
        }

        .radar-ping {
          width: 6px;
          height: 6px;
          background: var(--danger);
          border-radius: 50%;
          box-shadow: 0 0 6px var(--danger);
          display: inline-block;
          animation: pulse 1s infinite;
        }

        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.4; }
          100% { opacity: 1; }
        }

        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </nav>
  );
}
