"use client";
import React, { useState } from 'react';
import { PaperPlaneTilt, CheckCircle, Spinner } from "@phosphor-icons/react";

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus('loading');

    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 3000);
    }, 1500);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section
      id="contact"
      style={{
        padding: 'clamp(64px, 8vw, 100px) 24px',
        maxWidth: '700px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      {/* Section header */}
      <div style={{ marginBottom: '40px', textAlign: 'center' }}>
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-xs)',
          color: 'var(--accent)',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          display: 'block',
          marginBottom: '12px',
          fontWeight: 600
        }}>
          Hubungi Kami
        </span>
        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(28px, 4vw, 40px)',
          fontWeight: 700,
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
          lineHeight: '1.1',
          margin: 0
        }}>
          Butuh Bantuan atau Informasi?
        </h2>
      </div>

      {/* Form card */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'clamp(24px, 3vw, 40px)'
      }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-sm)',
              color: 'var(--text-tertiary)',
              fontWeight: 500
            }}>Nama Lengkap *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Masukkan nama Anda"
              style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px 16px',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-base)',
                fontFamily: 'var(--font-body)',
                outline: 'none',
                transition: 'all 0.3s var(--ease)'
              }}
              onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 12px var(--accent-dim)'; }}
              onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-sm)',
              color: 'var(--text-tertiary)',
              fontWeight: 500
            }}>Alamat Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="email@anda.com"
              style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px 16px',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-base)',
                fontFamily: 'var(--font-body)',
                outline: 'none',
                transition: 'all 0.3s var(--ease)'
              }}
              onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 12px var(--accent-dim)'; }}
              onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-sm)',
              color: 'var(--text-tertiary)',
              fontWeight: 500
            }}>Pesan *</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Tulis pesan atau pertanyaan Anda di sini"
              style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px 16px',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-base)',
                fontFamily: 'var(--font-body)',
                outline: 'none',
                resize: 'vertical',
                transition: 'all 0.3s var(--ease)'
              }}
              onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 12px var(--accent-dim)'; }}
              onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            style={{
              background: 'var(--accent)',
              color: '#060608',
              fontWeight: 600,
              fontSize: 'var(--text-base)',
              padding: '12px 24px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              cursor: (status === 'loading' || status === 'success') ? 'not-allowed' : 'pointer',
              opacity: (status === 'loading' || status === 'success') ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.3s var(--ease)'
            }}
          >
            {status === 'idle' && (
              <>Kirim Pesan <PaperPlaneTilt size={14} weight="bold" /></>
            )}
            {status === 'loading' && (
              <>Mengirim... <Spinner size={14} weight="bold" className="spin" /></>
            )}
            {status === 'success' && (
              <>Terkirim <CheckCircle size={14} weight="bold" /></>
            )}
          </button>

          {status === 'success' && (
            <p style={{
              textAlign: 'center',
              fontSize: 'var(--text-sm)',
              color: 'var(--success)',
              margin: 0,
              fontFamily: 'var(--font-body)'
            }}>
              Terima kasih! Tim kami akan merespons melalui email.
            </p>
          )}
        </form>
      </div>

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        input:focus-visible, textarea:focus-visible {
          outline: 2px solid var(--accent) !important;
          outline-offset: 2px !important;
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>
    </section>
  );
}
