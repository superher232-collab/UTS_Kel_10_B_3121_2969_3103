export default function Footer() {
  return (
    <footer style={{
      width: '100%',
      padding: '80px 24px 40px',
      borderTop: '1px solid rgba(124, 58, 237, 0.1)',
      background: '#0D0B14',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px'
    }}>
      <span style={{
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: '12px',
        fontWeight: 'bold',
        color: '#9B99A8',
        letterSpacing: '1px'
      }}>
        PRIMELOG · FLEET COMMAND SYSTEM
      </span>

      <span style={{
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: '11px',
        color: '#9B99A8',
        letterSpacing: '0.5px'
      }}>
        © 2026 PrimeLog. All systems operational.
      </span>
    </footer>
  );
}
