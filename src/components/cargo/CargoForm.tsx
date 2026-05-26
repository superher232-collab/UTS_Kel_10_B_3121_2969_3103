"use client";
import React, { useState, useEffect } from 'react';

interface CargoFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<boolean>;
  editData?: any | null;
}

export function CargoForm({ isOpen, onClose, onSubmit, editData }: CargoFormProps) {
  const [form, setForm] = useState({
    tanggal_kirim: '',
    nama_pengirim: '',
    nama_penerima: '',
    no_telepon: '',
    kota_asal: '',
    kota_tujuan: '',
    jenis_barang: '',
    berat_kg: '',
    harga_tarif: '',
    jenis_kendaraan: 'darat',
    jenis_pengiriman: 'biasa',
    status_pengiriman: 'diproses',
    status_barang: 'aman',
    status_transaksi: 'belum_bayar',
    deskripsi: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sync editData values if editing
  useEffect(() => {
    if (editData) {
      // Format date correctly to YYYY-MM-DD for date input
      let dateStr = '';
      if (editData.tanggal_kirim) {
        const d = new Date(editData.tanggal_kirim);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        dateStr = `${yyyy}-${mm}-${dd}`;
      }

      setForm({
        tanggal_kirim: dateStr,
        nama_pengirim: editData.nama_pengirim || '',
        nama_penerima: editData.nama_penerima || '',
        no_telepon: editData.no_telepon || '',
        kota_asal: editData.kota_asal || '',
        kota_tujuan: editData.kota_tujuan || '',
        jenis_barang: editData.jenis_barang || '',
        berat_kg: editData.berat_kg ? String(editData.berat_kg) : '',
        harga_tarif: editData.harga_tarif ? String(editData.harga_tarif) : '',
        jenis_kendaraan: editData.jenis_kendaraan || 'darat',
        jenis_pengiriman: editData.jenis_pengiriman || 'biasa',
        status_pengiriman: editData.status_pengiriman || 'diproses',
        status_barang: editData.status_barang || 'aman',
        status_transaksi: editData.status_transaksi || 'belum_bayar',
        deskripsi: editData.deskripsi || ''
      });
      setErrors({});
    } else {
      // Reset form if creating
      setForm({
        tanggal_kirim: new Date().toISOString().split('T')[0], // Default to today's date
        nama_pengirim: '',
        nama_penerima: '',
        no_telepon: '',
        kota_asal: '',
        kota_tujuan: '',
        jenis_barang: '',
        berat_kg: '',
        harga_tarif: '',
        jenis_kendaraan: 'darat',
        jenis_pengiriman: 'biasa',
        status_pengiriman: 'diproses',
        status_barang: 'aman',
        status_transaksi: 'belum_bayar',
        deskripsi: ''
      });
      setErrors({});
    }
  }, [editData, isOpen]);

  if (!isOpen) return null;

  // Validate form entries
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.tanggal_kirim) newErrors.tanggal_kirim = 'Tanggal kirim wajib diisi';
    if (!form.nama_pengirim.trim()) newErrors.nama_pengirim = 'Nama pengirim wajib diisi';
    if (!form.nama_penerima.trim()) newErrors.nama_penerima = 'Nama penerima wajib diisi';
    
    if (form.berat_kg && isNaN(Number(form.berat_kg))) {
      newErrors.berat_kg = 'Berat harus berupa angka numeric';
    } else if (Number(form.berat_kg) <= 0) {
      newErrors.berat_kg = 'Berat barang harus lebih besar dari 0 kg';
    }

    if (form.harga_tarif && isNaN(Number(form.harga_tarif))) {
      newErrors.harga_tarif = 'Harga harus berupa angka numeric';
    } else if (Number(form.harga_tarif) < 0) {
      newErrors.harga_tarif = 'Tarif pengiriman tidak boleh bernilai negatif';
    }

    if (form.no_telepon && !/^\+?[0-9\s-]{6,16}$/.test(form.no_telepon)) {
      newErrors.no_telepon = 'Format nomor telepon tidak valid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    const payload = {
      ...form,
      berat_kg: form.berat_kg ? parseFloat(form.berat_kg) : 0,
      harga_tarif: form.harga_tarif ? parseFloat(form.harga_tarif) : 0
    };

    const success = await onSubmit(payload);
    setLoading(false);

    if (success) {
      onClose();
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: '#07020E',
    border: '1px solid rgba(168, 85, 247, 0.35)',
    borderRadius: '4px',
    padding: '10px 12px',
    color: 'white',
    fontSize: '12px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'monospace',
    transition: 'border-color 0.3s ease'
  };

  const errorTextStyle: React.CSSProperties = {
    color: '#EF4444',
    fontSize: '9px',
    marginTop: '4px',
    fontWeight: 'bold',
    fontFamily: 'monospace'
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(7, 2, 14, 0.8)',
      zIndex: 200,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backdropFilter: 'blur(8px)'
    }}>
      <div style={{
        background: '#0D0618',
        border: '1px solid rgba(168, 85, 247, 0.5)',
        borderRadius: '12px',
        padding: '28px 32px',
        width: '90%',
        maxWidth: '560px',
        maxHeight: '90vh',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 20px rgba(168, 85, 247, 0.2)'
      }}>
        <div style={{
          fontSize: '14px',
          fontWeight: 'bold',
          letterSpacing: '2px',
          color: '#C084FC',
          borderBottom: '1px solid rgba(168, 85, 247, 0.2)',
          paddingBottom: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: 'monospace'
        }}>
          <span>{editData ? `REVISI CARGO RESI: ${editData.no_resi}` : 'REGISTRASI CARGO MULTI-MODAL'}</span>
          <button 
            onClick={onClose} 
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: '#8B7BA8', 
              cursor: 'pointer', 
              fontSize: '16px' 
            }}
          >
            ✕
          </button>
        </div>

        {/* Form Fields Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          
          {/* Tanggal Kirim */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '10px', color: '#8B7BA8', fontWeight: 'bold', fontFamily: 'monospace' }}>TANGGAL KIRIM *</span>
            <input
              type="date"
              value={form.tanggal_kirim}
              onChange={(e) => setForm(prev => ({ ...prev, tanggal_kirim: e.target.value }))}
              style={{
                ...inputStyle,
                borderColor: errors.tanggal_kirim ? '#EF4444' : 'rgba(168, 85, 247, 0.35)'
              }}
              onFocus={(e) => !errors.tanggal_kirim && (e.target.style.borderColor = '#A855F7')}
              onBlur={(e) => !errors.tanggal_kirim && (e.target.style.borderColor = 'rgba(168, 85, 247, 0.35)')}
            />
            {errors.tanggal_kirim && <span style={errorTextStyle}>{errors.tanggal_kirim}</span>}
          </div>

          {/* Jenis Barang */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '10px', color: '#8B7BA8', fontWeight: 'bold', fontFamily: 'monospace' }}>JENIS/NAMA BARANG</span>
            <input
              type="text"
              placeholder="e.g. Suku Cadang Mesin, Elektronik"
              value={form.jenis_barang}
              onChange={(e) => setForm(prev => ({ ...prev, jenis_barang: e.target.value }))}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = '#A855F7'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(168, 85, 247, 0.35)'}
            />
          </div>

          {/* Nama Pengirim */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '10px', color: '#8B7BA8', fontWeight: 'bold', fontFamily: 'monospace' }}>PENGIRIM *</span>
            <input
              type="text"
              placeholder="Nama Pengirim"
              value={form.nama_pengirim}
              onChange={(e) => setForm(prev => ({ ...prev, nama_pengirim: e.target.value }))}
              style={{
                ...inputStyle,
                borderColor: errors.nama_pengirim ? '#EF4444' : 'rgba(168, 85, 247, 0.35)'
              }}
              onFocus={(e) => !errors.nama_pengirim && (e.target.style.borderColor = '#A855F7')}
              onBlur={(e) => !errors.nama_pengirim && (e.target.style.borderColor = 'rgba(168, 85, 247, 0.35)')}
            />
            {errors.nama_pengirim && <span style={errorTextStyle}>{errors.nama_pengirim}</span>}
          </div>

          {/* Nama Penerima */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '10px', color: '#8B7BA8', fontWeight: 'bold', fontFamily: 'monospace' }}>PENERIMA *</span>
            <input
              type="text"
              placeholder="Nama Penerima"
              value={form.nama_penerima}
              onChange={(e) => setForm(prev => ({ ...prev, nama_penerima: e.target.value }))}
              style={{
                ...inputStyle,
                borderColor: errors.nama_penerima ? '#EF4444' : 'rgba(168, 85, 247, 0.35)'
              }}
              onFocus={(e) => !errors.nama_penerima && (e.target.style.borderColor = '#A855F7')}
              onBlur={(e) => !errors.nama_penerima && (e.target.style.borderColor = 'rgba(168, 85, 247, 0.35)')}
            />
            {errors.nama_penerima && <span style={errorTextStyle}>{errors.nama_penerima}</span>}
          </div>

          {/* No Telepon */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '10px', color: '#8B7BA8', fontWeight: 'bold', fontFamily: 'monospace' }}>NO TELEPON</span>
            <input
              type="text"
              placeholder="e.g. 081234567890"
              value={form.no_telepon}
              onChange={(e) => setForm(prev => ({ ...prev, no_telepon: e.target.value }))}
              style={{
                ...inputStyle,
                borderColor: errors.no_telepon ? '#EF4444' : 'rgba(168, 85, 247, 0.35)'
              }}
              onFocus={(e) => !errors.no_telepon && (e.target.style.borderColor = '#A855F7')}
              onBlur={(e) => !errors.no_telepon && (e.target.style.borderColor = 'rgba(168, 85, 247, 0.35)')}
            />
            {errors.no_telepon && <span style={errorTextStyle}>{errors.no_telepon}</span>}
          </div>

          {/* Kota Asal */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '10px', color: '#8B7BA8', fontWeight: 'bold', fontFamily: 'monospace' }}>KOTA ASAL</span>
            <input
              type="text"
              placeholder="e.g. Jakarta, Surabaya"
              value={form.kota_asal}
              onChange={(e) => setForm(prev => ({ ...prev, kota_asal: e.target.value }))}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = '#A855F7'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(168, 85, 247, 0.35)'}
            />
          </div>

          {/* Kota Tujuan */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '10px', color: '#8B7BA8', fontWeight: 'bold', fontFamily: 'monospace' }}>KOTA TUJUAN</span>
            <input
              type="text"
              placeholder="e.g. Batam, Sorong"
              value={form.kota_tujuan}
              onChange={(e) => setForm(prev => ({ ...prev, kota_tujuan: e.target.value }))}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = '#A855F7'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(168, 85, 247, 0.35)'}
            />
          </div>

          {/* Berat Barang */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '10px', color: '#8B7BA8', fontWeight: 'bold', fontFamily: 'monospace' }}>BERAT BARANG (KG)</span>
            <input
              type="text"
              placeholder="e.g. 24.5"
              value={form.berat_kg}
              onChange={(e) => setForm(prev => ({ ...prev, berat_kg: e.target.value }))}
              style={{
                ...inputStyle,
                borderColor: errors.berat_kg ? '#EF4444' : 'rgba(168, 85, 247, 0.35)'
              }}
              onFocus={(e) => !errors.berat_kg && (e.target.style.borderColor = '#A855F7')}
              onBlur={(e) => !errors.berat_kg && (e.target.style.borderColor = 'rgba(168, 85, 247, 0.35)')}
            />
            {errors.berat_kg && <span style={errorTextStyle}>{errors.berat_kg}</span>}
          </div>

          {/* Tarif/Harga Pengiriman */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '10px', color: '#8B7BA8', fontWeight: 'bold', fontFamily: 'monospace' }}>TARIF PENGIRIMAN (RP)</span>
            <input
              type="text"
              placeholder="e.g. 150000"
              value={form.harga_tarif}
              onChange={(e) => setForm(prev => ({ ...prev, harga_tarif: e.target.value }))}
              style={{
                ...inputStyle,
                borderColor: errors.harga_tarif ? '#EF4444' : 'rgba(168, 85, 247, 0.35)'
              }}
              onFocus={(e) => !errors.harga_tarif && (e.target.style.borderColor = '#A855F7')}
              onBlur={(e) => !errors.harga_tarif && (e.target.style.borderColor = 'rgba(168, 85, 247, 0.35)')}
            />
            {errors.harga_tarif && <span style={errorTextStyle}>{errors.harga_tarif}</span>}
          </div>

          {/* Jenis Kendaraan (Moda) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '10px', color: '#8B7BA8', fontWeight: 'bold', fontFamily: 'monospace' }}>MODA TRANSPORTASI *</span>
            <select
              value={form.jenis_kendaraan}
              onChange={(e) => setForm(prev => ({ ...prev, jenis_kendaraan: e.target.value }))}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              <option value="darat" style={{ background: '#0D0618' }}>🚛 DARAT (TRUCK)</option>
              <option value="udara" style={{ background: '#0D0618' }}>✈️ UDARA (PESAWAT)</option>
              <option value="laut" style={{ background: '#0D0618' }}>🚢 LAUT (KAPAL)</option>
            </select>
          </div>

          {/* Jenis Pengiriman */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '10px', color: '#8B7BA8', fontWeight: 'bold', fontFamily: 'monospace' }}>JENIS LAYANAN *</span>
            <select
              value={form.jenis_pengiriman}
              onChange={(e) => setForm(prev => ({ ...prev, jenis_pengiriman: e.target.value }))}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              <option value="biasa" style={{ background: '#0D0618' }}>🟢 BIASA (STANDARD)</option>
              <option value="cepat" style={{ background: '#0D0618' }}>⚡ CEPAT (EXPRESS)</option>
              <option value="vvip" style={{ background: '#0D0618' }}>👑 VVIP (PRIORITY)</option>
            </select>
          </div>

          {/* Status Pengiriman */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '10px', color: '#8B7BA8', fontWeight: 'bold', fontFamily: 'monospace' }}>STATUS CARGO *</span>
            <select
              value={form.status_pengiriman}
              onChange={(e) => setForm(prev => ({ ...prev, status_pengiriman: e.target.value }))}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              <option value="diproses" style={{ background: '#0D0618' }}>📋 DIPROSES</option>
              <option value="dalam_pengiriman" style={{ background: '#0D0618' }}>⚡ DALAM PENGIRIMAN</option>
              <option value="sampai_tujuan" style={{ background: '#0D0618' }}>🏁 SAMPAI TUJUAN</option>
              <option value="pending" style={{ background: '#0D0618' }}>⏳ PENDING</option>
              <option value="selesai" style={{ background: '#0D0618' }}>✅ SELESAI</option>
            </select>
          </div>

          {/* Status Kondisi Barang */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '10px', color: '#8B7BA8', fontWeight: 'bold', fontFamily: 'monospace' }}>KONDISI BARANG *</span>
            <select
              value={form.status_barang}
              onChange={(e) => setForm(prev => ({ ...prev, status_barang: e.target.value }))}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              <option value="aman" style={{ background: '#0D0618' }}>🛡️ AMAN (SEMPURNA)</option>
              <option value="rusak" style={{ background: '#0D0618' }}>⚠️ RUSAK (DAMAGE)</option>
              <option value="hilang" style={{ background: '#0D0618' }}>❌ HILANG (LOST)</option>
            </select>
          </div>

          {/* Status Transaksi Pembayaran */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '10px', color: '#8B7BA8', fontWeight: 'bold', fontFamily: 'monospace' }}>STATUS PEMBAYARAN *</span>
            <select
              value={form.status_transaksi}
              onChange={(e) => setForm(prev => ({ ...prev, status_transaksi: e.target.value }))}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              <option value="belum_bayar" style={{ background: '#0D0618' }}>⏳ UNPAID (BELUM LUNAS)</option>
              <option value="lunas" style={{ background: '#0D0618' }}>💳 PAID (LUNAS)</option>
            </select>
          </div>

          {/* Deskripsi (Colspan 2) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: '1 / -1' }}>
            <span style={{ fontSize: '10px', color: '#8B7BA8', fontWeight: 'bold', fontFamily: 'monospace' }}>CATATAN / DESKRIPSI BARANG</span>
            <textarea
              placeholder="Deskripsi muatan cargo atau instruksi penanganan khusus..."
              value={form.deskripsi}
              onChange={(e) => setForm(prev => ({ ...prev, deskripsi: e.target.value }))}
              rows={3}
              style={{ ...inputStyle, resize: 'vertical' }}
              onFocus={(e) => e.target.style.borderColor = '#A855F7'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(168, 85, 247, 0.35)'}
            />
          </div>
        </div>

        {/* Submission Actions */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '16px', borderTop: '1px dashed rgba(168, 85, 247, 0.15)', paddingTop: '20px' }}>
          <button
            onClick={onClose}
            disabled={loading}
            style={{
              flex: 1,
              background: 'transparent',
              border: '1px solid rgba(168, 85, 247, 0.35)',
              color: '#8B7BA8',
              padding: '12px',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '11px',
              fontWeight: 'bold',
              fontFamily: 'monospace',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.color = '#EF4444', e.currentTarget.style.borderColor = '#EF4444')}
            onMouseLeave={(e) => !loading && (e.currentTarget.style.color = '#8B7BA8', e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.35)')}
          >
            Batal
          </button>
          
          <button
            onClick={handleFormSubmit}
            disabled={loading}
            style={{
              flex: 1,
              background: 'linear-gradient(90deg, #A855F7 0%, #7C3AED 100%)',
              border: 'none',
              color: 'white',
              padding: '12px',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '11px',
              fontWeight: 'bold',
              fontFamily: 'monospace',
              boxShadow: '0 0 15px rgba(168, 85, 247, 0.3)',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.boxShadow = '0 0 20px rgba(168, 85, 247, 0.6)')}
            onMouseLeave={(e) => !loading && (e.currentTarget.style.boxShadow = '0 0 15px rgba(168, 85, 247, 0.3)')}
          >
            {loading ? 'MENYIMPAN KE DB...' : editData ? 'SIMPAN REVISI' : 'REGISTRASIKAN CARGO'}
          </button>
        </div>
      </div>
    </div>
  );
}
