"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, MagnifyingGlass } from "@phosphor-icons/react";

export default function CTA() {
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
      id="get-started"
      ref={sectionRef}
      className="double-bezel"
      style={{
        maxWidth: '900px',
        margin: 'clamp(64px, 8vw, 100px) auto',
        padding: '1.5px'
      }}
    >
      <div className="double-bezel-inner" style={{
        padding: 'clamp(48px, 6vw, 80px) clamp(32px, 4vw, 64px)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: '11px',
          color: 'rgba(168,85,247,0.7)',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          marginBottom: '16px'
        }}>
          Ready to Get Started?
        </span>

        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(28px, 4vw, 42px)',
          fontWeight: 700,
          color: '#F1F0F5',
          letterSpacing: '-0.02em',
          lineHeight: '1.1',
          margin: '0 0 16px 0'
        }}>
          Manage Your Fleet Today
        </h2>

        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '14px',
          color: 'rgba(241,240,245,0.45)',
          lineHeight: '1.6',
          maxWidth: '480px',
          margin: '0 0 40px 0'
        }}>
          Access the command dashboard for real-time monitoring, cargo management, and fleet performance analytics.
        </p>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href="/login" className="btn-inner" style={{ textDecoration: 'none' }}>
            Access System
            <span className="icon-wrap">
              <ArrowRight size={14} weight="bold" />
            </span>
          </a>

          <a href="/tracking" style={{
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            color: 'rgba(241,240,245,0.6)',
            textDecoration: 'none',
            padding: '12px 24px',
            borderRadius: '100px',
            border: '1px solid rgba(168,85,247,0.2)',
            transition: 'all 0.3s var(--cubic-premium)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(168,85,247,0.5)'; e.currentTarget.style.color = '#F1F0F5'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(168,85,247,0.2)'; e.currentTarget.style.color = 'rgba(241,240,245,0.6)'; }}
          >
            Track Cargo
            <MagnifyingGlass size={14} weight="bold" />
          </a>
        </div>

        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '11px',
          color: 'rgba(241,240,245,0.3)',
          marginTop: '24px',
          letterSpacing: '0.5px'
        }}>
          AES-256 Encrypted Access &middot; Multi-factor Authentication
        </p>
      </div>
    </section>
  );
}
