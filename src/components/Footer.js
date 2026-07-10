"use client";

export default function Footer() {
  return (
    <footer style={{
      width: '100%',
      padding: '48px 24px 32px',
      borderTop: '1px solid var(--border)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '24px'
    }}>
      <div style={{ display: 'flex', gap: '24px' }}>
        <a href="#about" style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', textDecoration: 'none', fontFamily: 'var(--font-body)', transition: 'color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
        >Tentang</a>
        <a href="#features" style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', textDecoration: 'none', fontFamily: 'var(--font-body)', transition: 'color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
        >Fitur</a>
        <a href="#contact" style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', textDecoration: 'none', fontFamily: 'var(--font-body)', transition: 'color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
        >Kontak</a>
      </div>
      <span style={{
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--text-xs)',
        color: 'var(--text-tertiary)'
      }}>
        &copy; 2026 PRIMELOG. All rights reserved.
      </span>
    </footer>
  );
}
