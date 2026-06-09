'use client';

import React, { useState, useEffect } from 'react';

// Dummy data
const DUMMY_SHIPS = [
  { id: 'V-001', name: 'KM Nusantara 1', lat: 30, lng: 40, status: 'BERLAYAR' },
  { id: 'V-002', name: 'KM Bahari 2', lat: 60, lng: 70, status: 'SANDAR' },
  { id: 'V-003', name: 'KM Express', lat: 50, lng: 20, status: 'PERJALANAN' },
];

const DUMMY_SHIPMENTS: Record<string, any[]> = {
  'V-001': [
    { id: 'SH-101', customer: 'Budi', item: 'Elektronik', origin: 'Jakarta', dest: 'Makassar' },
    { id: 'SH-102', customer: 'Andi', item: 'Pakaian', origin: 'Jakarta', dest: 'Makassar' }
  ],
  'V-002': [
    { id: 'SH-201', customer: 'Siti', item: 'Makanan', origin: 'Surabaya', dest: 'Bali' }
  ],
  'V-003': []
};

export default function AdminMapPage() {
  const [selectedShip, setSelectedShip] = useState<string | null>(null);

  return (
    <div style={{
      width: '100%',
      height: '80vh',
      background: '#07020E',
      color: 'white',
      fontFamily: 'monospace, var(--font-roboto-mono)',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: '#C084FC', letterSpacing: '2px', fontSize: '24px', margin: 0 }}>🗺️ GLOBAL FLEET MAP (ADMIN)</h1>
        <div style={{ fontSize: '12px', color: '#8B7BA8' }}>STATUS: <span style={{ color: '#22C55E' }}>LIVE TRACKING</span></div>
      </div>

      <div style={{ display: 'flex', gap: '20px', flex: 1 }}>
        {/* MAP AREA */}
        <div style={{
          flex: 2,
          border: '1px solid rgba(168, 85, 247, 0.4)',
          borderRadius: '8px',
          background: 'rgba(10, 4, 20, 0.8)',
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: 'linear-gradient(rgba(168, 85, 247, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(168, 85, 247, 0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}>
          {/* Dummy Map Markers */}
          {DUMMY_SHIPS.map(ship => (
            <div 
              key={ship.id}
              onClick={() => setSelectedShip(ship.id)}
              style={{
                position: 'absolute',
                top: `${ship.lat}%`,
                left: `${ship.lng}%`,
                width: '16px',
                height: '16px',
                background: selectedShip === ship.id ? '#F59E0B' : '#A855F7',
                borderRadius: '50%',
                cursor: 'pointer',
                boxShadow: `0 0 15px ${selectedShip === ship.id ? '#F59E0B' : '#A855F7'}`,
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{
                position: 'absolute',
                bottom: '-25px',
                background: 'rgba(0,0,0,0.8)',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '10px',
                whiteSpace: 'nowrap',
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                {ship.name}
              </div>
            </div>
          ))}
        </div>

        {/* SIDEBAR AREA */}
        <div style={{
          flex: 1,
          border: '1px solid rgba(168, 85, 247, 0.4)',
          borderRadius: '8px',
          background: 'rgba(10, 4, 20, 0.8)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          overflowY: 'auto'
        }}>
          <h2 style={{ fontSize: '16px', color: '#C084FC', borderBottom: '1px solid rgba(168,85,247,0.3)', paddingBottom: '8px', margin: 0 }}>
            {selectedShip ? `KAPAL: ${DUMMY_SHIPS.find(s => s.id === selectedShip)?.name}` : 'PILIH KAPAL DI PETA'}
          </h2>

          {selectedShip ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '12px', color: '#8B7BA8', marginBottom: '10px' }}>Daftar Paket di Kapal ini:</div>
              {DUMMY_SHIPMENTS[selectedShip]?.length > 0 ? (
                DUMMY_SHIPMENTS[selectedShip].map(shipment => (
                  <div key={shipment.id} style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    padding: '12px',
                    borderRadius: '6px'
                  }}>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'white' }}>{shipment.id} - {shipment.item}</div>
                    <div style={{ fontSize: '11px', color: '#A855F7', marginTop: '4px' }}>Customer: {shipment.customer}</div>
                    <div style={{ fontSize: '10px', color: '#8B7BA8', marginTop: '4px' }}>Rute: {shipment.origin} ➔ {shipment.dest}</div>
                  </div>
                ))
              ) : (
                <div style={{ color: '#EF4444', fontSize: '12px' }}>Kargo Kosong.</div>
              )}
            </div>
          ) : (
            <div style={{ color: '#8B7BA8', fontSize: '12px', textAlign: 'center', marginTop: '40px' }}>
              Klik ikon kapal di peta untuk melihat muatan kargo.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
