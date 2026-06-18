// src/components/admin/FleetManagerClient.tsx
'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export interface SerializedVehicle {
  id: string
  name: string
  type: string
  plateNo: string
  capacity: number
  status: string
  shipmentsCount: number
  shipmentsWeight: number
}

export interface SerializedPendingShipment {
  id: string
  receiptNo: string
  itemName: string
  weight: number
  destination: string
  origin: string
}

interface FleetManagerClientProps {
  initialVehicles: SerializedVehicle[]
  pendingShipments: SerializedPendingShipment[]
}

export function FleetManagerClient({ initialVehicles, pendingShipments }: FleetManagerClientProps) {
  const router = useRouter()

  const [vehicles, setVehicles] = useState<SerializedVehicle[]>(initialVehicles)
  
  // Selection states for bulk assign
  const [selectedShipmentIds, setSelectedShipmentIds] = useState<string[]>([])
  const [selectedVehicleId, setSelectedVehicleId] = useState('')
  const [eta, setEta] = useState('')

  // Vehicle CRUD Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [name, setName] = useState('')
  const [type, setType] = useState('STANDAR')
  const [plateNo, setPlateNo] = useState('')
  const [capacity, setCapacity] = useState('')
  const [vehicleStatus, setVehicleStatus] = useState('TERSEDIA')

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // Toast / update states
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  // Calculate cumulative checked cargo weights
  const selectedShipments = pendingShipments.filter(s => selectedShipmentIds.includes(s.id))
  const totalWeight = selectedShipments.reduce((sum, s) => sum + s.weight, 0)

  // Find target vehicle to validate capacity
  const targetVehicle = vehicles.find(v => v.id === selectedVehicleId)
  const isOverCapacity = targetVehicle ? totalWeight > targetVehicle.capacity : false

  const handleToggleShipment = (id: string) => {
    setSelectedShipmentIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const handleSelectAllShipments = () => {
    if (selectedShipmentIds.length === pendingShipments.length) {
      setSelectedShipmentIds([])
    } else {
      setSelectedShipmentIds(pendingShipments.map(s => s.id))
    }
  }

  // Submit Bulk Assignment
  const handleBulkAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedShipmentIds.length === 0 || !selectedVehicleId || !eta) {
      showToast('Mohon pilih kargo, armada, dan isi tanggal ETA.', 'error')
      return
    }
    if (isOverCapacity) {
      showToast('Kargo melebihi kapasitas maksimal armada!', 'error')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/admin/shipments/bulk-assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shipmentIds: selectedShipmentIds,
          vehicleId: selectedVehicleId,
          eta
        })
      })

      const result = await res.json()

      if (res.ok) {
        showToast(result.message || 'Alokasi armada bulk sukses dilakukan.', 'success')
        setSelectedShipmentIds([])
        setSelectedVehicleId('')
        setEta('')
        router.refresh()
        setTimeout(() => window.location.reload(), 1500)
      } else {
        showToast(result.error || 'Gagal melakukan bulk assign.', 'error')
      }
    } catch (err) {
      console.error(err)
      showToast('Koneksi satelit terputus.', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Create Vehicle
  const handleCreateVehicle = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    if (!name || !plateNo || !capacity) {
      setErrorMsg('Semua field wajib diisi.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          type,
          plateNo,
          capacity: Number(capacity),
          status: vehicleStatus
        })
      })

      const result = await res.json()

      if (res.ok) {
        setSuccessMsg(result.message || 'Armada berhasil ditambahkan.')
        setName('')
        setPlateNo('')
        setCapacity('')
        setVehicleStatus('TERSEDIA')
        setType('STANDAR')

        router.refresh()
        setTimeout(() => {
          setIsModalOpen(false)
          setSuccessMsg('')
          window.location.reload()
        }, 1500)
      } else {
        setErrorMsg(result.error || 'Gagal menambahkan armada.')
      }
    } catch (err) {
      console.error(err)
      setErrorMsg('Koneksi terputus. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  // Update Vehicle status
  const handleUpdateVehicleStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/vehicles/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      const result = await res.json()

      if (res.ok) {
        showToast('Status armada berhasil diperbarui.', 'success')
        
        // Update local state
        setVehicles(prev => 
          prev.map(v => v.id === id ? { ...v, status: newStatus } : v)
        )
        router.refresh()
      } else {
        showToast(result.error || 'Gagal memperbarui status armada.', 'error')
      }
    } catch (err) {
      console.error(err)
      showToast('Koneksi terputus.', 'error')
    }
  }

  // Delete Vehicle
  const handleDeleteVehicle = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus armada ini dari pusat command?')) return

    try {
      const res = await fetch(`/api/vehicles/${id}`, {
        method: 'DELETE'
      })

      const result = await res.json()

      if (res.ok) {
        showToast('Armada berhasil dihapus.', 'success')
        setVehicles(prev => prev.filter(v => v.id !== id))
        router.refresh()
      } else {
        showToast(result.error || 'Gagal menghapus armada.', 'error')
      }
    } catch (err) {
      console.error(err)
      showToast('Koneksi terputus.', 'error')
    }
  }

  const getStatusStyle = (status: string) => {
    const text = status.toUpperCase()
    if (text === 'TERSEDIA') return { color: '#22C55E', text: '🟢 TERSEDIA' }
    if (text === 'DIPAKAI') return { color: '#06B6D4', text: '🔵 DIPAKAI bertugas' }
    return { color: '#F59E0B', text: '🛠️ PERBAIKAN' }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', boxSizing: 'border-box', color: 'white', fontFamily: 'monospace' }}>
      
      {/* Toast */}
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
          zIndex: 1000,
          boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span>{toast.type === 'success' ? '✅' : '❌'}</span>
          <span>{toast.message.toUpperCase()}</span>
        </div>
      )}

      {/* Header */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link href="/admin" style={{ color: '#A855F7', textDecoration: 'none', fontWeight: 'bold' }}>◀ ADMIN CENTER</Link>
            <h1 style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '2px', margin: 0 }}>
              KONTROL FLEET & BULK ASSIGNMENT
            </h1>
          </div>
          <span style={{ fontSize: '9px', color: '#A855F7', fontWeight: 'bold', letterSpacing: '1px' }}>
            PENGENDALIAN TOTAL OPERASIONAL ARMADA & ALOKASI PENGIRIMAN MASAL
          </span>
        </div>


      </div>

      {/* Main Grid: CRUD List & Bulk Assign Panel */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(320px, 1.2fr) minmax(320px, 1fr)',
        gap: '24px',
        alignItems: 'start'
      }}>
        
        {/* Left Column: Fleet List */}
        <div style={{
          background: '#0D0618',
          border: '1px solid rgba(168, 85, 247, 0.2)',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.6)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{ borderBottom: '1px solid rgba(168, 85, 247, 0.15)', paddingBottom: '10px' }}>
            <h2 style={{ fontSize: '13px', color: 'white', fontWeight: 'bold', letterSpacing: '1px', margin: 0 }}>
              📋 MANAGEMENT DAFTAR ARMADA PRIMELOG
            </h2>
            <span style={{ fontSize: '8px', color: '#8B7BA8', fontWeight: 'bold' }}>DATABASES FLEET REGISTERED</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', maxHeight: '580px' }}>
            {vehicles.map(v => {
              const statusInfo = getStatusStyle(v.status)
              return (
                <div key={v.id} style={{
                  padding: '16px',
                  background: 'rgba(168, 85, 247, 0.02)',
                  border: '1px solid rgba(168, 85, 247, 0.1)',
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ color: 'white', fontWeight: 'bold', fontSize: '12px' }}>{v.name}</span>
                      <span style={{ fontSize: '9px', color: '#8B7BA8' }}>📋 {v.plateNo} • Tipe: {v.type}</span>
                    </div>
                    <span style={{ fontSize: '9px', fontWeight: 'bold', color: statusInfo.color }}>
                      {statusInfo.text}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '8px', fontSize: '10px' }}>
                    <div>
                      <span style={{ color: '#8B7BA8' }}>Kapasitas Maks:</span>
                      <span style={{ color: 'white', display: 'block', fontWeight: 'bold' }}>{v.capacity.toFixed(0)} kg</span>
                    </div>
                    <div>
                      <span style={{ color: '#8B7BA8' }}>Muatan Terisi:</span>
                      <span style={{ color: v.shipmentsWeight > v.capacity ? '#EF4444' : '#06B6D4', display: 'block', fontWeight: 'bold' }}>
                        {v.shipmentsWeight.toFixed(0)} kg ({v.shipmentsCount} kargo)
                      </span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed rgba(168, 85, 247, 0.15)', paddingTop: '10px', marginTop: '4px' }}>
                    
                    {/* Status updater dropdown */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '8px', color: '#8B7BA8', fontWeight: 'bold' }}>SET STATUS:</span>
                      <select
                        value={v.status}
                        onChange={(e) => handleUpdateVehicleStatus(v.id, e.target.value)}
                        style={{
                          background: '#07020E',
                          border: '1px solid rgba(168, 85, 247, 0.25)',
                          borderRadius: '4px',
                          padding: '4px 8px',
                          fontSize: '9px',
                          color: 'white',
                          fontFamily: 'monospace',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="TERSEDIA">TERSEDIA</option>
                        <option value="DIPAKAI">DIPAKAI</option>
                        <option value="PERBAIKAN">PERBAIKAN</option>
                      </select>
                    </div>

                    <button
                      onClick={() => handleDeleteVehicle(v.id)}
                      disabled={v.status === 'DIPAKAI'}
                      style={{
                        background: 'transparent',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '4px',
                        padding: '4px 10px',
                        color: '#EF4444',
                        cursor: v.status === 'DIPAKAI' ? 'not-allowed' : 'pointer',
                        fontSize: '9px',
                        fontWeight: 'bold',
                        opacity: v.status === 'DIPAKAI' ? 0.3 : 1
                      }}
                    >
                      HAPUS 🗑️
                    </button>
                  </div>
                </div>
              )
            })}

            {vehicles.length === 0 && (
              <span style={{ fontSize: '10px', color: '#8B7BA8', textAlign: 'center', padding: '24px' }}>
                Belum ada armada terdaftar. Daftarkan armada baru.
              </span>
            )}
          </div>
        </div>

        {/* Right Column: Bulk Assign Command Center */}
        <div style={{
          background: '#0D0618',
          border: '1px solid rgba(168, 85, 247, 0.2)',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.6)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{ borderBottom: '1px solid rgba(168, 85, 247, 0.15)', paddingBottom: '10px' }}>
            <h2 style={{ fontSize: '13px', color: 'white', fontWeight: 'bold', letterSpacing: '1px', margin: 0 }}>
              🚢 ALOKASI ARMADA MASSAL (BULK ASSIGN)
            </h2>
            <span style={{ fontSize: '8px', color: '#8B7BA8', fontWeight: 'bold' }}>CHOOSE CARGOS & ASSIGN VEHICLE</span>
          </div>

          <form onSubmit={handleBulkAssignSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Step 1: Select Cargo Shipments */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '9px', color: '#8B7BA8', fontWeight: 'bold' }}>
                  LANGKAH 1: PILIH KARGO ANTRIAN ({pendingShipments.length} Tersedia)
                </label>
                <button
                  type="button"
                  onClick={handleSelectAllShipments}
                  style={{
                    background: 'transparent',
                    border: '1px dashed rgba(168, 85, 247, 0.3)',
                    color: '#C084FC',
                    fontSize: '8px',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  {selectedShipmentIds.length === pendingShipments.length ? 'DESELECT ALL' : 'SELECT ALL'}
                </button>
              </div>

              {/* Shipments List */}
              <div style={{
                maxHeight: '180px',
                overflowY: 'auto',
                border: '1px solid rgba(168, 85, 247, 0.25)',
                borderRadius: '6px',
                background: '#07020E',
                display: 'flex',
                flexDirection: 'column',
                boxSizing: 'border-box'
              }}>
                {pendingShipments.map(s => {
                  const isChecked = selectedShipmentIds.includes(s.id)
                  return (
                    <div
                      key={s.id}
                      onClick={() => handleToggleShipment(s.id)}
                      style={{
                        padding: '10px 14px',
                        borderBottom: '1px solid rgba(168, 85, 247, 0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        cursor: 'pointer',
                        background: isChecked ? 'rgba(168, 85, 247, 0.04)' : 'transparent',
                        transition: 'background 0.2s'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        readOnly
                        style={{ cursor: 'pointer' }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between', flex: 1, fontSize: '10px' }}>
                        <div>
                          <span style={{ color: 'white', fontWeight: 'bold' }}>{s.receiptNo}</span>
                          <span style={{ color: '#8B7BA8', display: 'block', fontSize: '8px' }}>{s.itemName} • {s.origin} ➔ {s.destination}</span>
                        </div>
                        <span style={{ color: '#06B6D4', fontWeight: 'bold' }}>{s.weight.toFixed(1)} kg</span>
                      </div>
                    </div>
                  )
                })}

                {pendingShipments.length === 0 && (
                  <span style={{ fontSize: '9px', color: '#8B7BA8', textAlign: 'center', padding: '24px' }}>
                    Tidak ada kargo antrean (DIPROSES/PENDING) tersedia saat ini.
                  </span>
                )}
              </div>
            </div>

            {/* Step 2: Select Vehicle & ETA */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px' }}>
              
              {/* Vehicle Select */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '9px', color: '#8B7BA8', fontWeight: 'bold' }}>LANGKAH 2: PILIH ARMADA</label>
                <select
                  required
                  value={selectedVehicleId}
                  onChange={(e) => setSelectedVehicleId(e.target.value)}
                  style={inputStyle}
                >
                  <option value="">-- PILIH ARMADA TERSEDIA --</option>
                  {vehicles.filter(v => v.status === 'TERSEDIA').map(v => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.capacity} kg max)
                    </option>
                  ))}
                </select>
              </div>

              {/* ETA Input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '9px', color: '#8B7BA8', fontWeight: 'bold' }}>LANGKAH 3: TARGET ETA TIBA</label>
                <input
                  type="datetime-local"
                  required
                  value={eta}
                  onChange={(e) => setEta(e.target.value)}
                  style={inputStyle}
                />
              </div>

            </div>

            {/* Run-time Weight Calculator */}
            {selectedShipmentIds.length > 0 && (
              <div style={{
                padding: '14px',
                borderRadius: '6px',
                background: isOverCapacity ? 'rgba(239, 68, 68, 0.08)' : 'rgba(34, 197, 94, 0.08)',
                border: `1px solid ${isOverCapacity ? '#EF4444' : '#22C55E'}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                fontSize: '10px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#8B7BA8' }}>Total Berat Checked:</span>
                  <span style={{ fontWeight: 'bold', color: isOverCapacity ? '#EF4444' : 'white' }}>
                    {totalWeight.toFixed(1)} kg
                  </span>
                </div>
                {targetVehicle && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#8B7BA8' }}>Kapasitas Maks ({targetVehicle.name}):</span>
                      <span style={{ fontWeight: 'bold', color: 'white' }}>
                        {targetVehicle.capacity.toFixed(0)} kg
                      </span>
                    </div>
                    {isOverCapacity && (
                      <div style={{ color: '#EF4444', fontSize: '9px', fontWeight: 'bold', marginTop: '4px', borderTop: '1px dashed rgba(239, 68, 68, 0.2)', paddingTop: '6px' }}>
                        ⚠️ ALARM KAPASITAS: Muatan kargo melampaui batas maksimal berat armada. Kurangi pilihan kargo atau pilih armada lain.
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Confirm button */}
            <button
              type="submit"
              disabled={loading || selectedShipmentIds.length === 0 || !selectedVehicleId || !eta || isOverCapacity}
              style={{
                background: loading || selectedShipmentIds.length === 0 || !selectedVehicleId || !eta || isOverCapacity
                  ? 'rgba(168, 85, 247, 0.1)'
                  : 'linear-gradient(90deg, #A855F7 0%, #7C3AED 100%)',
                border: 'none',
                borderRadius: '6px',
                color: loading || selectedShipmentIds.length === 0 || !selectedVehicleId || !eta || isOverCapacity ? '#8B7BA8' : 'white',
                padding: '12px 24px',
                fontSize: '11px',
                fontWeight: 'bold',
                fontFamily: 'monospace',
                cursor: loading || selectedShipmentIds.length === 0 || !selectedVehicleId || !eta || isOverCapacity ? 'not-allowed' : 'pointer',
                boxShadow: loading || selectedShipmentIds.length === 0 || !selectedVehicleId || !eta || isOverCapacity ? 'none' : '0 0 15px rgba(168, 85, 247, 0.3)',
                transition: 'all 0.2s',
                textAlign: 'center'
              }}
            >
              {loading ? 'MENGEKSEKUSI ALOKASI BULK...' : '🚀 BIND & SELESAIKAN ALOKASI MASAL'}
            </button>
          </form>
        </div>

      </div>

      {/* Register Vehicle Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(7, 2, 14, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: '#0D0618',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '480px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid rgba(168, 85, 247, 0.2)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'rgba(168, 85, 247, 0.02)'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'white', letterSpacing: '1px' }}>
                  REGISTRASI ARMADA BARU
                </span>
                <span style={{ fontSize: '8px', color: '#8B7BA8' }}>
                  TAMBAHKAN UNIT ARMADA PENGANGKUT BARU KE DATABASE PRIMELOG
                </span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#8B7BA8', fontSize: '18px', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateVehicle} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {errorMsg && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #EF4444', color: '#EF4444', padding: '10px 14px', borderRadius: '6px', fontSize: '10px' }}>
                  ❌ {errorMsg.toUpperCase()}
                </div>
              )}
              {successMsg && (
                <div style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid #22C55E', color: '#22C55E', padding: '10px 14px', borderRadius: '6px', fontSize: '10px' }}>
                  ✅ {successMsg.toUpperCase()}
                </div>
              )}

              {/* Name */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '9px', color: '#8B7BA8', fontWeight: 'bold' }}>NAMA ARMADA PENGANGKUT</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: KM NUSANTARA CARRIER"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={inputStyle}
                />
              </div>

              {/* Plate / Register No */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '9px', color: '#8B7BA8', fontWeight: 'bold' }}>NOMOR REGISTER / PLAT PELAT</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: REG-ID-909012"
                  value={plateNo}
                  onChange={(e) => setPlateNo(e.target.value)}
                  style={inputStyle}
                />
              </div>

              {/* Dropdowns row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {/* Type */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '9px', color: '#8B7BA8', fontWeight: 'bold' }}>TIPE TRANSPORTASI</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    style={inputStyle}
                  >
                    <option value="STANDAR">🚢 STANDAR (REGULER)</option>
                    <option value="CEPAT">⚡ CEPAT (EXPRESS)</option>
                    <option value="VVIP">👑 VVIP (PREMIUM)</option>
                  </select>
                </div>

                {/* Initial Status */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '9px', color: '#8B7BA8', fontWeight: 'bold' }}>STATUS OPERASIONAL</label>
                  <select
                    value={vehicleStatus}
                    onChange={(e) => setVehicleStatus(e.target.value)}
                    style={inputStyle}
                  >
                    <option value="TERSEDIA">🟢 TERSEDIA (AVAILABLE)</option>
                    <option value="DIPAKAI">🔵 DIPAKAI bertugas</option>
                    <option value="PERBAIKAN">🛠️ PERBAIKAN (MAINTENANCE)</option>
                  </select>
                </div>
              </div>

              {/* Capacity */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '9px', color: '#8B7BA8', fontWeight: 'bold' }}>KAPASITAS MAKSIMAL BERAT (KG)</label>
                <input
                  type="number"
                  required
                  placeholder="Contoh: 15000"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  style={inputStyle}
                />
              </div>

              {/* Buttons */}
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
                marginTop: '12px',
                borderTop: '1px solid rgba(168, 85, 247, 0.15)',
                paddingTop: '16px'
              }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(168, 85, 247, 0.25)',
                    borderRadius: '6px',
                    padding: '10px 20px',
                    color: '#8B7BA8',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontWeight: 'bold',
                  }}
                >
                  BATAL
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: 'linear-gradient(90deg, #A855F7 0%, #7C3AED 100%)',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '10px 24px',
                    color: 'white',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    boxShadow: '0 0 15px rgba(168, 85, 247, 0.3)'
                  }}
                >
                  {loading ? 'MENYIMPAN...' : 'DAFTARKAN ARMADA'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

const inputStyle: React.CSSProperties = {
  background: '#07020E',
  border: '1px solid rgba(168, 85, 247, 0.25)',
  borderRadius: '6px',
  padding: '10px 14px',
  color: 'white',
  fontSize: '11px',
  fontFamily: 'monospace',
  boxSizing: 'border-box',
  width: '100%'
}
