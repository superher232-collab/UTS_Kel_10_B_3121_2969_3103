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
      icon: <Compass size={22} weight="duotone" color="#A855F7" />,
      title: 'Real-Time Tracking',
      desc: 'Monitor vessel positions and routes with high accuracy across all Indonesian waters in real time'
    },
    {
      icon: <Drop size={22} weight="duotone" color="#A855F7" />,
      title: 'Fuel Monitoring',
      desc: 'Track fleet fuel consumption to optimize efficiency and reduce operational costs'
    },
    {
      icon: <Gauge size={22} weight="duotone" color="#A855F7" />,
      title: 'Vessel Performance',
      desc: 'Monitor engine health metrics and technical performance of every fleet vessel comprehensively'
    },
    {
      icon: <ChartBar size={22} weight="duotone" color="#A855F7" />,
      title: 'Efficiency Analytics',
      desc: 'Data-driven operational efficiency visualization to support strategic management decisions'
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
          fontSize: '11px',
          color: 'rgba(168,85,247,0.7)',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          display: 'block',
          marginBottom: '12px'
        }}>
          Platform Capabilities
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
          Everything you need to<br />
          <span style={{ color: 'rgba(241,240,245,0.5)' }}>command your fleet</span>
        </h2>
      </div>

      {/* Feature cards — bento grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '16px'
      }}>
        {features.map((f, i) => (
          <div key={i} className="double-bezel feature-card" style={{
            gridColumn: i < 2 ? 'span 1' : 'span 1'
          }}>
            <div className="double-bezel-inner" style={{ padding: '28px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(168,85,247,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                {f.icon}
              </div>
              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '16px',
                fontWeight: 600,
                color: '#F1F0F5',
                letterSpacing: '-0.01em',
                margin: '0 0 8px 0'
              }}>
                {f.title}
              </h3>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                color: 'rgba(241,240,245,0.45)',
                lineHeight: '1.6',
                margin: 0
              }}>
                {f.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          #features > div:last-child { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
