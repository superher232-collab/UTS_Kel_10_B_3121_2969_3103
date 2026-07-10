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
          fontSize: '11px',
          color: 'rgba(168,85,247,0.7)',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          display: 'block',
          marginBottom: '12px'
        }}>
          Contact Us
        </span>
        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(28px, 4vw, 40px)',
          fontWeight: 700,
          color: '#F1F0F5',
          letterSpacing: '-0.02em',
          lineHeight: '1.1',
          margin: 0
        }}>
          Need Help or More Information?
        </h2>
      </div>

      {/* Glass card form */}
      <div className="double-bezel">
        <div className="double-bezel-inner" style={{ padding: 'clamp(24px, 3vw, 40px)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{
                fontFamily: 'var(--font-body)',
                fontSize: '11px',
                color: 'rgba(241,240,245,0.5)',
                letterSpacing: '1px',
                textTransform: 'uppercase'
              }}>Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your name"
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(168,85,247,0.15)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  color: '#F1F0F5',
                  fontSize: '14px',
                  fontFamily: 'var(--font-body)',
                  outline: 'none',
                  transition: 'all 0.3s var(--cubic-premium)'
                }}
                onFocus={e => { e.target.style.borderColor = 'rgba(168,85,247,0.5)'; e.target.style.boxShadow = '0 0 16px rgba(168,85,247,0.1)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(168,85,247,0.15)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{
                fontFamily: 'var(--font-body)',
                fontSize: '11px',
                color: 'rgba(241,240,245,0.5)',
                letterSpacing: '1px',
                textTransform: 'uppercase'
              }}>Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your@email.com"
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(168,85,247,0.15)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  color: '#F1F0F5',
                  fontSize: '14px',
                  fontFamily: 'var(--font-body)',
                  outline: 'none',
                  transition: 'all 0.3s var(--cubic-premium)'
                }}
                onFocus={e => { e.target.style.borderColor = 'rgba(168,85,247,0.5)'; e.target.style.boxShadow = '0 0 16px rgba(168,85,247,0.1)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(168,85,247,0.15)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{
                fontFamily: 'var(--font-body)',
                fontSize: '11px',
                color: 'rgba(241,240,245,0.5)',
                letterSpacing: '1px',
                textTransform: 'uppercase'
              }}>Message *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Write your message or question here"
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(168,85,247,0.15)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  color: '#F1F0F5',
                  fontSize: '14px',
                  fontFamily: 'var(--font-body)',
                  outline: 'none',
                  resize: 'vertical',
                  transition: 'all 0.3s var(--cubic-premium)'
                }}
                onFocus={e => { e.target.style.borderColor = 'rgba(168,85,247,0.5)'; e.target.style.boxShadow = '0 0 16px rgba(168,85,247,0.1)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(168,85,247,0.15)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              className="btn-inner"
              style={{
                justifyContent: 'center',
                width: '100%',
                textDecoration: 'none',
                border: 'none',
                cursor: (status === 'loading' || status === 'success') ? 'not-allowed' : 'pointer',
                opacity: (status === 'loading' || status === 'success') ? 0.7 : 1
              }}
            >
              {status === 'idle' && (
                <>Send Message <span className="icon-wrap"><PaperPlaneTilt size={14} weight="bold" /></span></>
              )}
              {status === 'loading' && (
                <>Sending... <span className="icon-wrap"><Spinner size={14} weight="bold" className="spin" /></span></>
              )}
              {status === 'success' && (
                <>Message Sent <span className="icon-wrap"><CheckCircle size={14} weight="bold" /></span></>
              )}
            </button>

            {status === 'success' && (
              <p style={{
                textAlign: 'center',
                fontSize: '12px',
                color: '#22C55E',
                margin: 0,
                fontFamily: 'var(--font-body)'
              }}>
                Thank you! Our admin team will respond via Email shortly.
              </p>
            )}
          </form>
        </div>
      </div>

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        input:focus-visible, textarea:focus-visible {
          outline: 2px solid rgba(168,85,247,0.5) !important;
          outline-offset: 2px !important;
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>
    </section>
  );
}
