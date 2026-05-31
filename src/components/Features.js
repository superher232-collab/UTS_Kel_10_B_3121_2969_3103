"use client";

export default function Features() {
  const features = [
    {
      color: '#22C55E',
      glowColor: 'rgba(34, 197, 94, 0.15)',
      borderColor: 'rgba(34, 197, 94, 0.25)',
      title: 'Pelacakan Real-Time',
      desc: 'Monitor posisi dan rute kapal secara langsung dengan akurasi tinggi di seluruh perairan Indonesia',
      icon: '🛰️'
    },
    {
      color: '#F59E0B',
      glowColor: 'rgba(245, 158, 11, 0.15)',
      borderColor: 'rgba(245, 158, 11, 0.25)',
      title: 'Monitoring Bahan Bakar',
      desc: 'Pantau konsumsi armada untuk mengoptimalkan efisiensi dan mengurangi biaya operasional',
      icon: '⛽'
    },
    {
      color: '#3B82F6',
      glowColor: 'rgba(59, 130, 246, 0.15)',
      borderColor: 'rgba(59, 130, 246, 0.25)',
      title: 'Performa Kapal',
      desc: 'Pantau metrik kesehatan mesin dan performa teknis setiap armada kapal secara menyeluruh',
      icon: '⚙️'
    },
    {
      color: '#A855F7',
      glowColor: 'rgba(168, 85, 247, 0.15)',
      borderColor: 'rgba(168, 85, 247, 0.25)',
      title: 'Grafik Efisiensi',
      desc: 'Visualisasi data efisiensi operasional untuk mendukung keputusan strategis manajemen',
      icon: '📊'
    }
  ];

  return (
    <section
      id="fitur"
      style={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        boxSizing: 'border-box'
      }}
    >
      {features.map((f, i) => (
        <div
          key={i}
          style={{
            background: 'rgba(20, 10, 36, 0.6)',
            backdropFilter: 'blur(8px)',
            padding: '28px',
            borderRadius: '12px',
            border: `1px solid ${f.borderColor}`,
            transition: 'all 0.3s ease',
            cursor: 'default',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: `0 4px 20px rgba(0,0,0,0.3), 0 0 15px ${f.glowColor}`
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = `0 8px 30px rgba(0,0,0,0.4), 0 0 25px ${f.glowColor}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = `0 4px 20px rgba(0,0,0,0.3), 0 0 15px ${f.glowColor}`;
          }}
        >
          {/* Subtle top border glow */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '20%',
            right: '20%',
            height: '2px',
            background: `linear-gradient(90deg, transparent, ${f.color}, transparent)`,
            opacity: 0.5,
            borderRadius: '0 0 2px 2px'
          }} />

          {/* Icon */}
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '10px',
            background: f.glowColor,
            border: `1px solid ${f.borderColor}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
            marginBottom: '18px'
          }}>
            {f.icon}
          </div>

          {/* Title */}
          <h3 style={{
            fontFamily: 'var(--font-title)',
            color: 'white',
            fontSize: '16px',
            marginBottom: '10px',
            letterSpacing: '0.5px'
          }}>
            {f.title}
          </h3>

          {/* Description */}
          <p style={{
            fontFamily: 'var(--font-body)',
            color: '#8B7BA8',
            fontSize: '12px',
            lineHeight: '1.7',
            margin: 0
          }}>
            {f.desc}
          </p>
        </div>
      ))}
    </section>
  );
}