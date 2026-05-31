"use client";
import { useState } from "react";
import Image from "next/image";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);

  const links = [
    { href: '#tentang', label: 'Tentang' },
    { href: '#fitur', label: 'Fitur' },
    { href: '#keunggulan', label: 'Keunggulan' },
    { href: '/tracking', label: 'Tracking' }
  ];

  return (
    <nav
      style={{
        width: '100%',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
        background: 'rgba(7, 2, 14, 0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(168, 85, 247, 0.15)',
        margin: 0,
        padding: 0,
        transition: 'all 0.3s ease'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 32px',
          height: '72px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxSizing: 'border-box'
        }}
      >
        {/* SISI KIRI: LOGO */}
        <a href="#beranda" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'white',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(168, 85, 247, 0.3)',
            overflow: 'hidden',
            flexShrink: 0
          }}>
            <Image src="/logo.png" alt="Logo" width={32} height={32} style={{ objectFit: 'contain' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 700,
              color: 'white',
              fontSize: '15px',
              letterSpacing: '2px'
            }}>
              PRIMELOG
            </span>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '9px',
              color: '#A855F7',
              letterSpacing: '1px',
              fontWeight: 'bold'
            }}>
              FLEET COMMAND SYSTEM
            </span>
          </div>
        </a>

        {/* SISI KANAN: NAVIGASI */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ul className={`navbar-nav ${mobileOpen ? 'open' : ''}`}>
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onMouseEnter={() => setHoveredLink(link.href)}
                  onMouseLeave={() => setHoveredLink(null)}
                  style={{
                    color: hoveredLink === link.href ? '#C084FC' : '#8B7BA8',
                    textDecoration: 'none',
                    fontSize: '12px',
                    fontWeight: 600,
                    letterSpacing: '1px',
                    fontFamily: 'var(--font-body)',
                    transition: 'color 0.3s ease',
                    textTransform: 'uppercase',
                    position: 'relative'
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a href="/login" style={{
                padding: '10px 24px',
                background: 'linear-gradient(135deg, #A855F7 0%, #7C3AED 100%)',
                borderRadius: '6px',
                color: 'white',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '11px',
                letterSpacing: '1.5px',
                fontFamily: 'var(--font-body)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 0 20px rgba(168, 85, 247, 0.3)',
                transition: 'all 0.3s ease'
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
                MASUK
              </a>
            </li>
          </ul>

          {/* Hamburger Menu Toggle */}
          <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle Menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {mobileOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </>
              )}
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}