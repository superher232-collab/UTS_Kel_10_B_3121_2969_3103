"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { SearchBar } from '@/components/cargo/SearchBar';
import { CargoTable } from '@/components/cargo/CargoTable';
import { CargoForm } from '@/components/cargo/CargoForm';

export default function AdminCargoPage() {
  // Authorization & Identity State
  const [role, setRole] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('Tamu');
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Database Data States
  const [shipments, setShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1
  });

  // Query & Filter States
  const [filters, setFilters] = useState({
    q: '',
    status: 'all',
    mode: 'all',
    page: 1
  });

  // Modal & Edit States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<any | null>(null);

  // Premium Toast Notification State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // ============================================================
  // ROLE-BASED ACCESS CONTROL (RBAC) CHECK
  // Auto-verifies if role === 'Admin' from local storage
  // ============================================================
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedRole = localStorage.getItem('role') || 'User';
      const savedUser = localStorage.getItem('username') || 'Tamu';
      setRole(savedRole);
      setUsername(savedUser);
      setIsAuthLoading(false);
    }
  }, []);

  // Show premium toast helper
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // ============================================================
  // GET API — Fetch paginated, searched & filtered shipments
  // ============================================================
  const fetchShipments = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        q: filters.q,
        status: filters.status,
        mode: filters.mode,
        page: String(filters.page),
        limit: '10'
      });

      const response = await fetch(`/api/cargo?${queryParams.toString()}`);
      const json = await response.json();

      if (response.ok && json.status === 'success') {
        setShipments(json.data);
        setPagination(json.pagination);
      } else {
        throw new Error(json.error || 'Gagal mengambil data cargo');
      }
    } catch (err: any) {
      console.error('[fetchShipments] Error:', err);
      showToast(err.message || 'Gagal tersambung ke database cargo', 'error');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    if (role === 'Admin') {
      fetchShipments();
    }
  }, [fetchShipments, role]);

  // Handle Search and Filter inputs from SearchBar
  const handleSearchFilters = (newFilters: { q: string; status: string; mode: string }) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1 // Reset back to first page when search changes
    }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  // ============================================================
  // POST & PUT API — Save (Create or Update) Cargo Shipment
  // ============================================================
  const handleSaveCargo = async (formData: any) => {
    try {
      let response;
      if (editItem) {
        // PUT — Update existing shipment
        response = await fetch(`/api/cargo/${editItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        // POST — Create new shipment
        response = await fetch('/api/cargo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }

      const json = await response.json();
      if (response.ok && json.status === 'success') {
        showToast(
          editItem 
            ? `Cargo Resi ${json.data.no_resi} berhasil direvisi` 
            : `Cargo baru berhasil didaftarkan dengan Resi ${json.data.no_resi}`,
          'success'
        );
        fetchShipments(); // Refresh list from database
        return true;
      } else {
        throw new Error(json.error || 'Gagal menyimpan cargo');
      }
    } catch (err: any) {
      console.error('[handleSaveCargo] Error:', err);
      showToast(err.message || 'Gagal memproses cargo', 'error');
      return false;
    }
  };

  // ============================================================
  // DELETE API — Delete Shipment
  // ============================================================
  const handleDeleteCargo = async (id: number) => {
    try {
      const response = await fetch(`/api/cargo/${id}`, {
        method: 'DELETE'
      });
      const json = await response.json();

      if (response.ok && json.status === 'success') {
        showToast(json.message || 'Cargo berhasil dihapus', 'success');
        
        // Adjust pagination offset if last item on current page was deleted
        if (shipments.length === 1 && filters.page > 1) {
          setFilters(prev => ({ ...prev, page: prev.page - 1 }));
        } else {
          fetchShipments(); // Refresh database
        }
        return true;
      } else {
        throw new Error(json.error || 'Gagal menghapus cargo');
      }
    } catch (err: any) {
      console.error('[handleDeleteCargo] Error:', err);
      showToast(err.message || 'Gagal menghapus cargo', 'error');
      return false;
    }
  };

  // Calculate statistics totals
  const totalCargo = pagination.total;
  const daratCargo = shipments.filter(s => s.jenis_kendaraan === 'darat').length; // Local visual estimate for layout
  const udaraCargo = shipments.filter(s => s.jenis_kendaraan === 'udara').length;
  const lautCargo = shipments.filter(s => s.jenis_kendaraan === 'laut').length;
  const selesaiCargo = shipments.filter(s => s.status_pengiriman === 'selesai').length;

  // Render authorization loading screen
  if (isAuthLoading) {
    return (
      <div style={{ color: 'white', fontFamily: 'monospace', padding: '48px', textAlign: 'center', background: '#07020E', minHeight: '80vh' }}>
        <span>Mengotentikasi hak akses komando...</span>
      </div>
    );
  }

  // ============================================================
  // UNAUTHORIZED ACCESS ERROR PAGE (Route Guard)
  // Shows high-contrast glowing warning card if role !== 'Admin'
  // ============================================================
  if (role !== 'Admin') {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        background: '#07020E',
        color: 'white',
        fontFamily: 'monospace',
        padding: '24px',
        boxSizing: 'border-box'
      }}>
        <div style={{
          background: '#0D0618',
          border: '1px solid #EF4444',
          borderRadius: '12px',
          padding: '40px',
          width: '90%',
          maxWidth: '520px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 20px rgba(239, 68, 68, 0.2)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div style={{ fontSize: '48px', animation: 'blink 1.5s infinite' }}>⚠️</div>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '2px', color: '#EF4444', margin: 0 }}>AKSES DITOLAK / UNAUTHORIZED</h2>
          <p style={{ color: '#C7B8EA', fontSize: '12px', lineHeight: '1.6', margin: 0 }}>
            Halaman administrasi kontrol cargo multi-modal memerlukan hak akses **Administrator**. Akun Anda saat ini memiliki peran **{role}** ({username}) dan tidak diizinkan masuk ke ruang kendali CRUDS.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '10px' }}>
            <button
              onClick={() => window.location.href = '/dashboard'}
              style={{
                background: 'linear-gradient(90deg, #A855F7 0%, #7C3AED 100%)',
                border: 'none',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: 'bold',
                boxShadow: '0 4px 15px rgba(168, 85, 247, 0.3)',
                fontFamily: 'monospace'
              }}
            >
              KEMBALI KE DASHBOARD
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // AUTHORIZED CONTROL DASHBOARD (Admin Panel)
  // ============================================================
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', boxSizing: 'border-box' }}>
      
      {/* Absolute Premium Floating Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '90px',
          right: '24px',
          background: toast.type === 'success' ? 'rgba(34, 197, 94, 0.95)' : 'rgba(239, 68, 68, 0.95)',
          border: `1px solid ${toast.type === 'success' ? '#22C55E' : '#EF4444'}`,
          borderRadius: '6px',
          padding: '14px 24px',
          color: 'white',
          fontSize: '11px',
          fontWeight: 'bold',
          fontFamily: 'monospace',
          zIndex: 1000,
          boxShadow: '0 10px 30px rgba(0,0,0,0.6), 0 0 15px rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          animation: 'slideIn 0.3s ease-out'
        }}>
          <span>{toast.type === 'success' ? '✅' : '❌'}</span>
          <span>{toast.message.toUpperCase()}</span>
        </div>
      )}

      {/* Header and Add Button Actions */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        borderBottom: '1px dashed rgba(168, 85, 247, 0.25)',
        paddingBottom: '16px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <h1 style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '2px', color: 'white', margin: 0, fontFamily: 'monospace' }}>
            PUSAT KONTROL CARGO MULTI-MODAL
          </h1>
          <span style={{ fontSize: '9px', color: '#A855F7', fontWeight: 'bold', letterSpacing: '1px', fontFamily: 'monospace' }}>
            ADMINISTRATOR: {username.toUpperCase()} ─ LOGBOOK PEMELIHARAAN CRUDS TERINTEGRASI DB
          </span>
        </div>

        <button
          onClick={() => {
            setEditItem(null);
            setIsModalOpen(true);
          }}
          style={{
            background: 'linear-gradient(90deg, #A855F7 0%, #7C3AED 100%)',
            border: 'none',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: 'bold',
            fontFamily: 'monospace',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 0 15px rgba(168, 85, 247, 0.4)',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 0 22px rgba(168, 85, 247, 0.7)'}
          onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 0 15px rgba(168, 85, 247, 0.4)'}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          TAMBAH PENGIRIMAN CARGO
        </button>
      </div>

      {/* Summary Panels Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        {[
          { label: 'TOTAL CARGO DB', value: totalCargo, color: '#A855F7', border: 'rgba(168, 85, 247, 0.3)' },
          { label: 'MODA DARAT (ACT)', value: daratCargo, color: '#22C55E', border: 'rgba(34, 197, 94, 0.3)' },
          { label: 'MODA UDARA (ACT)', value: udaraCargo, color: '#06B6D4', border: 'rgba(6, 182, 212, 0.3)' },
          { label: 'MODA LAUT (ACT)', value: lautCargo, color: '#F59E0B', border: 'rgba(245, 158, 11, 0.3)' },
          { label: 'PENGIRIMAN SELESAI', value: selesaiCargo, color: '#22C55E', border: 'rgba(34, 197, 94, 0.3)' }
        ].map(card => (
          <div key={card.label} style={{
            background: '#0D0618',
            border: `1px solid ${card.border}`,
            borderRadius: '8px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
          }}>
            <span style={{ fontSize: '8px', color: '#8B7BA8', fontWeight: 'bold', letterSpacing: '0.5px', fontFamily: 'monospace' }}>{card.label}</span>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: card.color, fontFamily: 'monospace' }}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Sleek Search & Filters Bar */}
      <SearchBar onSearch={handleSearchFilters} />

      {/* Real-time DB Table Grid */}
      <CargoTable
        data={shipments}
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onEdit={(cargo) => {
          setEditItem(cargo);
          setIsModalOpen(true);
        }}
        onDelete={handleDeleteCargo}
      />

      {/* Register/Update Cargo Modal Form */}
      <CargoForm
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditItem(null);
        }}
        onSubmit={handleSaveCargo}
        editData={editItem}
      />

      {/* Dynamic Keyframe animations injected via inline CSS */}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
