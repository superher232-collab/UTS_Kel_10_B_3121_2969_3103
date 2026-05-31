export default function About() {
  return (
    <section id="tentang" style={{
      padding: '40px',
      background: 'rgba(20, 10, 36, 0.6)',
      backdropFilter: 'blur(8px)',
      border: '1px solid rgba(168, 85, 247, 0.2)',
      borderRadius: '16px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.4), 0 0 20px rgba(168, 85, 247, 0.08)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative corner accent */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '80px',
        height: '80px',
        borderTop: '2px solid rgba(168, 85, 247, 0.3)',
        borderLeft: '2px solid rgba(168, 85, 247, 0.3)',
        borderRadius: '16px 0 0 0',
        pointerEvents: 'none'
      }} />

      {/* Section Label */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '20px'
      }}>
        <div style={{
          width: '4px',
          height: '24px',
          background: 'linear-gradient(180deg, #A855F7 0%, #7C3AED 100%)',
          borderRadius: '2px',
          boxShadow: '0 0 10px rgba(168, 85, 247, 0.4)'
        }} />
        <h2 style={{
          fontFamily: 'var(--font-title)',
          fontSize: '22px',
          color: 'white',
          letterSpacing: '1.5px',
          margin: 0
        }}>
          Tentang Sistem
        </h2>
      </div>

      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '14px',
        color: '#C7B8EA',
        lineHeight: '1.8',
        margin: '0 0 20px 0'
      }}>
        PrimeLog adalah platform terpadu yang dirancang untuk memantau,
        mengelola, dan mengoptimalkan operasional armada kapal secara real-time
        di seluruh perairan Indonesia. Sistem kami menyediakan visibilitas penuh terhadap
        seluruh aspek operasional, mulai dari pelacakan lokasi, manajemen kargo,
        hingga jadwal pemeliharaan.
      </p>
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '14px',
        color: '#C7B8EA',
        lineHeight: '1.8',
        margin: 0
      }}>
        Dengan teknologi monitoring canggih dan analitik prediktif, kami membantu
        perusahaan maritim meningkatkan efisiensi operasional, mengurangi biaya,
        dan memastikan keselamatan armada di seluruh dunia.
      </p>

      {/* Bottom decorative line */}
      <div style={{
        marginTop: '24px',
        height: '1px',
        background: 'linear-gradient(90deg, transparent 0%, rgba(168, 85, 247, 0.3) 50%, transparent 100%)'
      }} />
    </section>
  );
}
