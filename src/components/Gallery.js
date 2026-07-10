"use client";
import Image from "next/image";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Gallery() {
  const sectionRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(sectionRef.current.querySelectorAll('.gallery-card'),
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0,
          duration: 0.6, stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 85%" }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const items = [
    { src: '/ship1.png', label: 'Maritime Operations', desc: 'Active fleet surveillance' },
    { src: '/ship2.png', label: 'Fleet Management', desc: 'Cross-vessel coordination' },
    { src: '/ship3.png', label: 'Global Reach', desc: 'International sea routes' },
    { src: '/ship4.png', label: 'Cargo Logistics', desc: 'Multi-modal distribution' },
    { src: '/ship5.png', label: 'Strategic Ports', desc: 'Key transit hubs' }
  ];

  return (
    <section
      id="gallery"
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
          Visual Tour
        </span>
        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(28px, 4vw, 40px)',
          fontWeight: 700,
          color: '#F1F0F5',
          letterSpacing: '-0.03em',
          lineHeight: '1.1',
          margin: 0
        }}>
          Fleet Gallery
        </h2>
      </div>

      {/* Edge-to-edge gallery strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '8px'
      }}>
        {items.map((item, i) => (
          <div key={i} className="gallery-card" style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '8px',
            height: '220px',
            cursor: 'pointer'
          }}>
            <Image
              src={item.src}
              alt={item.label}
              width={400}
              height={250}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.6s var(--cubic-premium)'
              }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(0deg, rgba(5,5,5,0.9) 0%, transparent 50%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: '16px'
            }}>
              <span style={{
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
                fontWeight: 600,
                color: '#F1F0F5',
                letterSpacing: '0.5px'
              }}>
                {item.label}
              </span>
              <span style={{
                fontFamily: 'var(--font-body)',
                fontSize: '11px',
                color: 'rgba(241,240,245,0.4)',
                marginTop: '2px'
              }}>
                {item.desc}
              </span>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 1024px) {
          #gallery > div:last-child { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 768px) {
          #gallery > div:last-child { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          #gallery > div:last-child { grid-template-columns: 1fr !important; }
        }
        .gallery-card:hover img { transform: scale(1.06); }
      `}</style>
    </section>
  );
}
