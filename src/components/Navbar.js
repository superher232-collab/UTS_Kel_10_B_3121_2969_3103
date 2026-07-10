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
    { href: '#about', label: 'About' },
    { href: '#features', label: 'Features' },
    { href: '#advantages', label: 'Advantages' },
    { href: '#testimonials', label: 'Testimonials' },
  ];

  return (
    <>
      <nav className="island-nav" style={{
        background: scrolled ? 'rgba(12, 12, 20, 0.92)' : 'rgba(12, 12, 20, 0.75)',
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
            color: '#F1F0F5',
            fontSize: '13px',
            letterSpacing: '1.5px'
          }}>
            PRIMELOG
          </span>
        </a>

        {/* Desktop links */}
        <div style={{ display: 'flex', gap: '2px' }} className="nav-desktop-links">
          {links.map((link) => (
            <a key={link.href} href={link.href}>
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
            color: 'rgba(241,240,245,0.6)'
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
        <a href="/login" className="nav-cta" style={{ textDecoration: 'none' }}>
          Sign In
        </a>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9998,
          background: 'rgba(5,5,5,0.95)',
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
                color: '#F1F0F5',
                textDecoration: 'none',
                fontSize: '20px',
                fontFamily: 'var(--font-body)',
                letterSpacing: '2px'
              }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="/login"
            onClick={() => setMobileOpen(false)}
            className="btn-inner"
            style={{ marginTop: '16px' }}
          >
            Sign In
            <span className="icon-wrap">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
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
