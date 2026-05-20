"use client";
import React from 'react';
import { useDashboard } from '@/context/DashboardContext';

export default function AnalyticsPage() {
  const { armada = [] } = useDashboard() || {};

  const total       = armada.length;
  const berlayar    = armada.filter(s => s.status?.toLowerCase().includes('perjalanan')).length;
  const sandar      = armada.filter(s => s.status?.toLowerCase().includes('pelabuhan')).length;
  const terlambat   = armada.filter(s => s.status?.toLowerCase().includes('terlambat')).length;
  const maintenance = armada.filter(s => s.status?.toLowerCase().includes('pemeliharaan')).length;

  // Grafik batang — hitung dari tujuan armada
  const pelabuhan = ['Tanjung Perak', 'Belawan', 'Makassar', 'Sorong', 'Tanjung Priok'];
  const barData = pelabuhan.map(p => ({
    label: p === 'Tanjung Perak' ? 'Tj Perak' : p === 'Tanjung Priok' ? 'Tj Priok' : p,
    count: armada.filter(s => s.destination?.toLowerCase().includes(p.toLowerCase())).length,
  }));
  const maxBar = Math.max(...barData.map(b => b.count), 1);

  const getStatusColor = (status: any) => {
    if (!status) return '#8B7BA8';
    const s = status.toLowerCase();
    if (s.includes('perjalanan')) return '#22C55E';
    if (s.includes('pelabuhan'))  return '#3B82F6';
    if (s.includes('terlambat'))  return '#F59E0B';
    if (s.includes('pemeliharaan')) return '#EF4444';
    return '#8B7BA8';
  };

  const getKeterangan = (ship: any) => {
    const s = ship.status?.toLowerCase() || '';
    if (s.includes('terlambat'))    return 'Terlambat — kemungkinan cuaca buruk atau kendala teknis';
    if (s.includes('pemeliharaan')) return 'Dalam perawatan di galangan — tidak beroperasi';
    if (s.includes('pelabuhan'))    return 'Sandar di pelabuhan — menunggu jadwal keberangkatan';
    if (s.includes('perjalanan'))   return 'Dalam perjalanan menuju tujuan';
    return 'Status tidak diketahui';
  };

  const formatEta = (eta: any) => {
    if (!eta) return '-';
    try {
      return new Date(eta).toLocaleString('id-ID', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    } catch { return eta; }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', color: 'white', fontFamily: 'monospace' }}>
      {/* Top Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        {[
          { label: 'Total Armada',      value: total,       color: '#22C55E', icon: <><circle cx="12" cy="12" r="10"/><polyline points="12 16 16 12 12 8"/><line x1="8" y1="12" x2="16" y2="12"/></> },
          { label: 'Sedang Berlayar',   value: berlayar,    color: '#C7B8EA', icon: <><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></> },
          { label: 'Di Pelabuhan',      value: sandar,      color: '#3B82F6', icon: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></> },
          { label: 'Pemeliharaan/Terlambat', value: maintenance + terlambat, color: '#EAB308', icon: <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/> },
        ].map(({ label, value, color, icon }) => (
          <div key={label} style={{ background: 'var(--bg-card, #130a24)', border: '1px solid rgba(168, 85, 247, 0.2)', borderRadius: '4px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted, #8B7BA8)' }}>{label}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color }}>{value} Kapal</div>
          </div>
        ))}
      </div>

      {/* Grafik Batang — lebih kecil */}
      <div style={{ background: 'var(--bg-card, #130a24)', border: '1px solid rgba(168, 85, 247, 0.2)', borderRadius: '4px', padding: '16px', height: '200px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '12px' }}>DISTRIBUSI ARMADA PER PELABUHAN TUJUAN</div>
        <div style={{ flex: 1, position: 'relative' }}>
          <div style={{ position: 'absolute', left: '35px', right: 0, top: '4px', bottom: '24px', borderLeft: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', padding: '0 10px' }}>
            <div style={{ position: 'absolute', left: 0, right: 0, top: '33%', borderTop: '1px dashed rgba(255,255,255,0.05)' }} />
            <div style={{ position: 'absolute', left: 0, right: 0, top: '66%', borderTop: '1px dashed rgba(255,255,255,0.05)' }} />
            {barData.map((bar, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', width: '12%', gap: '4px' }}>
                <span style={{ fontSize: '9px', color: '#A855F7' }}>{bar.count}</span>
                <div style={{ background: '#A855F7', height: `${(bar.count / maxBar) * 100}%`, minHeight: bar.count > 0 ? '4px' : '0', width: '100%', borderTopLeftRadius: '2px', borderTopRightRadius: '2px' }} />
              </div>
            ))}
          </div>
          <div style={{ position: 'absolute', left: '35px', right: 0, bottom: 0, display: 'flex', justifyContent: 'space-around', fontSize: '9px', color: 'var(--text-muted, #8B7BA8)', padding: '0 10px' }}>
            {barData.map(b => <span key={b.label}>{b.label}</span>)}
          </div>
        </div>
      </div>

      {/* Logbook — detail */}
      <div style={{ background: 'var(--bg-card, #130a24)', border: '1px solid rgba(168, 85, 247, 0.2)', borderRadius: '4px', padding: '16px' }}>
        <div style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '16px', textTransform: 'uppercase' }}>LOGBOOK PERGERAKAN TERAKHIR</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {armada.slice(0, 6).map((ship, i) => (
            <div key={ship.id || i} style={{ display: 'grid', gridTemplateColumns: '180px 1fr 1fr 180px', gap: '12px', alignItems: 'start', padding: '14px 0', borderBottom: i < 5 ? '1px dashed rgba(255,255,255,0.07)' : 'none' }}>
              
              {/* Kolom 1: Nama + Jenis */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '12px', color: '#A855F7', fontWeight: 'bold' }}>{ship.name || '-'}</span>
                <span style={{ fontSize: '10px', color: '#8B7BA8' }}>{ship.type || '-'}</span>
              </div>

              {/* Kolom 2: Status + Keterangan */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: getStatusColor(ship.status) }}>{ship.status || '-'}</span>
                <span style={{ fontSize: '10px', color: '#8B7BA8', lineHeight: '1.5' }}>{getKeterangan(ship)}</span>
              </div>

              {/* Kolom 3: Rute */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px' }}>
                  <span style={{ color: '#8B7BA8' }}>Dari</span>
                  <span style={{ color: 'white' }}>{ship.location || '-'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px' }}>
                  <span style={{ color: '#8B7BA8' }}>Ke</span>
                  <span style={{ color: 'white' }}>{ship.destination || '-'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px' }}>
                  <span style={{ color: '#8B7BA8' }}>Muatan</span>
                  <span style={{ color: 'white' }}>{ship.cargo || '-'}</span>
                </div>
              </div>

              {/* Kolom 4: ETA */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'right' }}>
                <span style={{ fontSize: '10px', color: '#8B7BA8' }}>Perkiraan Tiba</span>
                <span style={{ fontSize: '11px', color: ship.status?.toLowerCase().includes('terlambat') ? '#F59E0B' : 'white', fontWeight: ship.status?.toLowerCase().includes('terlambat') ? 'bold' : 'normal' }}>
                  {formatEta(ship.eta)}
                </span>
                {ship.status?.toLowerCase().includes('terlambat') && (
                  <span style={{ fontSize: '9px', color: '#F59E0B' }}>⚠ Melewati jadwal</span>
                )}
                {ship.status?.toLowerCase().includes('pemeliharaan') && (
                  <span style={{ fontSize: '9px', color: '#EF4444' }}>🔧 Tidak beroperasi</span>
                )}
              </div>

            </div>
          ))}

          {armada.length === 0 && (
            <div style={{ fontSize: '11px', color: '#8B7BA8', textAlign: 'center', padding: '24px' }}>
              Menunggu sinkronisasi data logbook...
            </div>
          )}
        </div>
      </div>

    </div>
  );
}