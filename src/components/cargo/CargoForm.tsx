"use client";
import React, { useState, useEffect } from 'react';
import { CargoShipment } from '../../app/dashboard/cargo/page'

interface Ship {
  id: string;
  name: string;
  type: string;
  plateNo: string;
  capacity: number;
  status: string;
}

interface CargoFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<CargoShipment>) => Promise<boolean>;
  editData?: CargoShipment | null;
  ships?: Ship[];
  role: 'ADMIN' | 'CUSTOMER';
}

export function CargoForm({ isOpen, onClose, onSubmit, editData, ships = [], role }: CargoFormProps) {
  const CITIES = [
    { name: 'Jakarta', island: 'Jawa' },
    { name: 'Surabaya', island: 'Jawa' },
    { name: 'Medan', island: 'Sumatra' },
    { name: 'Makassar', island: 'Sulawesi' },
    { name: 'Palembang', island: 'Sumatra' },
    { name: 'Balikpapan', island: 'Kalimantan' },
    { name: 'Manado', island: 'Sulawesi' },
    { name: 'Denpasar', island: 'Bali' },
    { name: 'Semarang', island: 'Jawa' },
    { name: 'Yogyakarta', island: 'Jawa' },
    { name: 'Padang', island: 'Sumatra' },
    { name: 'Pontianak', island: 'Kalimantan' },
    { name: 'Ambon', island: 'Maluku' },
    { name: 'Jayapura', island: 'Papua' }
  ];

  const todayStr = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState({
    tanggal_kirim: todayStr,
    nama_pengirim: '',
    nama_penerima: '',
    no_telepon: '',
    kota_asal: '',
    kota_tujuan: '',
    jenis_barang: '',
    berat_kg: '',
    harga_tarif: '',
    jenis_kendaraan: 'laut',
    vehicleId: '',
    jenis_pengiriman: 'biasa',
    status_pengiriman: 'diproses',
    status_barang: 'aman',
    status_transaksi: 'belum_bayar',
    metode_pembayaran: 'TUNAI',
    deskripsi: '',
    targetUserId: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Autocomplete UI states
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);
  const [originSearch, setOriginSearch] = useState('');
  const [destSearch, setDestSearch] = useState('');
  const [debouncedOriginSearch, setDebouncedOriginSearch] = useState('');
  const [debouncedDestSearch, setDebouncedDestSearch] = useState('');

  // Debouncing search inputs
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedOriginSearch(originSearch);
    }, 150);
    return () => clearTimeout(handler);
  }, [originSearch]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedDestSearch(destSearch);
    }, 150);
    return () => clearTimeout(handler);
  }, [destSearch]);

  // Sync editData values if editing
  useEffect(() => {
    if (editData) {
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
        jenis_kendaraan: 'laut',
        vehicleId: editData.vehicleId || '',
        jenis_pengiriman: editData.jenis_pengiriman || 'biasa',
        status_pengiriman: editData.status_pengiriman || 'diproses',
        status_barang: editData.status_barang || 'aman',
        status_transaksi: editData.status_transaksi || 'belum_bayar',
        metode_pembayaran: editData.metode_pembayaran || 'TUNAI',
        deskripsi: editData.deskripsi || '',
        targetUserId: (editData as any).userId || ''
      });
      setOriginSearch(editData.kota_asal || '');
      setDestSearch(editData.kota_tujuan || '');
      setErrors({});
    } else {
      setForm({
        tanggal_kirim: todayStr,
        nama_pengirim: '',
        nama_penerima: '',
        no_telepon: '',
        kota_asal: '',
        kota_tujuan: '',
        jenis_barang: '',
        berat_kg: '',
        harga_tarif: '',
        jenis_kendaraan: 'laut',
        vehicleId: '',
        jenis_pengiriman: 'biasa',
        status_pengiriman: 'diproses',
        status_barang: 'aman',
        status_transaksi: 'belum_bayar',
        metode_pembayaran: 'TUNAI',
        deskripsi: '',
        targetUserId: ''
      });
      setOriginSearch('');
      setDestSearch('');
      setErrors({});
    }
  }, [editData, isOpen]);

  const getFilteredOrigins = () => {
    let list = [...CITIES];
    if (debouncedOriginSearch.trim()) {
      const q = debouncedOriginSearch.toLowerCase();
      list = list.filter(c => c.name.toLowerCase().includes(q));
    }
    list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  };

  const getFilteredDestinations = () => {
    let list = [...CITIES];

    if (debouncedDestSearch.trim()) {
      const q = debouncedDestSearch.toLowerCase();
      list = list.filter(c => c.name.toLowerCase().includes(q));
    }

    const originCity = CITIES.find(c => c.name.toLowerCase() === form.kota_asal.trim().toLowerCase());
    if (originCity) {
      const originIsland = originCity.island;
      list.sort((a, b) => {
        const aIsCross = a.island !== originIsland;
        const bIsCross = b.island !== originIsland;
        if (aIsCross && !bIsCross) return -1;
        if (!aIsCross && bIsCross) return 1;
        return a.name.localeCompare(b.name);
      });
    } else {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  };

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Date validation
    if (!form.tanggal_kirim) {
      newErrors.tanggal_kirim = 'Tanggal kirim wajib diisi';
    } else {
      const [year, month, day] = form.tanggal_kirim.split('-').map(Number);
      const selectedDate = new Date(year, month - 1, day);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.tanggal_kirim = 'Tanggal kirim tidak boleh di masa lalu';
      }
    }

    if (!form.nama_pengirim.trim()) newErrors.nama_pengirim = 'Nama pengirim wajib diisi';
    if (!form.nama_penerima.trim()) newErrors.nama_penerima = 'Nama penerima wajib diisi';

    // City validation
    if (!form.kota_asal.trim()) {
      newErrors.kota_asal = 'Kota asal wajib dipilih';
    } else if (!CITIES.some(c => c.name.toLowerCase() === form.kota_asal.trim().toLowerCase())) {
      newErrors.kota_asal = 'Pilih kota dari daftar yang tersedia';
    }

    if (!form.kota_tujuan.trim()) {
      newErrors.kota_tujuan = 'Kota tujuan wajib dipilih';
    } else if (!CITIES.some(c => c.name.toLowerCase() === form.kota_tujuan.trim().toLowerCase())) {
      newErrors.kota_tujuan = 'Pilih kota dari daftar yang tersedia';
    }

    if (form.kota_asal.trim() && form.kota_tujuan.trim() &&
        form.kota_asal.trim().toLowerCase() === form.kota_tujuan.trim().toLowerCase()) {
      newErrors.kota_tujuan = 'Kota asal dan tujuan tidak boleh sama';
    }

    // Ship validation — only required for Admin (BR-07)
    if (role === 'ADMIN' && !form.vehicleId) {
      newErrors.vehicleId = 'Kapal pengangkut wajib dipilih';
    }

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

  const originCity = CITIES.find(c => c.name.toLowerCase() === form.kota_asal.trim().toLowerCase());

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
          <span>{editData ? `REVISI CARGO RESI: ${editData.no_resi}` : 'REGISTRASI CARGO MARITIM'}</span>
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

          {/* Tanggal Kirim — Native date with min blocking */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '10px', color: '#8B7BA8', fontWeight: 'bold', fontFamily: 'monospace' }}>TANGGAL KIRIM *</span>
            <input
              type="date"
              value={form.tanggal_kirim}
              min={todayStr}
              onChange={(e) => setForm(prev => ({ ...prev, tanggal_kirim: e.target.value }))}
              style={{
                ...inputStyle,
                borderColor: errors.tanggal_kirim ? '#EF4444' : 'rgba(168, 85, 247, 0.35)',
                colorScheme: 'dark'
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

          {/* Kota Asal — Autocomplete Dropdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', position: 'relative' }}>
            <span style={{ fontSize: '10px', color: '#8B7BA8', fontWeight: 'bold', fontFamily: 'monospace' }}>KOTA ASAL *</span>
            <input
              type="text"
              placeholder="Ketik nama kota..."
              value={originSearch}
              onChange={(e) => {
                setOriginSearch(e.target.value);
                setForm(prev => ({ ...prev, kota_asal: e.target.value }));
                setShowOriginDropdown(true);
              }}
              onFocus={() => setShowOriginDropdown(true)}
              onBlur={() => {
                setTimeout(() => setShowOriginDropdown(false), 150);
              }}
              style={{
                ...inputStyle,
                borderColor: errors.kota_asal ? '#EF4444' : showOriginDropdown ? '#A855F7' : 'rgba(168, 85, 247, 0.35)'
              }}
            />
            {showOriginDropdown && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: '#0D0618',
                border: '1px solid rgba(168, 85, 247, 0.5)',
                borderRadius: '4px',
                maxHeight: '180px',
                overflowY: 'auto',
                zIndex: 300,
                boxShadow: '0 10px 30px rgba(0,0,0,0.7)',
                marginTop: '2px'
              }}>
                {getFilteredOrigins().map((city) => (
                  <div
                    key={city.name}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setForm(prev => ({ ...prev, kota_asal: city.name }));
                      setOriginSearch(city.name);
                      setShowOriginDropdown(false);
                      setErrors(prev => { const n = { ...prev }; delete n.kota_asal; return n; });
                    }}
                    style={{
                      padding: '8px 12px',
                      cursor: 'pointer',
                      fontSize: '11px',
                      color: 'white',
                      fontFamily: 'monospace',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderBottom: '1px solid rgba(168, 85, 247, 0.1)',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(168, 85, 247, 0.15)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <span>{city.name}</span>
                    <span style={{ fontSize: '9px', color: '#8B7BA8' }}>{city.island}</span>
                  </div>
                ))}
                {getFilteredOrigins().length === 0 && (
                  <div style={{ padding: '12px', fontSize: '10px', color: '#8B7BA8', textAlign: 'center' }}>
                    Kota tidak ditemukan
                  </div>
                )}
              </div>
            )}
            {errors.kota_asal && <span style={errorTextStyle}>{errors.kota_asal}</span>}
          </div>

          {/* Kota Tujuan — Autocomplete Dropdown with Cross-Island Priority */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', position: 'relative' }}>
            <span style={{ fontSize: '10px', color: '#8B7BA8', fontWeight: 'bold', fontFamily: 'monospace' }}>KOTA TUJUAN *</span>
            <input
              type="text"
              placeholder="Ketik nama kota..."
              value={destSearch}
              onChange={(e) => {
                setDestSearch(e.target.value);
                setForm(prev => ({ ...prev, kota_tujuan: e.target.value }));
                setShowDestDropdown(true);
              }}
              onFocus={() => setShowDestDropdown(true)}
              onBlur={() => {
                setTimeout(() => setShowDestDropdown(false), 150);
              }}
              style={{
                ...inputStyle,
                borderColor: errors.kota_tujuan ? '#EF4444' : showDestDropdown ? '#A855F7' : 'rgba(168, 85, 247, 0.35)'
              }}
            />
            {showDestDropdown && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: '#0D0618',
                border: '1px solid rgba(168, 85, 247, 0.5)',
                borderRadius: '4px',
                maxHeight: '180px',
                overflowY: 'auto',
                zIndex: 300,
                boxShadow: '0 10px 30px rgba(0,0,0,0.7)',
                marginTop: '2px'
              }}>
                {getFilteredDestinations().map((city) => {
                  const isCrossIsland = originCity && city.island !== originCity.island;
                  return (
                    <div
                      key={city.name}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setForm(prev => ({ ...prev, kota_tujuan: city.name }));
                        setDestSearch(city.name);
                        setShowDestDropdown(false);
                        setErrors(prev => { const n = { ...prev }; delete n.kota_tujuan; return n; });
                      }}
                      style={{
                        padding: '8px 12px',
                        cursor: 'pointer',
                        fontSize: '11px',
                        color: 'white',
                        fontFamily: 'monospace',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: '1px solid rgba(168, 85, 247, 0.1)',
                        transition: 'background 0.15s',
                        background: isCrossIsland ? 'rgba(6, 182, 212, 0.05)' : 'transparent'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = isCrossIsland ? 'rgba(6, 182, 212, 0.15)' : 'rgba(168, 85, 247, 0.15)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = isCrossIsland ? 'rgba(6, 182, 212, 0.05)' : 'transparent'}
                    >
                      <span>{city.name}</span>
                      <span style={{ fontSize: '9px', color: isCrossIsland ? '#06B6D4' : '#8B7BA8' }}>
                        {isCrossIsland ? `🚢 ${city.island}` : city.island}
                      </span>
                    </div>
                  );
                })}
                {getFilteredDestinations().length === 0 && (
                  <div style={{ padding: '12px', fontSize: '10px', color: '#8B7BA8', textAlign: 'center' }}>
                    Kota tidak ditemukan
                  </div>
                )}
              </div>
            )}
            {errors.kota_tujuan && <span style={errorTextStyle}>{errors.kota_tujuan}</span>}
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
            {role === 'ADMIN' ? (
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
            ) : (
              <div style={{
                ...inputStyle,
                background: 'rgba(255, 255, 255, 0.05)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                color: '#8B7BA8',
                cursor: 'not-allowed',
                display: 'flex',
                alignItems: 'center'
              }}>
                Auto-kalkulasi sistem (BR-05)
              </div>
            )}
            {errors.harga_tarif && <span style={errorTextStyle}>{errors.harga_tarif}</span>}
          </div>

          {/* Moda Transportasi — LOCKED to LAUT */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '10px', color: '#8B7BA8', fontWeight: 'bold', fontFamily: 'monospace' }}>MODA TRANSPORTASI *</span>
            <div style={{
              ...inputStyle,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(6, 182, 212, 0.08)',
              borderColor: 'rgba(6, 182, 212, 0.3)',
              cursor: 'not-allowed',
              opacity: 0.9
            }}>
              <span style={{ fontSize: '14px' }}>🚢</span>
              <span style={{ color: '#06B6D4', fontWeight: 'bold', flex: 1 }}>LAUT (KAPAL)</span>
              <span style={{
                fontSize: '8px',
                color: '#F59E0B',
                background: 'rgba(245, 158, 11, 0.15)',
                padding: '2px 6px',
                borderRadius: '2px',
                fontWeight: 'bold',
                border: '1px solid rgba(245, 158, 11, 0.3)'
              }}>TERKUNCI</span>
            </div>
          </div>

          {/* Ship Selector — Dynamic from DB (Admin Only, BR-07) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '10px', color: '#8B7BA8', fontWeight: 'bold', fontFamily: 'monospace' }}>KAPAL PENGANGKUT *</span>
            {role === 'ADMIN' ? (
              <select
                value={form.vehicleId}
                onChange={(e) => setForm(prev => ({ ...prev, vehicleId: e.target.value }))}
                style={{
                  ...inputStyle,
                  cursor: 'pointer',
                  borderColor: errors.vehicleId ? '#EF4444' : 'rgba(168, 85, 247, 0.35)'
                }}
              >
                <option value="" style={{ background: '#0D0618', color: '#8B7BA8' }}>— Pilih Kapal —</option>
                {ships.map((ship) => (
                  <option key={ship.id} value={ship.id} style={{ background: '#0D0618' }}>
                    🚢 {ship.name} ({ship.capacity.toLocaleString()} ton) — {ship.plateNo}
                  </option>
                ))}
              </select>
            ) : (
              <div style={{
                ...inputStyle,
                background: 'rgba(255, 255, 255, 0.05)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                color: '#8B7BA8',
                cursor: 'not-allowed',
                display: 'flex',
                alignItems: 'center'
              }}>
                Dialokasikan oleh admin
              </div>
            )}
            {errors.vehicleId && <span style={errorTextStyle}>{errors.vehicleId}</span>}
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

          {/* Metode Pembayaran */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '10px', color: '#8B7BA8', fontWeight: 'bold', fontFamily: 'monospace' }}>METODE PEMBAYARAN *</span>
            <select
              value={form.metode_pembayaran}
              onChange={(e) => setForm(prev => ({ ...prev, metode_pembayaran: e.target.value }))}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              <option value="TUNAI" style={{ background: '#0D0618' }}>💵 TUNAI (CASH)</option>
              <option value="QRIS" style={{ background: '#0D0618' }}>📱 QRIS (CASHLESS)</option>
            </select>
          </div>

          {/* Status Dropdowns — Only editable by Admin (BR-09, BR-08) */}
          {role === 'ADMIN' ? (
            <>
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

              {/* Target User ID Klien */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '10px', color: '#8B7BA8', fontWeight: 'bold', fontFamily: 'monospace' }}>USER ID ADMIN (KLIEN)</span>
                <input
                  type="text"
                  placeholder="ID Akun Customer (Opsional)"
                  value={form.targetUserId}
                  onChange={(e) => setForm(prev => ({ ...prev, targetUserId: e.target.value }))}
                  style={inputStyle}
                />
              </div>
            </>
          ) : editData ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: '1 / -1' }}>
              <span style={{ fontSize: '10px', color: '#8B7BA8', fontWeight: 'bold', fontFamily: 'monospace' }}>STATUS PENGIRIMAN</span>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ ...inputStyle, flex: 1, background: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.1)', cursor: 'not-allowed', color: '#8B7BA8' }}>
                  Kargo: {form.status_pengiriman.toUpperCase()}
                </div>
                <div style={{ ...inputStyle, flex: 1, background: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.1)', cursor: 'not-allowed', color: '#8B7BA8' }}>
                  Pembayaran: {form.status_transaksi.toUpperCase()}
                </div>
              </div>
            </div>
          ) : null}

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
