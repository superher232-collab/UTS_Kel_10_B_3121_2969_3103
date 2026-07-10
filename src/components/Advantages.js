"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Clock, Monitor, Bell, FileText, NavigationArrow, Lock } from "@phosphor-icons/react";

export default function Advantages() {
  const sectionRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(sectionRef.current.querySelectorAll('.advantage-card'),
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0,
          duration: 0.6, stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%" }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const items = [
    { text: 'Pemantauan 24/7 untuk seluruh armada', icon: <Clock size={18} weight="duotone" color="var(--accent)" /> },
    { text: 'Dashboard interaktif dengan data real-time', icon: <Monitor size={18} weight="duotone" color="var(--accent)" /> },
    { text: 'Sistem alarm otomatis untuk anomali', icon: <Bell size={18} weight="duotone" color="var(--accent)" /> },
    { text: 'Laporan lengkap dan analisis mendalam', icon: <FileText size={18} weight="duotone" color="var(--accent)" /> },
    { text: 'Integrasi dengan sistem navigasi kapal', icon: <NavigationArrow size={18} weight="duotone" color="var(--accent)" /> },
    { text: 'Keamanan data kelas enterprise', icon: <Lock size={18} weight="duotone" color="var(--accent)" /> }
  ];

  return (
    <section
      id="advantages"
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
          Mengapa PRIMELOG
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
          Keunggulan Utama
        </h2>
      </div>

      {/* 3-col grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px'
      }}>
        {items.map((item, i) => (
          <div key={i} className="advantage-card" style={{
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
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '14px',
              height: '100%',
              boxSizing: 'border-box'
            }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '11px',
                background: 'var(--accent-dim)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {item.icon}
              </div>
              <span style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-base)',
                color: 'var(--text-secondary)',
                lineHeight: '1.5'
              }}>
                {item.text}
              </span>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          #advantages > div:last-child { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          #advantages > div:last-child { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}
