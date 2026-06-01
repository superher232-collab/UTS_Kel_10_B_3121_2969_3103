// src/components/support/ChatThreadClient.tsx
'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export interface SerializedMessage {
  id: string
  message: string
  senderId: string
  senderName: string
  senderRole: 'ADMIN' | 'CUSTOMER'
  createdAt: string
}

export interface TicketDetails {
  id: string
  ticketNo: string
  title: string
  description: string
  type: string
  severity: string
  status: string
  resolution: string | null
  compensation: number | null
  compensationType: string | null
  createdAt: string
  creatorName: string
  creatorEmail: string
  shipmentReceiptNo: string | null
}

interface ChatThreadClientProps {
  role: 'ADMIN' | 'CUSTOMER'
  userId: string
  ticket: TicketDetails
  initialMessages: SerializedMessage[]
}

// Simple HTML decoder for displaying sanitized messages in UI
function decodeHtml(html: string): string {
  if (!html) return ''
  const map: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#x27;': "'",
    '&#x2F;': '/'
  }
  return html.replace(/&amp;|&lt;|&gt;|&quot;|&#x27;|&#x2F;/g, (m) => map[m])
}

export function ChatThreadClient({ role, userId, ticket, initialMessages }: ChatThreadClientProps) {
  const router = useRouter()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [messages, setMessages] = useState<SerializedMessage[]>(initialMessages)
  const [ticketState, setTicketState] = useState<TicketDetails>(ticket)
  
  // Message input state
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState('')

  // Admin resolution action states
  const [resStatus, setResStatus] = useState(ticket.status)
  const [resolutionText, setResolutionText] = useState(ticket.resolution || '')
  const [compensation, setCompensation] = useState(ticket.compensation ? String(ticket.compensation) : '')
  const [compensationType, setCompensationType] = useState(ticket.compensationType || 'NONE')
  const [updating, setUpdating] = useState(false)
  const [updateMsg, setUpdateMsg] = useState('')

  // Auto-scroll chat window to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // POLLING HOOK (BR-05: Customer: 10s, Admin: 5s)
  useEffect(() => {
    const intervalTime = role === 'ADMIN' ? 5000 : 10000

    const fetchLatestData = async () => {
      try {
        const response = await fetch(`/api/support/tickets/${ticketState.id}`)
        if (response.ok) {
          const result = await response.json()
          if (result.data) {
            // Update messages thread
            const parsedMsgs: SerializedMessage[] = result.data.messages.map((m: any) => ({
              id: m.id,
              message: m.message,
              senderId: m.senderId,
              senderName: m.sender.name,
              senderRole: m.sender.role,
              createdAt: m.createdAt
            }))
            setMessages(parsedMsgs)

            // Update ticket properties
            const parsedTicket: TicketDetails = {
              id: result.data.id,
              ticketNo: result.data.ticketNo,
              title: result.data.title,
              description: result.data.description,
              type: result.data.type,
              severity: result.data.severity,
              status: result.data.status,
              resolution: result.data.resolution,
              compensation: result.data.compensation,
              compensationType: result.data.compensationType,
              createdAt: result.data.createdAt,
              creatorName: result.data.user.name,
              creatorEmail: result.data.user.email,
              shipmentReceiptNo: result.data.shipment ? result.data.shipment.receiptNo : null
            }
            setTicketState(parsedTicket)
          }
        }
      } catch (err) {
        console.error('Polling message thread retrieval failed:', err)
      }
    }

    const timer = setInterval(fetchLatestData, intervalTime)
    return () => clearInterval(timer)
  }, [role, ticketState.id])

  // Message Send action
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    setSendError('')
    if (newMessage.trim().length === 0) return
    if (newMessage.trim().length > 500) {
      setSendError('Pesan melampaui batas maksimal 500 karakter.')
      return
    }

    setSending(true)
    try {
      const response = await fetch(`/api/support/tickets/${ticketState.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newMessage })
      })

      const result = await response.json()

      if (response.ok) {
        const addedMsg: SerializedMessage = {
          id: result.data.id,
          message: result.data.message,
          senderId: result.data.senderId,
          senderName: result.data.sender.name,
          senderRole: result.data.sender.role,
          createdAt: result.data.createdAt
        }
        setMessages(prev => [...prev, addedMsg])
        setNewMessage('')
        router.refresh()
      } else {
        setSendError(result.error || 'Gagal mengirim pesan chat.')
      }
    } catch (err) {
      console.error(err)
      setSendError('Gagal mengirim pesan. Sinyal terputus.')
    } finally {
      setSending(false)
    }
  }

  // Update Support Ticket Resolution/Status (Admin / Customer self-close)
  const handleUpdateTicketProps = async (targetStatus?: string) => {
    setUpdateMsg('')
    setUpdating(true)

    const finalStatus = targetStatus || resStatus
    const payload = {
      status: finalStatus,
      resolution: role === 'ADMIN' ? resolutionText : undefined,
      compensation: role === 'ADMIN' ? (compensation ? Number(compensation) : null) : undefined,
      compensationType: role === 'ADMIN' ? compensationType : undefined
    }

    try {
      const response = await fetch(`/api/support/tickets/${ticketState.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const result = await response.json()

      if (response.ok) {
        setUpdateMsg('🟢 Perubahan tiket berhasil disimpan.')
        
        // Refresh ticket details
        const updatedProps = {
          ...ticketState,
          status: result.data.status,
          resolution: result.data.resolution,
          compensation: result.data.compensation,
          compensationType: result.data.compensationType
        }
        setTicketState(updatedProps)
        setResStatus(result.data.status)
        
        router.refresh()
        setTimeout(() => setUpdateMsg(''), 3000)
      } else {
        setUpdateMsg(`❌ ${result.error || 'Gagal menyimpan perubahan.'}`)
      }
    } catch (err) {
      console.error(err)
      setUpdateMsg('❌ Gagal menyimpan perubahan. Koneksi satelit bermasalah.')
    } finally {
      setUpdating(false)
    }
  }

  const formatDateTime = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' ' + d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
  }

  const isClosed = ticketState.status === 'CLOSED'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', boxSizing: 'border-box', color: 'white', fontFamily: 'monospace' }}>
      
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link href="/dashboard/support/tickets" style={{ color: '#A855F7', textDecoration: 'none', fontWeight: 'bold' }}>◀ TIKET LIST</Link>
            <h1 style={{ fontSize: '16px', fontWeight: 'bold', letterSpacing: '1px', margin: 0 }}>
              LIVE CHAT: {ticketState.ticketNo}
            </h1>
          </div>
          <span style={{ fontSize: '9px', color: '#A855F7', fontWeight: 'bold', letterSpacing: '1px' }}>
            INTERAKSI DUKUNGAN OPERATOR DENGAN POLLING TRANSMISI TELEMETRI ({role === 'ADMIN' ? '5s' : '10s'})
          </span>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{
            background: 'rgba(6, 182, 212, 0.08)',
            border: '1px solid #06B6D4',
            color: '#06B6D4',
            padding: '6px 12px',
            borderRadius: '4px',
            fontSize: '9px',
            fontWeight: 'bold',
          }}>
            📋 STATUS: {ticketState.status}
          </span>
          <span style={{
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid #F59E0B',
            color: '#F59E0B',
            padding: '6px 12px',
            borderRadius: '4px',
            fontSize: '9px',
            fontWeight: 'bold',
          }}>
            ⚠️ SEVERITY: {ticketState.severity}
          </span>
        </div>
      </div>

      {/* Main Grid: Info Card & Chat Window */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(300px, 1fr) minmax(320px, 2fr)',
        gap: '24px',
        alignItems: 'start'
      }}>
        
        {/* Left Side: Ticket Metadata & Operator panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Ticket Info Card */}
          <div style={{
            background: '#0D0618',
            border: '1px solid rgba(168, 85, 247, 0.25)',
            borderRadius: '8px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
          }}>
            <span style={{ fontSize: '10px', color: '#A855F7', fontWeight: 'bold', borderBottom: '1px solid rgba(168, 85, 247, 0.15)', paddingBottom: '6px' }}>
              🎟️ DETAIL PERMASALAHAN TIKET
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <span style={{ fontSize: '8px', color: '#8B7BA8', display: 'block' }}>JUDUL PERMASALAHAN</span>
                <span style={{ color: 'white', fontWeight: 'bold', fontSize: '12px' }}>{ticketState.title}</span>
              </div>
              <div>
                <span style={{ fontSize: '8px', color: '#8B7BA8', display: 'block' }}>DESKRIPSI TIKET</span>
                <p style={{ color: '#C7B8EA', fontSize: '10px', margin: '4px 0 0 0', lineHeight: '1.4' }}>{ticketState.description}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <span style={{ fontSize: '8px', color: '#8B7BA8', display: 'block' }}>TIPE LAYANAN</span>
                  <span style={{ color: 'white', fontSize: '10px' }}>{ticketState.type}</span>
                </div>
                <div>
                  <span style={{ fontSize: '8px', color: '#8B7BA8', display: 'block' }}>TANGGAL</span>
                  <span style={{ color: 'white', fontSize: '10px' }}>{ticketState.createdAt.slice(0, 10)}</span>
                </div>
              </div>
              <div>
                <span style={{ fontSize: '8px', color: '#8B7BA8', display: 'block' }}>PELAPOR</span>
                <span style={{ color: 'white', fontSize: '10px' }}>{ticketState.creatorName} ({ticketState.creatorEmail})</span>
              </div>
              {ticketState.shipmentReceiptNo && (
                <div>
                  <span style={{ fontSize: '8px', color: '#8B7BA8', display: 'block' }}>KARGO TERKAIT</span>
                  <span style={{ color: '#06B6D4', fontSize: '11px', fontWeight: 'bold' }}>📦 {ticketState.shipmentReceiptNo}</span>
                </div>
              )}
            </div>
          </div>

          {/* Resolutions details (if resolved/compensated) */}
          {(ticketState.resolution || ticketState.compensation) && (
            <div style={{
              background: '#0D0618',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              borderRadius: '8px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
            }}>
              <span style={{ fontSize: '10px', color: '#22C55E', fontWeight: 'bold', borderBottom: '1px solid rgba(34, 197, 94, 0.15)', paddingBottom: '6px' }}>
                🟢 RESOLUSI & KOMPENSASI RESMI
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '10px' }}>
                {ticketState.resolution && (
                  <div>
                    <span style={{ fontSize: '8px', color: '#8B7BA8', display: 'block' }}>SOLUSI TIKET</span>
                    <p style={{ color: 'white', margin: '4px 0 0 0', lineHeight: '1.4' }}>{ticketState.resolution}</p>
                  </div>
                )}
                {ticketState.compensation && (
                  <div>
                    <span style={{ fontSize: '8px', color: '#8B7BA8', display: 'block' }}>BIAYA GANTI RUGI (KOMPENSASI)</span>
                    <span style={{ color: '#22C55E', fontWeight: 'bold', fontSize: '12px' }}>
                      Rp {ticketState.compensation.toLocaleString('id-ID')} ({ticketState.compensationType})
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Customer Self-Close widget */}
          {role === 'CUSTOMER' && !isClosed && (
            <div style={{
              background: '#0D0618',
              border: '1px solid rgba(168, 85, 247, 0.2)',
              borderRadius: '8px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <span style={{ fontSize: '10px', color: '#C084FC', fontWeight: 'bold' }}>⚙️ KONTROL TIKET ANDA</span>
              <p style={{ fontSize: '9px', color: '#8B7BA8', lineHeight: '1.4', margin: 0 }}>
                Jika permasalahan Anda sudah diselesaikan oleh operator support, silakan tutup tiket ini secara manual.
              </p>
              <button
                onClick={() => handleUpdateTicketProps('CLOSED')}
                disabled={updating}
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  color: '#EF4444',
                  padding: '10px',
                  borderRadius: '6px',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  cursor: updating ? 'not-allowed' : 'pointer',
                  fontFamily: 'monospace'
                }}
              >
                {updating ? 'MENGUPDATE...' : '🛑 SELESAI & TUTUP TIKET'}
              </button>
              {updateMsg && <span style={{ fontSize: '9px', textAlign: 'center' }}>{updateMsg}</span>}
            </div>
          )}

          {/* Admin resolution widget (BR-02) */}
          {role === 'ADMIN' && (
            <div style={{
              background: '#0D0618',
              border: '1px solid rgba(168, 85, 247, 0.25)',
              borderRadius: '8px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
            }}>
              <span style={{ fontSize: '10px', color: '#A855F7', fontWeight: 'bold', borderBottom: '1px solid rgba(168, 85, 247, 0.15)', paddingBottom: '6px' }}>
                ⚙️ RUANG ADMIN RESOLUTION PANEL
              </span>

              {updateMsg && (
                <div style={{ fontSize: '10px', padding: '6px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px' }}>
                  {updateMsg}
                </div>
              )}

              {/* Status Select */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '8px', color: '#8B7BA8', fontWeight: 'bold' }}>UPDATE TIKET STATUS</label>
                <select
                  value={resStatus}
                  onChange={(e) => setResStatus(e.target.value)}
                  style={adminInputStyle}
                >
                  <option value="OPEN">OPEN</option>
                  <option value="IN_PROGRESS">IN PROGRESS</option>
                  <option value="RESOLVED">RESOLVED</option>
                  <option value="CLOSED">CLOSED</option>
                  <option value="ESCALATED">ESCALATED</option>
                </select>
              </div>

              {/* Resolution Text */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '8px', color: '#8B7BA8', fontWeight: 'bold' }}>SOLUSI TIKET (TEXT RESOLUTION)</label>
                <textarea
                  rows={3}
                  value={resolutionText}
                  onChange={(e) => setResolutionText(e.target.value)}
                  placeholder="Tuliskan keputusan solusi permasalahan..."
                  style={{ ...adminInputStyle, resize: 'none' }}
                />
              </div>

              {/* Compensation inputs */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '8px', color: '#8B7BA8', fontWeight: 'bold' }}>JUMLAH GANTI RUGI</label>
                  <input
                    type="number"
                    value={compensation}
                    onChange={(e) => setCompensation(e.target.value)}
                    placeholder="Nilai Rupiah"
                    style={adminInputStyle}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '8px', color: '#8B7BA8', fontWeight: 'bold' }}>TIPE GANTI RUGI</label>
                  <select
                    value={compensationType}
                    onChange={(e) => setCompensationType(e.target.value)}
                    style={adminInputStyle}
                  >
                    <option value="NONE">NONE</option>
                    <option value="REFUND">REFUND</option>
                    <option value="DISCOUNT">DISCOUNT</option>
                    <option value="RESHIP">RESEND / RESHIP</option>
                  </select>
                </div>
              </div>

              <button
                onClick={() => handleUpdateTicketProps()}
                disabled={updating}
                style={{
                  background: 'linear-gradient(90deg, #A855F7 0%, #7C3AED 100%)',
                  border: 'none',
                  borderRadius: '6px',
                  color: 'white',
                  padding: '10px',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  cursor: updating ? 'not-allowed' : 'pointer',
                  fontFamily: 'monospace',
                  boxShadow: '0 0 10px rgba(168, 85, 247, 0.2)'
                }}
              >
                {updating ? 'MENYIMPAN...' : '💾 SIMPAN TICKET RESOLUSI'}
              </button>
            </div>
          )}

        </div>

        {/* Right Side: Chat Message Thread & Text Sender */}
        <div style={{
          background: '#0D0618',
          border: '1px solid rgba(168, 85, 247, 0.2)',
          borderRadius: '12px',
          height: '560px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
          overflow: 'hidden'
        }}>
          {/* Thread Header info */}
          <div style={{
            padding: '14px 20px',
            borderBottom: '1px solid rgba(168, 85, 247, 0.15)',
            background: 'rgba(168, 85, 247, 0.02)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '11px', color: 'white', fontWeight: 'bold' }}>COMPLAINT MESSAGE THREAD</span>
              <span style={{ fontSize: '8px', color: '#8B7BA8' }}>
                POLLING SINYAL ONLINE ─ CHAT SECARA OTOMATIS AKAN MENYINKRONKAN PESAN
              </span>
            </div>
            <span style={{ fontSize: '9px', color: '#22C55E' }}>● LIVE POLLING ACTIVE</span>
          </div>

          {/* Messages Thread Container */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            background: '#07020E'
          }}>
            {messages.map(msg => {
              const isOwnMessage = msg.senderId === userId
              return (
                <div 
                  key={msg.id}
                  style={{
                    display: 'flex',
                    justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
                    width: '100%'
                  }}
                >
                  <div style={{
                    maxWidth: '80%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isOwnMessage ? 'flex-end' : 'flex-start',
                    gap: '4px'
                  }}>
                    {/* Sender Identity metadata */}
                    <div style={{ display: 'flex', gap: '6px', fontSize: '8px', color: '#8B7BA8', fontFamily: 'monospace' }}>
                      <span style={{ fontWeight: 'bold', color: msg.senderRole === 'ADMIN' ? '#EF4444' : '#06B6D4' }}>
                        {msg.senderName} ({msg.senderRole})
                      </span>
                      <span>•</span>
                      <span>{formatDateTime(msg.createdAt)}</span>
                    </div>

                    {/* Chat Bubble box */}
                    <div style={{
                      background: isOwnMessage 
                        ? 'linear-gradient(135deg, rgba(124, 58, 237, 0.25) 0%, rgba(168, 85, 247, 0.15) 100%)' 
                        : '#0D0618',
                      border: isOwnMessage 
                        ? '1px solid rgba(168, 85, 247, 0.4)' 
                        : '1px solid rgba(168, 85, 247, 0.15)',
                      borderRadius: isOwnMessage 
                        ? '12px 12px 2px 12px' 
                        : '12px 12px 12px 2px',
                      padding: '12px 16px',
                      color: 'white',
                      fontSize: '11px',
                      fontFamily: 'monospace',
                      whiteSpace: 'pre-wrap',
                      lineHeight: '1.4',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                    }}>
                      {decodeHtml(msg.message)}
                    </div>
                  </div>
                </div>
              )
            })}
            
            {messages.length === 0 && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#8B7BA8', fontSize: '10px' }}>
                <span>💬 Belum ada percakapan.</span>
                <span>Tuliskan pesan pertama Anda untuk memulai chat.</span>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Messages Sender panel */}
          {isClosed ? (
            <div style={{
              padding: '16px 20px',
              background: '#0D0618',
              borderTop: '1px solid rgba(168, 85, 247, 0.15)',
              textAlign: 'center',
              color: '#8B7BA8',
              fontSize: '10px',
              fontFamily: 'monospace',
              fontWeight: 'bold'
            }}>
              🔒 CHAT DIKUNCI: Tiket pengaduan ini telah dinyatakan CLOSED.
            </div>
          ) : (
            <form 
              onSubmit={handleSendMessage}
              style={{
                padding: '16px 20px',
                background: '#0D0618',
                borderTop: '1px solid rgba(168, 85, 247, 0.15)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              {sendError && (
                <div style={{ fontSize: '9px', color: '#EF4444' }}>
                  ⚠️ {sendError.toUpperCase()}
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input
                  type="text"
                  required
                  placeholder="Ketik pesan keluhan Anda di sini (Maks. 500 karakter)..."
                  value={newMessage}
                  onChange={(e) => {
                    if (e.target.value.length <= 500) {
                      setNewMessage(e.target.value)
                    }
                  }}
                  style={{
                    flex: 1,
                    background: '#07020E',
                    border: '1px solid rgba(168, 85, 247, 0.25)',
                    borderRadius: '6px',
                    padding: '12px 16px',
                    fontSize: '11px',
                    color: 'white',
                    fontFamily: 'monospace',
                    boxSizing: 'border-box'
                  }}
                />

                <button
                  type="submit"
                  disabled={sending || newMessage.trim().length === 0}
                  style={{
                    background: sending || newMessage.trim().length === 0
                      ? 'rgba(168, 85, 247, 0.1)'
                      : 'linear-gradient(90deg, #A855F7 0%, #7C3AED 100%)',
                    border: 'none',
                    color: sending || newMessage.trim().length === 0 ? '#8B7BA8' : 'white',
                    borderRadius: '6px',
                    padding: '12px 24px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    fontFamily: 'monospace',
                    cursor: sending || newMessage.trim().length === 0 ? 'not-allowed' : 'pointer',
                    boxShadow: '0 0 10px rgba(168, 85, 247, 0.2)',
                    transition: 'all 0.2s'
                  }}
                >
                  {sending ? 'KIRIM...' : 'KIRIM 📤'}
                </button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '8px', color: '#8B7BA8' }}>
                <span>{newMessage.length} / 500 KARAKTER</span>
              </div>
            </form>
          )}

        </div>

      </div>

    </div>
  )
}

const adminInputStyle: React.CSSProperties = {
  background: '#07020E',
  border: '1px solid rgba(168, 85, 247, 0.25)',
  borderRadius: '6px',
  padding: '8px 12px',
  color: 'white',
  fontSize: '11px',
  fontFamily: 'monospace',
  boxSizing: 'border-box',
  width: '100%'
}
