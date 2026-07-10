'use client';

import React, { useState, useEffect } from 'react';

// Simplified SVG paths for an abstract Indonesia map view
const INDONESIA_PATHS = [
  // Sumatera
  "M 15 25 Q 25 35 35 50 L 25 55 Q 15 45 10 30 Z",
  // Kalimantan
  "M 45 25 L 65 20 Q 75 35 65 45 L 50 40 Z",
  // Jawa
  "M 35 60 Q 55 65 75 60 L 70 55 Q 50 60 40 55 Z",
  // Sulawesi
  "M 75 35 L 85 30 Q 90 40 85 50 L 75 45 Z",
  // Papua
  "M 100 40 L 125 40 Q 135 50 120 60 L 100 55 Z"
];

const POSITIONS: Record<string, { x: number, y: number }> = {
  'Jakarta': { x: 42, y: 58 },
  'Surabaya': { x: 60, y: 62 },
  'Makassar': { x: 80, y: 48 },
  'Medan': { x: 18, y: 30 },
  'Balikpapan': { x: 60, y: 38 },
  'Ambon': { x: 95, y: 45 },
  'Jayapura': { x: 122, y: 42 },
  'Semarang': { x: 50, y: 60 }
};

export default function CustomerMapPage() {
  const [shipments, setShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedShipment, setSelectedShipment] = useState<any | null>(null);

  useEffect(() => {
    fetch('/api/analytics?period=overall')
      .then(res => res.json())
      .then(data => {
        // Filter out active shipments (not completed/cancelled)
        const active = (data.recentShipments || []).filter((s: any) => 
          ['DALAM_PENGIRIMAN', 'DIPROSES', 'PENDING'].includes(s.status)
        );
        setShipments(active);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const hasShipments = shipments.length > 0;

  return (
    <div style={{
      width: '100%',
      height: '100%',
      minHeight: '80vh',
      background: 'var(--bg-void)',
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-body)',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ color: 'var(--text-primary)', fontSize: 'var(--text-2xl)', margin: 0, fontWeight: 700 }}>
            Pelacakan Kiriman
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', margin: '4px 0 0 0' }}>
            Pemantauan rute dan posisi armada laut.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px', flex: 1, flexWrap: 'wrap' }}>
        
        {/* MAP VISUALIZATION AREA */}
        <div style={{
          flex: '2 1 600px',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--bg-surface)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px'
        }}>
          {/* Grid background */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            opacity: 0.5
          }} />

          {/* SVG Map Container */}
          <svg viewBox="0 0 140 80" style={{ width: '100%', height: '100%', position: 'absolute', zIndex: 1 }}>
            {/* Islands */}
            {INDONESIA_PATHS.map((path, idx) => (
              <path 
                key={idx} 
                d={path} 
                fill="var(--bg-elevated)" 
                stroke="var(--accent)" 
                strokeWidth="0.5" 
                style={{ opacity: 0.6 }}
              />
            ))}

            {/* Ports/Cities Markers */}
            {Object.entries(POSITIONS).map(([city, pos]) => (
              <g key={city}>
                <circle cx={pos.x} cy={pos.y} r="0.6" fill="var(--text-tertiary)" />
                <text x={pos.x} y={pos.y - 1.5} fontSize="2" fill="var(--text-tertiary)" textAnchor="middle" style={{ opacity: 0.7 }}>{city}</text>
              </g>
            ))}

            {/* Active Shipments Lines & Ships */}
            {!loading && hasShipments && shipments.map((s, idx) => {
              const origin = POSITIONS[s.origin] || POSITIONS['Jakarta'];
              const dest = POSITIONS[s.destination] || POSITIONS['Surabaya'];
              const isSelected = selectedShipment?.id === s.id;
              
              let progress = 0.5;
              if (s.status === 'PENDING' || s.status === 'DIPROSES') progress = 0.1;
              if (s.status === 'DALAM_PENGIRIMAN') progress = 0.6;
              
              const currentX = origin.x + (dest.x - origin.x) * progress;
              const currentY = origin.y + (dest.y - origin.y) * progress;
              
              return (
                <g key={s.id} onClick={() => setSelectedShipment(s)} style={{ cursor: 'pointer' }}>
                  <line 
                    x1={origin.x} y1={origin.y} 
                    x2={dest.x} y2={dest.y} 
                    stroke={isSelected ? "var(--accent)" : "rgba(0,229,255,0.3)"} 
                    strokeWidth={isSelected ? "0.6" : "0.3"} 
                    strokeDasharray="2,1"
                  />
                  {/* Ship Marker */}
                  <circle cx={currentX} cy={currentY} r="1.5" fill={isSelected ? "var(--accent)" : "var(--accent)"} />
                  {isSelected && (
                    <circle cx={currentX} cy={currentY} r="3" fill="none" stroke="var(--accent)" strokeWidth="0.4">
                      <animate attributeName="r" values="1.5;4" dur="1.5s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="1;0" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <text x={currentX} y={currentY - 2.5} fontSize="2" fill="var(--text-primary)" textAnchor="middle" fontWeight="bold">
                    {s.receiptNo.slice(-6)}
                  </text>
                </g>
              )
            })}
          </svg>

          {/* Standby Ship Animation if no shipments */}
          {!loading && !hasShipments && (
            <div style={{ position: 'absolute', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <div style={{
                background: 'var(--accent-dim)',
                border: '1px solid rgba(0,229,255,0.3)',
                padding: '8px 16px',
                borderRadius: '20px',
                color: 'var(--accent)',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                letterSpacing: '1px'
              }}>
                Armada Siap
              </div>
            </div>
          )}

          <style>{`
            @keyframes float { 0% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-8px) rotate(2deg); } 100% { transform: translateY(0px) rotate(0deg); } }
            @keyframes pulse { 0% { opacity: 0.5; transform: translateX(-50%) scale(0.8); } 50% { opacity: 1; transform: translateX(-50%) scale(1.2); } 100% { opacity: 0.5; transform: translateX(-50%) scale(0.8); } }
          `}</style>
        </div>

        {/* SIDEBAR AREA */}
        <div style={{
          flex: '1 1 300px',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--bg-surface)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          maxHeight: '80vh',
          overflowY: 'auto'
        }}>
          <h2 style={{ fontSize: 'var(--text-sm)', color: 'var(--accent)', borderBottom: '1px solid var(--border)', paddingBottom: '12px', margin: 0, fontWeight: 600 }}>
            {selectedShipment ? `Info Kargo: ${selectedShipment.receiptNo}` : 'Pemantauan Kargo Aktif'}
          </h2>

          {loading ? (
            <div style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)', textAlign: 'center', marginTop: '20px' }}>Memuat data...</div>
          ) : !hasShipments ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', height: '100%', textAlign: 'center', color: 'var(--text-tertiary)' }}>
              <p style={{ fontSize: 'var(--text-sm)', lineHeight: '1.6', margin: 0 }}>
                Saat ini Anda tidak memiliki kargo yang sedang aktif atau dalam perjalanan.
              </p>
            </div>
          ) : selectedShipment ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                background: 'var(--accent-dim)',
                border: '1px solid rgba(0,229,255,0.2)',
                padding: '16px',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', display: 'block' }}>Nama Barang</span>
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>{selectedShipment.itemName}</span>
                </div>
                <div>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', display: 'block' }}>Status</span>
                  <span className="badge badge-accent" style={{ marginTop: '4px' }}>
                    {selectedShipment.status.replace('_', ' ')}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', display: 'block' }}>Rute Perjalanan</span>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{selectedShipment.origin} <strong style={{color:'var(--accent)'}}>→</strong> {selectedShipment.destination}</span>
                </div>
                <div style={{ marginTop: '8px' }}>
                  <button
                    onClick={() => window.location.href = `/dashboard/cargo/${selectedShipment.id}`}
                    className="btn-primary"
                    style={{ width: '100%', padding: '10px', fontSize: 'var(--text-sm)' }}
                  >
                    Detail Pelacakan
                  </button>
                </div>
              </div>
              <button 
                onClick={() => setSelectedShipment(null)}
                className="btn-secondary"
                style={{ fontSize: 'var(--text-xs)' }}
              >
                Kembali ke Daftar
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: '8px' }}>Pilih armada di peta untuk melihat detail. Kargo aktif Anda:</div>
              {shipments.map(s => (
                <div 
                  key={s.id} 
                  onClick={() => setSelectedShipment(s)}
                  style={{
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border)',
                    padding: '12px',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-focus)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--accent)' }}>{s.receiptNo.slice(-8)}</span>
                    <span className="badge badge-accent">{s.status}</span>
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: '6px' }}>{s.origin} → {s.destination}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}