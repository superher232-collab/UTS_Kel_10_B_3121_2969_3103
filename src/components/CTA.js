"use client";
import { motion } from "framer-motion";

export default function CTA() {
  return (
    <motion.section
      id="masuk"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '80px 24px',
        position: 'relative',
        background: '#12101A',
        borderLeft: '3px solid #7C3AED',
        margin: '40px 0'
      }}
    >
      <h3 style={{
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: '14px',
        fontWeight: 600,
        color: '#9B99A8',
        letterSpacing: '3px',
        marginBottom: '12px',
        position: 'relative',
        zIndex: 1
      }}>
        SIAP UNTUK MEMULAI?
      </h3>

      <h2 style={{
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: 'clamp(24px, 4vw, 36px)',
        fontWeight: 700,
        color: '#F1F0F5',
        letterSpacing: '1px',
        marginBottom: '16px',
        position: 'relative',
        zIndex: 1
      }}>
        Kelola Armada Anda Sekarang
      </h2>

      <p style={{
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: '15px',
        color: '#9B99A8',
        lineHeight: '1.6',
        maxWidth: '480px',
        marginBottom: '40px',
        position: 'relative',
        zIndex: 1
      }}>
        Akses dashboard komando untuk monitoring real-time, manajemen kargo, dan analitik performa armada
      </p>

      <div style={{
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        <a href="/login" className="btn-cta-primary" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          background: '#7C3AED',
          color: '#F1F0F5',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: '14px',
          fontWeight: 'bold',
          letterSpacing: '1.5px',
          padding: '16px 40px',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          textDecoration: 'none',
          transition: 'all 0.3s ease'
        }}>
          MASUK KE SISTEM
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>

        <a href="/tracking" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          background: 'transparent',
          color: '#F1F0F5',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: '14px',
          fontWeight: 'bold',
          letterSpacing: '1.5px',
          padding: '16px 40px',
          border: '1px solid #7C3AED',
          borderRadius: '8px',
          cursor: 'pointer',
          textDecoration: 'none',
          transition: 'all 0.3s ease'
        }}>
          LACAK PAKET
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </a>
      </div>

      <p style={{
        fontFamily: '"Roboto Mono", monospace',
        fontSize: '12px',
        color: '#9B99A8',
        marginTop: '24px',
        letterSpacing: '0.5px',
        position: 'relative',
        zIndex: 1
      }}>
        🔐 Akses terenkripsi AES-256 · Autentikasi multi-faktor
      </p>

      <style>{`
        .btn-cta-primary:hover {
          background: #A855F7 !important;
          box-shadow: 0 0 20px rgba(168, 85, 247, 0.6) !important;
        }
      `}</style>
    </motion.section>
  );
}
