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
      padding: '40px',
      background: 'rgba(20, 10, 36, 0.6)',
      backdropFilter: 'blur(8px)',
      border: '1px solid rgba(168, 85, 247, 0.2)',
      borderRadius: '16px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.4), 0 0 20px rgba(168, 85, 247, 0.08)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Section Label */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '28px'
      }}>
        <div style={{
          width: '4px',
          height: '24px',
          background: 'linear-gradient(180deg, #22C55E 0%, #16A34A 100%)',
          borderRadius: '2px',
          boxShadow: '0 0 10px rgba(34, 197, 94, 0.4)'
        }} />
        <h2 style={{
          fontFamily: 'var(--font-body)',
          fontSize: '18px',
          fontWeight: 600,
          color: 'white',
          letterSpacing: '1.5px',
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
            gap: '14px',
            padding: '14px 16px',
            background: 'rgba(34, 197, 94, 0.04)',
            border: '1px solid rgba(34, 197, 94, 0.1)',
            borderRadius: '8px',
            transition: 'all 0.2s ease'
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              flexShrink: 0
            }}>
              {item.icon}
            </div>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              color: '#C7B8EA',
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
