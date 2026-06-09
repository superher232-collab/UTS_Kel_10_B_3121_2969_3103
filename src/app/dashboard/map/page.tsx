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
      background: '#07020E',
      color: 'white',
      fontFamily: 'monospace',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ color: '#C084FC', letterSpacing: '2px', fontSize: '24px', margin: 0, fontWeight: 'bold' }}>
            🗺️ PERSONAL TRACKING RADAR
          </h1>
          <p style={{ fontSize: '11px', color: '#8B7BA8', margin: '4px 0 0 0' }}>
            Pemantauan rute dan posisi armada laut.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px', flex: 1, flexWrap: 'wrap' }}>
        
        {/* MAP VISUALIZATION AREA */}
        <div style={{
          flex: '2 1 600px',
          border: '1px solid rgba(168, 85, 247, 0.25)',
          borderRadius: '12px',
          background: '#0D0618',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
          minHeight: '400px'
        }}>
          {/* Grid background */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'linear-gradient(rgba(168, 85, 247, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(168, 85, 247, 0.05) 1px, transparent 1px)',
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
                fill="#1A112A" 
                stroke="#A855F7" 
                strokeWidth="0.5" 
                style={{ opacity: 0.6 }}
              />
            ))}

            {/* Ports/Cities Markers */}
            {Object.entries(POSITIONS).map(([city, pos]) => (
              <g key={city}>
                <circle cx={pos.x} cy={pos.y} r="0.6" fill="#8B7BA8" />
                <text x={pos.x} y={pos.y - 1.5} fontSize="2" fill="#8B7BA8" textAnchor="middle" style={{ opacity: 0.7 }}>{city}</text>
              </g>
            ))}

            {/* Active Shipments Lines & Ships */}
            {!loading && hasShipments && shipments.map((s, idx) => {
              const origin = POSITIONS[s.origin] || POSITIONS['Jakarta'];
              const dest = POSITIONS[s.destination] || POSITIONS['Surabaya'];
              const isSelected = selectedShipment?.id === s.id;
              
              // Simple interpolation for "current" position based on status
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
                    stroke={isSelected ? "#06B6D4" : "rgba(168,85,247,0.3)"} 
                    strokeWidth={isSelected ? "0.6" : "0.3"} 
                    strokeDasharray="2,1"
                  />
                  {/* Ship Marker */}
                  <circle cx={currentX} cy={currentY} r="1.5" fill={isSelected ? "#06B6D4" : "#A855F7"} />
                  {isSelected && (
                    <circle cx={currentX} cy={currentY} r="3" fill="none" stroke="#06B6D4" strokeWidth="0.4">
                      <animate attributeName="r" values="1.5;4" dur="1.5s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="1;0" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <text x={currentX} y={currentY - 2.5} fontSize="2" fill="white" textAnchor="middle" fontWeight="bold">
                    {s.receiptNo.slice(-6)}
                  </text>
                </g>
              )
            })}
          </svg>

          {/* Standby Ship Animation if no shipments */}
          {!loading && !hasShipments && (
            <div style={{ position: 'absolute', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <div style={{ position: 'relative', width: '60px', height: '60px', animation: 'float 3s ease-in-out infinite' }}>
                <div style={{ fontSize: '40px', filter: 'drop-shadow(0 0 15px rgba(6, 182, 212, 0.6))' }}>🚢</div>
                <div style={{
                  position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)',
                  width: '40px', height: '10px', background: 'radial-gradient(ellipse at center, rgba(6,182,212,0.4) 0%, transparent 70%)',
                  animation: 'pulse 2s infinite'
                }} />
              </div>
              <div style={{
                background: 'rgba(6, 182, 212, 0.1)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                padding: '8px 16px',
                borderRadius: '20px',
                color: '#06B6D4',
                fontSize: '11px',
                fontWeight: 'bold',
                letterSpacing: '1px'
              }}>
                🟢 ARMADA STANDBY (TERSEDIA)
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
          border: '1px solid rgba(168, 85, 247, 0.25)',
          borderRadius: '12px',
          background: '#0D0618',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
          maxHeight: '80vh',
          overflowY: 'auto'
        }}>
          <h2 style={{ fontSize: '13px', color: '#C084FC', borderBottom: '1px dashed rgba(168,85,247,0.3)', paddingBottom: '12px', margin: 0, fontWeight: 'bold' }}>
            {selectedShipment ? `INFO KARGO: ${selectedShipment.receiptNo}` : 'PEMANTAUAN KARGO AKTIF'}
          </h2>

          {loading ? (
            <div style={{ color: '#8B7BA8', fontSize: '11px', textAlign: 'center', marginTop: '20px' }}>Memuat radar...</div>
          ) : !hasShipments ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', height: '100%', textAlign: 'center', color: '#8B7BA8' }}>
              <span style={{ fontSize: '32px' }}>📡</span>
              <p style={{ fontSize: '11px', lineHeight: '1.6', margin: 0 }}>
                Saat ini Anda tidak memiliki kargo yang sedang aktif atau dalam perjalanan.<br/><br/>
                Armada kami dalam posisi <strong style={{color:'#06B6D4'}}>STANDBY</strong> dan siap melayani pengiriman Anda kapan saja.
              </p>
            </div>
          ) : selectedShipment ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                background: 'rgba(168, 85, 247, 0.05)',
                border: '1px solid rgba(168, 85, 247, 0.2)',
                padding: '16px',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div>
                  <span style={{ fontSize: '9px', color: '#8B7BA8', display: 'block' }}>NAMA BARANG</span>
                  <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'white' }}>{selectedShipment.itemName}</span>
                </div>
                <div>
                  <span style={{ fontSize: '9px', color: '#8B7BA8', display: 'block' }}>STATUS</span>
                  <span style={{ fontSize: '10px', color: '#06B6D4', fontWeight: 'bold', padding: '4px 8px', background: 'rgba(6,182,212,0.1)', borderRadius: '4px', display: 'inline-block', marginTop: '4px' }}>
                    {selectedShipment.status.replace('_', ' ')}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '9px', color: '#8B7BA8', display: 'block' }}>RUTE PERJALANAN</span>
                  <span style={{ fontSize: '11px', color: '#C7B8EA' }}>{selectedShipment.origin} <strong style={{color:'#A855F7'}}>→</strong> {selectedShipment.destination}</span>
                </div>
                <div style={{ marginTop: '8px' }}>
                  <button
                    onClick={() => window.location.href = `/dashboard/cargo/${selectedShipment.id}`}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: '#A855F7',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: 'bold',
                      fontSize: '11px',
                      cursor: 'pointer',
                      fontFamily: 'monospace'
                    }}
                  >
                    DETAIL PELACAKAN PENUH
                  </button>
                </div>
              </div>
              <button 
                onClick={() => setSelectedShipment(null)}
                style={{ background: 'transparent', border: '1px dashed #A855F7', color: '#A855F7', padding: '8px', borderRadius: '6px', fontSize: '10px', cursor: 'pointer', fontFamily: 'monospace' }}
              >
                Kembali ke Daftar Keseluruhan
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '10px', color: '#8B7BA8', marginBottom: '8px' }}>Pilih armada di peta untuk melihat detail. Kargo aktif Anda:</div>
              {shipments.map(s => (
                <div 
                  key={s.id} 
                  onClick={() => setSelectedShipment(s)}
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    padding: '12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(168,85,247,0.4)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#C084FC' }}>{s.receiptNo.slice(-8)}</span>
                    <span style={{ fontSize: '9px', color: '#06B6D4' }}>{s.status}</span>
                  </div>
                  <div style={{ fontSize: '10px', color: '#8B7BA8', marginTop: '6px' }}>{s.origin} → {s.destination}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}