"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useDashboard } from '@/context/DashboardContext';

interface InteractiveMapProps {
  compact?: boolean;
}

export function InteractiveMap({ compact = false }: InteractiveMapProps) {
  const { armada, cuaca, errorSignal } = useDashboard();
  
  // State untuk menyimpan posisi dinamis kapal yang dirender ke layar
  const [positions, setPositions] = useState<any[]>([]);
  // Ref untuk menyimpan data gerak tanpa memicu re-render berlebihan
  const shipsRef = useRef<any[]>([]);
  const animRef = useRef<any>(null);

  useEffect(() => {
    if (!armada || armada.length === 0) return;

    // Inisialisasi/sinkronisasi shipsRef.current dengan armada dari database
    const updatedShips = armada.map((s: any) => {
      const existing = shipsRef.current.find((x: any) => x.id === s.id);
      
      const isMoving = s.status?.toUpperCase().includes('PERJALANAN') || s.status?.toUpperCase().includes('BERLAYAR');
      const isPort = s.status?.toUpperCase().includes('PELABUHAN') || s.status?.toUpperCase().includes('SANDAR');
      const isDelayed = s.status?.toUpperCase().includes('TERLAMBAT');
      const isMaintenance = s.status?.toUpperCase().includes('PEMELIHARAAN') || s.status?.toUpperCase().includes('PERBAIKAN');

      let statusColor = '#22C55E'; // Hijau: Berlayar
      if (isPort) statusColor = '#3B82F6'; // Biru: Di Pelabuhan
      if (isDelayed) statusColor = '#F59E0B'; // Oranye: Terlambat
      if (isMaintenance) statusColor = '#EF4444'; // Merah: Perawatan

      const targetX = s.latitude || 500;
      const targetY = s.longitude || 250;

      return {
        ...s,
        x: existing ? existing.x : targetX,
        y: existing ? existing.y : targetY,
        tx: targetX,
        ty: targetY,
        statusText: s.status,
        statusColor,
        isMoving
      };
    });

    shipsRef.current = updatedShips;
    setPositions(updatedShips);

    // Loop animasi untuk interpolasi gerak kapal dan simulasi ombak maritim
    const tick = () => {
      shipsRef.current = shipsRef.current.map((ship: any) => {
        const currentDbShip = armada.find((x: any) => x.id === ship.id);
        const tx = currentDbShip ? (currentDbShip.latitude || ship.tx) : ship.tx;
        const ty = currentDbShip ? (currentDbShip.longitude || ship.ty) : ship.ty;

        // Interpolasi pergerakan kapal yang sangat halus menuju koordinat target
        let nx = ship.x + (tx - ship.x) * 0.04;
        let ny = ship.y + (ty - ship.y) * 0.04;

        // Simulasi terombang-ambing akibat gelombang laut/cuaca
        let driftX = 0;
        let driftY = 0;

        if (cuaca === 'Badai Ekstrem') {
          driftX = Math.sin(Date.now() * 0.003 + ship.id) * 0.8;
          driftY = Math.cos(Date.now() * 0.003 + ship.id + 1) * 0.8;
        } else if (cuaca === 'Terik Gersang') {
          driftX = Math.sin(Date.now() * 0.004 + ship.id) * 0.4;
          driftY = Math.cos(Date.now() * 0.004 + ship.id + 1) * 0.4;
        } else {
          driftX = Math.sin(Date.now() * 0.0015 + ship.id) * 0.2;
          driftY = Math.cos(Date.now() * 0.0015 + ship.id + 1) * 0.2;
        }

        nx += driftX;
        ny += driftY;

        const isMoving = currentDbShip ? (
          currentDbShip.status?.toUpperCase().includes('PERJALANAN') || currentDbShip.status?.toUpperCase().includes('BERLAYAR')
        ) : ship.isMoving;

        return {
          ...ship,
          x: nx,
          y: ny,
          tx,
          ty,
          statusText: currentDbShip ? currentDbShip.status : ship.statusText,
          statusColor: currentDbShip ? (
            currentDbShip.status?.toUpperCase().includes('PERJALANAN') ? '#22C55E' :
            currentDbShip.status?.toUpperCase().includes('PELABUHAN') ? '#3B82F6' :
            currentDbShip.status?.toUpperCase().includes('TERLAMBAT') ? '#F59E0B' : '#EF4444'
          ) : ship.statusColor,
          isMoving
        };
      });

      setPositions([...shipsRef.current]);
      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animRef.current);
  }, [armada, cuaca]);

  const isStorm = cuaca === 'Badai Ekstrem';
  const isWindy = cuaca === 'Terik Gersang';
  const isNormal = cuaca === 'Normal' || !cuaca;

  const heightVal = compact ? '320px' : '500px';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', color: 'white', fontFamily: 'var(--font-body)' }}>
      
      {/* SWR warning info */}
      {errorSignal && (
        <div style={{
          background: 'rgba(255, 23, 68, 0.1)',
          border: '1px solid var(--danger)',
          padding: '12px 18px',
          borderRadius: 'var(--radius-md)',
          fontSize: 'var(--text-sm)',
          color: '#FCA5A5',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '16px'
        }}>
          <span><strong>TELEMETRI SATELIT GAGAL:</strong> Menampilkan data terakhir yang tersimpan. Sinyal kembali normal secara otomatis.</span>
        </div>
      )}

      {/* Main Map Container */}
      <div style={{ 
        background: 'var(--bg-surface)', 
        border: '1px solid var(--border)', 
        borderRadius: 'var(--radius-lg)', 
        padding: compact ? '16px' : '24px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '16px', 
        position: 'relative'
      }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--accent)' }}>Pelacakan Armada</span> &mdash; Status Cuaca: 
            <span style={{ 
              color: isStorm ? 'var(--danger)' : isWindy ? 'var(--warning)' : 'var(--success)', 
            }}>
              {cuaca?.toUpperCase() || 'NORMAL'}
            </span>
          </div>
          
          {isStorm && (
            <div style={{
              background: 'rgba(255, 23, 68, 0.2)',
              border: '1px solid var(--danger)',
              borderRadius: 'var(--radius-md)',
              padding: '4px 8px',
              color: '#FCA5A5',
              fontSize: 'var(--text-xs)',
              fontWeight: 700,
              animation: 'pulse 1s infinite'
            }}>
              BADAI AKTIF
            </div>
          )}
        </div>

        {/* Map Area */}
        <div style={{ 
          background: 'var(--bg-void)', 
          border: '1px solid var(--border)', 
          borderRadius: 'var(--radius-md)', 
          height: heightVal, 
          position: 'relative', 
          overflow: 'hidden' 
        }}>
          
          {/* Live Tracking Label */}
          <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(6,6,8,0.85)', border: '1px solid var(--border)', padding: '6px 12px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 10 }}>
            <div style={{ width: '6px', height: '6px', background: 'var(--success)', borderRadius: '50%', boxShadow: '0 0 8px var(--success)', animation: 'pulse 1.5s infinite' }}></div>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--success)', fontWeight: 700 }}>LIVE MONITOR</span>
          </div>

          {/* Legend */}
          {!compact && (
            <div style={{ position: 'absolute', bottom: '16px', left: '16px', background: 'rgba(6,6,8,0.85)', border: '1px solid var(--border)', padding: '12px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 10 }}>
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-tertiary)', borderBottom: '1px solid var(--border)', paddingBottom: '4px', marginBottom: '2px' }}>LEGENDA</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', background: 'var(--success)', borderRadius: '50%', boxShadow: '0 0 8px var(--success)' }}></div>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Berlayar</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', background: 'var(--info)', borderRadius: '50%', boxShadow: '0 0 8px var(--info)' }}></div>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Pelabuhan</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', background: 'var(--danger)', borderRadius: '50%', boxShadow: '0 0 8px var(--danger)' }}></div>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Pemeliharaan</span>
              </div>
            </div>
          )}

          {/* Map SVG */}
          <svg width="100%" height="100%" viewBox="0 0 1000 500" preserveAspectRatio="none" style={{ position: 'absolute', top: 0, left: 0 }}>
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0, 229, 255, 0.04)" strokeWidth="1"/>
              </pattern>
              
              <filter id="cyber-glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* ─── PETA KEPULAUAN INDONESIA (SVG OUTLINES) ─── */}
            <g opacity="0.8" style={{ pointerEvents: 'none' }}>
              {/* Pulau Sumatera */}
              <path d="M 50 75 L 200 110 L 250 180 L 170 200 L 90 150 L 50 85 Z" fill="rgba(0, 229, 255, 0.02)" stroke="rgba(0, 229, 255, 0.2)" strokeWidth="1.2" filter="url(#cyber-glow)" />
              <text x="110" y="130" fill="rgba(0, 229, 255, 0.25)" fontSize="8px" fontWeight="bold" letterSpacing="1px">SUMATERA</text>

              {/* Pulau Jawa */}
              <path d="M 230 355 L 410 365 L 550 375 L 530 395 L 370 385 L 230 370 Z" fill="rgba(0, 229, 255, 0.02)" stroke="rgba(0, 229, 255, 0.2)" strokeWidth="1.2" filter="url(#cyber-glow)" />
              <text x="350" y="410" fill="rgba(0, 229, 255, 0.25)" fontSize="8px" fontWeight="bold" letterSpacing="1px">JAWA</text>

              {/* Pulau Kalimantan */}
              <path d="M 350 150 L 450 115 L 530 130 L 550 200 L 470 240 L 370 220 L 340 180 Z" fill="rgba(0, 229, 255, 0.02)" stroke="rgba(0, 229, 255, 0.2)" strokeWidth="1.2" filter="url(#cyber-glow)" />
              <text x="400" y="180" fill="rgba(0, 229, 255, 0.25)" fontSize="8px" fontWeight="bold" letterSpacing="1px">KALIMANTAN</text>

              {/* Pulau Sulawesi */}
              <path d="M 610 180 L 730 180 L 730 200 L 670 215 L 740 250 L 710 270 L 650 250 L 630 280 L 600 280 L 620 230 L 580 210 Z" fill="rgba(0, 229, 255, 0.02)" stroke="rgba(0, 229, 255, 0.2)" strokeWidth="1.2" filter="url(#cyber-glow)" />
              <text x="630" y="230" fill="rgba(0, 229, 255, 0.25)" fontSize="8px" fontWeight="bold" letterSpacing="1px">SULAWESI</text>

              {/* Pulau Papua */}
              <path d="M 830 230 L 910 220 L 970 250 L 970 300 L 910 310 L 870 270 L 800 260 Z" fill="rgba(0, 229, 255, 0.02)" stroke="rgba(0, 229, 255, 0.2)" strokeWidth="1.2" filter="url(#cyber-glow)" />
              <text x="860" y="270" fill="rgba(0, 229, 255, 0.25)" fontSize="8px" fontWeight="bold" letterSpacing="1px">PAPUA</text>
            </g>

            {/* ─── GLOWING SEA LANES (TRANSIT PATHS) ─── */}
            <g style={{ pointerEvents: 'none' }}>
              {[
                { name: 'Belawan-Batam', d: 'M 150 100 Q 200 130 250 175' },
                { name: 'Batam-Priok', d: 'M 250 175 Q 260 270 300 360' },
                { name: 'Priok-Emas-Perak', d: 'M 300 360 L 380 370 L 450 375' },
                { name: 'Perak-Makassar', d: 'M 450 375 Q 550 340 650 275' },
                { name: 'Makassar-Sorong', d: 'M 650 275 L 820 240' },
                { name: 'Perak-Sorong', d: 'M 450 375 Q 630 320 820 240' }
              ].map(lane => (
                <path
                  key={lane.name}
                  d={lane.d}
                  fill="none"
                  stroke="rgba(0, 229, 255, 0.2)"
                  strokeWidth="1.5"
                  strokeDasharray="6 12"
                  className="sea-lane"
                />
              ))}
            </g>

            {/* ─── STRATEGIC PORT NODES ─── */}
            <g opacity="0.8" style={{ pointerEvents: 'none' }}>
              {[
                { name: 'Belawan', x: 150, y: 100 },
                { name: 'Batam', x: 250, y: 175 },
                { name: 'Merak', x: 260, y: 365 },
                { name: 'Tj. Priok', x: 300, y: 360 },
                { name: 'Tj. Emas', x: 380, y: 370 },
                { name: 'Tj. Perak', x: 450, y: 375 },
                { name: 'Makassar', x: 650, y: 275 },
                { name: 'Sorong', x: 820, y: 240 }
              ].map(port => (
                <g key={port.name}>
                  <circle cx={port.x} cy={port.y} r="3" fill="var(--accent)" />
                  <circle cx={port.x} cy={port.y} r="7" fill="none" stroke="var(--accent)" strokeWidth="0.5" opacity="0.4" />
                  <text x={port.x + 10} y={port.y + 4} fill="rgba(139, 123, 168, 0.7)" fontSize="7px" fontWeight="bold">
                    {port.name}
                  </text>
                </g>
              ))}
            </g>

            {/* ─── WEATHER EFFECTS ANIMATION OVERLAYS ─── */}
            {isStorm && (
              <g style={{ pointerEvents: 'none' }}>
                {/* Jagged SVG Lightning Strikes */}
                <path d="M 400 0 L 380 90 L 410 140 L 390 280" fill="none" stroke="#FFF" strokeWidth="2.5" filter="url(#cyber-glow)" className="lightning-bolt" style={{ animationDelay: '0.5s' }} />
                <path d="M 720 0 L 740 120 L 710 180 L 730 330" fill="none" stroke="#FFF" strokeWidth="2.5" filter="url(#cyber-glow)" className="lightning-bolt" style={{ animationDelay: '2.8s' }} />
                <path d="M 180 0 L 160 80 L 190 140 L 175 250" fill="none" stroke="#FFF" strokeWidth="2" filter="url(#cyber-glow)" className="lightning-bolt" style={{ animationDelay: '4.1s' }} />
                
                {/* Diagonal Rain Streaks */}
                {Array.from({ length: 18 }).map((_, i) => {
                  const rx = (i * 61) % 1000;
                  const ry = (i * 31) % 500;
                  const delay = (i * 0.07).toFixed(2);
                  return (
                    <line
                      key={`rain-${i}`}
                      x1={rx}
                      y1={ry}
                      x2={rx + 10}
                      y2={ry + 28}
                      stroke="var(--text-tertiary)"
                      strokeWidth="1"
                      opacity="0.35"
                      className="rain-streak"
                      style={{ animationDelay: `${delay}s` }}
                    />
                  );
                })}
                {/* Ambient flash */}
                <rect width="1000" height="500" fill="#FFF" opacity="0" style={{ animation: 'lightning-flash 6s infinite' }} />
              </g>
            )}

            {isWindy && (
              <g opacity="0.6" style={{ pointerEvents: 'none' }}>
                {/* Golden horizontal wind swooshes */}
                {[
                  "M 50 80 Q 250 40 500 80 T 950 80",
                  "M 100 230 Q 300 270 600 220 T 900 230",
                  "M 50 380 Q 250 350 500 400 T 950 380"
                ].map((d, i) => (
                  <path
                    key={`wind-${i}`}
                    d={d}
                    fill="none"
                    stroke="rgba(245, 158, 11, 0.25)"
                    strokeWidth="1.5"
                    strokeDasharray="25 65"
                    className="wind-line"
                    style={{ animationDelay: `${i * 1.5}s` }}
                  />
                ))}
              </g>
            )}

            {isNormal && (
              <g style={{ pointerEvents: 'none' }}>
                {/* Cyber ocean wave lines at bottom */}
                <path d="M 0 460 Q 250 440 500 460 T 1000 460" fill="none" stroke="rgba(6, 182, 212, 0.15)" strokeWidth="1.5" className="ocean-wave" />
                <path d="M 0 475 Q 250 455 500 475 T 1000 475" fill="none" stroke="rgba(6, 182, 212, 0.1)" strokeWidth="2" className="ocean-wave" style={{ animationDelay: '2s' }} />

                {/* Radar Sweep Rotating Line originating from Tj. Priok */}
                <line 
                  x1="300" y1="360" x2="480" y2="360" 
                  stroke="rgba(0, 229, 255, 0.15)" 
                  strokeWidth="2.5" 
                  style={{ transformOrigin: '300px 360px', animation: 'radar-sweep 8s linear infinite' }} 
                />
                <circle cx="300" cy="360" r="180" fill="none" stroke="rgba(0, 229, 255, 0.05)" strokeWidth="1" strokeDasharray="3 6" />
              </g>
            )}

            {/* Render Dynamic Vessel Nodes */}
            {positions.map((ship: any, index: number) => {
              const moving = ship.isMoving;
              return (
                <g 
                  key={ship.id || index} 
                  className="ship-node"
                  transform={`translate(${ship.x}, ${ship.y})`}
                >
                  {/* Glowing Radar Halo Rings */}
                  {moving ? (
                    <circle cx="0" cy="0" r="12" fill="none" stroke={ship.statusColor} strokeWidth="1" opacity="0.6">
                      <animate attributeName="r" values="6; 22; 6" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.6; 0; 0.6" dur="2s" repeatCount="indefinite" />
                    </circle>
                  ) : (
                    <circle cx="0" cy="0" r="9" fill="none" stroke={ship.statusColor} strokeWidth="1" opacity="0.8">
                      <animate attributeName="r" values="4; 14; 4" dur="3s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.8; 0.2; 0.8" dur="3s" repeatCount="indefinite" />
                    </circle>
                  )}

                  {/* Cyber Node Core */}
                  <circle cx="0" cy="0" r="5" fill={ship.statusColor} style={{ filter: 'drop-shadow(0 0 6px ' + ship.statusColor + ')' }} />
                  <circle cx="0" cy="0" r="9" fill={ship.statusColor} opacity="0.15" />

                  {/* Render anchor icon if stationary, else ship pointer */}
                  {!moving ? (
                    // Anchor SVG
                    <g transform="translate(-6, -14)" style={{ color: ship.statusColor, pointerEvents: 'none' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="5" r="3" />
                        <line x1="12" y1="22" x2="12" y2="8" />
                        <path d="M 5 12 A 7 7 0 0 0 19 12" />
                      </svg>
                    </g>
                  ) : (
                    // Cargo Ship SVG
                    <g transform="translate(-6, -14)" style={{ color: ship.statusColor, pointerEvents: 'none' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 17l1.5-2.5h17L22 17H2z" fill="currentColor" opacity="0.25" />
                        <path d="M4 12V8a2 2 0 012-2h12a2 2 0 012 2v4" />
                        <path d="M12 2v4" />
                      </svg>
                    </g>
                  )}
                  
                  {/* Vessel Metadata Labels (Hidden if compact on small screens) */}
                  <g transform="translate(14, -4)">
                    <rect x="-2" y="-9" width="110" height="26" fill="rgba(6,6,8,0.8)" stroke="rgba(0,229,255,0.15)" strokeWidth="0.5" rx="3" style={{ pointerEvents: 'none' }} />
                    <text x="2" y="1" fill="#FFF" fontSize="8px" fontWeight="bold" style={{ pointerEvents: 'none', letterSpacing: '0.2px' }}>
                      {ship.name.toUpperCase()}
                    </text>
                    <text x="2" y="11" fill={ship.statusColor} fontSize="7px" fontWeight="bold" style={{ pointerEvents: 'none' }}>
                      {moving ? 'DALAM PERJALANAN' : ship.statusText?.includes('PEMELIHARAAN') ? 'PERBAIKAN DOK' : 'SANDAR PORT'}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>

        </div>
      </div>
      
      {/* Dynamic Keyframes & Transitions Styles */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
        @keyframes radar-sweep {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes rain-sweep {
          0% { transform: translate(-80px, -180px); opacity: 0; }
          10% { opacity: 0.55; }
          90% { opacity: 0.55; }
          100% { transform: translate(120px, 280px); opacity: 0; }
        }
        @keyframes wind-flow {
          0% { stroke-dashoffset: 360; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes wave-sway {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
        @keyframes lightning-strike {
          0%, 93%, 97%, 100% { opacity: 0; }
          94%, 96% { opacity: 1; stroke-width: 3.5px; }
          95% { opacity: 0.2; }
        }
        @keyframes lightning-flash {
          0%, 94%, 100% { opacity: 0; }
          95%, 97% { opacity: 0.28; }
          96% { opacity: 0.08; }
        }
        @keyframes lane-flow {
          0% { stroke-dashoffset: 96; }
          100% { stroke-dashoffset: 0; }
        }
        .rain-streak {
          animation: rain-sweep 1s linear infinite;
        }
        .wind-line {
          animation: wind-flow 7s linear infinite;
        }
        .ocean-wave {
          animation: wave-sway 4s ease-in-out infinite;
        }
        .lightning-bolt {
          animation: lightning-strike 6s infinite;
        }
        .sea-lane {
          animation: lane-flow 4s linear infinite;
        }
      `}</style>
    </div>
  );
}
