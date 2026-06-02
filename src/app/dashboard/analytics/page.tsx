"use client";
import React from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { AnalyticsClient } from '@/components/admin/AnalyticsClient';

export default function AnalyticsPage() {
  const { armada = [], logs = [], errorSignal } = useDashboard() || {};

  const total       = armada.length;
  const berlayar    = armada.filter((s: any) => s.status?.toLowerCase().includes('perjalanan')).length;
  const sandar      = armada.filter((s: any) => s.status?.toLowerCase().includes('pelabuhan')).length;
  const terlambat   = armada.filter((s: any) => s.status?.toLowerCase().includes('terlambat')).length;
  const maintenance = armada.filter((s: any) => s.status?.toLowerCase().includes('pemeliharaan')).length;

  // Donut chart calculations
  const totalArmada = total || 1;
  const pctBerlayar = (berlayar / totalArmada) * 100;
  const pctSandar = (sandar / totalArmada) * 100;
  const pctTerlambat = (terlambat / totalArmada) * 100;
  const pctPerawatan = (maintenance / totalArmada) * 100;

  const circumference = 2 * Math.PI * 35; // ~219.9
  let accumulatedPercent = 0;

  const segments = [
    { label: 'Sedang Berlayar', count: berlayar, pct: pctBerlayar, color: '#22C55E', shadow: 'rgba(34, 197, 94, 0.4)' },
    { label: 'Sandar Pelabuhan', count: sandar, pct: pctSandar, color: '#3B82F6', shadow: 'rgba(59, 130, 246, 0.4)' },
    { label: 'Terlambat Operasi', count: terlambat, pct: pctTerlambat, color: '#F59E0B', shadow: 'rgba(245, 158, 11, 0.4)' },
    { label: 'Dalam Perawatan', count: maintenance, pct: pctPerawatan, color: '#EF4444', shadow: 'rgba(239, 68, 68, 0.4)' }
  ].filter(s => s.count > 0);

  const segmentRings = segments.map((seg) => {
    const strokeDasharray = `${(seg.pct / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
    accumulatedPercent += seg.pct;
    return {
      ...seg,
      strokeDasharray,
      strokeDashoffset
    };
  });

  // Bar chart calculations — count of vessels by destination port
  const pelabuhan = ['Tanjung Perak', 'Belawan', 'Makassar', 'Sorong', 'Tanjung Priok'];
  const barData = pelabuhan.map(p => ({
    label: p === 'Tanjung Perak' ? 'Tj Perak' : p === 'Tanjung Priok' ? 'Tj Priok' : p,
    count: armada.filter((s: any) => s.destination?.toLowerCase().includes(p.toLowerCase())).length,
  }));
  const maxBar = Math.max(...barData.map(b => b.count), 1);

  const getStatusBadgeStyle = (status: string) => {
    const base: React.CSSProperties = {
      padding: '2px 6px',
      borderRadius: '4px',
      fontSize: '8px',
      fontWeight: 'bold',
      fontFamily: 'monospace',
      border: '1px solid',
      display: 'inline-block'
    };

    const s = status.toUpperCase();
    if (s.includes('PERJALANAN') || s.includes('ONLINE')) {
      return { ...base, background: 'rgba(34, 197, 94, 0.1)', borderColor: '#22C55E', color: '#22C55E' };
    } else if (s.includes('PELABUHAN') || s.includes('PORT')) {
      return { ...base, background: 'rgba(59, 130, 246, 0.1)', borderColor: '#3B82F6', color: '#3B82F6' };
    } else if (s.includes('TERLAMBAT') || s.includes('DELAYED')) {
      return { ...base, background: 'rgba(245, 158, 11, 0.1)', borderColor: '#F59E0B', color: '#F59E0B' };
    } else {
      return { ...base, background: 'rgba(239, 68, 68, 0.1)', borderColor: '#EF4444', color: '#EF4444' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', color: 'white', fontFamily: 'monospace' }}>

      {/* ── PUSAT ANALITIK (Harian / Mingguan / Bulanan / Keseluruhan) ── */}
      <AnalyticsClient role="OPERATOR" />

      {/* ── MONITORING ARMADA (Legacy telemetri) ── */}
      <div style={{ borderTop: '1px dashed rgba(168,85,247,0.2)', paddingTop: '24px' }}>
        <div style={{ fontSize: '10px', color: '#8B7BA8', letterSpacing: '1.5px', marginBottom: '16px', fontWeight: 'bold' }}>
          🛰️ MONITORING ARMADA &amp; LOGBOOK TELEMETRI
        </div>
      
      {/* SWR warning info */}
      {errorSignal && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid #EF4444',
          padding: '12px 18px',
          borderRadius: '6px',
          fontSize: '11px',
          color: '#FCA5A5',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span>⚠️</span>
          <span><strong>TELEMETRI SATELIT GAGAL:</strong> Menampilkan telemetri terakhir yang tersimpan di cache. Pembaruan grafik dinonaktifkan sementara hingga koneksi satelit pulih.</span>
        </div>
      )}

      {/* Stats Summary Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        {[
          { label: 'TOTAL ARMADA TERDAFTAR', value: total, color: '#C084FC', border: 'rgba(168, 85, 247, 0.3)', icon: <circle cx="12" cy="12" r="10" /> },
          { label: 'SEDANG BERLAYAR (ON ROUTE)', value: berlayar, color: '#22C55E', border: 'rgba(34, 197, 94, 0.3)', icon: <path d="M5 3v18M5 5l14 4-14 4" /> },
          { label: 'DI PELABUHAN (DOCKED)', value: sandar, color: '#3B82F6', border: 'rgba(59, 130, 246, 0.3)', icon: <path d="M12 22V10M12 10a4 4 0 0 1 4-4h2M12 10a4 4 0 0 0-4-4H6M12 2a3 3 0 1 0 0 6 3 3 0 1 0 0-6z" /> },
          { label: 'PEMELIHARAAN & TERLAMBAT', value: maintenance + terlambat, color: '#F59E0B', border: 'rgba(245, 158, 11, 0.3)', icon: <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" /> },
        ].map(({ label, value, color, border, icon }) => (
          <div key={label} style={{ 
            background: '#0D0618', 
            border: `1px solid ${border}`, 
            borderRadius: '8px', 
            padding: '20px', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.6)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '9px', color: '#8B7BA8', fontWeight: 'bold', letterSpacing: '0.5px' }}>{label}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color, textShadow: `0 0 10px ${color}33` }}>
              {value} <span style={{ fontSize: '12px', color: '#8B7BA8', fontWeight: 'normal' }}>Unit</span>
            </div>
          </div>
        ))}
      </div>

      {/* Cybernetic Charts Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: '20px' }}>
        
        {/* Rounded Gradient SVG Bar Chart Card */}
        <div style={{ 
          background: '#0D0618', 
          border: '1px solid rgba(168, 85, 247, 0.25)', 
          borderRadius: '8px', 
          padding: '24px',
          boxShadow: '0 4px 25px rgba(0,0,0,0.6)'
        }}>
          <div style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '1.5px', color: '#C084FC', marginBottom: '16px', borderBottom: '1px dashed rgba(168, 85, 247, 0.2)', paddingBottom: '10px' }}>
            DISTRIBUSI ARMADA PER PELABUHAN TUJUAN
          </div>
          
          <div style={{ width: '100%', height: '190px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="100%" height="100%" viewBox="0 0 450 180" style={{ overflow: 'visible' }}>
              <defs>
                <linearGradient id="bar-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#A855F7" />
                  <stop offset="100%" stopColor="#6366F1" stopOpacity="0.2" />
                </linearGradient>
                <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              
              {/* Gridlines */}
              <line x1="40" y1="20" x2="420" y2="20" stroke="rgba(168, 85, 247, 0.08)" strokeDasharray="3 3" />
              <line x1="40" y1="70" x2="420" y2="70" stroke="rgba(168, 85, 247, 0.08)" strokeDasharray="3 3" />
              <line x1="40" y1="120" x2="420" y2="120" stroke="rgba(168, 85, 247, 0.08)" strokeDasharray="3 3" />
              
              {/* Axes */}
              <line x1="40" y1="10" x2="40" y2="150" stroke="rgba(168, 85, 247, 0.2)" strokeWidth="1" />
              <line x1="40" y1="150" x2="430" y2="150" stroke="rgba(168, 85, 247, 0.2)" strokeWidth="1" />
              
              {/* Bars */}
              {barData.map((bar, idx) => {
                const x = 60 + idx * 75;
                const barHeight = (bar.count / maxBar) * 120;
                const y = 150 - barHeight;
                const barWidth = 32;
                return (
                  <g key={idx}>
                    {/* Glowing bar */}
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={Math.max(barHeight, 2)}
                      fill="url(#bar-gradient)"
                      stroke="#C084FC"
                      strokeWidth="1.5"
                      rx="4"
                      style={{ transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
                      filter="url(#neon-glow)"
                    />
                    {/* Count value */}
                    <text
                      x={x + barWidth / 2}
                      y={y - 8}
                      fill="#C084FC"
                      fontSize="10px"
                      fontWeight="bold"
                      textAnchor="middle"
                      style={{ fontFamily: 'monospace' }}
                    >
                      {bar.count}
                    </text>
                    {/* Axis Label */}
                    <text
                      x={x + barWidth / 2}
                      y="166"
                      fill="#8B7BA8"
                      fontSize="9px"
                      textAnchor="middle"
                      style={{ fontFamily: 'monospace', fontWeight: 'bold' }}
                    >
                      {bar.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Dynamic Interactive SVG Donut Chart Card */}
        <div style={{ 
          background: '#0D0618', 
          border: '1px solid rgba(168, 85, 247, 0.25)', 
          borderRadius: '8px', 
          padding: '24px',
          boxShadow: '0 4px 25px rgba(0,0,0,0.6)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '1.5px', color: '#C084FC', marginBottom: '16px', borderBottom: '1px dashed rgba(168, 85, 247, 0.2)', paddingBottom: '10px' }}>
            BREAKDOWN STATUS OPERASIONAL
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1 }}>
            
            {/* Centered Donut Ring */}
            <div style={{ position: 'relative', width: '130px', height: '130px', flexShrink: 0 }}>
              <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                {/* Base gray ring */}
                <circle cx="50" cy="50" r="35" fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="10" />
                
                {segmentRings.map((ring, idx) => (
                  <circle
                    key={idx}
                    cx="50"
                    cy="50"
                    r="35"
                    fill="transparent"
                    stroke={ring.color}
                    strokeWidth="10"
                    strokeDasharray={ring.strokeDasharray}
                    strokeDashoffset={ring.strokeDashoffset}
                    style={{
                      transition: 'all 0.5s ease'
                    }}
                  />
                ))}
              </svg>
              {/* Inner absolute label block */}
              <div style={{ 
                position: 'absolute', 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '7px', color: '#8B7BA8', fontWeight: 'bold', letterSpacing: '0.5px' }}>ARMADA</span>
                <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>{total}</span>
                <span style={{ fontSize: '7px', color: '#8B7BA8', fontWeight: 'bold' }}>TOTAL</span>
              </div>
            </div>

            {/* Color Ledgends */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
              {segments.map((seg, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '8px', height: '8px', background: seg.color, borderRadius: '50%', boxShadow: `0 0 6px ${seg.color}` }} />
                    <span style={{ fontSize: '10px', color: 'white' }}>{seg.label}</span>
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 'bold', color: seg.color }}>
                    {seg.count} <span style={{ color: '#8B7BA8', fontSize: '8px', fontWeight: 'normal' }}>({seg.pct.toFixed(0)}%)</span>
                  </span>
                </div>
              ))}
              {segments.length === 0 && (
                <div style={{ fontSize: '9px', color: '#8B7BA8' }}>Tidak ada kapal aktif.</div>
              )}
            </div>

          </div>
        </div>

      </div>

      {/* Cyberpunk console Terminal Logbook Table */}
      <div style={{ 
        background: '#0D0618', 
        border: '1px solid rgba(168, 85, 247, 0.25)', 
        borderRadius: '8px', 
        padding: '24px',
        boxShadow: '0 4px 25px rgba(0,0,0,0.6)'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          borderBottom: '1px dashed rgba(168, 85, 247, 0.2)', 
          paddingBottom: '12px',
          marginBottom: '16px' 
        }}>
          <div style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '1.5px', color: '#C084FC' }}>
            LOGBOOK MONITORING ARMADA KONSOL UTAMA
          </div>
          <div style={{ fontSize: '9px', color: '#8B7BA8', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '6px', height: '6px', background: '#22C55E', borderRadius: '50%', animation: 'pulse-dot 1.5s infinite' }}></span>
            REAL-TIME FEED
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '11px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(168, 85, 247, 0.25)', color: '#8B7BA8', height: '32px' }}>
                <th style={{ padding: '8px', width: '130px' }}>TIMESTAMP</th>
                <th style={{ padding: '8px', width: '150px' }}>NAMA ARMADA</th>
                <th style={{ padding: '8px', width: '150px' }}>EVENT KATEGORI</th>
                <th style={{ padding: '8px', width: '120px' }}>STATUS RE-ENTRY</th>
                <th style={{ padding: '8px' }}>CATATAN TELEMETRI</th>
              </tr>
            </thead>
            <tbody>
              {logs.slice(0, 10).map((log: any, idx: number) => (
                <tr 
                  key={log.id || idx} 
                  style={{ 
                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)', 
                    height: '38px',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(168, 85, 247, 0.04)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: '8px', color: '#8B7BA8', fontFamily: 'monospace', fontSize: '10px' }}>{log.timestamp}</td>
                  <td style={{ padding: '8px', fontWeight: 'bold', color: '#C084FC' }}>{log.vesselName}</td>
                  <td style={{ padding: '8px', color: 'white' }}>{log.event}</td>
                  <td style={{ padding: '8px' }}>
                    <span style={getStatusBadgeStyle(log.status)}>{log.status}</span>
                  </td>
                  <td style={{ padding: '8px', color: '#C7B8EA', fontSize: '10px', lineHeight: '1.4' }}>{log.notes}</td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: '#8B7BA8' }}>
                    Belum ada riwayat aktivitas logbook terdeteksi di server satelit.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      </div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
      `}</style>

    </div>
  );
}