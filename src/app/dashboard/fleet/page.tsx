"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useDashboard } from '@/context/DashboardContext';

function FleetSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', color: 'white', fontFamily: 'monospace' }}>
      
      {/* Top Summary Cards Skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx} style={{ background: '#0D0618', border: '1px solid rgba(168, 85, 247, 0.15)', borderRadius: '6px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', animation: 'skeleton-pulse 1.5s infinite ease-in-out' }}>
            <div style={{ width: '60%', height: '10px', background: 'rgba(168, 85, 247, 0.15)', borderRadius: '2px' }}></div>
            <div style={{ width: '30%', height: '24px', background: 'rgba(168, 85, 247, 0.25)', borderRadius: '4px' }}></div>
          </div>
        ))}
      </div>

      {/* Filter Bar Skeleton */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={{ flex: 1, height: '38px', background: '#0D0618', border: '1px solid rgba(168, 85, 247, 0.15)', borderRadius: '6px', animation: 'skeleton-pulse 1.5s infinite ease-in-out' }} />
        <div style={{ width: '130px', height: '38px', background: 'rgba(168, 85, 247, 0.2)', borderRadius: '6px', animation: 'skeleton-pulse 1.5s infinite ease-in-out' }} />
      </div>

      {/* Fleet Grid Skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} style={{ background: '#0D0618', border: '1px solid rgba(168, 85, 247, 0.15)', borderRadius: '6px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', overflow: 'hidden', minHeight: '180px', animation: 'skeleton-pulse 1.5s infinite ease-in-out' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', width: '70%' }}>
                <div style={{ width: '32px', height: '32px', background: 'rgba(168, 85, 247, 0.15)', borderRadius: '4px' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
                  <div style={{ width: '80%', height: '12px', background: 'rgba(168, 85, 247, 0.2)', borderRadius: '2px' }} />
                  <div style={{ width: '50%', height: '8px', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '2px' }} />
                </div>
              </div>
              <div style={{ width: '70px', height: '18px', background: 'rgba(168, 85, 247, 0.15)', borderRadius: '4px' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', rowGap: '12px', marginTop: '8px' }}>
              <div style={{ width: '40px', height: '10px', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '2px' }} />
              <div style={{ width: '60px', height: '10px', background: 'rgba(168, 85, 247, 0.15)', borderRadius: '2px', justifySelf: 'end' }} />
              <div style={{ width: '40px', height: '10px', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '2px' }} />
              <div style={{ width: '80px', height: '10px', background: 'rgba(168, 85, 247, 0.15)', borderRadius: '2px', justifySelf: 'end' }} />
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes skeleton-pulse {
          0% { opacity: 0.6; }
          50% { opacity: 0.35; }
          100% { opacity: 0.6; }
        }
      `}</style>

    </div>
  );
}

function FleetContent() {
  const { role, armada, tambahKapal, hapusKapal, loading, errorSignal } = useDashboard();
  const ships = armada && armada.length > 0 ? armada : [];

  // Localized filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('semua');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // React to search query params from megamenu
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const filterParam = params.get('filter');
      if (filterParam) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setStatusFilter(filterParam);
      }
    }
  }, []);

  // Stats calculation
  const total = ships.length;
  const berlayar = ships.filter((s: any) => s.status?.toLowerCase().includes('perjalanan')).length;
  const pelabuhan = ships.filter((s: any) => s.status?.toLowerCase().includes('pelabuhan')).length;
  const terlambat = ships.filter((s: any) => s.status?.toLowerCase().includes('terlambat')).length;
  const perawatan = ships.filter((s: any) => s.status?.toLowerCase().includes('pemeliharaan')).length;

  // State tambah kapal modal
  const [showModal, setShowModal] = useState(false);
  const [loadingTambah, setLoadingTambah] = useState(false);
  const [loadingHapus, setLoadingHapus] = useState<any>(null);
  
  const [form, setForm] = useState({
    name: '', type: 'Kapal Petikemas', status: 'DALAM PERJALANAN',
    location: '', destination: '', eta: '', cargo: ''
  });

  // Filter lists based on Search Query & Status Dropdowns
  const filteredShips = ships.filter((ship: any) => {
    const term = searchTerm.toLowerCase();
    const statusText = ship.status?.toLowerCase() || '';

    const matchesSearch = (
      (ship.name || '').toLowerCase().includes(term) ||
      (ship.type || '').toLowerCase().includes(term) ||
      (ship.location || '').toLowerCase().includes(term) ||
      (ship.destination || '').toLowerCase().includes(term)
    );

    let matchesStatus = true;
    if (statusFilter === 'berlayar') matchesStatus = statusText.includes('perjalanan');
    else if (statusFilter === 'sandar') matchesStatus = statusText.includes('pelabuhan');
    else if (statusFilter === 'terlambat') matchesStatus = statusText.includes('terlambat');
    else if (statusFilter === 'pemeliharaan') matchesStatus = statusText.includes('pemeliharaan');

    return matchesSearch && matchesStatus;
  });

  const totalFilteredShips = filteredShips.length;
  const totalPages = Math.ceil(totalFilteredShips / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedShips = filteredShips.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const handleTambah = async () => {
    if (!form.name || !form.type || !form.status) {
      alert('Nama, jenis, dan status wajib diisi.');
      return;
    }

    setLoadingTambah(true);
    const result = await tambahKapal(form);
    setLoadingTambah(false);

    if (result.success) {
      setShowModal(false);
      setForm({ name: '', type: 'Kapal Petikemas', status: 'DALAM PERJALANAN', location: '', destination: '', eta: '', cargo: '' });
      setSearchTerm('');
      setCurrentPage(1);
    } else {
      alert('Gagal menambah kapal. Silakan coba lagi.');
    }
  };

  const handleHapus = async (id: any) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kapal ini dari sistem monitoring PrimeLog?')) return;

    setLoadingHapus(id);
    const result = await hapusKapal(id);
    setLoadingHapus(null);

    if (!result.success) {
      alert('Gagal menghapus kapal.');
    }
  };

  // Status Badge visual styles
  const getBadgeStyle = (status: string): React.CSSProperties => {
    const base: React.CSSProperties = {
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '9px',
      fontWeight: 'bold',
      fontFamily: 'monospace',
      border: '1px solid'
    };

    const text = status.toUpperCase();
    if (text.includes('PERJALANAN')) {
      return { ...base, background: 'rgba(34, 197, 94, 0.1)', borderColor: '#22C55E', color: '#22C55E' };
    } else if (text.includes('PELABUHAN')) {
      return { ...base, background: 'rgba(59, 130, 246, 0.1)', borderColor: '#3B82F6', color: '#3B82F6' };
    } else if (text.includes('TERLAMBAT')) {
      return { ...base, background: 'rgba(245, 158, 11, 0.1)', borderColor: '#F59E0B', color: '#F59E0B' };
    } else {
      return { ...base, background: 'rgba(239, 68, 68, 0.1)', borderColor: '#EF4444', color: '#EF4444' };
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: '#07020E',
    border: '1px solid rgba(168, 85, 247, 0.35)',
    borderRadius: '4px',
    padding: '8px 12px',
    color: 'white',
    fontSize: '12px',
    outline: 'none',
    boxSizing: 'border-box'
  };

  if (loading) {
    return <FleetSkeleton />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', color: 'white', fontFamily: 'monospace' }}>

      {/* SWR warning info */}
      {errorSignal && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid #EF4444',
          padding: '12px 18px',
          borderRadius: '6px',
          fontSize: '11px',
          color: '#FCA5A5',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span>⚠️</span>
          <span><strong>TELEMETRI SATELIT GAGAL:</strong> Menampilkan telemetri terakhir yang tersimpan di cache. Interaksi CRUD (Tambah/Hapus) dinonaktifkan sementara hingga sinyal pulih.</span>
        </div>
      )}

      {/* CRUD Modal Form */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(7, 2, 14, 0.8)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
          <div style={{ background: '#0D0618', border: '1px solid rgba(168, 85, 247, 0.5)', borderRadius: '12px', padding: '32px', width: '90%', maxWidth: '480px', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 20px rgba(168, 85, 247, 0.2)' }}>
            <div style={{ fontSize: '14px', fontWeight: 'bold', letterSpacing: '2px', color: '#C084FC', borderBottom: '1px solid rgba(168, 85, 247, 0.2)', paddingBottom: '10px' }}>REGISTRASI KAPAL BARU</div>

            {[
              { label: 'Nama Kapal *', key: 'name', placeholder: 'KM NUSANTARA COMMANDER' },
              { label: 'Jenis Kapal *', key: 'type', placeholder: 'Kapal Petikemas / Tanker / Kargo' },
              { label: 'Lokasi Perairan *', key: 'location', placeholder: 'Laut Jawa / Selat Malaka' },
              { label: 'Tujuan Pelabuhan *', key: 'destination', placeholder: 'Tanjung Perak / Belawan' },
              { label: 'ETA Pelabuhan *', key: 'eta', placeholder: '2026-05-30 08:00' },
              { label: 'Muatan Kargo *', key: 'cargo', placeholder: 'Elektronik / LNG / Sembako' },
            ].map(({ label, key, placeholder }) => (
              <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '10px', color: '#8B7BA8', fontWeight: 'bold' }}>{label}</span>
                <input
                  type="text"
                  placeholder={placeholder}
                  value={form[key as keyof typeof form]}
                  onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                  style={inputStyle}
                />
              </div>
            ))}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '10px', color: '#8B7BA8', fontWeight: 'bold' }}>Status Maritim *</span>
              <select
                value={form.status}
                onChange={e => setForm(prev => ({ ...prev, status: e.target.value }))}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                <option value="DALAM PERJALANAN" style={{ background: '#0D0618' }}>DALAM PERJALANAN</option>
                <option value="DI PELABUHAN" style={{ background: '#0D0618' }}>DI PELABUHAN</option>
                <option value="TERLAMBAT" style={{ background: '#0D0618' }}>TERLAMBAT</option>
                <option value="PEMELIHARAAN" style={{ background: '#0D0618' }}>PEMELIHARAAN</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
              <button
                onClick={() => setShowModal(false)}
                style={{ flex: 1, background: 'transparent', border: '1px solid rgba(168,85,247,0.3)', color: '#8B7BA8', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}
              >
                Batal
              </button>
              <button
                onClick={handleTambah}
                disabled={loadingTambah}
                style={{ flex: 1, background: '#A855F7', border: 'none', color: 'white', padding: '10px', borderRadius: '6px', cursor: loadingTambah ? 'not-allowed' : 'pointer', fontSize: '11px', fontWeight: 'bold', opacity: loadingTambah ? 0.7 : 1, boxShadow: '0 0 15px rgba(168, 85, 247, 0.4)' }}
              >
                {loadingTambah ? 'Menyimpan...' : 'Daftarkan Kapal'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Summary Panels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
        {[
          { label: 'TOTAL ARMADA AKTIF', value: total, color: '#A855F7', border: 'rgba(168, 85, 247, 0.3)' },
          { label: 'SEDANG BERLAYAR', value: berlayar, color: '#22C55E', border: 'rgba(34, 197, 94, 0.3)' },
          { label: 'SANDAR DI PELABUHAN', value: pelabuhan, color: '#3B82F6', border: 'rgba(59, 130, 246, 0.3)' },
          { label: 'TERLAMBAT / DELAYED', value: terlambat, color: '#F59E0B', border: 'rgba(245, 158, 11, 0.3)' },
          { label: 'PERAWATAN / DOCK', value: perawatan, color: '#EF4444', border: 'rgba(239, 68, 68, 0.3)' },
        ].map(card => (
          <div key={card.label} style={{ background: '#0D0618', border: `1px solid ${card.border}`, borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }}>
            <span style={{ fontSize: '9px', color: '#8B7BA8', fontWeight: 'bold', letterSpacing: '0.5px' }}>{card.label}</span>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: card.color }}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Searching, Filtering, and Actions Command */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        
        {/* Search */}
        <div style={{ flex: 1, position: 'relative', minWidth: '240px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8B7BA8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}>
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Cari nama kapal, tipe, perairan, atau pelabuhan..."
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            style={{ width: '100%', background: '#0D0618', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '6px', padding: '10px 10px 10px 38px', color: 'white', fontSize: '12px', outline: 'none' }}
          />
        </div>

        {/* Localized Filter Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '10px', color: '#8B7BA8', fontWeight: 'bold' }}>FILTER:</span>
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            style={{ background: '#0D0618', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '6px', padding: '8px 16px', color: 'white', fontSize: '12px', outline: 'none', cursor: 'pointer' }}
          >
            <option value="semua">SEMUA ARMADA</option>
            <option value="berlayar">SEDANG BERLAYAR</option>
            <option value="sandar">DI PELABUHAN</option>
            <option value="terlambat">TERLAMBAT</option>
            <option value="pemeliharaan">PEMELIHARAAN</option>
          </select>
        </div>

        {/* Admin CRUD additions */}
        {role === 'Admin' && (
          <button
            onClick={() => setShowModal(true)}
            disabled={!!errorSignal}
            style={{
              background: errorSignal ? 'rgba(255, 255, 255, 0.05)' : '#A855F7',
              color: errorSignal ? '#8B7BA8' : 'white',
              padding: '10px 20px',
              borderRadius: '6px',
              border: 'none',
              cursor: errorSignal ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '11px',
              fontWeight: 'bold',
              boxShadow: errorSignal ? 'none' : '0 0 15px rgba(168, 85, 247, 0.4)',
              transition: 'all 0.2s'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            TAMBAH ARMADA
          </button>
        )}
      </div>

      {/* Grid of Vessels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {paginatedShips.map((ship: any) => {
          const isBerlayar = ship.status?.toLowerCase().includes('perjalanan');
          
          return (
            <div 
              key={ship.id} 
              style={{
                background: '#0D0618',
                border: '1px solid rgba(168, 85, 247, 0.2)',
                borderRadius: '8px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.5)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.2)'}
            >
              {/* Pulsing visual top-bar line for active moving vessels */}
              {isBerlayar && (
                <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: '2px', background: '#22C55E', boxShadow: '0 0 15px 3px #22C55E' }}></div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: '34px', height: '34px', background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C084FC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                      <line x1="4" y1="22" x2="4" y2="15"></line>
                    </svg>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'white' }}>{ship.name}</span>
                    <span style={{ fontSize: '10px', color: '#8B7BA8' }}>{ship.type}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={getBadgeStyle(ship.status)}>{ship.status}</span>
                  {role === 'Admin' && (
                    <button
                      onClick={() => handleHapus(ship.id)}
                      disabled={loadingHapus === ship.id || !!errorSignal}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: (loadingHapus === ship.id || errorSignal) ? 'not-allowed' : 'pointer',
                        padding: '4px',
                        opacity: (loadingHapus === ship.id || errorSignal) ? 0.3 : 0.8,
                        transition: 'opacity 0.2s'
                      }}
                      onMouseEnter={e => !errorSignal && (e.currentTarget.style.opacity = '1')}
                      onMouseLeave={e => !errorSignal && (e.currentTarget.style.opacity = '0.8')}
                      title="Hapus Kapal Dari Sistem"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Specs parameters */}
              <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', rowGap: '8px', fontSize: '11px', color: '#C7B8EA', marginBottom: '20px' }}>
                <span style={{ color: '#8B7BA8' }}>Posisi Terkini:</span>
                <span style={{ textAlign: 'right' }}>{ship.location || '-'}</span>

                <span style={{ color: '#8B7BA8' }}>Pelabuhan ETA:</span>
                <span style={{ textAlign: 'right' }}>{ship.destination || '-'}</span>

                <span style={{ color: '#8B7BA8' }}>Muatan Cargo:</span>
                <span style={{ textAlign: 'right' }}>{ship.cargo || '-'}</span>

                <span style={{ color: '#8B7BA8' }}>Perkiraan Tiba:</span>
                <span style={{ textAlign: 'right', color: ship.status?.includes('TERLAMBAT') ? '#F59E0B' : 'white', fontWeight: ship.status?.includes('TERLAMBAT') ? 'bold' : 'normal' }}>
                  {ship.eta || '-'}
                </span>
              </div>

              <div style={{ fontSize: '9px', color: '#8B7BA8', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed rgba(168, 85, 247, 0.15)', paddingTop: '10px' }}>
                <span>GPS Lat/Lng: {ship.latitude}, {ship.longitude}</span>
                <span>Pembaruan: {ship.update}</span>
              </div>
            </div>
          );
        })}

        {/* Empty state */}
        {totalFilteredShips === 0 && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '64px 24px',
            background: '#0D0618',
            border: '1px dashed rgba(168, 85, 247, 0.3)',
            borderRadius: '12px',
            textAlign: 'center',
            gap: '16px',
            gridColumn: '1 / -1'
          }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(168, 85, 247, 0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'white' }}>Data Armada Kosong</span>
              <span style={{ fontSize: '10px', color: '#8B7BA8' }}>Tidak ada kapal yang cocok dengan pencarian dan filter Anda saat ini.</span>
            </div>
            <button
              onClick={() => { setSearchTerm(''); setStatusFilter('semua'); setCurrentPage(1); }}
              style={{
                background: 'rgba(168, 85, 247, 0.1)',
                border: '1px solid rgba(168, 85, 247, 0.35)',
                color: '#C084FC',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '11px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'background 0.2s'
              }}
            >
              Reset Filter Pencarian
            </button>
          </div>
        )}
      </div>

      {/* Pagination Footer controls */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: '1px solid rgba(168, 85, 247, 0.2)'
        }}>
          <div style={{ fontSize: '11px', color: '#8B7BA8' }}>
            Menampilkan <span style={{ color: 'white', fontWeight: 'bold' }}>{startIndex + 1}</span> - <span style={{ color: 'white', fontWeight: 'bold' }}>{Math.min(startIndex + itemsPerPage, totalFilteredShips)}</span> dari <span style={{ color: 'white', fontWeight: 'bold' }}>{totalFilteredShips}</span> kapal
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={{
                background: currentPage === 1 ? 'rgba(255,255,255,0.01)' : 'rgba(168, 85, 247, 0.1)',
                border: `1px solid ${currentPage === 1 ? 'rgba(255,255,255,0.05)' : 'rgba(168, 85, 247, 0.35)'}`,
                color: currentPage === 1 ? '#8B7BA8' : 'white',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '10px',
                fontWeight: 'bold',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
              }}
            >
              Kembali
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                style={{
                  background: currentPage === page ? 'linear-gradient(90deg, #A855F7 0%, #7C3AED 100%)' : 'transparent',
                  border: `1px solid ${currentPage === page ? '#A855F7' : 'rgba(168, 85, 247, 0.25)'}`,
                  color: 'white',
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: currentPage === page ? '0 0 10px rgba(168, 85, 247, 0.4)' : 'none'
                }}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              style={{
                background: currentPage === totalPages ? 'rgba(255,255,255,0.01)' : 'rgba(168, 85, 247, 0.1)',
                border: `1px solid ${currentPage === totalPages ? 'rgba(255,255,255,0.05)' : 'rgba(168, 85, 247, 0.35)'}`,
                color: currentPage === totalPages ? '#8B7BA8' : 'white',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '10px',
                fontWeight: 'bold',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
              }}
            >
              Lanjut
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default function FleetPage() {
  return (
    <Suspense fallback={<FleetSkeleton />}>
      <FleetContent />
    </Suspense>
  );
}