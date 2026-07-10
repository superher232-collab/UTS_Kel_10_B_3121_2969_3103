"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function CTA() {
  const sectionRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      gsap.fromTo(sectionRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
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
  return (
    <section
      id="get-started"
      ref={sectionRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '80px 24px',
        position: 'relative',
        background: '#12101A',
        borderLeft: '3px solid #7C3AED',
        margin: '40px 0'
      }}
    >
      {/* Scan-line overlay */}
      <div className="scan-line" aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}></div>

      <h3 style={{
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: '14px',
        fontWeight: 600,
        color: '#9B99A8',
        letterSpacing: '3px',
        marginBottom: '12px',
        position: 'relative',
        zIndex: 1
      }}>
        READY TO GET STARTED?
      </h3>

      <h2 style={{
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: 'clamp(24px, 4vw, 36px)',
        fontWeight: 700,
        color: '#F1F0F5',
        letterSpacing: '1px',
        marginBottom: '16px',
        position: 'relative',
        zIndex: 1
      }}>
        Manage Your Fleet Today
      </h2>

      <p style={{
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: '15px',
        color: '#9B99A8',
        lineHeight: '1.6',
        maxWidth: '480px',
        marginBottom: '40px',
        position: 'relative',
        zIndex: 1
      }}>
        Access the command dashboard for real-time monitoring, cargo management, and fleet performance analytics
      </p>

      <div style={{
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        <a href="/login" className="btn-cta-primary" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          background: '#7C3AED',
          color: '#F1F0F5',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: '14px',
          fontWeight: 'bold',
          letterSpacing: '1.5px',
          padding: '16px 40px',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          textDecoration: 'none',
          transition: 'all 0.3s ease'
        }}>
          ACCESS SYSTEM
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>

        <a href="/tracking" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          background: 'transparent',
          color: '#F1F0F5',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: '14px',
          fontWeight: 'bold',
          letterSpacing: '1.5px',
          padding: '16px 40px',
          border: '1px solid #7C3AED',
          borderRadius: '8px',
          cursor: 'pointer',
          textDecoration: 'none',
          transition: 'all 0.3s ease'
        }}>
          TRACK CARGO
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </a>
      </div>

      <p style={{
        fontFamily: '"Roboto Mono", monospace',
        fontSize: '12px',
        color: '#9B99A8',
        marginTop: '24px',
        letterSpacing: '0.5px',
        position: 'relative',
        zIndex: 1
      }}>
        AES-256 Encrypted Access &middot; Multi-factor Authentication
      </p>

      <style>{`
        .btn-cta-primary:hover {
          background: #A855F7 !important;
          box-shadow: 0 0 20px rgba(168, 85, 247, 0.6) !important;
        }
        .btn-cta-secondary:hover {
          border-color: #A855F7 !important;
        }
        a:focus-visible {
          outline: 2px solid #A855F7;
          outline-offset: 2px;
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { transition: none !important; }
        }
      `}</style>
    </section>
  );
}
