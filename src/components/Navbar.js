"use client";
import { useState } from "react";
import Image from "next/image";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav 
      style={{ 
        width: '100%', 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        zIndex: 9999, // Sangat tinggi supaya tidak tertutup apapun
        background: 'rgba(10, 10, 10, 0.9)', 
        backdropFilter: 'blur(15px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        margin: 0,
        padding: 0
      }}
    >
      <div 
        style={{ 
          width: '100%', 
          padding: '0 40px', 
          height: '80px',
          display: 'flex', 
          flexDirection: 'row', // Paksa baris
          justifyContent: 'space-between', // Paksa Logo kiri, Menu kanan
          alignItems: 'center',
          boxSizing: 'border-box'
        }}
      >
        {/* SISI KIRI: LOGO */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Image src="/logo.png" alt="Logo" width={40} height={40} style={{ flexShrink: 0 }} />
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
            <span style={{ fontWeight: '800', color: 'white', fontSize: '1.1rem', letterSpacing: '1px' }}>
              PRIMELOG
            </span>
            <span style={{ fontSize: '0.65rem', color: '#a855f7', textTransform: 'uppercase' }}>
              Fleet Command System
            </span>
          </div>
        </div>

        {/* SISI KANAN: NAVIGASI */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ul className={`navbar-nav ${mobileOpen ? 'open' : ''}`}>
            <li><a href="#tentang" style={{ color: '#ccc', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>Tentang</a></li>
            <li><a href="#fitur" style={{ color: '#ccc', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>Fitur</a></li>
            <li><a href="#keunggulan" style={{ color: '#ccc', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>Keunggulan</a></li>
            <li>
              <a href="/login" style={{ 
                padding: '12px 24px', 
                background: 'linear-gradient(135deg, #6d28d9 0%, #9333ea 100%)', 
                borderRadius: '6px',
                color: 'white',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '0.85rem',
                display: 'inline-block',
                boxShadow: '0 4px 15px rgba(126, 34, 206, 0.3)'
              }}>
                MASUK SISTEM
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