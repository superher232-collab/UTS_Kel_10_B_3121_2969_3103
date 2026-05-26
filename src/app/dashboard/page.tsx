"use client";
import React, { Suspense, useEffect, useRef, useState } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { useSearchParams } from 'next/navigation';

function DashboardContent() {
  const { role, cuaca, updateCuaca, armada, logs, errorSignal, triggerVesselMutation } = useDashboard();
  const searchParams = useSearchParams();
  const filter = searchParams.get('filter') || 'semua';

  // Dynamic ship positions state driven by animation loop
  const [positions, setPositions] = useState<any[]>([]);
  const animRef = useRef<any>(null);
  const shipsRef = useRef<any[]>([]);
  const lastStatusesRef = useRef<Record<number, string>>({});

  // Audio Alert Trigger: Plays a premium beep using browser Web Audio API as fallback
  const playAudioAlert = () => {
    console.log('[AUDIO COMMAND] Pemicu sinyal bahaya PrimeLog!');
    try {
      // First try to load from placeholder asset
      const audio = new Audio('/sounds/alert.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => {
        // Fallback: Web Audio API synth beep
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // Pulse 1
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
        
        osc.start();
        osc.stop(audioCtx.currentTime + 0.5);

        // Pulse 2 (slight delay)
        setTimeout(() => {
          const osc2 = audioCtx.createOscillator();
          const gain2 = audioCtx.createGain();
          osc2.connect(gain2);
          gain2.connect(audioCtx.destination);
          osc2.type = 'sawtooth';
          osc2.frequency.setValueAtTime(1100, audioCtx.currentTime);
          gain2.gain.setValueAtTime(0.15, audioCtx.currentTime);
          gain2.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
          osc2.start();
          osc2.stop(audioCtx.currentTime + 0.4);
        }, 150);
      });
    } catch (e) {
      console.warn('AudioContext not allowed or not supported yet.', e);
    }
  };

  // Monitor vessel statuses to trigger alert if anything changes to DELAYED or PEMELIHARAAN
  useEffect(() => {
    if (!armada || armada.length === 0) return;
    
    armada.forEach((ship: any) => {
      const prev = lastStatusesRef.current[ship.id];
      if (prev && prev !== ship.status) {
        // Trigger sound alert on important transitions
        if (ship.status === 'TERLAMBAT' || ship.status === 'PEMELIHARAAN') {
          playAudioAlert();
        }
      }
      lastStatusesRef.current[ship.id] = ship.status;
    });
  }, [armada]);

  // Handle ship live physics movement simulation
  useEffect(() => {
    if (!armada || armada.length === 0) return;

    // Helper for ports and route lanes
    const getShipRouteSettings = (name: string, status: string) => {
      const isMoving = status?.toLowerCase().includes('perjalanan');
      const shipName = name?.toUpperCase() || '';

      let x = 500;
      let y = 250;
      let minX = 100, maxX = 900, minY = 50, maxY = 450;
      let vx = 0;
      let vy = 0;

      if (!isMoving) {
        if (shipName.includes('BIMA SAKTI')) {
          x = 300; y = 360; // Tj Priok
        } else if (shipName.includes('SRIWIJAYA')) {
          x = 260; y = 365; // Pelabuhan Merak
        } else if (shipName.includes('GADJAH MADA')) {
          x = 250; y = 175; // Batam
        } else if (shipName.includes('DEWARUCI')) {
          x = 380; y = 370; // Tj Emas
        } else {
          x = 450; y = 375; // Tj Perak
        }
      } else {
        const speed = 0.22;
        const angle = Math.random() * Math.PI * 2;
        vx = Math.cos(angle) * speed;
        vy = Math.sin(angle) * speed;

        if (shipName.includes('NUSANTARA')) {
          minX = 280; maxX = 520; minY = 250; maxY = 340;
          x = 300 + Math.random() * 100;
          y = 260 + Math.random() * 60;
        } else if (shipName.includes('KARTINI') || shipName.includes('RAJAWALI')) {
          minX = 550; maxX = 600; minY = 150; maxY = 275;
          x = 560 + Math.random() * 30;
          y = 170 + Math.random() * 80;
        } else if (shipName.includes('MAJAPAHIT')) {
          minX = 250; maxX = 320; minY = 60; maxY = 140;
          x = 260 + Math.random() * 40;
          y = 80 + Math.random() * 40;
        } else if (shipName.includes('CENDRAWASIH')) {
          minX = 740; maxX = 820; minY = 200; maxY = 320;
          x = 750 + Math.random() * 50;
          y = 220 + Math.random() * 80;
        } else {
          minX = 150; maxX = 850; minY = 80; maxY = 420;
          x = 400 + Math.random() * 200;
          y = 200 + Math.random() * 100;
        }
      }

      return { x, y, minX, maxX, minY, maxY, vx, vy };
    };

    shipsRef.current = armada.map((ship: any) => {
      const settings = getShipRouteSettings(ship.name, ship.status);
      const isMoving = ship.status?.toLowerCase().includes('perjalanan');
      return {
        id: ship.id,
        name: ship.name,
        status: isMoving ? 'berlayar' : 'sandar',
        actualStatus: ship.status,
        x: settings.x,
        y: settings.y,
        minX: settings.minX,
        maxX: settings.maxX,
        minY: settings.minY,
        maxY: settings.maxY,
        vx: settings.vx,
        vy: settings.vy,
      };
    });

    setPositions(shipsRef.current.map(s => ({ id: s.id, x: s.x, y: s.y, name: s.name, status: s.status, actualStatus: s.actualStatus })));

    // Physics dynamic tick loop
    const tick = () => {
      shipsRef.current = shipsRef.current.map((ship: any) => {
        if (ship.status !== 'berlayar') return ship;

        let speedMultiplier = 1.0;
        let driftX = 0;
        let driftY = 0;

        if (cuaca === 'Badai Ekstrem') {
          speedMultiplier = 0.55; // Storm slowdown
          driftX = Math.sin(Date.now() * 0.0035 + ship.x) * 0.45;
          driftY = Math.cos(Date.now() * 0.0035 + ship.y) * 0.45;
        } else if (cuaca === 'Terik Gersang') {
          speedMultiplier = 1.40; // High wind boost
        }

        let nx = ship.x + (ship.vx * speedMultiplier) + driftX;
        let ny = ship.y + (ship.vy * speedMultiplier) + driftY;
        let nvx = ship.vx;
        let nvy = ship.vy;

        if (nx < ship.minX || nx > ship.maxX) nvx = -nvx;
        if (ny < ship.minY || ny > ship.maxY) nvy = -nvy;

        nx = Math.max(ship.minX, Math.min(ship.maxX, nx));
        ny = Math.max(ship.minY, Math.min(ship.maxY, ny));

        return { ...ship, x: nx, y: ny, vx: nvx, vy: nvy };
      });

      setPositions(shipsRef.current.map(s => ({ id: s.id, x: s.x, y: s.y, name: s.name, status: s.status, actualStatus: s.actualStatus })));
      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [armada, cuaca]);

  const filteredPositions = positions.filter((s: any) => {
    if (filter === 'semua') return true;
    if (filter === 'berlayar') return s.status === 'berlayar';
    if (filter === 'sandar') return s.status === 'sandar';
    return true;
  });

  // Calculate numbers
  const total = armada?.length || 0;
  const berlayar = armada?.filter(s => s.status?.toLowerCase().includes('perjalanan')).length || 0;
  const pelabuhan = armada?.filter(s => s.status?.toLowerCase().includes('pelabuhan')).length || 0;
  const terlambat = armada?.filter(s => s.status?.toLowerCase().includes('terlambat')).length || 0;
  const perawatan = armada?.filter(s => s.status?.toLowerCase().includes('pemeliharaan')).length || 0;

  // Custom styling helper for Neon Status Badges
  const getBadgeStyle = (status: string): React.CSSProperties => {
    const base: React.CSSProperties = {
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '9px',
      fontWeight: 'bold',
      fontFamily: 'monospace',
      letterSpacing: '1px',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      borderWidth: '1px',
      borderStyle: 'solid'
    };

    const text = status.toUpperCase();
    if (text.includes('PERJALANAN')) {
      return {
        ...base,
        background: 'rgba(34, 197, 94, 0.1)',
        borderColor: '#22C55E',
        color: '#22C55E',
        boxShadow: '0 0 10px rgba(34, 197, 94, 0.2)'
      };
    } else if (text.includes('PELABUHAN')) {
      return {
        ...base,
        background: 'rgba(59, 130, 246, 0.1)',
        borderColor: '#3B82F6',
        color: '#3B82F6',
        boxShadow: '0 0 10px rgba(59, 130, 246, 0.2)'
      };
    } else if (text.includes('TERLAMBAT')) {
      return {
        ...base,
        background: 'rgba(245, 158, 11, 0.15)',
        borderColor: '#F59E0B',
        color: '#F59E0B',
        boxShadow: '0 0 10px rgba(245, 158, 11, 0.3)'
      };
    } else {
      return {
        ...base,
        background: 'rgba(239, 68, 68, 0.15)',
        borderColor: '#EF4444',
        color: '#EF4444',
        boxShadow: '0 0 10px rgba(239, 68, 68, 0.3)'
      };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* ⚠️ HIGH-CONTRAST SATELLITE DISCONNECT ALARM BAR (SWR Warning) */}
      {errorSignal && (
        <div style={{
          background: 'linear-gradient(90deg, #7F1D1D 0%, #B91C1C 50%, #7F1D1D 100%)',
          border: '1px solid #EF4444',
          borderRadius: '8px',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          boxShadow: '0 0 20px rgba(239, 68, 68, 0.5)',
          animation: 'warningPulse 2s infinite ease-in-out',
          color: 'white',
          fontFamily: 'monospace',
          zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '20px', animation: 'blink 1s infinite' }}>⚠️</span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '13px', fontWeight: 'bold', letterSpacing: '1px' }}>TELEMETRI TERGANGGU / SINYAL SATELIT TERPUTUS</span>
              <span style={{ fontSize: '10px', color: '#FCA5A5' }}>Menampilkan telemetri terakhir yang tersimpan di memori (Stale-While-Revalidate Mode)</span>
            </div>
          </div>
          <button 
            onClick={playAudioAlert}
            style={{
              background: 'white',
              border: 'none',
              borderRadius: '4px',
              color: '#B91C1C',
              padding: '6px 12px',
              fontSize: '10px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
              fontFamily: 'monospace'
            }}
          >
            Picu Klakson Bahaya
          </button>
        </div>
      )}

      {/* Grid: Fullscreen layout split (Left: Live map, Right: Telemetry Grid) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px', alignItems: 'start' }} className="main-cmd-grid">
        
        {/* Left Column: live SVG map */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{
            width: '100%',
            height: '460px',
            background: '#0D0618',
            border: '1px solid rgba(168, 85, 247, 0.35)',
            borderRadius: '12px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 10px 40px rgba(0,0,0,0.6)'
          }}>
            <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 10 }}>
              <div style={{ color: 'white', fontSize: '14px', fontWeight: 'bold', letterSpacing: '1.5px', fontFamily: 'monospace' }}>PETA MONITORING GLOBAL</div>
              <div style={{ color: '#A855F7', fontSize: '10px', textTransform: 'uppercase', fontFamily: 'monospace', marginTop: '4px' }}>
                Mode: {filter === 'semua' ? 'Tampilkan Semua' : filter === 'berlayar' ? 'Sedang Berlayar' : 'Sandar Pelabuhan'}
                {` ─ Cuaca Global: `}
                <span style={{ color: cuaca === 'Badai Ekstrem' ? '#EF4444' : cuaca === 'Terik Gersang' ? '#F59E0B' : '#22C55E', fontWeight: 'bold' }}>
                  {cuaca || 'Normal'}
                </span>
              </div>
            </div>

            <svg width="100%" height="100%" viewBox="0 0 1000 500" preserveAspectRatio="none" style={{ position: 'absolute', top: 0, left: 0 }}>
              <defs>
                <pattern id="gridPattern" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(168, 85, 247, 0.04)" strokeWidth="1"/>
                </pattern>
                <filter id="radarGlow" x="-10%" y="-10%" width="120%" height="120%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <rect width="100%" height="100%" fill="url(#gridPattern)" />
              
              {/* Strategic radar circles */}
              <circle cx="500" cy="250" r="180" fill="none" stroke="rgba(168, 85, 247, 0.08)" strokeWidth="1.5" strokeDasharray="3 6" />
              <circle cx="500" cy="250" r="320" fill="none" stroke="rgba(168, 85, 247, 0.05)" strokeWidth="1.2" />

              {/* Indonesia SVG Outlines */}
              <g opacity="0.8" style={{ pointerEvents: 'none' }}>
                <path d="M 50 75 L 200 110 L 250 180 L 170 200 L 90 150 L 50 85 Z" fill="rgba(168, 85, 247, 0.02)" stroke="rgba(168, 85, 247, 0.22)" strokeWidth="1.5" filter="url(#radarGlow)" />
                <path d="M 230 355 L 410 365 L 550 375 L 530 395 L 370 385 L 230 370 Z" fill="rgba(168, 85, 247, 0.02)" stroke="rgba(168, 85, 247, 0.22)" strokeWidth="1.5" filter="url(#radarGlow)" />
                <path d="M 350 150 L 450 115 L 530 130 L 550 200 L 470 240 L 370 220 L 340 180 Z" fill="rgba(168, 85, 247, 0.02)" stroke="rgba(168, 85, 247, 0.22)" strokeWidth="1.5" filter="url(#radarGlow)" />
                <path d="M 610 180 L 730 180 L 730 200 L 670 215 L 740 250 L 710 270 L 650 250 L 630 280 L 600 280 L 620 230 L 580 210 Z" fill="rgba(168, 85, 247, 0.02)" stroke="rgba(168, 85, 247, 0.22)" strokeWidth="1.5" filter="url(#radarGlow)" />
                <path d="M 830 230 L 910 220 L 970 250 L 970 300 L 910 310 L 870 270 L 800 260 Z" fill="rgba(168, 85, 247, 0.02)" stroke="rgba(168, 85, 247, 0.22)" strokeWidth="1.5" filter="url(#radarGlow)" />
                
                {/* Ports */}
                {[
                  { name: 'Belawan', x: 150, y: 100 },
                  { name: 'Batam', x: 250, y: 175 },
                  { name: 'Merak', x: 260, y: 365 },
                  { name: 'Tj. Priok', x: 300, y: 360 },
                  { name: 'Tj. Emas', x: 380, y: 370 },
                  { name: 'Tj. Perak', x: 450, y: 375 },
                  { name: 'Makassar', x: 650, y: 275 },
                  { name: 'Sorong', x: 820, y: 240 }
                ].map(p => (
                  <circle key={p.name} cx={p.x} cy={p.y} r="2.5" fill="#C084FC" opacity="0.6" />
                ))}
              </g>

              {/* Weather sweeps */}
              {cuaca === 'Badai Ekstrem' && (
                <g opacity="0.5">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <line
                      key={i}
                      x1={(i * 90) % 1000}
                      y1={(i * 45) % 500}
                      x2={((i * 90) % 1000) + 10}
                      y2={((i * 45) % 500) + 25}
                      stroke="#A855F7"
                      strokeWidth="1.2"
                      style={{ animation: 'rainFlow 1.5s linear infinite' }}
                    />
                  ))}
                  <rect width="1000" height="500" fill="white" opacity="0" style={{ animation: 'stormLightning 6s infinite' }} />
                </g>
              )}

              {cuaca === 'Terik Gersang' && (
                <g opacity="0.4">
                  <path d="M 50 150 Q 250 110 500 150 T 950 150" fill="none" stroke="#C084FC" strokeWidth="1" strokeDasharray="10 30" style={{ animation: 'windFlow 10s linear infinite' }} />
                  <path d="M 50 350 Q 250 310 500 350 T 950 350" fill="none" stroke="#C084FC" strokeWidth="1" strokeDasharray="10 30" style={{ animation: 'windFlow 10s linear infinite', animationDelay: '2s' }} />
                </g>
              )}

              {/* Radar sweep rotating line (Normal weather) */}
              {!cuaca || cuaca === 'Normal' ? (
                <line x1="500" y1="250" x2="1000" y2="250" stroke="rgba(192, 132, 252, 0.15)" strokeWidth="2" style={{ transformOrigin: '500px 250px', animation: 'radarRotation 10s linear infinite' }} />
              ) : null}

              {/* Live Vessel Markers */}
              {filteredPositions.map(vessel => {
                const isMoving = vessel.status === 'berlayar';
                const statusColor = 
                  vessel.actualStatus?.includes('PERJALANAN') ? '#22C55E' : 
                  vessel.actualStatus?.includes('PELABUHAN') ? '#3B82F6' : 
                  vessel.actualStatus?.includes('TERLAMBAT') ? '#F59E0B' : '#EF4444';

                return (
                  <g key={vessel.id} transform={`translate(${vessel.x}, ${vessel.y})`}>
                    <circle cx="0" cy="0" r="14" fill="none" stroke={statusColor} strokeWidth="1" opacity="0.25">
                      <animate attributeName="r" values="4; 16; 4" dur={isMoving ? '2s' : '4s'} repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.6; 0; 0.6" dur={isMoving ? '2s' : '4s'} repeatCount="indefinite" />
                    </circle>
                    
                    <circle cx="0" cy="0" r="5.5" fill={statusColor} style={{ filter: 'drop-shadow(0 0 6px ' + statusColor + ')' }} />
                    <text x="12" y="-6" fill="white" fontSize="10px" fontWeight="bold" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)', fontFamily: 'monospace' }}>{vessel.name}</text>
                    <text x="12" y="4" fill={statusColor} fontSize="8px" fontWeight="bold" style={{ fontFamily: 'monospace' }}>
                      {isMoving ? '▶ EN ROUTE' : vessel.actualStatus?.includes('PEMELIHARAAN') ? '🛠 MAINTENANCE' : '⚓ IN PORT'}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Quick Metrics Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
            {[
              { label: 'TOTAL ARMADA', value: total, color: '#A855F7', shadow: 'rgba(168, 85, 247, 0.2)' },
              { label: 'BERLAYAR', value: berlayar, color: '#22C55E', shadow: 'rgba(34, 197, 94, 0.2)' },
              { label: 'DI PELABUHAN', value: pelabuhan, color: '#3B82F6', shadow: 'rgba(59, 130, 246, 0.2)' },
              { label: 'TERLAMBAT', value: terlambat, color: '#F59E0B', shadow: 'rgba(245, 158, 11, 0.2)' },
              { label: 'PERAWATAN', value: perawatan, color: '#EF4444', shadow: 'rgba(239, 68, 68, 0.2)' }
            ].map(m => (
              <div key={m.label} style={{
                background: '#0D0618',
                border: '1px solid rgba(168, 85, 247, 0.2)',
                borderRadius: '8px',
                padding: '12px 16px',
                textAlign: 'center',
                boxShadow: `0 4px 15px ${m.shadow}`
              }}>
                <span style={{ fontSize: '9px', color: '#8B7BA8', fontWeight: 'bold', display: 'block', marginBottom: '4px', letterSpacing: '0.5px' }}>{m.label}</span>
                <span style={{ fontSize: '22px', fontWeight: 'bold', color: m.color, fontFamily: 'monospace' }}>{m.value}</span>
              </div>
            ))}
          </div>

        </div>

        {/* Right Column: vessels telemetry list */}
        <div style={{
          background: '#0D0618',
          border: '1px solid rgba(168, 85, 247, 0.35)',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
          height: '540px',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(168, 85, 247, 0.2)', paddingBottom: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>TELEMETRI REAL-TIME</span>
            <span style={{ fontSize: '9px', color: '#8B7BA8', fontWeight: 'bold' }}>AUTO STREAMING ACTIVE</span>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '4px' }}>
            {armada && armada.map((ship: any) => (
              <div 
                key={ship.id} 
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(168, 85, 247, 0.15)',
                  borderRadius: '6px',
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  transition: 'border-color 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.5)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.15)'}
                onClick={async () => {
                  // Interactive trigger: Admin can mutate ship status on click to demonstrate mutations
                  if (role === 'Admin') {
                    const statuses: any[] = ['DALAM PERJALANAN', 'DI PELABUHAN', 'TERLAMBAT', 'PEMELIHARAAN'];
                    const currentIdx = statuses.indexOf(ship.status);
                    const nextStatus = statuses[(currentIdx + 1) % statuses.length];
                    
                    const eventLogNote = `Intervensi admin memicu perubahan status ${ship.name} menjadi ${nextStatus}.`;
                    await triggerVesselMutation(ship.id, nextStatus);
                    console.log(`[MUTATION SUCCESS] ${ship.name} mutated to ${nextStatus}`);
                  } else {
                    alert(`Telemetri kapal ${ship.name}. Peran 'Admin' dibutuhkan untuk melakukan mutasi status kapal.`);
                  }
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'white' }}>{ship.name}</span>
                  <span style={getBadgeStyle(ship.status)}>{ship.status}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', fontSize: '10px', color: '#C7B8EA', rowGap: '4px' }}>
                  <span style={{ color: '#8B7BA8' }}>Rute:</span>
                  <span>{ship.location} ➔ {ship.destination}</span>
                  
                  <span style={{ color: '#8B7BA8' }}>Muatan:</span>
                  <span>{ship.cargo || '-'}</span>

                  <span style={{ color: '#8B7BA8' }}>ETA:</span>
                  <span style={{ color: ship.status === 'TERLAMBAT' ? '#F59E0B' : 'white', fontWeight: ship.status === 'TERLAMBAT' ? 'bold' : 'normal' }}>
                    {ship.eta}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div style={{ fontSize: '9px', color: '#8B7BA8', textAlign: 'center', marginTop: '12px', paddingTop: '8px', borderTop: '1px dashed rgba(168, 85, 247, 0.15)' }}>
            *Klik telemetry card (sebagai Administrator) untuk memicu mutasi status kapal.
          </div>
        </div>

      </div>

      {/* Bottom Area: Command & Logs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px' }}>
        
        {/* Command logs */}
        <div style={{
          background: '#0D0618',
          border: '1px solid rgba(168, 85, 247, 0.35)',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.6)'
        }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '16px', letterSpacing: '1px', textTransform: 'uppercase', borderBottom: '1px solid rgba(168, 85, 247, 0.2)', paddingBottom: '10px' }}>
            LOGBOOK PERGERAKAN TERAKHIR
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '180px', overflowY: 'auto' }}>
            {logs && logs.slice(0, 6).map((log: any) => (
              <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', fontSize: '10px', padding: '6px 0', borderBottom: '1px dashed rgba(255, 255, 255, 0.05)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', maxWidth: '75%' }}>
                  <span style={{ fontWeight: 'bold', color: '#C084FC' }}>
                    [{log.vesselName}] ➔ {log.event}
                  </span>
                  <span style={{ color: '#8B7BA8' }}>{log.notes}</span>
                </div>
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ color: '#C7B8EA', fontWeight: 'bold' }}>{log.status}</span>
                  <span style={{ fontSize: '8px', color: '#8B7BA8' }}>{log.timestamp.split(' ')[1]}</span>
                </div>
              </div>
            ))}
            {(!logs || logs.length === 0) && (
              <div style={{ fontSize: '10px', color: '#8B7BA8', textAlign: 'center', padding: '16px' }}>Menunggu data telemetry satelit...</div>
            )}
          </div>
        </div>

        {/* Global Controls */}
        <div style={{
          background: '#0D0618',
          border: '1px solid rgba(168, 85, 247, 0.35)',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          {role === 'Admin' ? (
            <>
              <span style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '6px' }}>KENDALI NAVIGASI PUSAT</span>
              <p style={{ color: '#8B7BA8', fontSize: '10px', marginBottom: '16px', maxWidth: '90%' }}>
                Peran: Administrator. Anda memiliki wewenang penuh untuk mengubah parameter cuaca global maritim.
              </p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {(['Badai Ekstrem', 'Terik Gersang', 'Normal'] as const).map(c => (
                  <button 
                    key={c} 
                    onClick={() => {
                      updateCuaca(c);
                      // Custom alert beep on weather shift
                      playAudioAlert();
                    }} 
                    style={{
                      background: cuaca === c
                        ? c === 'Badai Ekstrem' ? '#EF4444' : c === 'Terik Gersang' ? '#F59E0B' : '#22C55E'
                        : 'rgba(255, 255, 255, 0.03)',
                      border: `1px solid ${
                        cuaca === c
                          ? c === 'Badai Ekstrem' ? '#EF4444' : c === 'Terik Gersang' ? '#F59E0B' : '#22C55E'
                          : 'rgba(168, 85, 247, 0.3)'
                      }`,
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      fontFamily: 'monospace',
                      boxShadow: cuaca === c ? '0 0 10px rgba(168, 85, 247, 0.4)' : 'none',
                      transition: 'all 0.2s'
                    }}
                  >
                    {c.toUpperCase()}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <span style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '6px' }}>TELEMETRI CUACA MARITIM</span>
              <p style={{ color: '#8B7BA8', fontSize: '10px', marginBottom: '12px' }}>
                Peran: Pengamat. Pembaruan otomatis disinkronkan langsung dari satelit PrimeLog.
              </p>
              <div style={{
                border: '1px solid rgba(168, 85, 247, 0.3)',
                padding: '10px 20px',
                borderRadius: '6px',
                background: 'rgba(168, 85, 247, 0.05)',
                color: '#C084FC',
                fontWeight: 'bold',
                fontSize: '12px',
                fontFamily: 'monospace',
                letterSpacing: '1px'
              }}>
                [CUACA SAAT INI: {cuaca?.toUpperCase() || 'NORMAL'}]
              </div>
            </>
          )}
        </div>

      </div>

      <style>{`
        @keyframes warningPulse {
          0%, 100% { box-shadow: 0 0 15px rgba(239, 68, 68, 0.4); }
          50% { box-shadow: 0 0 25px rgba(239, 68, 68, 0.7); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes rainFlow {
          0% { transform: translate(-80px, -160px); opacity: 0; }
          10% { opacity: 0.55; }
          90% { opacity: 0.55; }
          100% { transform: translate(120px, 240px); opacity: 0; }
        }
        @keyframes windFlow {
          0% { stroke-dashoffset: 400; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes stormLightning {
          0%, 94%, 100% { opacity: 0; }
          95%, 97% { opacity: 0.3; }
          96% { opacity: 0.05; }
        }
        @keyframes radarRotation {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @media (max-width: 900px) {
          .main-cmd-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

    </div>
  );
}

export default function RingkasanDashboard() {
  return (
    <Suspense fallback={<div style={{ color: 'white', fontFamily: 'monospace', padding: '40px', textAlign: 'center' }}>Menginisialisasi sistem satelit PrimeLog...</div>}>
      <DashboardContent />
    </Suspense>
  );
}