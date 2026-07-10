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
      className="double-bezel"
      style={{
        maxWidth: '900px',
        margin: 'clamp(64px, 8vw, 100px) auto',
        padding: '1.5px'
      }}
    >
      <div className="double-bezel-inner" style={{
        padding: 'clamp(32px, 4vw, 56px)',
        display: 'grid',
        gridTemplateColumns: '1fr 1.2fr',
        gap: '40px',
        alignItems: 'center'
      }}>
        {/* Left — label + description */}
        <div>
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: '11px',
            color: 'rgba(168,85,247,0.7)',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '16px'
          }}>
            About PRIMELOG
          </span>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(24px, 3vw, 32px)',
            fontWeight: 700,
            color: '#F1F0F5',
            letterSpacing: '-0.02em',
            lineHeight: '1.15',
            margin: '0 0 20px 0'
          }}>
            Next-Gen Fleet<br />Command Platform
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            color: 'rgba(241,240,245,0.45)',
            lineHeight: '1.7',
            margin: 0
          }}>
            PRIMELOG provides full visibility into every operational aspect — from location tracking and cargo management to predictive maintenance scheduling.
          </p>
        </div>

        {/* Right — stats / highlights */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { stat: 'Real-Time', desc: 'Live vessel tracking with 30s update intervals' },
            { stat: 'Predictive', desc: 'AI-driven maintenance and anomaly detection' },
            { stat: 'End-to-End', desc: 'From port to port cargo visibility' }
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex',
              gap: '16px',
              padding: '16px',
              background: 'rgba(168,85,247,0.03)',
              border: '1px solid rgba(168,85,247,0.08)',
              borderRadius: '10px'
            }}>
              <div style={{
                fontFamily: '"Roboto Mono", monospace',
                fontSize: '11px',
                fontWeight: 600,
                color: '#A855F7',
                letterSpacing: '1px',
                whiteSpace: 'nowrap',
                minWidth: '70px'
              }}>
                {item.stat}
              </div>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
                color: 'rgba(241,240,245,0.45)',
                lineHeight: '1.4'
              }}>
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #about > div { grid-template-columns: 1fr !important; gap: 24px !important; }
        }
      `}</style>
    </section>
  );
}
