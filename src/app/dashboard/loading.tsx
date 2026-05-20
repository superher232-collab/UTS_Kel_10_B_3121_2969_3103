"use client";
import React from 'react';

export default function DashboardLoading() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      color: 'white',
      fontFamily: 'monospace',
      gap: '24px',
      width: '100%'
    }}>
      {/* Radar Scanner Animation */}
      <div style={{
        position: 'relative',
        width: '100px',
        height: '100px',
        border: '2px solid rgba(168, 85, 247, 0.2)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle, rgba(168, 85, 247, 0.05) 0%, transparent 70%)',
        boxShadow: '0 0 20px rgba(168, 85, 247, 0.1)'
      }}>
        {/* Sweep line */}
        <div style={{
          position: 'absolute',
          width: '50%',
          height: '2px',
          background: 'linear-gradient(90deg, #A855F7, transparent)',
          transformOrigin: '100% 50%',
          top: 'calc(50% - 1px)',
          left: 0,
          animation: 'radar-sweep 2s linear infinite'
        }} />

        {/* Pulse rings */}
        <div style={{
          position: 'absolute',
          inset: '10px',
          border: '1px dashed rgba(168, 85, 247, 0.15)',
          borderRadius: '50%'
        }} />
        <div style={{
          position: 'absolute',
          inset: '25px',
          border: '1px solid rgba(168, 85, 247, 0.1)',
          borderRadius: '50%'
        }} />

        {/* Inner Blinking Core */}
        <div style={{
          width: '8px',
          height: '8px',
          background: '#A855F7',
          borderRadius: '50%',
          boxShadow: '0 0 12px 4px #A855F7',
          animation: 'core-blink 1.2s infinite alternate'
        }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', textAlign: 'center' }}>
        <span style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '2px', color: '#A855F7', textShadow: '0 0 8px rgba(168,85,247,0.5)' }}>
          SINKRONISASI RADAR NAVIGASI...
        </span>
        <span style={{ fontSize: '9px', color: '#8B7BA8', letterSpacing: '1px' }}>
          MENGHUBUNGKAN DECK PUSAT
        </span>
      </div>

      <style>{`
        @keyframes radar-sweep {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes core-blink {
          0% { opacity: 0.4; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}
