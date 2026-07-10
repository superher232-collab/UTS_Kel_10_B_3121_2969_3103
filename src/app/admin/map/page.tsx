'use client';

import React from 'react';
import { InteractiveMap } from '@/components/map/InteractiveMap';

export default function AdminMapPage() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            margin: 0
          }}>
            Peta Armada
          </h1>
          <p style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--text-tertiary)',
            margin: '4px 0 0 0'
          }}>
            Pemantauan posisi dan rute seluruh armada kapal secara real-time.
          </p>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span className="status-dot status-dot-green"></span>
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--success)' }}>Live Tracking</span>
        </div>
      </div>

      <InteractiveMap />
    </div>
  );
}
