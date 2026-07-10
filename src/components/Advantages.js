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
    { text: '24/7 monitoring for entire fleet', icon: <Clock size={18} weight="duotone" color="#22C55E" /> },
    { text: 'Interactive dashboard with real-time data', icon: <Monitor size={18} weight="duotone" color="#3B82F6" /> },
    { text: 'Automated alert system for anomalies', icon: <Bell size={18} weight="duotone" color="#EF4444" /> },
    { text: 'Comprehensive reports and deep analytics', icon: <FileText size={18} weight="duotone" color="#F59E0B" /> },
    { text: 'Integration with vessel navigation systems', icon: <NavigationArrow size={18} weight="duotone" color="#06B6D4" /> },
    { text: 'Enterprise-grade data security', icon: <Lock size={18} weight="duotone" color="#A855F7" /> }
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
          fontSize: '11px',
          color: 'rgba(168,85,247,0.7)',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          display: 'block',
          marginBottom: '12px'
        }}>
          Why PRIMELOG
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
          Key Advantages
        </h2>
      </div>

      {/* 3-col bento icon tiles */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px'
      }}>
        {items.map((item, i) => (
          <div key={i} className="double-bezel advantage-card hover-lift">
            <div className="double-bezel-inner" style={{
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
                background: 'rgba(168,85,247,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {item.icon}
              </div>
              <span style={{
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                color: 'rgba(241,240,245,0.65)',
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
