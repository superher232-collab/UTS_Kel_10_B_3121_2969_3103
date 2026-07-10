"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { href: '#about', label: 'Tentang' },
    { href: '#features', label: 'Fitur' },
    { href: '#advantages', label: 'Keunggulan' },
    { href: '#contact', label: 'Kontak' },
  ];

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        width: 'auto',
        maxWidth: '90vw',
        background: scrolled ? 'rgba(6,6,8,0.92)' : 'rgba(6,6,8,0.75)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid var(--border)',
        borderRadius: '100px',
        padding: '8px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        boxShadow: scrolled
          ? '0 8px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)'
          : '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
        transition: 'background 0.4s ease, box-shadow 0.4s ease'
      }}>
        {/* Logo */}
        <a href="#home" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          textDecoration: 'none',
          padding: '4px 12px 4px 4px'
        }}>
          <div style={{
            width: '28px',
            height: '28px',
            background: 'white',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            flexShrink: 0
          }}>
            <Image src="/logo.png" alt="PRIMELOG" width={20} height={20} style={{ objectFit: 'contain' }} />
          </div>
          <span style={{
            fontWeight: 700,
            color: 'var(--text-primary)',
            fontSize: '13px',
            letterSpacing: '1px'
          }}>
            PRIMELOG
          </span>
        </a>

        {/* Desktop links */}
        <div style={{ display: 'flex', gap: '2px' }} className="nav-desktop-links">
          {links.map((link) => (
            <a key={link.href} href={link.href} style={{
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              padding: '8px 16px',
              borderRadius: '100px',
              transition: 'all 0.3s var(--ease)',
              letterSpacing: '0.5px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--accent-dim)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent'; }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-secondary)'
          }}
          className="nav-mobile-toggle"
          aria-label="Toggle menu"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {mobileOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </>
            )}
          </svg>
        </button>

        {/* CTA */}
        <a href="/login" style={{
          background: 'var(--accent)',
          color: '#060608',
          fontFamily: 'var(--font-body)',
          fontSize: '13px',
          fontWeight: 600,
          padding: '8px 20px',
          borderRadius: '100px',
          textDecoration: 'none',
          transition: 'all 0.3s var(--ease)',
          whiteSpace: 'nowrap'
        }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 20px var(--accent-glow)'; e.currentTarget.style.transform = 'scale(1.04)'; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'scale(1)'; }}
        >
          Masuk
        </a>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9998,
          background: 'rgba(6,6,8,0.95)',
          backdropFilter: 'blur(32px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px'
        }}>
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              style={{
                color: 'var(--text-primary)',
                textDecoration: 'none',
                fontSize: '20px',
                fontFamily: 'var(--font-body)',
                letterSpacing: '1px'
              }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="/login"
            onClick={() => setMobileOpen(false)}
            style={{
              background: 'var(--accent)',
              color: '#060608',
              fontWeight: 600,
              padding: '12px 24px',
              borderRadius: '100px',
              textDecoration: 'none',
              fontSize: '14px',
              marginTop: '16px'
            }}
          >
            Masuk
          </a>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop-links { display: none !important; }
          .nav-mobile-toggle { display: flex !important; }
        }
      `}</style>
    </>
  );
}
