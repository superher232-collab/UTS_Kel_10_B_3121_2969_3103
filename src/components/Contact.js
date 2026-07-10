"use client";
import React, { useState } from 'react';
import { motion } from "framer-motion";

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
    <motion.section
      id="contact"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '80px 24px',
        position: 'relative',
        background: '#0D0B14',
        margin: '40px 0'
      }}
    >
      <h3 style={{
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: '14px',
        fontWeight: 600,
        color: '#9B99A8',
        letterSpacing: '3px',
        marginBottom: '12px'
      }}>
        CONTACT US
      </h3>
      
      <h2 style={{
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: 'clamp(24px, 5vw, 36px)',
        fontWeight: 700,
        color: '#F1F0F5',
        letterSpacing: '1px',
        marginBottom: '40px',
        textAlign: 'center'
      }}>
        Need Help or More Information?
      </h2>

      <div style={{
        width: '100%',
        maxWidth: '500px',
        background: '#12101A',
        border: '1px solid rgba(124, 58, 237, 0.3)',
        borderRadius: '12px',
        padding: '32px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
      }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor="name" style={{ color: '#9B99A8', fontSize: '12px', fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 'bold' }}>FULL NAME *</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your name..."
              style={{
                background: '#0D0B14',
                border: '1px solid rgba(124, 58, 237, 0.3)',
                borderRadius: '6px',
                padding: '12px',
                color: '#F1F0F5',
                fontSize: '14px',
                outline: 'none',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#7C3AED'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(124, 58, 237, 0.3)'}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor="email" style={{ color: '#9B99A8', fontSize: '12px', fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 'bold' }}>EMAIL ADDRESS *</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your@email.com"
              style={{
                background: '#0D0B14',
                border: '1px solid rgba(124, 58, 237, 0.3)',
                borderRadius: '6px',
                padding: '12px',
                color: '#F1F0F5',
                fontSize: '14px',
                outline: 'none',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#7C3AED'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(124, 58, 237, 0.3)'}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor="message" style={{ color: '#9B99A8', fontSize: '12px', fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 'bold' }}>MESSAGE *</label>
            <textarea 
              id="message" 
              name="message" 
              value={formData.message}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Write your message or question here..."
              style={{
                background: '#0D0B14',
                border: '1px solid rgba(124, 58, 237, 0.3)',
                borderRadius: '6px',
                padding: '12px',
                color: '#F1F0F5',
                fontSize: '14px',
                outline: 'none',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                resize: 'vertical',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#7C3AED'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(124, 58, 237, 0.3)'}
            />
          </div>

          <button 
            type="submit" 
            disabled={status === 'loading' || status === 'success'}
            style={{
              background: status === 'success' ? '#22C55E' : '#7C3AED',
              color: '#F1F0F5',
              border: 'none',
              padding: '16px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 'bold',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              cursor: (status === 'loading' || status === 'success') ? 'not-allowed' : 'pointer',
              marginTop: '10px',
              transition: 'all 0.3s',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {status === 'idle' && 'SEND MESSAGE'}
            {status === 'loading' && 'SENDING...'}
            {status === 'success' && (
              <>MESSAGE SENT</>
            )}
          </button>
          
          {status === 'success' && (
             <p style={{ textAlign: 'center', fontSize: '12px', color: '#22C55E', margin: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
               Thank you! Our admin team will respond via Email shortly.
             </p>
          )}
        </form>
      </div>
      <style>{`
        #contact input:focus-visible, #contact textarea:focus-visible {
          outline: 2px solid #A855F7 !important;
          outline-offset: 2px !important;
          box-shadow: 0 0 12px rgba(168, 85, 247, 0.3) !important;
        }
        #contact button:focus-visible {
          outline: 2px solid #A855F7;
          outline-offset: 2px;
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { transition: none !important; }
        }
      `}</style>
    </motion.section>
  );
}
