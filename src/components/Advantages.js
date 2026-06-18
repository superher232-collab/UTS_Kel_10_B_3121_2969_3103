"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Advantages() {
  const sectionRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
        }
      });

      // Animate the section container
      tl.fromTo(sectionRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      )
      // Stagger the grid items
      .fromTo(".advantage-item",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: "power2.out" },
        "-=0.4"
      );
    }, sectionRef);
    
    return () => ctx.revert();
  }, []);
  const items = [
    { text: 'Monitoring 24/7 untuk seluruh armada', icon: '🔄' },
    { text: 'Dashboard interaktif dengan data real-time', icon: '📡' },
    { text: 'Sistem peringatan otomatis untuk anomali', icon: '🚨' },
    { text: 'Laporan komprehensif dan analitik mendalam', icon: '📋' },
    { text: 'Integrasi dengan sistem navigasi kapal', icon: '🧭' },
    { text: 'Keamanan data tingkat enterprise', icon: '🔐' }
  ];

  return (
    <section
      id="keunggulan"
      ref={sectionRef}
      style={{
        padding: '80px 24px',
        background: '#12101A',
        borderLeft: '3px solid #7C3AED',
        margin: '40px 0',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Section Label */}
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
          KEUNGGULAN UTAMA
        </h2>
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '14px'
      }}>
        {items.map((item, i) => (
          <div key={i} className="advantage-item" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '16px',
            background: 'rgba(124, 58, 237, 0.05)',
            border: '1px solid rgba(124, 58, 237, 0.1)',
            borderRadius: '8px',
            transition: 'all 0.2s ease'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              background: 'rgba(124, 58, 237, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              flexShrink: 0
            }}>
              {item.icon}
            </div>
            <span style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: '14px',
              color: '#9B99A8',
              lineHeight: '1.5'
            }}>
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
