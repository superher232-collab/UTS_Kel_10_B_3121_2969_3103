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
      quote: "PRIMELOG transformed our fleet operations. Real-time visibility into vessel performance reduced our fuel costs by 23% in the first quarter.",
      author: "Capt. Agus Wijaya",
      role: "Fleet Operations Director",
      company: "Merchant Marine Corp"
    },
    {
      quote: "The predictive maintenance feature saved us from three critical engine failures. This system is indispensable for modern maritime logistics.",
      author: "Dr. Sarah Chen",
      role: "Chief Technology Officer",
      company: "Pacific Cargo Lines"
    },
    {
      quote: "Integration with our existing navigation systems was seamless. The analytics dashboard gives us insights we never had before.",
      author: "Hendra Pratama",
      role: "Head of Maritime Logistics",
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
          fontSize: '11px',
          color: 'rgba(168,85,247,0.7)',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          display: 'block',
          marginBottom: '12px'
        }}>
          Testimonials
        </span>
        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(28px, 4vw, 40px)',
          fontWeight: 700,
          color: '#F1F0F5',
          letterSpacing: '-0.02em',
          lineHeight: '1.1',
          margin: 0
        }}>
          What Our Clients Say
        </h2>
      </div>

      {/* Cards grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px'
      }}>
        {testimonials.map((t, i) => (
          <div key={i} className="double-bezel testimonial-card">
            <div className="double-bezel-inner" style={{
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <Quotes size={24} weight="duotone" color="#A855F7" style={{ opacity: 0.4 }} />
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                color: 'rgba(241,240,245,0.55)',
                lineHeight: '1.7',
                margin: 0,
                fontStyle: 'italic'
              }}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <div style={{ marginTop: 'auto' }}>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#F1F0F5',
                  margin: '0 0 2px 0'
                }}>
                  {t.author}
                </p>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '11px',
                  color: 'rgba(241,240,245,0.35)',
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
          #testimonials > div:last-child { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          #testimonials > div:last-child { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}
