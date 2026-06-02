"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { confirmShipmentPayment } from '@/lib/actions';
import { CargoShipment } from '../../app/dashboard/cargo/page'

interface CargoTableProps {
  data: CargoShipment[];
  loading: boolean;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  onPageChange: (newPage: number) => void;
  onEdit: (cargo: CargoShipment) => void;
  onDelete: (id: string) => Promise<boolean>;
  onCancel: (id: string, reason: string) => Promise<boolean>;
  role: 'ADMIN' | 'OPERATOR';
}

export function CargoTable({ data, loading, pagination, onPageChange, onEdit, onDelete, onCancel, role }: CargoTableProps) {
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [canceling, setCanceling] = useState(false);
  const [cancelError, setCancelError] = useState('');
  const [confirmingPaymentId, setConfirmingPaymentId] = useState<string | null>(null);
  const [paymentModalShipment, setPaymentModalShipment] = useState<CargoShipment | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  const handleCancelExecute = async () => {
    if (!cancelId) return;
    if (cancelReason.trim().length < 10) {
      setCancelError('Alasan pembatalan minimal 10 karakter (BR-03)');
      return;
    }
    setCanceling(true);
    setCancelError('');
    const success = await onCancel(cancelId, cancelReason);
    setCanceling(false);
    if (success) {
      setCancelId(null);
      setCancelReason('');
    }
  };

  const handleExecutePayment = async () => {
    if (!paymentModalShipment) return
    setProcessingPayment(true)
    try {
      const result = await confirmShipmentPayment(paymentModalShipment.id)
      if (result.success) {
        setPaymentModalShipment(null)
      } else {
        alert(`Gagal: ${result.message}`)
      }
    } catch {
      alert('Terjadi kesalahan saat mengonfirmasi pembayaran.')
    } finally {
      setProcessingPayment(false)
    }
  }

  const handlePrintReceipt = (shipment: CargoShipment) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Mohon izinkan pop-up untuk mencetak resi.');
      return;
    }

    const qrUrl = shipment.metode_pembayaran === 'QRIS'
      ? `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=00020101021138580016ID.CO.QRIS.WWW0215ID10200874983050303035204531153033605802ID5912PRIMELOG%20LTD6007JAKARTA61051211062070703A0163045E1B`
      : '';

    const formattedTariff = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(shipment.harga_tarif);
    const dateFormatted = new Date(shipment.tanggal_kirim).toLocaleDateString('id-ID', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const htmlContent = `
      <html>
        <head>
          <title>Resi Pengiriman ${shipment.no_resi} - PrimeLog</title>
          <style>
            body {
              font-family: 'Courier New', Courier, monospace;
              color: #000;
              margin: 20px;
              font-size: 13px;
              line-height: 1.4;
            }
            .container {
              max-width: 400px;
              margin: 0 auto;
              border: 1px dashed #000;
              padding: 20px;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
              border-bottom: 2px double #000;
              padding-bottom: 10px;
            }
            .brand {
              font-size: 20px;
              font-weight: bold;
              letter-spacing: 2px;
            }
            .title {
              font-size: 11px;
              text-transform: uppercase;
              letter-spacing: 1px;
              color: #555;
            }
            .barcode {
              text-align: center;
              margin: 15px 0;
              font-size: 32px;
              letter-spacing: 4px;
              font-weight: 300;
            }
            .info-table {
              width: 100%;
              border-collapse: collapse;
              margin: 15px 0;
            }
            .info-table td {
              padding: 4px 0;
              vertical-align: top;
            }
            .info-table td.label {
              width: 35%;
              font-weight: bold;
            }
            .separator {
              border-top: 1px dashed #000;
              margin: 10px 0;
            }
            .total-box {
              background: #f0f0f0;
              padding: 10px;
              text-align: center;
              font-size: 16px;
              font-weight: bold;
              border: 1px solid #000;
              margin-top: 10px;
            }
            .qr-container {
              text-align: center;
              margin: 15px 0;
            }
            .qr-image {
              border: 1px solid #000;
              padding: 4px;
              background: #fff;
            }
            .footer {
              text-align: center;
              margin-top: 25px;
              font-size: 10px;
              border-top: 1px dashed #000;
              padding-top: 10px;
            }
            @media print {
              body { margin: 0; }
              .container { border: none; max-width: 100%; padding: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="brand">PRIMELOG</div>
              <div class="title">Maritime Logistics Command Center</div>
              <div style="font-size: 10px; margin-top: 4px;">Konektivitas Nusantara Laut & Pelabuhan</div>
            </div>

            <div class="barcode">
              ||||||| | ||| ||||
              <div style="font-size: 12px; font-weight: bold; letter-spacing: 1px; margin-top: 4px;">${shipment.no_resi}</div>
            </div>

            <div class="separator"></div>

            <table class="info-table">
              <tr>
                <td class="label">TANGGAL:</td>
                <td>${dateFormatted}</td>
              </tr>
              <tr>
                <td class="label">PENGIRIM:</td>
                <td>${shipment.nama_pengirim}</td>
              </tr>
              <tr>
                <td class="label">PENERIMA:</td>
                <td>${shipment.nama_penerima} (${shipment.no_telepon})</td>
              </tr>
              <tr>
                <td class="label">RUTE:</td>
                <td style="font-weight: bold;">${shipment.kota_asal} ➔ ${shipment.kota_tujuan}</td>
              </tr>
              <tr>
                <td class="label">BARANG:</td>
                <td>${shipment.jenis_barang}</td>
              </tr>
              <tr>
                <td class="label">BERAT:</td>
                <td>${shipment.berat_kg.toFixed(1)} kg</td>
              </tr>
              <tr>
                <td class="label">LAYANAN:</td>
                <td>LAUT - ${shipment.jenis_pengiriman?.toUpperCase() || 'STANDARD'}</td>
              </tr>
            </table>

            <div class="separator"></div>

            <table class="info-table">
              <tr>
                <td class="label">METODE BAYAR:</td>
                <td style="font-weight: bold;">${shipment.metode_pembayaran || 'TUNAI'}</td>
              </tr>
              <tr>
                <td class="label">STATUS TRANSAKSI:</td>
                <td style="font-weight: bold; color: ${shipment.status_transaksi === 'lunas' ? 'green' : 'black'};">
                  ${shipment.status_transaksi?.toUpperCase().replace('_', ' ') || 'BELUM LUNAS'}
                </td>
              </tr>
            </table>

            <div class="total-box">
              TOTAL: ${formattedTariff}
            </div>

            ${qrUrl ? `
              <div class="qr-container">
                <div style="font-size: 9px; font-weight: bold; margin-bottom: 6px;">SCAN UNTUK PEMBAYARAN QRIS:</div>
                <img src="${qrUrl}" class="qr-image" width="130" height="130" alt="QRIS Code" />
                <div style="font-size: 8px; color: #555; margin-top: 4px;">Merchant: PRIMELOG LOGISTICS LTD</div>
              </div>
            ` : ''}

            <div class="footer">
              <p>Terima kasih telah menggunakan jasa PrimeLog.</p>
              <p>Kargo Anda aman dalam jaringan satelit maritim kami.</p>
              <p style="font-size: 8px; color: #777;">Resi dicetak secara elektronik. Validitas data terintegrasi ke blockchain PrimeLog.</p>
            </div>
            
            <div style="text-align: center; margin-top: 15px;" class="no-print">
              <button onclick="window.print()" style="padding: 6px 16px; font-family: monospace; font-weight: bold; cursor: pointer; background: #000; color: #fff; border: none; border-radius: 4px;">PRINT / CETAK RESI</button>
            </div>
          </div>

          <script>
            // Auto trigger print window on load
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 500);
            }
          </script>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // Universal badge style helper matching Indonesia PrimeLog aesthetics
  const getBadgeStyle = (value: string): React.CSSProperties => {
    const base: React.CSSProperties = {
      padding: '3px 6px',
      borderRadius: '4px',
      fontSize: '8px',
      fontWeight: 'bold',
      fontFamily: 'monospace',
      letterSpacing: '0.5px',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '3px',
      borderWidth: '1px',
      borderStyle: 'solid'
    };

    const text = (value || '').toLowerCase();
    if (text === 'selesai' || text === 'aman' || text === 'lunas') {
      return {
        ...base,
        background: 'rgba(34, 197, 94, 0.08)',
        borderColor: '#22C55E',
        color: '#22C55E',
        boxShadow: '0 0 6px rgba(34, 197, 94, 0.15)'
      };
    } else if (text === 'dalam_pengiriman') {
      return {
        ...base,
        background: 'rgba(6, 182, 212, 0.08)',
        borderColor: '#06B6D4',
        color: '#06B6D4',
        boxShadow: '0 0 6px rgba(6, 182, 212, 0.15)'
      };
    } else if (text === 'diproses') {
      return {
        ...base,
        background: 'rgba(168, 85, 247, 0.08)',
        borderColor: '#A855F7',
        color: '#A855F7',
        boxShadow: '0 0 6px rgba(168, 85, 247, 0.15)'
      };
    } else if (text === 'pending' || text === 'rusak' || text === 'belum_bayar' || text === 'menunggu_pembatalan') {
      return {
        ...base,
        background: 'rgba(245, 158, 11, 0.08)',
        borderColor: '#F59E0B',
        color: '#F59E0B',
        boxShadow: '0 0 6px rgba(245, 158, 11, 0.15)'
      };
    } else {
      return {
        ...base,
        background: 'rgba(239, 68, 68, 0.08)',
        borderColor: '#EF4444',
        color: '#EF4444',
        boxShadow: '0 0 6px rgba(239, 68, 68, 0.15)'
      };
    }
  };

  const getModaIcon = (mode: string) => {
    const text = (mode || '').toLowerCase();
    if (text === 'darat') return '🚛 DARAT';
    if (text === 'udara') return '✈️ UDARA';
    if (text === 'laut') return '🚢 LAUT';
    return '📦 LAINNYA';
  };

  const getLayananLabel = (layanan: string) => {
    const text = (layanan || '').toLowerCase();
    if (text === 'biasa') return '🟢 BIASA';
    if (text === 'cepat') return '⚡ CEPAT';
    if (text === 'vvip') return '👑 VVIP';
    return layanan;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handleDeleteExecute = async () => {
    if (deleteConfirmId === null) return;
    setDeleting(true);
    const success = await onDelete(deleteConfirmId);
    setDeleting(false);
    if (success) {
      setDeleteConfirmId(null);
    }
  };

  // Render Table skeleton loaders while loading database
  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
        <div style={{
          width: '100%',
          height: '340px',
          background: '#0D0618',
          border: '1px solid rgba(168, 85, 247, 0.15)',
          borderRadius: '12px',
          padding: '24px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          animation: 'skeleton-pulse 1.5s infinite ease-in-out'
        }}>
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr 1fr 0.8fr', gap: '16px' }}>
              <div style={{ height: '12px', background: 'rgba(168, 85, 247, 0.25)', borderRadius: '2px' }} />
              <div style={{ height: '12px', background: 'rgba(168, 85, 247, 0.15)', borderRadius: '2px' }} />
              <div style={{ height: '12px', background: 'rgba(168, 85, 247, 0.15)', borderRadius: '2px' }} />
              <div style={{ height: '12px', background: 'rgba(168, 85, 247, 0.15)', borderRadius: '2px' }} />
              <div style={{ height: '12px', background: 'rgba(168, 85, 247, 0.15)', borderRadius: '2px' }} />
              <div style={{ height: '12px', background: 'rgba(168, 85, 247, 0.2)', borderRadius: '2px' }} />
              <div style={{ height: '12px', background: 'rgba(168, 85, 247, 0.25)', borderRadius: '2px' }} />
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

  const tableHeaderStyle: React.CSSProperties = {
    padding: '16px',
    textAlign: 'left',
    color: '#8B7BA8',
    fontSize: '10px',
    fontWeight: 'bold',
    letterSpacing: '1px',
    borderBottom: '1px solid rgba(168, 85, 247, 0.25)',
    fontFamily: 'monospace'
  };

  const tableCellStyle: React.CSSProperties = {
    padding: '14px 16px',
    fontSize: '11px',
    color: '#C7B8EA',
    borderBottom: '1px solid rgba(168, 85, 247, 0.1)',
    fontFamily: 'monospace'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', boxSizing: 'border-box' }}>
      
      {/* Scrollable Container */}
      <div style={{
        background: '#0D0618',
        border: '1px solid rgba(168, 85, 247, 0.2)',
        borderRadius: '12px',
        overflowX: 'auto',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.6)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '980px' }}>
          <thead>
            <tr style={{ background: 'rgba(168, 85, 247, 0.03)' }}>
              <th style={tableHeaderStyle}>NO RESI / KENDARAAN</th>
              <th style={tableHeaderStyle}>TANGGAL KIRIM</th>
              <th style={tableHeaderStyle}>PENGIRIM</th>
              <th style={tableHeaderStyle}>PENERIMA</th>
              <th style={tableHeaderStyle}>RUTE (ASAL ➔ TUJUAN)</th>
              <th style={tableHeaderStyle}>DETAIL BARANG / BIAYA</th>
              <th style={tableHeaderStyle}>STATUS</th>
              <th style={{ ...tableHeaderStyle, textAlign: 'center' }}>AKSI</th>
            </tr>
          </thead>
          <tbody>
            {data.map((shipment) => (
              <tr 
                key={shipment.id}
                style={{
                  transition: 'background 0.2s',
                }}
                className="ship-node"
              >
                {/* No Resi + Moda */}
                <td style={tableCellStyle}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <Link
                      href={`/dashboard/cargo/${shipment.id}`}
                      style={{ color: '#C084FC', fontWeight: 'bold', letterSpacing: '0.5px', textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#A855F7'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#C084FC'}
                    >
                      {shipment.no_resi}
                    </Link>
                    <span style={{ fontSize: '9px', color: '#A855F7' }}>{getModaIcon(shipment.jenis_kendaraan)} ─ {getLayananLabel(shipment.jenis_pengiriman)}</span>
                  </div>
                </td>

                {/* Tanggal */}
                <td style={tableCellStyle}>
                  {formatDate(shipment.tanggal_kirim)}
                </td>

                {/* Pengirim */}
                <td style={tableCellStyle}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ color: 'white', fontWeight: '500' }}>{shipment.nama_pengirim}</span>
                    {shipment.no_telepon && <span style={{ fontSize: '9px', color: '#8B7BA8' }}>📞 {shipment.no_telepon}</span>}
                  </div>
                </td>

                {/* Penerima */}
                <td style={tableCellStyle}>
                  <span style={{ color: 'white', fontWeight: '500' }}>{shipment.nama_penerima}</span>
                </td>

                {/* Rute */}
                <td style={tableCellStyle}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span>{shipment.kota_asal || '-'} ➔ {shipment.kota_tujuan || '-'}</span>
                    {shipment.deskripsi && <span style={{ fontSize: '9px', color: '#8B7BA8', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '160px' }}>📝 {shipment.deskripsi}</span>}
                  </div>
                </td>

                {/* Detail Barang & Tarif */}
                <td style={tableCellStyle}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ color: 'white' }}>{shipment.jenis_barang || 'Muatan Cargo'} ({shipment.berat_kg || 0} kg)</span>
                    <span style={{ fontSize: '10px', color: '#06B6D4', fontWeight: 'bold' }}>{formatCurrency(shipment.harga_tarif || 0)}</span>
                  </div>
                </td>

                {/* Status Stack — pengiriman + barang only */}
                <td style={tableCellStyle}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <span style={getBadgeStyle(shipment.status_pengiriman)}>
                      📋 {shipment.status_pengiriman?.toUpperCase().replace('_', ' ')}
                    </span>
                    <span style={getBadgeStyle(shipment.status_barang || 'aman')}>
                      📦 {shipment.status_barang?.toUpperCase()}
                    </span>
                  </div>
                </td>

                {/* Aksi */}
                <td style={{ ...tableCellStyle, textAlign: 'center' }}>
                  <div style={{ display: 'inline-flex', gap: '10px', alignItems: 'center' }}>
                    <Link
                      href={`/dashboard/cargo/${shipment.id}`}
                      style={{
                        background: 'rgba(6, 182, 212, 0.1)',
                        border: '1px solid rgba(6, 182, 212, 0.4)',
                        borderRadius: '4px',
                        padding: '6px 10px',
                        color: '#06B6D4',
                        cursor: 'pointer',
                        fontSize: '9px',
                        fontWeight: 'bold',
                        fontFamily: 'monospace',
                        textDecoration: 'none',
                        transition: 'all 0.2s',
                        display: 'inline-block'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#06B6D4';
                        e.currentTarget.style.color = 'white';
                        e.currentTarget.style.boxShadow = '0 0 10px rgba(6, 182, 212, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(6, 182, 212, 0.1)';
                        e.currentTarget.style.color = '#06B6D4';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      TRACK
                    </Link>
                    <button
                      onClick={() => handlePrintReceipt(shipment)}
                      style={{
                        background: 'rgba(34, 197, 94, 0.1)',
                        border: '1px solid rgba(34, 197, 94, 0.4)',
                        borderRadius: '4px',
                        padding: '6px 10px',
                        color: '#22C55E',
                        cursor: 'pointer',
                        fontSize: '9px',
                        fontWeight: 'bold',
                        fontFamily: 'monospace',
                        transition: 'all 0.2s',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#22C55E';
                        e.currentTarget.style.color = 'white';
                        e.currentTarget.style.boxShadow = '0 0 10px rgba(34, 197, 94, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(34, 197, 94, 0.1)';
                        e.currentTarget.style.color = '#22C55E';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      🖨️ CETAK
                    </button>
                    {role === 'ADMIN' ? (
                      <>
                        {/* Tombol ACC Batal */}
                        {shipment.status_pengiriman === 'menunggu_pembatalan' && (
                          <button
                            onClick={() => {
                              if (confirm('Apakah Anda yakin ingin menyetujui pembatalan kargo ini?')) {
                                onCancel(shipment.id, 'Disetujui oleh Administrator');
                              }
                            }}
                            style={{
                              background: 'rgba(245, 158, 11, 0.1)',
                              border: '1px solid rgba(245, 158, 11, 0.4)',
                              borderRadius: '4px',
                              padding: '6px 10px',
                              color: '#F59E0B',
                              cursor: 'pointer',
                              fontSize: '9px',
                              fontWeight: 'bold',
                              fontFamily: 'monospace',
                              transition: 'all 0.2s',
                              marginRight: '10px'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#F59E0B';
                              e.currentTarget.style.color = 'white';
                              e.currentTarget.style.boxShadow = '0 0 10px rgba(245, 158, 11, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'rgba(245, 158, 11, 0.1)';
                              e.currentTarget.style.color = '#F59E0B';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                          >
                            ACC BATAL
                          </button>
                        )}
                        {/* Tombol Edit */}
                        <button
                          onClick={() => onEdit(shipment)}
                          style={{
                            background: 'rgba(168, 85, 247, 0.1)',
                            border: '1px solid rgba(168, 85, 247, 0.4)',
                            borderRadius: '4px',
                            padding: '6px 10px',
                            color: '#C084FC',
                            cursor: 'pointer',
                            fontSize: '9px',
                            fontWeight: 'bold',
                            fontFamily: 'monospace',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#A855F7';
                            e.currentTarget.style.color = 'white';
                            e.currentTarget.style.boxShadow = '0 0 10px rgba(168, 85, 247, 0.4)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(168, 85, 247, 0.1)';
                            e.currentTarget.style.color = '#C084FC';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          EDIT
                        </button>
                        
                        {/* Tombol Hapus */}
                        <button
                          onClick={() => setDeleteConfirmId(shipment.id)}
                          style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.4)',
                            borderRadius: '4px',
                            padding: '6px 10px',
                            color: '#EF4444',
                            cursor: 'pointer',
                            fontSize: '9px',
                            fontWeight: 'bold',
                            fontFamily: 'monospace',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#EF4444';
                            e.currentTarget.style.color = 'white';
                            e.currentTarget.style.boxShadow = '0 0 10px rgba(239, 68, 68, 0.4)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                            e.currentTarget.style.color = '#EF4444';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          HAPUS
                        </button>
                      </>
                    ) : shipment.status_pengiriman === 'diproses' ? (
                      <>
                        {/* Tombol Bayar — buka modal QRIS/TUNAI */}
                        {shipment.status_transaksi === 'belum_bayar' && (
                          <button
                            onClick={() => setPaymentModalShipment(shipment)}
                            style={{
                              background: 'rgba(34, 197, 94, 0.1)',
                              border: '1px solid rgba(34, 197, 94, 0.4)',
                              borderRadius: '4px',
                              padding: '6px 10px',
                              color: '#22C55E',
                              cursor: 'pointer',
                              fontSize: '9px',
                              fontWeight: 'bold',
                              fontFamily: 'monospace',
                              transition: 'all 0.2s',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#22C55E';
                              e.currentTarget.style.color = 'white';
                              e.currentTarget.style.boxShadow = '0 0 10px rgba(34, 197, 94, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'rgba(34, 197, 94, 0.1)';
                              e.currentTarget.style.color = '#22C55E';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                          >
                            💳 BAYAR
                          </button>
                        )}
                        {shipment.status_transaksi === 'lunas' && (
                          <span style={{ fontSize: '9px', color: '#22C55E', fontFamily: 'monospace', fontWeight: 'bold', border: '1px solid rgba(34,197,94,0.3)', padding: '4px 8px', borderRadius: '4px', background: 'rgba(34,197,94,0.05)' }}>
                            ✅ LUNAS
                          </span>
                        )}
                        {/* Tombol Batal Operator (BR-03) */}
                        <button
                          onClick={() => {
                            setCancelId(shipment.id);
                            setCancelReason('');
                            setCancelError('');
                          }}
                          style={{
                            background: 'rgba(245, 158, 11, 0.1)',
                            border: '1px solid rgba(245, 158, 11, 0.4)',
                            borderRadius: '4px',
                            padding: '6px 10px',
                            color: '#F59E0B',
                            cursor: 'pointer',
                            fontSize: '9px',
                            fontWeight: 'bold',
                            fontFamily: 'monospace',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#F59E0B';
                            e.currentTarget.style.color = 'white';
                            e.currentTarget.style.boxShadow = '0 0 10px rgba(245, 158, 11, 0.4)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(245, 158, 11, 0.1)';
                            e.currentTarget.style.color = '#F59E0B';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          BATAL
                        </button>
                      </>
                    ) : (
                      <span style={{
                        fontSize: '9px',
                        color: '#8B7BA8',
                        fontFamily: 'monospace',
                        fontWeight: 'bold',
                        border: '1px dashed rgba(168, 85, 247, 0.2)',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        background: 'rgba(168, 85, 247, 0.02)',
                        letterSpacing: '0.5px'
                      }}>
                        🔒 LOCK (BR-02)
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {/* Empty state */}
            {data.length === 0 && (
              <tr>
                <td colSpan={8} style={{ padding: '64px 24px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '24px' }}>📦</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'white', fontFamily: 'monospace' }}>Data Pengiriman Cargo Kosong</span>
                      <span style={{ fontSize: '10px', color: '#8B7BA8', fontFamily: 'monospace' }}>Tidak ditemukan data cargo pengiriman di database yang sesuai.</span>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer Controls */}
      {pagination.totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          padding: '16px 24px',
          borderTop: '1px solid rgba(168, 85, 247, 0.15)',
          background: '#0D0618',
          border: '1px solid rgba(168, 85, 247, 0.15)',
          borderRadius: '8px'
        }}>
          {/* Counters */}
          <div style={{ fontSize: '11px', color: '#8B7BA8', fontFamily: 'monospace' }}>
            Menampilkan <span style={{ color: 'white', fontWeight: 'bold' }}>{((pagination.page - 1) * pagination.limit) + 1}</span> - <span style={{ color: 'white', fontWeight: 'bold' }}>{Math.min(pagination.page * pagination.limit, pagination.total)}</span> dari <span style={{ color: 'white', fontWeight: 'bold' }}>{pagination.total}</span> shipments
          </div>

          {/* Page Actions */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={() => onPageChange(Math.max(pagination.page - 1, 1))}
              disabled={pagination.page === 1}
              style={{
                background: pagination.page === 1 ? 'rgba(255,255,255,0.01)' : 'rgba(168, 85, 247, 0.1)',
                border: `1px solid ${pagination.page === 1 ? 'rgba(255,255,255,0.05)' : 'rgba(168, 85, 247, 0.35)'}`,
                color: pagination.page === 1 ? '#8B7BA8' : 'white',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '10px',
                fontWeight: 'bold',
                cursor: pagination.page === 1 ? 'not-allowed' : 'pointer',
                fontFamily: 'monospace'
              }}
            >
              Kembali
            </button>

            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                style={{
                  background: pagination.page === p ? 'linear-gradient(90deg, #A855F7 0%, #7C3AED 100%)' : 'transparent',
                  border: `1px solid ${pagination.page === p ? '#A855F7' : 'rgba(168, 85, 247, 0.25)'}`,
                  color: 'white',
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontFamily: 'monospace',
                  boxShadow: pagination.page === p ? '0 0 10px rgba(168, 85, 247, 0.4)' : 'none'
                }}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => onPageChange(Math.min(pagination.page + 1, pagination.totalPages))}
              disabled={pagination.page === pagination.totalPages}
              style={{
                background: pagination.page === pagination.totalPages ? 'rgba(255,255,255,0.01)' : 'rgba(168, 85, 247, 0.1)',
                border: `1px solid ${pagination.page === pagination.totalPages ? 'rgba(255,255,255,0.05)' : 'rgba(168, 85, 247, 0.35)'}`,
                color: pagination.page === pagination.totalPages ? '#8B7BA8' : 'white',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '10px',
                fontWeight: 'bold',
                cursor: pagination.page === pagination.totalPages ? 'not-allowed' : 'pointer',
                fontFamily: 'monospace'
              }}
            >
              Lanjut
            </button>
          </div>
        </div>
      )}

      {/* Sleek Custom Deletion Confirmation Dialog */}
      {deleteConfirmId !== null && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(7, 2, 14, 0.8)',
          zIndex: 300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(8px)'
        }}>
          <div style={{
            background: '#0D0618',
            border: '1px solid #EF4444',
            borderRadius: '12px',
            padding: '32px',
            width: '90%',
            maxWidth: '400px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 20px rgba(239, 68, 68, 0.15)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px' }}>⚠️</div>
            <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'white', letterSpacing: '1.5px', fontFamily: 'monospace' }}>KONFIRMASI PENGHAPUSAN</div>
            <p style={{ color: '#C7B8EA', fontSize: '11px', fontFamily: 'monospace', lineHeight: '1.5', margin: 0 }}>
              Apakah Anda yakin ingin menghapus data pengiriman cargo ini secara permanen dari database PrimeLog? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
              <button
                onClick={() => setDeleteConfirmId(null)}
                disabled={deleting}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: '1px solid rgba(168, 85, 247, 0.35)',
                  color: '#8B7BA8',
                  padding: '10px',
                  borderRadius: '6px',
                  cursor: deleting ? 'not-allowed' : 'pointer',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  fontFamily: 'monospace'
                }}
              >
                Batal
              </button>
              <button
                onClick={handleDeleteExecute}
                disabled={deleting}
                style={{
                  flex: 1,
                  background: '#EF4444',
                  border: 'none',
                  color: 'white',
                  padding: '10px',
                  borderRadius: '6px',
                  cursor: deleting ? 'not-allowed' : 'pointer',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  fontFamily: 'monospace',
                  boxShadow: '0 0 15px rgba(239, 68, 68, 0.3)'
                }}
              >
                {deleting ? 'MENGHAPUS...' : 'YA, HAPUS'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sleek Custom Cancellation Confirmation Dialog with Reason Input */}
      {cancelId !== null && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(7, 2, 14, 0.8)',
          zIndex: 300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(8px)'
        }}>
          <div style={{
            background: '#0D0618',
            border: '1px solid #F59E0B',
            borderRadius: '12px',
            padding: '32px',
            width: '90%',
            maxWidth: '440px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 20px rgba(245, 158, 11, 0.15)'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px' }}>⏳</div>
              <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'white', letterSpacing: '1.5px', fontFamily: 'monospace' }}>BATALKAN PENGIRIMAN CARGO</div>
            </div>
            
            <p style={{ color: '#C7B8EA', fontSize: '11px', fontFamily: 'monospace', lineHeight: '1.5', margin: 0, textAlign: 'center' }}>
              Berdasarkan aturan bisnis **BR-03**, Anda wajib memasukkan alasan pembatalan minimal 10 karakter.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
              <span style={{ fontSize: '9px', color: '#8B7BA8', fontWeight: 'bold', fontFamily: 'monospace' }}>ALASAN PEMBATALAN *</span>
              <textarea
                placeholder="Tulis alasan pembatalan cargo di sini (min. 10 karakter)..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={3}
                style={{
                  width: '100%',
                  background: '#07020E',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  borderRadius: '4px',
                  padding: '10px 12px',
                  color: 'white',
                  fontSize: '12px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'monospace',
                  resize: 'vertical'
                }}
              />
              {cancelError && (
                <span style={{ color: '#EF4444', fontSize: '9px', fontWeight: 'bold', fontFamily: 'monospace', marginTop: '2px' }}>
                  ❌ {cancelError}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
              <button
                onClick={() => setCancelId(null)}
                disabled={canceling}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: '1px solid rgba(245, 158, 11, 0.35)',
                  color: '#8B7BA8',
                  padding: '10px',
                  borderRadius: '6px',
                  cursor: canceling ? 'not-allowed' : 'pointer',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  fontFamily: 'monospace'
                }}
              >
                Batal
              </button>
              <button
                onClick={handleCancelExecute}
                disabled={canceling}
                style={{
                  flex: 1,
                  background: '#F59E0B',
                  border: 'none',
                  color: 'white',
                  padding: '10px',
                  borderRadius: '6px',
                  cursor: canceling ? 'not-allowed' : 'pointer',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  fontFamily: 'monospace',
                  boxShadow: '0 0 15px rgba(245, 158, 11, 0.3)'
                }}
              >
                {canceling ? 'MEMBATALKAN...' : 'YA, BATALKAN'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal — QRIS & TUNAI */}
      {paymentModalShipment && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(7, 2, 14, 0.88)',
          zIndex: 400,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(10px)',
          animation: 'fadeInModal 0.2s ease'
        }}>
          <div style={{
            background: '#0D0618',
            border: `1px solid ${paymentModalShipment.metode_pembayaran === 'QRIS' ? 'rgba(245, 158, 11, 0.5)' : 'rgba(34, 197, 94, 0.5)'}`,
            borderRadius: '16px',
            padding: '32px',
            width: '100%', maxWidth: '420px',
            display: 'flex', flexDirection: 'column', gap: '20px',
            boxShadow: paymentModalShipment.metode_pembayaran === 'QRIS'
              ? '0 0 60px rgba(245, 158, 11, 0.2), 0 20px 60px rgba(0,0,0,0.8)'
              : '0 0 60px rgba(34, 197, 94, 0.2), 0 20px 60px rgba(0,0,0,0.8)',
            animation: 'scaleInModal 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}>
            {/* Header */}
            <div style={{ textAlign: 'center', borderBottom: '1px dashed rgba(168,85,247,0.2)', paddingBottom: '16px' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>
                {paymentModalShipment.metode_pembayaran === 'QRIS' ? '📱' : '💵'}
              </div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'white', fontFamily: 'monospace', letterSpacing: '1px' }}>
                PEMBAYARAN {paymentModalShipment.metode_pembayaran === 'QRIS' ? 'QRIS' : 'TUNAI'}
              </div>
              <div style={{ fontSize: '10px', color: '#8B7BA8', fontFamily: 'monospace', marginTop: '4px' }}>
                {paymentModalShipment.no_resi} · {paymentModalShipment.nama_penerima}
              </div>
            </div>

            {/* Total */}
            <div style={{ textAlign: 'center', background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: '10px', padding: '16px' }}>
              <div style={{ fontSize: '9px', color: '#8B7BA8', fontFamily: 'monospace', letterSpacing: '1px', marginBottom: '6px' }}>TOTAL TAGIHAN</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#06B6D4', fontFamily: 'monospace' }}>
                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(paymentModalShipment.harga_tarif)}
              </div>
            </div>

            {/* QRIS mode — show QR */}
            {paymentModalShipment.metode_pembayaran === 'QRIS' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: 'white', padding: '12px', borderRadius: '10px', border: '2px solid rgba(245,158,11,0.4)', boxShadow: '0 0 20px rgba(245,158,11,0.15)' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=00020101021138580016ID.CO.QRIS.WWW0215ID10200874983050303035204531153033605802ID5912PRIMELOG%20LTD6007JAKARTA61051211062070703A0163045E1B`}
                    alt="QRIS Code"
                    width={180} height={180}
                    style={{ display: 'block' }}
                  />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '10px', color: '#C7B8EA', fontFamily: 'monospace' }}>Scan kode QR menggunakan aplikasi pembayaran</div>
                  <div style={{ fontSize: '9px', color: '#8B7BA8', fontFamily: 'monospace', marginTop: '2px' }}>Merchant: PRIMELOG LOGISTICS LTD · ID10200874983</div>
                </div>
                <div style={{ width: '100%', height: '1px', background: 'rgba(168,85,247,0.15)' }} />
                <div style={{ fontSize: '10px', color: '#F59E0B', fontFamily: 'monospace', textAlign: 'center', fontWeight: 'bold' }}>
                  ⚠️ Klik konfirmasi setelah pelanggan berhasil scan & bayar
                </div>
              </div>
            )}

            {/* TUNAI mode */}
            {paymentModalShipment.metode_pembayaran !== 'QRIS' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>🪙</div>
                  <div style={{ fontSize: '11px', color: '#C7B8EA', fontFamily: 'monospace', lineHeight: '1.6' }}>
                    Pastikan Anda telah menerima uang tunai<br/>
                    sebesar nominal di atas dari pelanggan.<br/>
                    <span style={{ color: '#22C55E', fontWeight: 'bold' }}>Kembalian dihitung oleh Operator.</span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setPaymentModalShipment(null)}
                disabled={processingPayment}
                style={{
                  flex: 1, background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.35)',
                  color: '#EF4444', padding: '12px',
                  borderRadius: '8px', cursor: 'pointer',
                  fontSize: '11px', fontWeight: 'bold', fontFamily: 'monospace'
                }}
              >
                ✕ BATAL
              </button>
              <button
                onClick={handleExecutePayment}
                disabled={processingPayment}
                style={{
                  flex: 2,
                  background: processingPayment
                    ? 'rgba(34,197,94,0.3)'
                    : 'linear-gradient(135deg, #15803d, #22C55E)',
                  border: 'none', color: 'white',
                  padding: '12px', borderRadius: '8px',
                  cursor: processingPayment ? 'not-allowed' : 'pointer',
                  fontSize: '11px', fontWeight: 'bold', fontFamily: 'monospace',
                  boxShadow: processingPayment ? 'none' : '0 0 20px rgba(34,197,94,0.35)',
                  transition: 'all 0.2s'
                }}
              >
                {processingPayment
                  ? '⏳ MEMPROSES...'
                  : paymentModalShipment.metode_pembayaran === 'QRIS'
                    ? '✅ KONFIRMASI SUDAH DIBAYAR'
                    : '✅ KONFIRMASI TERIMA TUNAI'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Hover style */}
      <style>{`
        .ship-node:hover {
          background: rgba(168, 85, 247, 0.05) !important;
          border-left: 2px solid #A855F7 !important;
        }
        @keyframes fadeInModal {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleInModal {
          from { transform: scale(0.88); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
