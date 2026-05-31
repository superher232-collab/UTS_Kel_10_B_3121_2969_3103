export default function Footer() {
  return (
    <footer style={{
      width: '100%',
      padding: '32px 24px',
      borderTop: '1px solid rgba(168, 85, 247, 0.1)',
      background: 'rgba(7, 2, 14, 0.9)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px'
    }}>
      <div style={{
        width: '80px',
        height: '2px',
        background: 'linear-gradient(90deg, transparent, #A855F7, transparent)',
        marginBottom: '4px',
        borderRadius: '1px'
      }} />

      <span style={{
        fontFamily: 'var(--font-body)',
        fontSize: '11px',
        color: '#8B7BA8',
        letterSpacing: '1px'
      }}>
        PRIMELOG · FLEET COMMAND SYSTEM
      </span>

      <span style={{
        fontFamily: 'var(--font-body)',
        fontSize: '10px',
        color: 'rgba(139, 123, 168, 0.6)',
        letterSpacing: '0.5px'
      }}>
        © 2026 PrimeLog. All systems operational.
      </span>
    </footer>
  );
}
