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
          letterSpacing: '-0.03em',
          lineHeight: '1.1',
          margin: 0
        }}>
          Everything you need to<br />
          <span style={{ color: 'rgba(241,240,245,0.5)' }}>command your fleet</span>
        </h2>
      </div>

      {/* Bento grid: 1 wide + 3 small */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridTemplateRows: 'auto auto',
        gap: '12px'
      }}>
        {/* First card spans 2 columns */}
        {features.map((f, i) => (
          <div key={i} className="double-bezel feature-card hover-lift" style={{
            gridColumn: i === 0 ? 'span 2' : 'span 1',
            gridRow: i === 0 ? 'span 2' : 'span 1'
          }}>
            <div className="double-bezel-inner" style={{
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
                background: 'rgba(168,85,247,0.08)',
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
                  color: '#F1F0F5',
                  letterSpacing: '-0.01em',
                  margin: '0 0 6px 0'
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
