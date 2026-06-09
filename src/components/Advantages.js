export default function Advantages() {
  const items = [
    { text: 'Monitoring 24/7 untuk seluruh armada', icon: '🔄' },
    { text: 'Dashboard interaktif dengan data real-time', icon: '📡' },
    { text: 'Sistem peringatan otomatis untuk anomali', icon: '🚨' },
    { text: 'Laporan komprehensif dan analitik mendalam', icon: '📋' },
    { text: 'Integrasi dengan sistem navigasi kapal', icon: '🧭' },
    { text: 'Keamanan data tingkat enterprise', icon: '🔐' }
  ];

  return (
    <section id="keunggulan" style={{
      padding: '80px 24px',
      background: '#12101A',
      borderLeft: '3px solid #7C3AED',
      margin: '40px 0',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Section Label */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '40px'
      }}>
        <h2 style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: '24px',
          fontWeight: 700,
          color: '#F1F0F5',
          letterSpacing: '1px',
          margin: 0
        }}>
          KEUNGGULAN UTAMA
        </h2>
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '14px'
      }}>
        {items.map((item, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '16px',
            background: 'rgba(124, 58, 237, 0.05)',
            border: '1px solid rgba(124, 58, 237, 0.1)',
            borderRadius: '8px',
            transition: 'all 0.2s ease'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              background: 'rgba(124, 58, 237, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              flexShrink: 0
            }}>
              {item.icon}
            </div>
            <span style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: '14px',
              color: '#9B99A8',
              lineHeight: '1.5'
            }}>
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
