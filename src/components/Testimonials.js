"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Testimonials() {
  const sectionRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(sectionRef.current.children,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
          }
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
        padding: '80px 24px',
        position: 'relative',
        background: '#12101A',
        borderLeft: '3px solid #7C3AED',
        margin: '40px 0',
        overflow: 'hidden'
      }}
    >
      {/* Section label */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '40px'
      }}>
        <h2 style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: '24px',
          fontWeight: 700,
          color: '#F1F0F5',
          letterSpacing: '1px',
          margin: 0
        }}>
          WHAT OUR CLIENTS SAY
        </h2>
      </div>

      {/* Testimonials grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px'
      }}>
        {testimonials.map((t, i) => (
          <div
            key={i}
            style={{
              background: '#0D0B14',
              border: '1px solid rgba(124, 58, 237, 0.15)',
              borderRadius: '8px',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              transition: 'all 0.3s ease'
            }}
          >
            {/* Quote icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#A855F7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
              <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
              <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
            </svg>

            {/* Quote text */}
            <p style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: '14px',
              color: '#C7B8EA',
              lineHeight: '1.7',
              margin: 0,
              fontStyle: 'italic'
            }}>
              &ldquo;{t.quote}&rdquo;
            </p>

            {/* Author info */}
            <div style={{ marginTop: 'auto' }}>
              <p style={{
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontSize: '13px',
                fontWeight: 'bold',
                color: '#F1F0F5',
                margin: '0 0 4px 0',
                letterSpacing: '0.5px'
              }}>
                {t.author}
              </p>
              <p style={{
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontSize: '11px',
                color: '#9B99A8',
                margin: 0
              }}>
                {t.role}, {t.company}
              </p>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { transition: none !important; }
        }
      `}</style>
    </section>
  );
}
