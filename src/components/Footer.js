"use client";

export default function Footer() {
  return (
    <footer style={{
      width: '100%',
      padding: '48px 24px 32px',
      borderTop: '1px solid rgba(168,85,247,0.08)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px'
    }}>
      <span style={{
        fontFamily: 'var(--font-body)',
        fontSize: '12px',
        fontWeight: 600,
        color: 'rgba(241,240,245,0.4)',
        letterSpacing: '2px'
      }}>
        PRIMELOG
      </span>
      <span style={{
        fontFamily: 'var(--font-body)',
        fontSize: '11px',
        color: 'rgba(241,240,245,0.2)',
        letterSpacing: '0.5px'
      }}>
        &copy; 2026 PrimeLog. All systems operational.
      </span>
    </footer>
  );
}
