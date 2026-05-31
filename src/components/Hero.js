"use client";
import Image from "next/image";

export default function Hero() {
  return (
    <section
      id="beranda"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '120px 24px 60px',
        overflow: 'hidden',
        boxSizing: 'border-box'
      }}
    >
      {/* Animated Grid Lines Background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(168, 85, 247, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(168, 85, 247, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        zIndex: 0
      }} />

      {/* Radial glow behind logo */}
      <div style={{
        position: 'absolute',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, transparent 70%)',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -55%)',
        zIndex: 0,
        animation: 'heroGlow 4s ease-in-out infinite alternate'
      }} />

      {/* Logo Box with neon glow */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        width: '120px',
        height: '120px',
        background: 'white',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '32px',
        boxShadow: '0 0 60px rgba(168, 85, 247, 0.5), 0 0 120px rgba(168, 85, 247, 0.2), inset 0 0 20px rgba(168, 85, 247, 0.1)',
        animation: 'logoFloat 6s ease-in-out infinite'
      }}>
        <Image src="/logo.png" alt="PRIMELOG Logo" width={88} height={88} priority style={{ objectFit: 'contain' }} />
      </div>

      {/* Title */}
      <h1 style={{
        position: 'relative',
        zIndex: 2,
        fontFamily: 'var(--font-title)',
        fontSize: 'clamp(36px, 6vw, 56px)',
        fontWeight: 400,
        color: 'white',
        letterSpacing: '6px',
        marginBottom: '12px',
        textAlign: 'center',
        textShadow: '0 0 40px rgba(168, 85, 247, 0.3)'
      }}>
        PRIMELOG
      </h1>

      {/* Subtitle */}
      <p style={{
        position: 'relative',
        zIndex: 2,
        fontFamily: 'var(--font-body)',
        fontSize: 'clamp(14px, 2.5vw, 20px)',
        color: '#C084FC',
        letterSpacing: '3px',
        marginBottom: '8px',
        textAlign: 'center',
        fontWeight: 500
      }}>
        FLEET COMMAND SYSTEM
      </p>

      {/* Tagline */}
      <p style={{
        position: 'relative',
        zIndex: 2,
        fontFamily: 'var(--font-body)',
        fontSize: 'clamp(11px, 1.5vw, 14px)',
        color: '#8B7BA8',
        letterSpacing: '1px',
        marginBottom: '40px',
        textAlign: 'center',
        maxWidth: '480px',
        lineHeight: '1.6'
      }}>
        Platform terpadu untuk monitoring, manajemen, dan optimalisasi operasional armada kapal secara real-time
      </p>

      {/* Gradient Divider */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        width: '160px',
        height: '3px',
        background: 'linear-gradient(90deg, transparent 0%, #A855F7 50%, transparent 100%)',
        marginBottom: '40px',
        borderRadius: '2px',
        boxShadow: '0 0 15px rgba(168, 85, 247, 0.4)'
      }} />

      {/* CTA Buttons */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <a href="/login" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          background: 'linear-gradient(135deg, #A855F7 0%, #7C3AED 100%)',
          color: 'white',
          padding: '14px 36px',
          borderRadius: '8px',
          textDecoration: 'none',
          fontFamily: 'var(--font-body)',
          fontSize: '13px',
          fontWeight: 'bold',
          letterSpacing: '1.5px',
          boxShadow: '0 0 30px rgba(168, 85, 247, 0.4), 0 4px 20px rgba(0,0,0,0.4)',
          transition: 'all 0.3s ease'
        }}>
          MASUK SISTEM
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>

        <a href="/tracking" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          background: 'transparent',
          color: '#C084FC',
          padding: '14px 36px',
          borderRadius: '8px',
          textDecoration: 'none',
          fontFamily: 'var(--font-body)',
          fontSize: '13px',
          fontWeight: 'bold',
          letterSpacing: '1.5px',
          border: '1px solid rgba(168, 85, 247, 0.4)',
          transition: 'all 0.3s ease'
        }}>
          LACAK PAKET
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </a>
      </div>

      {/* Floating Stats Bar */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        gap: '32px',
        marginTop: '60px',
        padding: '20px 40px',
        background: 'rgba(20, 10, 36, 0.6)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(168, 85, 247, 0.2)',
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        {[
          { value: '24/7', label: 'MONITORING' },
          { value: '14+', label: 'PELABUHAN' },
          { value: '99.9%', label: 'UPTIME' },
          { value: 'AES-256', label: 'ENKRIPSI' }
        ].map((stat) => (
          <div key={stat.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '18px', fontWeight: 'bold', color: '#C084FC', letterSpacing: '1px' }}>{stat.value}</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '9px', color: '#8B7BA8', letterSpacing: '1px' }}>{stat.label}</span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes heroGlow {
          from { opacity: 0.6; transform: translate(-50%, -55%) scale(0.95); }
          to { opacity: 1; transform: translate(-50%, -55%) scale(1.05); }
        }
        @keyframes logoFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </section>
  );
}
