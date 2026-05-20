"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useDashboard } from '@/context/DashboardContext';

export default function MapPage() {
  const { armada, cuaca } = useDashboard();
  
  // State untuk menyimpan posisi dinamis kapal yang dirender ke layar
  const [positions, setPositions] = useState<any[]>([]);
  // Ref untuk menyimpan data gerak tanpa memicu re-render berlebihan (biar nggak ngelag)
  const shipsRef = useRef<any[]>([]);
  const animRef = useRef(null);

  useEffect(() => {
    if (!armada || armada.length === 0) return;

    // Helper untuk mendefinisikan lokasi pelabuhan dan batas rute perairan masing-masing kapal (Skala 1000x500)
    const getShipRouteSettings = (name: string, status: string) => {
      const isMoving = status?.toLowerCase().includes('perjalanan');
      const shipName = name?.toUpperCase() || '';

      // Default fallback
      let x = 500;
      let y = 250;
      let minX = 100, maxX = 900, minY = 50, maxY = 450;
      let vx = 0;
      let vy = 0;

      if (!isMoving) {
        // Kapal sandar ditempatkan presisi di koordinat pelabuhan masing-masing
        if (shipName.includes('BIMA SAKTI')) {
          x = 300; y = 360; // Tj. Priok
        } else if (shipName.includes('SRIWIJAYA')) {
          x = 260; y = 365; // Pelabuhan Merak
        } else if (shipName.includes('GADJAH MADA')) {
          x = 250; y = 175; // Galangan Batam
        } else if (shipName.includes('DEWARUCI')) {
          x = 380; y = 370; // Tj. Emas
        } else {
          x = 450; y = 375; // Tj. Perak
        }
      } else {
        // Kapal berlayar bergerak di perairan (sea lane) masing-masing
        const speed = 0.25;
        const angle = Math.random() * Math.PI * 2;
        vx = Math.cos(angle) * speed;
        vy = Math.sin(angle) * speed;

        if (shipName.includes('NUSANTARA')) {
          // Laut Jawa -> Tanjung Perak
          minX = 280; maxX = 520; minY = 250; maxY = 340;
          x = 300 + Math.random() * 100;
          y = 260 + Math.random() * 60;
        } else if (shipName.includes('KARTINI') || shipName.includes('RAJAWALI')) {
          // Laut Sulawesi -> Makassar
          minX = 550; maxX = 600; minY = 150; maxY = 275;
          x = 560 + Math.random() * 30;
          y = 170 + Math.random() * 80;
        } else if (shipName.includes('MAJAPAHIT')) {
          // Selat Malaka -> Belawan
          minX = 250; maxX = 320; minY = 60; maxY = 140;
          x = 260 + Math.random() * 40;
          y = 80 + Math.random() * 40;
        } else if (shipName.includes('CENDRAWASIH')) {
          // Laut Banda -> Sorong
          minX = 740; maxX = 820; minY = 200; maxY = 320;
          x = 750 + Math.random() * 50;
          y = 220 + Math.random() * 80;
        } else {
          // Fallback laut terbuka
          minX = 150; maxX = 850; minY = 80; maxY = 420;
          x = 400 + Math.random() * 200;
          y = 200 + Math.random() * 100;
        }
      }

      return { x, y, minX, maxX, minY, maxY, vx, vy };
    };

    // 1. Inisialisasi posisi awal dan "mesin" (kecepatan)
    shipsRef.current = armada.map((s: any) => {
      const settings = getShipRouteSettings(s.name, s.status);
      const isMoving = s.status?.toLowerCase().includes('perjalanan');
      return {
        ...s,
        x: settings.x,
        y: settings.y,
        minX: settings.minX,
        maxX: settings.maxX,
        minY: settings.minY,
        maxY: settings.maxY,
        vx: settings.vx,
        vy: settings.vy,
        statusText: s.status,
        statusColor: isMoving ? '#22C55E' : 
                     (s.status?.toLowerCase().includes('pelabuhan') ? '#3B82F6' : '#EF4444')
      };
    });

    setPositions(shipsRef.current);

    // 2. Bikin fungsi loop animasi gerak
    const tick = () => {
      shipsRef.current = shipsRef.current.map((ship: any) => {
        // Kalo lagi sandar atau rusak, diem di tempat
        if (ship.vx === 0 && ship.vy === 0) return ship;

        // Sesuaikan pergerakan kapal berdasarkan cuaca global saat ini
        let speedMultiplier = 1.0;
        let driftX = 0;
        let driftY = 0;

        if (cuaca === 'Badai Ekstrem') {
          speedMultiplier = 0.65; // Melambat karena ombak besar
          driftX = Math.sin(Date.now() * 0.003 + ship.x) * 0.3; // Efek terombang-ambing
          driftY = Math.cos(Date.now() * 0.003 + ship.y) * 0.3;
        } else if (cuaca === 'Terik Gersang') {
          speedMultiplier = 1.45; // Angin kencang (Berangin), kapal bergerak lebih cepat
        }

        let nx = ship.x + (ship.vx * speedMultiplier) + driftX;
        let ny = ship.y + (ship.vy * speedMultiplier) + driftY;
        let nvx = ship.vx;
        let nvy = ship.vy;

        // Bouncing di batas koridor pelayaran masing-masing
        if (nx < ship.minX || nx > ship.maxX) nvx = -nvx;
        if (ny < ship.minY || ny > ship.maxY) nvy = -nvy;

        // Clamp
        nx = Math.max(ship.minX, Math.min(ship.maxX, nx));
        ny = Math.max(ship.minY, Math.min(ship.maxY, ny));

        return { ...ship, x: nx, y: ny, vx: nvx, vy: nvy };
      });

      // Update state buat geser posisi UI
      setPositions([...shipsRef.current]);
      
      // Panggil diri sendiri buat frame berikutnya
      animRef.current = requestAnimationFrame(tick);
    };

    // Jalankan mesin animasi
    animRef.current = requestAnimationFrame(tick);

    // Bersihkan memori (cleanup) kalau user pindah tab
    return () => cancelAnimationFrame(animRef.current);
  }, [armada, cuaca]);

  // Klasifikasi status cuaca saat ini
  const isStorm = cuaca === 'Badai Ekstrem';
  const isWindy = cuaca === 'Terik Gersang';
  const isNormal = cuaca === 'Normal' || !cuaca;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '1200px', margin: '0 auto', color: 'white', fontFamily: 'monospace' }}>
      
      {/* Main Map Container */}
      <div style={{ background: 'var(--bg-card, #130a24)', border: '1px solid rgba(168, 85, 247, 0.2)', borderRadius: '4px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>
            PELACAKAN ARMADA GLOBAL ─ Status Cuaca: <span style={{ color: isStorm ? '#EF4444' : isWindy ? '#F59E0B' : '#22C55E' }}>[{cuaca || 'Normal'}]</span>
          </div>
        </div>

        {/* Map Area */}
        <div style={{ background: '#0a0510', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px', height: '500px', position: 'relative', overflow: 'hidden' }}>
          
          {/* Live Tracking Label (Animasi kedip) */}
          <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(20, 10, 36, 0.8)', border: '1px solid rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 10 }}>
            <div style={{ width: '6px', height: '6px', background: '#22C55E', borderRadius: '50%', boxShadow: '0 0 8px #22C55E', animation: 'pulse 1.5s infinite' }}></div>
            <span style={{ fontSize: '10px', color: '#22C55E', fontWeight: 'bold', letterSpacing: '0.5px' }}>LIVE TRACKING</span>
          </div>

          {/* Legend */}
          <div style={{ position: 'absolute', bottom: '16px', left: '16px', background: 'rgba(20, 10, 36, 0.8)', border: '1px solid rgba(168, 85, 247, 0.2)', padding: '16px', borderRadius: '4px', display: 'flex', flexDirection: 'column', gap: '12px', zIndex: 10 }}>
            <div style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--text-muted, #8B7BA8)', letterSpacing: '1px' }}>LEGENDA</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', background: '#22C55E', borderRadius: '50%', boxShadow: '0 0 8px #22C55E' }}></div>
              <span style={{ fontSize: '11px', color: 'white' }}>Dalam Perjalanan</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', background: '#3B82F6', borderRadius: '50%', boxShadow: '0 0 8px #3B82F6' }}></div>
              <span style={{ fontSize: '11px', color: 'white' }}>Di Pelabuhan / Sandar</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', background: '#EF4444', borderRadius: '50%', boxShadow: '0 0 8px #EF4444' }}></div>
              <span style={{ fontSize: '11px', color: 'white' }}>Pemeliharaan / Perawatan</span>
            </div>
          </div>

          {/* Map Dots & Trails (SVG) */}
          <svg width="100%" height="100%" viewBox="0 0 1000 500" preserveAspectRatio="none" style={{ position: 'absolute', top: 0, left: 0 }}>
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(168, 85, 247, 0.05)" strokeWidth="1"/>
              </pattern>
              <filter id="cyber-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* ─── PETA KEPULAUAN INDONESIA (SVG CYBER OUTLINES) ─── */}
            <g opacity="0.75" style={{ pointerEvents: 'none' }}>
              {/* Pulau Sumatera */}
              <path d="M 50 75 L 200 110 L 250 180 L 170 200 L 90 150 L 50 85 Z" fill="rgba(168, 85, 247, 0.03)" stroke="rgba(168, 85, 247, 0.25)" strokeWidth="1.5" filter="url(#cyber-glow)" />
              <text x="110" y="130" fill="rgba(168, 85, 247, 0.3)" fontSize="8px" fontWeight="bold" letterSpacing="1px">SUMATERA</text>

              {/* Pulau Jawa */}
              <path d="M 230 355 L 410 365 L 550 375 L 530 395 L 370 385 L 230 370 Z" fill="rgba(168, 85, 247, 0.03)" stroke="rgba(168, 85, 247, 0.25)" strokeWidth="1.5" filter="url(#cyber-glow)" />
              <text x="350" y="410" fill="rgba(168, 85, 247, 0.3)" fontSize="8px" fontWeight="bold" letterSpacing="1px">JAWA</text>

              {/* Pulau Kalimantan */}
              <path d="M 350 150 L 450 115 L 530 130 L 550 200 L 470 240 L 370 220 L 340 180 Z" fill="rgba(168, 85, 247, 0.03)" stroke="rgba(168, 85, 247, 0.25)" strokeWidth="1.5" filter="url(#cyber-glow)" />
              <text x="400" y="180" fill="rgba(168, 85, 247, 0.3)" fontSize="8px" fontWeight="bold" letterSpacing="1px">KALIMANTAN</text>

              {/* Pulau Sulawesi */}
              <path d="M 610 180 L 730 180 L 730 200 L 670 215 L 740 250 L 710 270 L 650 250 L 630 280 L 600 280 L 620 230 L 580 210 Z" fill="rgba(168, 85, 247, 0.03)" stroke="rgba(168, 85, 247, 0.25)" strokeWidth="1.5" filter="url(#cyber-glow)" />
              <text x="630" y="230" fill="rgba(168, 85, 247, 0.3)" fontSize="8px" fontWeight="bold" letterSpacing="1px">SULAWESI</text>

              {/* Pulau Papua */}
              <path d="M 830 230 L 910 220 L 970 250 L 970 300 L 910 310 L 870 270 L 800 260 Z" fill="rgba(168, 85, 247, 0.03)" stroke="rgba(168, 85, 247, 0.25)" strokeWidth="1.5" filter="url(#cyber-glow)" />
              <text x="860" y="270" fill="rgba(168, 85, 247, 0.3)" fontSize="8px" fontWeight="bold" letterSpacing="1px">PAPUA</text>

              {/* Strategic Port Nodes */}
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
                  <circle cx={port.x} cy={port.y} r="3" fill="#A855F7" opacity="0.8" />
                  <circle cx={port.x} cy={port.y} r="6" fill="none" stroke="#A855F7" strokeWidth="0.5" opacity="0.4" />
                  <text x={port.x + 10} y={port.y + 4} fill="rgba(139, 123, 168, 0.6)" fontSize="7px" style={{ pointerEvents: 'none' }}>
                    {port.name}
                  </text>
                </g>
              ))}
            </g>

            {/* ─── WEATHER EFFECTS ANIMATION OVERLAYS ─── */}
            {isStorm && (
              <g opacity="0.6">
                {/* 15 Rain streaks moving diagonally */}
                {Array.from({ length: 15 }).map((_, i) => {
                  const rx = (i * 73) % 1000;
                  const ry = (i * 37) % 500;
                  const delay = (i * 0.08).toFixed(2);
                  return (
                    <line
                      key={`rain-${i}`}
                      x1={rx}
                      y1={ry}
                      x2={rx + 12}
                      y2={ry + 32}
                      stroke="#C084FC"
                      strokeWidth="1.2"
                      opacity="0.4"
                      className="rain-streak"
                      style={{ animationDelay: `${delay}s` }}
                    />
                  );
                })}
                {/* Lightning Overlay */}
                <rect width="1000" height="500" fill="#fff" opacity="0" style={{ animation: 'lightning-flash 5s infinite', pointerEvents: 'none' }} />
              </g>
            )}

            {isWindy && (
              <g opacity="0.5" style={{ pointerEvents: 'none' }}>
                {/* 3 Horizontal wavy sweeping winds */}
                {[
                  "M 50 100 Q 250 60 500 100 T 950 100",
                  "M 100 250 Q 300 290 600 240 T 900 250",
                  "M 50 400 Q 250 370 500 420 T 950 400"
                ].map((d, i) => (
                  <path
                    key={`wind-${i}`}
                    d={d}
                    fill="none"
                    stroke="rgba(168, 85, 247, 0.25)"
                    strokeWidth="1.5"
                    strokeDasharray="20 60"
                    className="wind-line"
                    style={{ animationDelay: `${i * 1.5}s` }}
                  />
                ))}
              </g>
            )}

            {isNormal && (
              /* Radar Sweep Rotating Line */
              <line 
                x1="500" y1="250" x2="1000" y2="250" 
                stroke="rgba(168, 85, 247, 0.12)" 
                strokeWidth="2.5" 
                style={{ transformOrigin: '500px 250px', animation: 'radar-sweep 12s linear infinite', pointerEvents: 'none' }} 
              />
            )}

            {/* Render Dynamic Ships */}
            {positions.map((ship: any, index: number) => (
              <g 
                key={ship.id || index} 
                className="ship-node"
                transform={`translate(${ship.x}, ${ship.y})`}
              >
                {/* Efek Ping / Radar untuk kapal yang berlayar */}
                {ship.vx !== 0 && (
                  <circle cx="0" cy="0" r="12" fill="none" stroke={ship.statusColor} strokeWidth="1" opacity="0.5">
                    <animate attributeName="r" values="6; 25; 6" dur="2.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.6; 0; 0.6" dur="2.5s" repeatCount="indefinite" />
                  </circle>
                )}

                {/* Titik Kapal */}
                <circle cx="0" cy="0" r="5" fill={ship.statusColor} style={{ filter: 'drop-shadow(0px 0px 4px ' + ship.statusColor + ')' }} />
                
                {/* Halo Pendaran Warna */}
                <circle cx="0" cy="0" r="10" fill={ship.statusColor} opacity="0.15" />
                
                {/* Teks Nama Kapal */}
                <text x="12" y="-8" fill="rgba(255,255,255,0.9)" fontSize="10px" fontWeight="bold" style={{ pointerEvents: 'none', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                  {ship.name}
                </text>
                
                {/* Teks Status */}
                <text x="12" y="4" fill={ship.statusColor} fontSize="8px" style={{ pointerEvents: 'none', fontWeight: 'bold' }}>
                  {ship.vx !== 0 ? '▶ Bergerak' : ship.statusText?.includes('PEMELIHARAAN') ? '🛠 Perawatan' : '⚓ Sandar'}
                </text>
              </g>
            ))}
          </svg>

        </div>
      </div>
      
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes rain-sweep {
          0% { transform: translate(-100px, -200px); opacity: 0; }
          10% { opacity: 0.5; }
          90% { opacity: 0.5; }
          100% { transform: translate(150px, 300px); opacity: 0; }
        }
        @keyframes wind-flow {
          0% { stroke-dashoffset: 400; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes lightning-flash {
          0%, 95%, 100% { opacity: 0; }
          96%, 98% { opacity: 0.25; }
          97% { opacity: 0.05; }
        }
        @keyframes radar-sweep {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .rain-streak {
          animation: rain-sweep 1.2s linear infinite;
        }
        .wind-line {
          animation: wind-flow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}