// src/components/support/TicketsClient.tsx
'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export interface SerializedTicket {
  id: string
  ticketNo: string
  title: string
  description: string
  type: string
  severity: string
  status: string
  createdAt: string
  resolvedAt: string | null
  creatorName: string
  creatorEmail: string
  shipmentReceiptNo: string | null
}

export interface SerializedShipment {
  id: string
  receiptNo: string
  itemName: string
}

interface TicketsClientProps {
  role: 'ADMIN' | 'OPERATOR'
  userId: string
  initialTickets: SerializedTicket[]
  shipments: SerializedShipment[]
}

export function TicketsClient({ role, userId, initialTickets, shipments }: TicketsClientProps) {
  const router = useRouter()

  const [tickets, setTickets] = useState<SerializedTicket[]>(initialTickets)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  // Form states
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [ticketType, setTicketType] = useState('COMPLAINT')
  const [severity, setSeverity] = useState('MEDIUM')
  const [shipmentId, setShipmentId] = useState('')
  
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')
    
    if (title.trim().length < 3) {
      setErrorMsg('Judul tiket minimal 3 karakter.')
      return
    }
    if (description.trim().length < 10) {
      setErrorMsg('Deskripsi permasalahan minimal 10 karakter.')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          type: ticketType,
          severity,
          shipmentId: shipmentId || null
        })
      })

      const result = await response.json()

      if (response.ok) {
        setSuccessMsg(result.message || 'Tiket sukses didaftarkan.')
        setTitle('')
        setDescription('')
        setShipmentId('')
        setTicketType('COMPLAINT')
        setSeverity('MEDIUM')
        
        // Refresh local data & router state
        router.refresh()
        setTimeout(() => {
          setIsModalOpen(false)
          setSuccessMsg('')
          window.location.reload() // Reload to pull updated server side ticket log
        }, 1500)
      } else {
        setErrorMsg(result.error || 'Gagal mendaftarkan tiket bantuan.')
      }
    } catch (err: unknown) {
      console.error(err)
      setErrorMsg('Koneksi terputus. Silakan coba beberapa saat lagi.')
    } finally {
      setLoading(false)
    }
  }

  // Filter logic
  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.ticketNo.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.creatorName.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Counters
  const countOpen = tickets.filter(t => t.status === 'OPEN').length
  const countInProgress = tickets.filter(t => t.status === 'IN_PROGRESS').length
  const countResolved = tickets.filter(t => t.status === 'RESOLVED').length
  const countClosed = tickets.filter(t => t.status === 'CLOSED').length

  const getSeverityBadgeStyle = (sev: string): React.CSSProperties => {
    const base: React.CSSProperties = {
      padding: '3px 6px',
      borderRadius: '4px',
      fontSize: '8px',
      fontWeight: 'bold',
      fontFamily: 'monospace',
      borderWidth: '1px',
      borderStyle: 'solid',
      display: 'inline-block'
    }

    const text = sev.toUpperCase()
    if (text === 'CRITICAL') {
      return {
        ...base,
        background: 'rgba(239, 68, 68, 0.12)',
        borderColor: '#EF4444',
        color: '#EF4444'
      }
    } else if (text === 'HIGH') {
      return {
        ...base,
        background: 'rgba(245, 158, 11, 0.12)',
        borderColor: '#F59E0B',
        color: '#F59E0B'
      }
    } else if (text === 'MEDIUM') {
      return {
        ...base,
        background: 'rgba(6, 182, 212, 0.12)',
        borderColor: '#06B6D4',
        color: '#06B6D4'
      }
    } else {
      return {
        ...base,
        background: 'rgba(34, 197, 94, 0.12)',
        borderColor: '#22C55E',
        color: '#22C55E'
      }
    }
  }

  const getStatusBadgeStyle = (status: string): React.CSSProperties => {
    const base: React.CSSProperties = {
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '9px',
      fontWeight: 'bold',
      fontFamily: 'monospace',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      border: '1px solid'
    }

    const text = status.toUpperCase()
    if (text === 'RESOLVED' || text === 'CLOSED') {
      return {
        ...base,
        background: 'rgba(34, 197, 94, 0.08)',
        borderColor: '#22C55E',
        color: '#22C55E'
      }
    } else if (text === 'IN_PROGRESS') {
      return {
        ...base,
        background: 'rgba(6, 182, 212, 0.08)',
        borderColor: '#06B6D4',
        color: '#06B6D4'
      }
    } else if (text === 'OPEN') {
      return {
        ...base,
        background: 'rgba(168, 85, 247, 0.08)',
        borderColor: '#A855F7',
        color: '#A855F7'
      }
    } else {
      return {
        ...base,
        background: 'rgba(245, 158, 11, 0.08)',
        borderColor: '#F59E0B',
        color: '#F59E0B'
      }
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', boxSizing: 'border-box', color: 'white', fontFamily: 'monospace' }}>
      
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link href="/dashboard/support" style={{ color: '#A855F7', textDecoration: 'none', fontWeight: 'bold' }}>◀ SUPPORT</Link>
            <h1 style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '2px', margin: 0 }}>
              TIKET COMPLAINT & SUPPORT TICKET
            </h1>
          </div>
          <span style={{ fontSize: '9px', color: '#A855F7', fontWeight: 'bold', letterSpacing: '1px' }}>
            MANAJEMEN RUANG BANTUAN OPERASIONAL SELESAI
          </span>
        </div>

        {role === 'OPERATOR' && (
          <button
            onClick={() => setIsModalOpen(true)}
            style={{
              background: 'linear-gradient(90deg, #A855F7 0%, #7C3AED 100%)',
              border: 'none',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 0 15px rgba(168, 85, 247, 0.4)'
            }}
          >
            ➕ BUAT TIKET PERMASALAHAN BARU
          </button>
        )}
      </div>

      {/* Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
        {[
          { label: 'TIKET OPEN', value: countOpen, color: '#A855F7', border: 'rgba(168, 85, 247, 0.3)' },
          { label: 'TIKET PROSES', value: countInProgress, color: '#06B6D4', border: 'rgba(6, 182, 212, 0.3)' },
          { label: 'TIKET RESOLVED', value: countResolved, color: '#22C55E', border: 'rgba(34, 197, 94, 0.3)' },
          { label: 'TIKET CLOSED', value: countClosed, color: '#8B7BA8', border: 'rgba(139, 123, 168, 0.3)' }
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
            <span style={{ fontSize: '8px', color: '#8B7BA8', fontWeight: 'bold', letterSpacing: '0.5px' }}>{card.label}</span>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: card.color }}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div style={{
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap',
        background: '#0D0618',
        border: '1px solid rgba(168, 85, 247, 0.15)',
        borderRadius: '8px',
        padding: '16px',
        alignItems: 'center'
      }}>
        {/* Search input */}
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <input
            type="text"
            placeholder="Cari Tiket (No. Tiket / Judul / Nama)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              background: '#07020E',
              border: '1px solid rgba(168, 85, 247, 0.25)',
              borderRadius: '6px',
              padding: '10px 14px',
              fontSize: '11px',
              color: 'white',
              fontFamily: 'monospace',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Filter status */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '9px', color: '#8B7BA8', fontWeight: 'bold' }}>FILTER STATUS:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              background: '#07020E',
              border: '1px solid rgba(168, 85, 247, 0.25)',
              borderRadius: '6px',
              padding: '10px 16px',
              fontSize: '11px',
              color: 'white',
              fontFamily: 'monospace',
              cursor: 'pointer'
            }}
          >
            <option value="ALL">SEMUA STATUS</option>
            <option value="OPEN">🟢 OPEN</option>
            <option value="IN_PROGRESS">🔵 IN PROGRESS</option>
            <option value="RESOLVED">🟢 RESOLVED</option>
            <option value="CLOSED">🟣 CLOSED</option>
            <option value="ESCALATED">🟠 ESCALATED</option>
          </select>
        </div>
      </div>

      {/* Tickets List Table */}
      <div style={{
        background: '#0D0618',
        border: '1px solid rgba(168, 85, 247, 0.2)',
        borderRadius: '12px',
        overflowX: 'auto',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.6)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
          <thead>
            <tr style={{ background: 'rgba(168, 85, 247, 0.03)', borderBottom: '1px solid rgba(168, 85, 247, 0.25)' }}>
              <th style={tableHeaderStyle}>NO TIKET / TIPE</th>
              <th style={tableHeaderStyle}>JUDUL PERMASALAHAN</th>
              <th style={tableHeaderStyle}>PELAPOR</th>
              <th style={tableHeaderStyle}>KARGO TERKAIT</th>
              <th style={tableHeaderStyle}>TANGGAL DIAJUKAN</th>
              <th style={tableHeaderStyle}>SEVERITY</th>
              <th style={tableHeaderStyle}>STATUS</th>
              <th style={{ ...tableHeaderStyle, textAlign: 'center' }}>LIVE CHAT</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map(ticket => (
              <tr key={ticket.id} style={{ borderBottom: '1px solid rgba(168, 85, 247, 0.1)' }}>
                {/* No Tiket */}
                <td style={tableCellStyle}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ color: 'white', fontWeight: 'bold' }}>{ticket.ticketNo}</span>
                    <span style={{ fontSize: '8px', color: '#A855F7', fontWeight: 'bold' }}>🏷️ {ticket.type}</span>
                  </div>
                </td>

                {/* Judul */}
                <td style={{ ...tableCellStyle, maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ color: 'white' }}>{ticket.title}</span>
                    <span style={{ fontSize: '9px', color: '#8B7BA8' }}>{ticket.description}</span>
                  </div>
                </td>

                {/* Pelapor */}
                <td style={tableCellStyle}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span>{ticket.creatorName}</span>
                    <span style={{ fontSize: '8px', color: '#8B7BA8' }}>{ticket.creatorEmail}</span>
                  </div>
                </td>

                {/* Kargo */}
                <td style={tableCellStyle}>
                  {ticket.shipmentReceiptNo ? (
                    <span style={{ color: '#06B6D4' }}>📦 {ticket.shipmentReceiptNo}</span>
                  ) : (
                    <span style={{ color: '#8B7BA8' }}>-</span>
                  )}
                </td>

                {/* Tanggal */}
                <td style={tableCellStyle}>
                  {new Date(ticket.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>

                {/* Severity */}
                <td style={tableCellStyle}>
                  <span style={getSeverityBadgeStyle(ticket.severity)}>
                    ⚠️ {ticket.severity}
                  </span>
                </td>

                {/* Status */}
                <td style={tableCellStyle}>
                  <span style={getStatusBadgeStyle(ticket.status)}>
                    {ticket.status}
                  </span>
                </td>

                {/* Live Chat Action */}
                <td style={{ ...tableCellStyle, textAlign: 'center' }}>
                  <Link
                    href={`/dashboard/support/tickets/${ticket.id}`}
                    style={{
                      background: 'rgba(6, 182, 212, 0.1)',
                      border: '1px solid rgba(6, 182, 212, 0.4)',
                      borderRadius: '4px',
                      padding: '6px 14px',
                      color: '#06B6D4',
                      cursor: 'pointer',
                      fontSize: '9px',
                      fontWeight: 'bold',
                      textDecoration: 'none',
                      display: 'inline-block',
                      transition: 'all 0.2s'
                    }}
                  >
                    CHAT 💬
                  </Link>
                </td>
              </tr>
            ))}

            {/* Empty state */}
            {filteredTickets.length === 0 && (
              <tr>
                <td colSpan={8} style={{ padding: '48px 16px', textAlign: 'center', color: '#8B7BA8', fontSize: '11px' }}>
                  Tidak ditemukan tiket bantuan yang sesuai.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Creation Modal */}
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
            maxWidth: '560px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 25px rgba(168, 85, 247, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
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
                  BUAT TIKET PERMASALAHAN BARU
                </span>
                <span style={{ fontSize: '8px', color: '#8B7BA8' }}>
                  TULIS PERMASALAHAN ANDA SECARA LENGKAP PADA ADMIN KAMI
                </span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#8B7BA8', fontSize: '18px', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleCreateTicket} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
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

              {/* Title */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '9px', color: '#8B7BA8', fontWeight: 'bold' }}>JUDUL TIKET / SUBJEK</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kargo Rusak Saat Diterima"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={modalInputStyle}
                />
              </div>

              {/* Description */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '9px', color: '#8B7BA8', fontWeight: 'bold' }}>DESKRIPSI LENGKAP KELUHAN (MIN. 10 KARAKTER)</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tuliskan rincian barang, keluhan, dan kronologi kejadian secara detail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ ...modalInputStyle, resize: 'none' }}
                />
              </div>

              {/* Dropdowns row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {/* Type */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '9px', color: '#8B7BA8', fontWeight: 'bold' }}>TIPE LAYANAN</label>
                  <select
                    value={ticketType}
                    onChange={(e) => setTicketType(e.target.value)}
                    style={modalInputStyle}
                  >
                    <option value="COMPLAINT">COMPLAINT (KELUHAN)</option>
                    <option value="INQUIRY">INQUIRY (PERTANYAAN)</option>
                    <option value="FEEDBACK">FEEDBACK (MASUKAN)</option>
                  </select>
                </div>

                {/* Severity */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '9px', color: '#8B7BA8', fontWeight: 'bold' }}>SEVERITY LEVEL</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    style={modalInputStyle}
                  >
                    <option value="LOW">🟢 LOW (RENDAH)</option>
                    <option value="MEDIUM">🔵 MEDIUM (SEDANG)</option>
                    <option value="HIGH">🟡 HIGH (TINGGI)</option>
                    <option value="CRITICAL">🔴 CRITICAL (GAWAT)</option>
                  </select>
                </div>
              </div>

              {/* Shipment ID dropdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '9px', color: '#8B7BA8', fontWeight: 'bold' }}>KARGO TERKAIT (OPSIONAL)</label>
                <select
                  value={shipmentId}
                  onChange={(e) => setShipmentId(e.target.value)}
                  style={modalInputStyle}
                >
                  <option value="">-- PILIH CARGO (TIDAK ADA) --</option>
                  {shipments.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.receiptNo} ({s.itemName})
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
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
                  {loading ? 'MENYIMPAN...' : 'AJUKAN TIKET'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

const tableHeaderStyle: React.CSSProperties = {
  padding: '14px 16px',
  color: '#8B7BA8',
  fontSize: '10px',
  fontWeight: 'bold',
  textAlign: 'left',
  letterSpacing: '0.5px'
}

const tableCellStyle: React.CSSProperties = {
  padding: '12px 16px',
  color: '#C7B8EA',
  fontSize: '11px',
  verticalAlign: 'middle'
}

const modalInputStyle: React.CSSProperties = {
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
