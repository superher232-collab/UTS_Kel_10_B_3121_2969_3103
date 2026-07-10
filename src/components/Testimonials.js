"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Quotes } from "@phosphor-icons/react";

export default function Testimonials() {
  const sectionRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(sectionRef.current.querySelectorAll('.testimonial-card'),
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0,
          duration: 0.7, stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%" }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const testimonials = [
    {
      quote: "PRIMELOG mengubah operasi armada kami. Visibilitas real-time terhadap performa kapal mengurangi biaya BBM sebesar 23% di kuartal pertama.",
      author: "Capt. Agus Wijaya",
      role: "Direktur Operasi Armada",
      company: "Merchant Marine Corp"
    },
    {
      quote: "Fitur pemeliharaan prediktif menyelamatkan kami dari tiga kegagalan mesin kritis. Sistem ini sangat penting untuk logistik maritim modern.",
      author: "Dr. Sarah Chen",
      role: "Chief Technology Officer",
      company: "Pacific Cargo Lines"
    },
    {
      quote: "Integrasi dengan sistem navigasi kami berjalan mulus. Dashboard analitik memberikan wawasan yang belum pernah kami miliki sebelumnya.",
      author: "Hendra Pratama",
      role: "Kepala Logistik Maritim",
      company: "Nusantara Shipping Group"
    }
  ];

  return (
    <section
      id="testimonials"
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
      <div style={{ marginBottom: '40px', maxWidth: '600px' }}>
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
          Testimoni
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
          Apa Kata Klien Kami
        </h2>
      </div>

      {/* Grid: 1 large + 2 small */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.5fr 1fr',
        gridTemplateRows: 'auto auto',
        gap: '12px'
      }}>
        {testimonials.map((t, i) => (
          <div key={i} className="testimonial-card" style={{
            gridColumn: i === 0 ? 'span 1' : 'span 1',
            gridRow: i === 0 ? 'span 2' : 'span 1',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            transition: 'all 0.3s var(--ease)'
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-focus)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
          >
            <div style={{
              padding: i === 0 ? '36px' : '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: i === 0 ? '20px' : '12px',
              height: '100%',
              boxSizing: 'border-box'
            }}>
              <Quotes size={i === 0 ? 28 : 20} weight="duotone" color="var(--accent)" style={{ opacity: 0.4 }} />
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: i === 0 ? 'var(--text-base)' : 'var(--text-sm)',
                color: 'var(--text-secondary)',
                lineHeight: '1.7',
                margin: 0,
                fontStyle: 'italic'
              }}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <div style={{ marginTop: 'auto' }}>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  margin: '0 0 2px 0'
                }}>
                  {t.author}
                </p>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-tertiary)',
                  margin: 0
                }}>
                  {t.role}, {t.company}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          #testimonials > div:last-child {
            grid-template-columns: 1fr !important;
          }
          #testimonials > div:last-child > div {
            grid-column: span 1 !important;
            grid-row: span 1 !important;
          }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          #testimonials > div:last-child { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}
