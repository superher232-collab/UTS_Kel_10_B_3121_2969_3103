"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Compass, Drop, Gauge, ChartBar } from "@phosphor-icons/react";

export default function Features() {
  const sectionRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(sectionRef.current.querySelectorAll('.feature-card'),
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0,
          duration: 0.8, stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%" }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const features = [
    {
      icon: <Compass size={22} weight="duotone" color="var(--accent)" />,
      title: 'Pelacakan Real-Time',
      desc: 'Pantau posisi dan rute seluruh armada kapal secara langsung.'
    },
    {
      icon: <Drop size={22} weight="duotone" color="var(--accent)" />,
      title: 'Monitoring Bahan Bakar',
      desc: 'Efisiensi konsumsi BBM untuk optimasi biaya operasional.'
    },
    {
      icon: <Gauge size={22} weight="duotone" color="var(--accent)" />,
      title: 'Performa Kapal',
      desc: 'Status mesin dan kesehatan teknis setiap armada.'
    },
    {
      icon: <ChartBar size={22} weight="duotone" color="var(--accent)" />,
      title: 'Analitik Efisiensi',
      desc: 'Visualisasi data operasional untuk pengambilan keputusan.'
    }
  ];

  return (
    <section
      id="features"
      ref={sectionRef}
      style={{
        padding: 'clamp(64px, 8vw, 100px) 24px',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      {/* Section header */}
      <div style={{ marginBottom: '48px', maxWidth: '600px' }}>
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-xs)',
          color: 'var(--accent)',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          display: 'block',
          marginBottom: '12px',
          fontWeight: 600
        }}>
          Fitur Platform
        </span>
        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(28px, 4vw, 40px)',
          fontWeight: 700,
          color: 'var(--text-primary)',
          letterSpacing: '-0.03em',
          lineHeight: '1.1',
          margin: 0
        }}>
          Yang Anda butuhkan untuk<br />
          <span style={{ color: 'var(--text-secondary)' }}>mengelola armada</span>
        </h2>
      </div>

      {/* Grid: 1 large + 3 small */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridTemplateRows: 'auto auto',
        gap: '12px'
      }}>
        {features.map((f, i) => (
          <div key={i} className="feature-card" style={{
            gridColumn: i === 0 ? 'span 2' : 'span 1',
            gridRow: i === 0 ? 'span 2' : 'span 1',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            transition: 'all 0.3s var(--ease)',
            cursor: 'default'
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-focus)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,229,255,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div style={{
              padding: i === 0 ? '32px' : '24px',
              display: 'flex',
              flexDirection: i === 0 ? 'column' : 'row',
              alignItems: i === 0 ? 'flex-start' : 'center',
              gap: i === 0 ? '16px' : '14px',
              height: '100%',
              boxSizing: 'border-box'
            }}>
              <div style={{
                width: i === 0 ? '52px' : '40px',
                height: i === 0 ? '52px' : '40px',
                borderRadius: '12px',
                background: 'var(--accent-dim)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {f.icon}
              </div>
              <div>
                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: i === 0 ? '18px' : '15px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  margin: '0 0 6px 0'
                }}>
                  {f.title}
                </h3>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-base)',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  {f.desc}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          #features > div:last-child {
            grid-template-columns: 1fr !important;
          }
          #features > div:last-child > div {
            grid-column: span 1 !important;
            grid-row: span 1 !important;
          }
        }
      `}</style>
    </section>
  );
}
