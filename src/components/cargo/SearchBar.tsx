"use client";
import React, { useState, useEffect, useRef } from 'react';

interface SearchBarProps {
  onSearch: (filters: { q: string; status: string; mode: string }) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('all');
  const [mode, setMode] = useState('all');

  // Debouncing logic for input query
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any active timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set 300ms debounce timeout to optimize database calls
    searchTimeoutRef.current = setTimeout(() => {
      onSearch({ q, status, mode });
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [q, status, mode, onSearch]);

  const selectStyle: React.CSSProperties = {
    background: '#0D0618',
    border: '1px solid rgba(168, 85, 247, 0.35)',
    borderRadius: '6px',
    padding: '10px 16px',
    color: 'white',
    fontSize: '12px',
    outline: 'none',
    cursor: 'pointer',
    fontFamily: 'monospace',
    transition: 'all 0.3s ease',
    minWidth: '150px',
  };

  return (
    <div style={{
      display: 'flex',
      gap: '16px',
      alignItems: 'center',
      flexWrap: 'wrap',
      background: 'rgba(13, 6, 24, 0.4)',
      padding: '18px 24px',
      borderRadius: '8px',
      border: '1px solid rgba(168, 85, 247, 0.15)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      {/* Debounced Search Input */}
      <div style={{ flex: 1, position: 'relative', minWidth: '260px' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8B7BA8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}>
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="text"
          placeholder="Cari berdasarkan No Resi, Pengirim, Penerima, atau Nama Barang..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{
            width: '100%',
            background: '#0D0618',
            border: '1px solid rgba(168, 85, 247, 0.35)',
            borderRadius: '6px',
            padding: '11px 12px 11px 38px',
            color: 'white',
            fontSize: '12px',
            outline: 'none',
            fontFamily: 'monospace',
            boxSizing: 'border-box',
            transition: 'border-color 0.3s ease'
          }}
          onFocus={(e) => e.target.style.borderColor = '#A855F7'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(168, 85, 247, 0.35)'}
        />
      </div>

      {/* Transportation Mode Filter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '10px', color: '#8B7BA8', fontWeight: 'bold', fontFamily: 'monospace' }}>MODA:</span>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          style={selectStyle}
          onFocus={(e) => e.target.style.borderColor = '#A855F7'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(168, 85, 247, 0.35)'}
        >
          <option value="all" style={{ background: '#0D0618' }}>🚚 SEMUA MODA</option>
          <option value="darat" style={{ background: '#0D0618' }}>🚛 DARAT (TRUCK)</option>
          <option value="udara" style={{ background: '#0D0618' }}>✈️ UDARA (PESAWAT)</option>
          <option value="laut" style={{ background: '#0D0618' }}>🚢 LAUT (KAPAL)</option>
        </select>
      </div>

      {/* Shipment Status Filter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '10px', color: '#8B7BA8', fontWeight: 'bold', fontFamily: 'monospace' }}>STATUS:</span>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={selectStyle}
          onFocus={(e) => e.target.style.borderColor = '#A855F7'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(168, 85, 247, 0.35)'}
        >
          <option value="all" style={{ background: '#0D0618' }}>📦 SEMUA STATUS</option>
          <option value="diproses" style={{ background: '#0D0618' }}>📋 DIPROSES</option>
          <option value="dalam_pengiriman" style={{ background: '#0D0618' }}>⚡ DALAM PENGIRIMAN</option>
          <option value="sampai_tujuan" style={{ background: '#0D0618' }}>🏁 SAMPAI TUJUAN</option>
          <option value="pending" style={{ background: '#0D0618' }}>⏳ PENDING</option>
          <option value="selesai" style={{ background: '#0D0618' }}>✅ SELESAI</option>
        </select>
      </div>
    </div>
  );
}
