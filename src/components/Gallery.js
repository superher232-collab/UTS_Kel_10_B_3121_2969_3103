"use client";
import Image from "next/image";

export default function Gallery() {
  const items = [
    { src: '/ship1.png', label: 'OPERASIONAL MARITIM', desc: 'Pengawasan armada aktif' },
    { src: '/ship2.png', label: 'MANAJEMEN ARMADA', desc: 'Koordinasi antar kapal' },
    { src: '/ship3.png', label: 'JANGKAUAN GLOBAL', desc: 'Rute lintas perairan' },
    { src: '/ship4.png', label: 'LOGISTIK KARGO', desc: 'Distribusi multi-moda' },
    { src: '/ship5.png', label: 'PELABUHAN STRATEGIS', desc: 'Titik transit utama' }
  ];

  return (
    <section style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    }}>
      {/* Section Label */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          width: '4px',
          height: '24px',
          background: 'linear-gradient(180deg, #06B6D4 0%, #0891B2 100%)',
          borderRadius: '2px',
          boxShadow: '0 0 10px rgba(6, 182, 212, 0.4)'
        }} />
        <h2 style={{
          fontFamily: 'var(--font-body)',
          fontSize: '18px',
          fontWeight: 600,
          color: 'white',
          letterSpacing: '1.5px',
          margin: 0
        }}>
          GALERI ARMADA
        </h2>
      </div>

      {/* Gallery Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px'
      }}>
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              position: 'relative',
              height: '200px',
              overflow: 'hidden',
              borderRadius: '10px',
              border: '1px solid rgba(168, 85, 247, 0.15)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.4)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.5), 0 0 15px rgba(168, 85, 247, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.15)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
            }}
          >
            <Image
              src={item.src}
              alt={item.label}
              width={400}
              height={250}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.5s ease'
              }}
            />

            {/* Gradient overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(0deg, rgba(7, 2, 14, 0.9) 0%, rgba(7, 2, 14, 0.3) 40%, transparent 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: '16px'
            }}>
              <span style={{
                fontFamily: 'var(--font-body)',
                fontSize: '11px',
                fontWeight: 'bold',
                color: 'white',
                letterSpacing: '1px'
              }}>
                {item.label}
              </span>
              <span style={{
                fontFamily: 'var(--font-body)',
                fontSize: '9px',
                color: '#8B7BA8',
                marginTop: '2px'
              }}>
                {item.desc}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
