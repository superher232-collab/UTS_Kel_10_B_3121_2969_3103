"use client";
import React, { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | loading | success

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    setStatus('loading');
    
    // Mock network request
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      
      // Reset success message after 3 seconds
      setTimeout(() => setStatus('idle'), 3000);
    }, 1500);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="contact" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '80px 24px',
      position: 'relative',
      background: 'rgba(20, 10, 36, 0.4)',
      borderTop: '1px solid rgba(168, 85, 247, 0.1)',
      borderBottom: '1px solid rgba(168, 85, 247, 0.1)',
      margin: '40px 0'
    }}>
      <h3 style={{
        fontFamily: 'var(--font-body)',
        fontSize: '12px',
        fontWeight: 600,
        color: '#8B7BA8',
        letterSpacing: '3px',
        marginBottom: '12px'
      }}>
        HUBUNGI KAMI
      </h3>
      
      <h2 style={{
        fontFamily: 'var(--font-title)',
        fontSize: 'clamp(24px, 5vw, 36px)',
        color: 'white',
        letterSpacing: '1px',
        marginBottom: '40px',
        textAlign: 'center'
      }}>
        Butuh Bantuan <span style={{ color: '#A855F7' }}>Atau Informasi?</span>
      </h2>

      <div style={{
        width: '100%',
        maxWidth: '500px',
        background: '#0D0618',
        border: '1px solid rgba(168, 85, 247, 0.3)',
        borderRadius: '12px',
        padding: '32px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)'
      }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor="name" style={{ color: '#8B7BA8', fontSize: '11px', fontFamily: 'monospace', fontWeight: 'bold' }}>NAMA LENGKAP *</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Masukkan nama Anda..."
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                borderRadius: '6px',
                padding: '12px',
                color: 'white',
                fontSize: '12px',
                outline: 'none',
                fontFamily: 'var(--font-body)',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#A855F7'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(168, 85, 247, 0.3)'}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor="email" style={{ color: '#8B7BA8', fontSize: '11px', fontFamily: 'monospace', fontWeight: 'bold' }}>ALAMAT EMAIL *</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="contoh@email.com"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                borderRadius: '6px',
                padding: '12px',
                color: 'white',
                fontSize: '12px',
                outline: 'none',
                fontFamily: 'var(--font-body)',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#A855F7'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(168, 85, 247, 0.3)'}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor="message" style={{ color: '#8B7BA8', fontSize: '11px', fontFamily: 'monospace', fontWeight: 'bold' }}>ISI PESAN *</label>
            <textarea 
              id="message" 
              name="message" 
              value={formData.message}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Tulis pesan atau pertanyaan Anda di sini..."
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                borderRadius: '6px',
                padding: '12px',
                color: 'white',
                fontSize: '12px',
                outline: 'none',
                fontFamily: 'var(--font-body)',
                resize: 'vertical',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#A855F7'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(168, 85, 247, 0.3)'}
            />
          </div>

          <button 
            type="submit" 
            disabled={status === 'loading' || status === 'success'}
            style={{
              background: status === 'success' ? '#22C55E' : 'linear-gradient(135deg, #A855F7 0%, #7C3AED 100%)',
              color: 'white',
              border: 'none',
              padding: '14px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 'bold',
              fontFamily: 'monospace',
              cursor: (status === 'loading' || status === 'success') ? 'not-allowed' : 'pointer',
              marginTop: '10px',
              transition: 'all 0.3s',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {status === 'idle' && 'KIRIM PESAN SEKARANG'}
            {status === 'loading' && 'MENGIRIM...'}
            {status === 'success' && '✅ PESAN BERHASIL DIKIRIM'}
          </button>
          
          {status === 'success' && (
             <p style={{ textAlign: 'center', fontSize: '10px', color: '#22C55E', margin: 0, fontFamily: 'monospace' }}>
               Terima kasih! Tim Admin kami akan segera merespon via Email.
             </p>
          )}
        </form>
      </div>
    </section>
  );
}
