"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function About() {
  const sectionRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(sectionRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%" }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      style={{
        padding: 'clamp(64px, 8vw, 100px) 24px',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      <div style={{
        display: 'grid',
        gridTemplateColumns: '0.8fr 1.2fr',
        gap: '64px',
        alignItems: 'center'
      }}>
        {/* Left — label + description */}
        <div>
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-xs)',
            color: 'var(--accent)',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '16px',
            fontWeight: 600
          }}>
            Tentang PRIMELOG
          </span>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(28px, 3.5vw, 40px)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.03em',
            lineHeight: '1.1',
            margin: '0 0 20px 0'
          }}>
            Platform Komando Armada<br />
            <span style={{ color: 'var(--text-secondary)' }}>Generasi Terbaru</span>
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-base)',
            color: 'var(--text-secondary)',
            lineHeight: '1.7',
            margin: 0
          }}>
            PRIMELOG memberikan visibilitas penuh ke setiap aspek operasional — mulai dari pelacakan posisi, manajemen kargo, hingga pemeliharaan prediktif armada.
          </p>
        </div>

        {/* Right — stats / highlights */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { stat: 'Real-time', desc: 'Pelacakan posisi kapal dengan interval update 30 detik' },
            { stat: 'Prediktif', desc: 'AI untuk deteksi anomali dan pemeliharaan armada' },
            { stat: 'End-to-End', desc: 'Visibilitas kargo dari pelabuhan asal hingga tujuan' }
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex',
              gap: '16px',
              padding: '16px 20px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              transition: 'all 0.3s var(--ease)'
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-focus)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,229,255,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                color: 'var(--accent)',
                whiteSpace: 'nowrap',
                minWidth: '80px'
              }}>
                {item.stat}
              </div>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-base)',
                color: 'var(--text-secondary)',
                lineHeight: '1.5'
              }}>
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #about > div { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
    </section>
  );
}
