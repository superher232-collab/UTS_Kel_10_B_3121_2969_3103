"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useDashboard } from '@/context/DashboardContext';

function FleetSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', color: 'white', fontFamily: 'monospace' }}>
      
      {/* Top Summary Cards Skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx} style={{ background: '#130a24', border: '1px solid rgba(168, 85, 247, 0.15)', borderRadius: '4px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', animation: 'skeleton-pulse 1.5s infinite ease-in-out' }}>
            <div style={{ width: '60%', height: '10px', background: 'rgba(168, 85, 247, 0.15)', borderRadius: '2px' }}></div>
            <div style={{ width: '30%', height: '24px', background: 'rgba(168, 85, 247, 0.25)', borderRadius: '4px' }}></div>
          </div>
        ))}
      </div>

      {/* Filter Bar Skeleton */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={{ flex: 1, height: '38px', background: '#130a24', border: '1px solid rgba(168, 85, 247, 0.15)', borderRadius: '4px', animation: 'skeleton-pulse 1.5s infinite ease-in-out' }} />
        <div style={{ width: '130px', height: '38px', background: 'rgba(168, 85, 247, 0.2)', borderRadius: '4px', animation: 'skeleton-pulse 1.5s infinite ease-in-out' }} />
      </div>

      {/* Fleet Grid Skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} style={{ background: '#130a24', border: '1px solid rgba(168, 85, 247, 0.15)', borderRadius: '4px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', overflow: 'hidden', minHeight: '180px', animation: 'skeleton-pulse 1.5s infinite ease-in-out' }}>
            
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

            <div style={{ width: '60%', height: '8px', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '2px', marginTop: 'auto' }} />

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
  const { role, armada, tambahKapal, hapusKapal, loading } = useDashboard();
  const ships = armada && armada.length > 0 ? armada : [];

  // Stats dari data nyata
  const total      = ships.length;
  const berlayar   = ships.filter((s: any) => s.status?.toLowerCase().includes('perjalanan')).length;
  const pelabuhan  = ships.filter((s: any) => s.status?.toLowerCase().includes('pelabuhan')).length;
  const terlambat  = ships.filter((s: any) => s.status?.toLowerCase().includes('terlambat')).length;
  const perawatan  = ships.filter((s: any) => s.status?.toLowerCase().includes('pemeliharaan')).length;

  // State pencarian dan pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // State modal tambah kapal
  const [showModal, setShowModal] = useState(false);
  const [loadingTambah, setLoadingTambah] = useState(false);
  const [loadingHapus, setLoadingHapus]   = useState<any>(null);
  const [form, setForm] = useState({
    name: '', type: '', status: 'DALAM PERJALANAN',
    location: '', destination: '', eta: ''
  });

  // Filter kapal berdasarkan search term
  const filteredShips = ships.filter((ship: any) => {
    const term = searchTerm.toLowerCase();
    return (
      (ship.name || '').toLowerCase().includes(term) ||
      (ship.type || '').toLowerCase().includes(term) ||
      (ship.location || '').toLowerCase().includes(term) ||
      (ship.destination || '').toLowerCase().includes(term) ||
      (ship.status || '').toLowerCase().includes(term)
    );
  });

  const totalFilteredShips = filteredShips.length;
  const totalPages = Math.ceil(totalFilteredShips / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedShips = filteredShips.slice(startIndex, startIndex + itemsPerPage);

  // Sesuaikan halaman aktif jika di luar batas karena perubahan data
  useEffect(() => {
    if (currentPage > totalPages) {
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
      setForm({ name: '', type: '', status: 'DALAM PERJALANAN', location: '', destination: '', eta: '' });
      // Reset search dan pindah ke halaman akhir untuk melihat kapal baru
      setSearchTerm('');
      setCurrentPage(Math.ceil((ships.length + 1) / itemsPerPage) || 1);
    } else {
      alert('Gagal menambah kapal. Cek console untuk detail.');
    }
  };

  const handleHapus = async (id: any) => {
    if (!confirm('Yakin hapus kapal ini?')) return;

    setLoadingHapus(id);
    const result = await hapusKapal(id);
    setLoadingHapus(null);

    if (!result.success) {
      alert('Gagal menghapus kapal. Cek console untuk detail.');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // FIX TYPESCRIPT ERROR: Tambahkan "as React.CSSProperties" di sini
  const inputStyle = {
    width: '100%', background: '#0d0618',
    border: '1px solid rgba(168, 85, 247, 0.3)',
    borderRadius: '4px', padding: '8px 12px',
    color: 'white', fontSize: '12px', outline: 'none',
    boxSizing: 'border-box' as const // <--- INI KUNCI UTAMANYA BIAR ERROR ILANG
  };

  if (loading) {
    return <FleetSkeleton />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', color: 'white', fontFamily: 'monospace' }}>

      {/* Modal Tambah Kapal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#130a24', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '8px', padding: '32px', width: '100%', maxWidth: '480px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: 'bold', letterSpacing: '1px' }}>TAMBAH KAPAL BARU</div>

            {[
              { label: 'Nama Kapal *', key: 'name',        placeholder: 'KM NUSANTARA' },
              { label: 'Jenis Kapal *', key: 'type',       placeholder: 'Kapal Petikemas' },
              { label: 'Lokasi',        key: 'location',   placeholder: 'Laut Jawa' },
              { label: 'Tujuan',        key: 'destination',placeholder: 'Tanjung Perak' },
              { label: 'ETA',           key: 'eta',        placeholder: '2026-05-01 10:00' },
            ].map(({ label, key, placeholder }) => (
              <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '11px', color: '#8B7BA8' }}>{label}</span>
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
              <span style={{ fontSize: '11px', color: '#8B7BA8' }}>Status *</span>
              <select
                value={form.status}
                onChange={e => setForm(prev => ({ ...prev, status: e.target.value }))}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                <option value="DALAM PERJALANAN">DALAM PERJALANAN</option>
                <option value="DI PELABUHAN">DI PELABUHAN</option>
                <option value="TERLAMBAT">TERLAMBAT</option>
                <option value="PEMELIHARAAN">PEMELIHARAAN</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button
                onClick={() => setShowModal(false)}
                style={{ flex: 1, background: 'transparent', border: '1px solid rgba(168,85,247,0.3)', color: '#8B7BA8', padding: '10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
              >
                Batal
              </button>
              <button
                onClick={handleTambah}
                disabled={loadingTambah}
                style={{ flex: 1, background: '#A855F7', border: 'none', color: 'white', padding: '10px', borderRadius: '4px', cursor: loadingTambah ? 'not-allowed' : 'pointer', fontSize: '12px', fontWeight: 'bold', opacity: loadingTambah ? 0.7 : 1 }}
              >
                {loadingTambah ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
        {[
          { label: 'Total Kapal',      value: total,     color: '#A855F7' },
          { label: 'Dalam Perjalanan', value: berlayar,  color: '#22C55E' },
          { label: 'Di Pelabuhan',     value: pelabuhan, color: '#3B82F6' },
          { label: 'Terlambat',        value: terlambat, color: '#F59E0B' },
          { label: 'Pemeliharaan',     value: perawatan, color: '#EF4444' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: 'var(--bg-card, #130a24)', border: '1px solid rgba(168, 85, 247, 0.2)', borderRadius: '4px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted, #8B7BA8)' }}>{label}</span>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted, #8B7BA8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}>
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Cari kapal..."
            value={searchTerm}
            onChange={handleSearchChange}
            style={{ width: '100%', background: 'var(--bg-card, #130a24)', border: '1px solid rgba(168, 85, 247, 0.2)', borderRadius: '4px', padding: '10px 10px 10px 36px', color: 'white', fontSize: '12px', outline: 'none' }}
          />
        </div>
        {role === 'Admin' && (
          <button
            onClick={() => setShowModal(true)}
            style={{ background: '#A855F7', color: 'white', padding: '10px 16px', borderRadius: '4px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 'bold' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Tambah Armada
          </button>
        )}
      </div>

      {/* Fleet Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {paginatedShips.map((ship: any) => {
          const statusColor = ship.statusColor ||
            (ship.status?.includes('PERJALANAN') ? '#22C55E' :
             ship.status?.includes('PELABUHAN')  ? '#3B82F6' :
             ship.status?.includes('TERLAMBAT')  ? '#F59E0B' : '#EF4444');

          return (
            <div key={ship.id} style={{ background: 'var(--bg-card, #130a24)', border: '1px solid rgba(168, 85, 247, 0.2)', borderRadius: '4px', padding: '16px', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>

              {ship.status?.includes('PERJALANAN') && (
                <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '60%', height: '2px', background: statusColor, boxShadow: '0 0 20px 5px ' + statusColor }}></div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: '32px', height: '32px', background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                      <line x1="4" y1="22" x2="4" y2="15"></line>
                    </svg>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{ship.name}</span>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted, #8B7BA8)' }}>{ship.type}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ border: '1px solid ' + statusColor, borderRadius: '4px', padding: '4px 8px', fontSize: '9px', fontWeight: 'bold', color: statusColor }}>
                    {ship.status}
                  </div>
                  {role === 'Admin' && (
                    <button
                      aria-label="Hapus Kapal"
                      onClick={() => handleHapus(ship.id)}
                      disabled={loadingHapus === ship.id}
                      style={{ background: 'transparent', border: 'none', cursor: loadingHapus === ship.id ? 'not-allowed' : 'pointer', padding: '4px', opacity: loadingHapus === ship.id ? 0.5 : 1 }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', rowGap: '12px', fontSize: '11px', marginBottom: '24px' }}>
                <span style={{ color: 'var(--text-muted, #8B7BA8)' }}>Lokasi</span>
                <span style={{ textAlign: 'right' }}>{ship.location || '-'}</span>
                <span style={{ color: 'var(--text-muted, #8B7BA8)' }}>Tujuan</span>
                <span style={{ textAlign: 'right' }}>{ship.destination || '-'}</span>
                <span style={{ color: 'var(--text-muted, #8B7BA8)' }}>Perkiraan Tiba</span>
                <span style={{ textAlign: 'right' }}>{ship.eta || '-'}</span>
              </div>

              <div style={{ fontSize: '10px', color: 'var(--text-muted, #8B7BA8)' }}>
                Pembaruan terakhir: {ship.update || 'Baru saja'}
              </div>
            </div>
          );
        })}

        {/* Empty State */}
        {totalFilteredShips === 0 && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '64px 24px',
            background: 'var(--bg-card, #130a24)',
            border: '1px dashed rgba(168, 85, 247, 0.3)',
            borderRadius: '8px',
            textAlign: 'center',
            gap: '16px',
            gridColumn: '1 / -1'
          }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(168, 85, 247, 0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'white' }}>Armada Tidak Ditemukan</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted, #8B7BA8)' }}>Tidak ada kapal yang cocok dengan pencarian "{searchTerm}"</span>
            </div>
            <button
              onClick={() => { setSearchTerm(''); setCurrentPage(1); }}
              style={{
                background: 'rgba(168, 85, 247, 0.1)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                color: '#C084FC',
                padding: '8px 16px',
                borderRadius: '4px',
                fontSize: '11px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(168, 85, 247, 0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(168, 85, 247, 0.1)'}
            >
              Reset Pencarian
            </button>
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginTop: '12px',
          paddingTop: '16px',
          borderTop: '1px solid rgba(168, 85, 247, 0.15)'
        }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted, #8B7BA8)' }}>
            Menampilkan <span style={{ color: 'white', fontWeight: 'bold' }}>{startIndex + 1}</span> - <span style={{ color: 'white', fontWeight: 'bold' }}>{Math.min(startIndex + itemsPerPage, totalFilteredShips)}</span> dari <span style={{ color: 'white', fontWeight: 'bold' }}>{totalFilteredShips}</span> armada
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {/* Prev Button */}
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={{
                background: currentPage === 1 ? 'rgba(255,255,255,0.02)' : 'rgba(168, 85, 247, 0.1)',
                border: `1px solid ${currentPage === 1 ? 'rgba(255,255,255,0.05)' : 'rgba(168, 85, 247, 0.3)'}`,
                color: currentPage === 1 ? 'rgba(255,255,255,0.2)' : 'white',
                padding: '6px 12px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 'bold',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
              Sebelumnya
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                style={{
                  background: currentPage === page ? 'linear-gradient(90deg, #A855F7 0%, #7C3AED 100%)' : 'rgba(20, 10, 36, 0.6)',
                  border: `1px solid ${currentPage === page ? '#A855F7' : 'rgba(168, 85, 247, 0.2)'}`,
                  color: 'white',
                  width: '28px',
                  height: '28px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                  boxShadow: currentPage === page ? '0 0 10px rgba(168, 85, 247, 0.4)' : 'none'
                }}
              >
                {page}
              </button>
            ))}

            {/* Next Button */}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              style={{
                background: currentPage === totalPages ? 'rgba(255,255,255,0.02)' : 'rgba(168, 85, 247, 0.1)',
                border: `1px solid ${currentPage === totalPages ? 'rgba(255,255,255,0.05)' : 'rgba(168, 85, 247, 0.3)'}`,
                color: currentPage === totalPages ? 'rgba(255,255,255,0.2)' : 'white',
                padding: '6px 12px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 'bold',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              Selanjutnya
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
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