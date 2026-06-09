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
      gap: '32px',
      padding: '80px 24px',
      background: '#0D0B14'
    }}>
      {/* Section Label */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <h2 style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: '24px',
          fontWeight: 700,
          color: '#F1F0F5',
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
        gap: '32px'
      }}>
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              position: 'relative',
              height: '200px',
              overflow: 'hidden',
              borderRadius: '8px',
              border: '1px solid rgba(124, 58, 237, 0.2)',
              borderLeft: '3px solid #7C3AED',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              background: '#12101A'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.4)';
              e.currentTarget.style.borderLeft = '3px solid #7C3AED';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.2)';
              e.currentTarget.style.borderLeft = '3px solid #7C3AED';
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
              background: 'linear-gradient(0deg, rgba(13, 11, 20, 0.95) 0%, rgba(13, 11, 20, 0.4) 50%, transparent 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: '20px'
            }}>
              <span style={{
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#F1F0F5',
                letterSpacing: '1px'
              }}>
                {item.label}
              </span>
              <span style={{
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontSize: '11px',
                color: '#9B99A8',
                marginTop: '4px'
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
