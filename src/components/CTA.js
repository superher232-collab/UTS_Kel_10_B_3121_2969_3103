export default function CTA() {
  return (
    <section id="masuk" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      padding: '60px 24px',
      position: 'relative'
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(168, 85, 247, 0.08) 0%, transparent 70%)',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none'
      }} />

      <h3 style={{
        fontFamily: 'var(--font-body)',
        fontSize: '14px',
        fontWeight: 600,
        color: '#8B7BA8',
        letterSpacing: '3px',
        marginBottom: '12px',
        position: 'relative',
        zIndex: 1
      }}>
        SIAP UNTUK MEMULAI?
      </h3>

      <h2 style={{
        fontFamily: 'var(--font-title)',
        fontSize: 'clamp(20px, 4vw, 28px)',
        color: 'white',
        letterSpacing: '1px',
        marginBottom: '16px',
        position: 'relative',
        zIndex: 1
      }}>
        Kelola Armada Anda Sekarang
      </h2>

      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '12px',
        color: '#8B7BA8',
        lineHeight: '1.6',
        maxWidth: '400px',
        marginBottom: '32px',
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
        <a href="/login" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          background: 'linear-gradient(135deg, #A855F7 0%, #7C3AED 100%)',
          boxShadow: '0 0 30px rgba(168, 85, 247, 0.4)',
          color: 'white',
          fontFamily: 'var(--font-body)',
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
          color: '#C084FC',
          fontFamily: 'var(--font-body)',
          fontSize: '14px',
          fontWeight: 'bold',
          letterSpacing: '1.5px',
          padding: '16px 40px',
          border: '1px solid rgba(168, 85, 247, 0.4)',
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
        fontFamily: 'var(--font-body)',
        fontSize: '10px',
        color: '#8B7BA8',
        marginTop: '20px',
        letterSpacing: '0.5px',
        position: 'relative',
        zIndex: 1
      }}>
        🔐 Akses terenkripsi AES-256 · Autentikasi multi-faktor
      </p>
    </section>
  );
}
