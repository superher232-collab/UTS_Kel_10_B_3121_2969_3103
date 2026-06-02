'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { SearchBar } from './SearchBar'
import { CargoTable } from './CargoTable'
import { CargoForm } from './CargoForm'
import { createShipment, updateShipment, deleteShipment, cancelShipment } from '@/lib/actions'
import { CargoShipment, VehicleOption } from '../../app/dashboard/cargo/page'

interface CargoDashboardClientProps {
  role: 'ADMIN' | 'OPERATOR' | 'CUSTOMER'
  initialShipments: CargoShipment[]
  ships: VehicleOption[]
  stats: {
    total: number
    darat: number
    udara: number
    laut: number
    selesai: number
  }
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export function CargoDashboardClient({ role, initialShipments, ships, stats, pagination }: CargoDashboardClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editItem, setEditItem] = useState<CargoShipment | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [loading, setLoading] = useState(false)

  const showToast = (message: string, type: 'success' | 'error' = 'success'): void => {
    setToast({ message, type })
    setTimeout(() => {
      setToast(null)
    }, 4000)
  }

  // Update URL Search Parameters
  const updateUrlParams = (newParams: Record<string, string | number>): void => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === 'all' || value === '') {
        params.delete(key)
      } else {
        params.set(key, String(value))
      }
    })
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleSearchFilters = (newFilters: { q: string; status: string; mode: string }): void => {
    updateUrlParams({
      q: newFilters.q,
      status: newFilters.status,
      mode: newFilters.mode,
      page: 1 // Reset to first page
    })
  }

  const handlePageChange = (newPage: number): void => {
    updateUrlParams({ page: newPage })
  }

  // Handler for creating/updating cargo
  const handleSaveCargo = async (payload: Partial<CargoShipment>): Promise<boolean> => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('senderName', payload.nama_pengirim || '')
      formData.append('receiverName', payload.nama_penerima || '')
      formData.append('receiverTelp', payload.no_telepon || '')
      formData.append('origin', payload.kota_asal || '')
      formData.append('destination', payload.kota_tujuan || '')
      formData.append('itemName', payload.jenis_barang || '')
      formData.append('weight', String(payload.berat_kg || '0'))
      formData.append('tariff', String(payload.harga_tarif || '0'))
      formData.append('shippingType', (payload.jenis_kendaraan || 'laut').toUpperCase())
      formData.append('shipmentDate', payload.tanggal_kirim || '')
      formData.append('vehicleId', payload.vehicleId || '')
      formData.append('notes', payload.deskripsi || '')
      formData.append('targetUserId', (payload as any).targetUserId || '')

      let result
      if (editItem) {
        formData.append('status', (payload.status_pengiriman || 'diproses').toUpperCase())
        result = await updateShipment(editItem.id, null, formData)
      } else {
        result = await createShipment(null, formData)
      }

      if (result.success) {
        showToast(result.message || 'Transaksi berhasil disimpan', 'success')
        setIsModalOpen(false)
        setEditItem(null)
        router.refresh()
        return true
      } else {
        showToast(result.message || 'Terjadi kesalahan validasi', 'error')
        if (result.errors) {
          // Flatten nested errors to a single message for toast
          const errorMsg = Object.entries(result.errors)
            .map(([field, msgs]) => `${field}: ${(msgs as string[]).join(', ')}`)
            .join(' | ')
          showToast(errorMsg, 'error')
        }
        return false
      }
    } catch (err: unknown) {
      console.error(err)
      // Raise DB failures to system level error boundary
      showToast('Koneksi database terputus. Silakan coba beberapa saat lagi.', 'error')
      return false
    } finally {
      setLoading(false)
    }
  }

  // Handler for deleting cargo
  const handleDeleteCargo = async (id: string): Promise<boolean> => {
    try {
      const result = await deleteShipment(id)
      if (result.success) {
        showToast(result.message || 'Cargo berhasil dihapus.', 'success')
        router.refresh()
        return true
      } else {
        showToast(result.message || 'Gagal menghapus kargo.', 'error')
        return false
      }
    } catch (e: unknown) {
      console.error(e)
      showToast('Terjadi kegagalan sistem saat menghapus cargo.', 'error')
      return false
    }
  }

  // Handler for canceling cargo (BR-03)
  const handleCancelCargo = async (id: string, reason: string): Promise<boolean> => {
    try {
      const result = await cancelShipment(id, reason)
      if (result.success) {
        showToast(result.message || 'Cargo berhasil dibatalkan.', 'success')
        router.refresh()
        return true
      } else {
        showToast(result.message || 'Gagal membatalkan kargo.', 'error')
        return false
      }
    } catch (e: unknown) {
      console.error(e)
      showToast('Terjadi kegagalan sistem saat membatalkan cargo.', 'error')
      return false
    }
  }

  // Summary counts based on database stats (Overall values)
  const totalCargo = stats.total
  const daratCargo = stats.darat
  const udaraCargo = stats.udara
  const lautCargo = stats.laut
  const selesaiCargo = stats.selesai

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', boxSizing: 'border-box' }}>
      
      {/* Toast notifications */}
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

      {/* Header Panel */}
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
            PUSAT KONTROL CARGO PRISMA
          </h1>
          <span style={{ fontSize: '9px', color: '#A855F7', fontWeight: 'bold', letterSpacing: '1px', fontFamily: 'monospace' }}>
            RUANG KENDALI DASHBOARD BERBASIS SERVER ACTIONS & PRISMA ORM
          </span>
        </div>

        {(role === 'ADMIN' || role === 'OPERATOR') && (
          <button
            onClick={() => {
              setEditItem(null)
              setIsModalOpen(true)
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
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            TAMBAH PENGIRIMAN CARGO
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        {[
          { label: 'TOTAL CARGO PRISMA', value: totalCargo, color: '#A855F7', border: 'rgba(168, 85, 247, 0.3)' },
          { label: 'MODA LAUT', value: lautCargo, color: '#F59E0B', border: 'rgba(245, 158, 11, 0.3)' },
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

      {/* Searchbar Component */}
      <SearchBar onSearch={handleSearchFilters} />

      {/* Table Component */}
      <CargoTable
        data={initialShipments}
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onEdit={(cargo) => {
          setEditItem(cargo)
          setIsModalOpen(true)
        }}
        onDelete={handleDeleteCargo}
        onCancel={handleCancelCargo}
        role={role}
      />

      {/* Form Component */}
      <CargoForm
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditItem(null)
        }}
        onSubmit={handleSaveCargo}
        editData={editItem}
        ships={ships}
        role={role}
      />

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
