export default function About() {
  return (
    <section id="tentang" style={{
      padding: '80px 32px',
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
        marginBottom: '32px'
      }}>
        <h2 style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: '28px',
          fontWeight: 700,
          color: '#F1F0F5',
          letterSpacing: '1px',
          margin: 0
        }}>
          Tentang Sistem
        </h2>
      </div>

      <p style={{
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: '16px',
        color: '#9B99A8',
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
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: '16px',
        color: '#9B99A8',
        lineHeight: '1.8',
        margin: 0
      }}>
        Dengan teknologi monitoring canggih dan analitik prediktif, kami membantu
        perusahaan maritim meningkatkan efisiensi operasional, mengurangi biaya,
        dan memastikan keselamatan armada di seluruh dunia.
      </p>
    </section>
  );
}
