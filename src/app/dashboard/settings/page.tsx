'use client'

import React, { useState, useEffect } from 'react'

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    emailNotif: true,
    smsNotif: true
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/user/profile')
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      
      setProfile(data.data)
      setFormData({
        name: data.data.name || '',
        phone: data.data.phone || '',
        address: data.data.address || '',
        emailNotif: data.data.emailNotif ?? true,
        smsNotif: data.data.smsNotif ?? true
      })
    } catch (err: any) {
      setError(err.message || 'Gagal memuat profil')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as any
    const checked = (e.target as HTMLInputElement).checked
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')
    
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      
      setSuccess('Profil berhasil diperbarui!')
      setProfile(data.data)
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan profil')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#A855F7', fontFamily: 'monospace' }}>
        MEMUAT DATA PROFIL...
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ borderBottom: '1px dashed rgba(168, 85, 247, 0.25)', paddingBottom: '16px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', letterSpacing: '2px', color: 'white', margin: '0 0 8px 0' }}>
          ⚙️ PENGATURAN PROFIL
        </h1>
        <span style={{ fontSize: '11px', color: '#A855F7', fontWeight: 'bold', letterSpacing: '1px' }}>
          KELOLA DATA PERSONAL & PREFERENSI NOTIFIKASI
        </span>
      </div>

      {error && (
        <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #EF4444', borderRadius: '6px', color: '#EF4444', fontSize: '11px', fontWeight: 'bold' }}>
          ⚠️ ERROR: {error}
        </div>
      )}
      
      {success && (
        <div style={{ padding: '12px', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid #22C55E', borderRadius: '6px', color: '#22C55E', fontSize: '11px', fontWeight: 'bold' }}>
          ✅ {success}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ background: '#0D0618', border: '1px solid rgba(168, 85, 247, 0.25)', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 8px 30px rgba(0,0,0,0.6)' }}>
        
        {/* Email Read-only */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '11px', color: '#8B7BA8', fontWeight: 'bold', letterSpacing: '1px' }}>ALAMAT EMAIL (READ-ONLY)</label>
          <input 
            type="email" 
            value={profile?.email || ''} 
            disabled
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px', padding: '12px', color: '#6B5C83', fontFamily: 'monospace', cursor: 'not-allowed' }}
          />
          <span style={{ fontSize: '9px', color: '#6B5C83' }}>* Email digunakan sebagai identitas utama login dan tidak dapat diubah di sini.</span>
        </div>

        {/* Nama */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '11px', color: '#C084FC', fontWeight: 'bold', letterSpacing: '1px' }}>NAMA LENGKAP</label>
          <input 
            type="text" 
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ background: '#07020E', border: '1px solid rgba(168, 85, 247, 0.4)', borderRadius: '6px', padding: '12px', color: 'white', fontFamily: 'monospace', transition: 'all 0.3s' }}
          />
        </div>

        {/* Telepon */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '11px', color: '#C084FC', fontWeight: 'bold', letterSpacing: '1px' }}>NOMOR TELEPON AKTIF</label>
          <input 
            type="tel" 
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Contoh: +628123456789"
            style={{ background: '#07020E', border: '1px solid rgba(168, 85, 247, 0.4)', borderRadius: '6px', padding: '12px', color: 'white', fontFamily: 'monospace' }}
          />
        </div>

        {/* Alamat */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '11px', color: '#C084FC', fontWeight: 'bold', letterSpacing: '1px' }}>ALAMAT PENGIRIMAN UTAMA</label>
          <textarea 
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={3}
            placeholder="Masukkan alamat lengkap pengiriman standar..."
            style={{ background: '#07020E', border: '1px solid rgba(168, 85, 247, 0.4)', borderRadius: '6px', padding: '12px', color: 'white', fontFamily: 'monospace', resize: 'vertical' }}
          />
        </div>

        <div style={{ borderTop: '1px dashed rgba(168, 85, 247, 0.2)', margin: '10px 0' }}></div>

        {/* Preferensi Notifikasi */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '13px', color: '#A855F7', letterSpacing: '1px' }}>PREFERENSI NOTIFIKASI KINERJA</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(168, 85, 247, 0.05)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(168, 85, 247, 0.1)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'white' }}>NOTIFIKASI EMAIL PRIBADI</span>
              <span style={{ fontSize: '10px', color: '#8B7BA8' }}>Terima invoice dan update status kargo ke kotak masuk email.</span>
            </div>
            <input 
              type="checkbox" 
              name="emailNotif"
              checked={formData.emailNotif}
              onChange={handleChange}
              style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#A855F7' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(168, 85, 247, 0.05)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(168, 85, 247, 0.1)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'white' }}>NOTIFIKASI SMS/WHATSAPP DELEGASI</span>
              <span style={{ fontSize: '10px', color: '#8B7BA8' }}>Terima notifikasi darurat langsung ke perangkat mobile terdaftar.</span>
            </div>
            <input 
              type="checkbox" 
              name="smsNotif"
              checked={formData.smsNotif}
              onChange={handleChange}
              style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#A855F7' }}
            />
          </div>
        </div>

        {/* Submit */}
        <button 
          type="submit" 
          disabled={saving}
          style={{ 
            marginTop: '16px',
            background: saving ? 'rgba(168, 85, 247, 0.4)' : 'linear-gradient(90deg, #A855F7 0%, #7C3AED 100%)', 
            border: 'none', 
            color: 'white', 
            padding: '14px', 
            borderRadius: '8px', 
            cursor: saving ? 'not-allowed' : 'pointer', 
            fontFamily: 'monospace', 
            fontWeight: 'bold', 
            fontSize: '14px',
            letterSpacing: '2px',
            transition: 'all 0.3s'
          }}
        >
          {saving ? 'MENYIMPAN KE SERVER...' : 'SIMPAN PERUBAHAN PROFIL'}
        </button>

      </form>
    </div>
  )
}
