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
      style={{
        maxWidth: '900px',
        margin: 'clamp(64px, 8vw, 100px) auto',
        padding: '0 24px'
      }}
    >
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        padding: 'clamp(48px, 6vw, 80px) clamp(32px, 4vw, 64px)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-xs)',
          color: 'var(--accent)',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          marginBottom: '16px',
          fontWeight: 600
        }}>
          Siap Memulai?
        </span>

        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(28px, 4vw, 42px)',
          fontWeight: 700,
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
          lineHeight: '1.1',
          margin: '0 0 16px 0'
        }}>
          Siap Mengelola Armada?
        </h2>

        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-base)',
          color: 'var(--text-secondary)',
          lineHeight: '1.6',
          maxWidth: '480px',
          margin: '0 0 40px 0'
        }}>
          Akses dashboard komando untuk pemantauan real-time, manajemen kargo, dan analitik performa armada.
        </p>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href="/login" style={{
            background: 'var(--accent)',
            color: '#060608',
            fontWeight: 600,
            fontSize: 'var(--text-base)',
            padding: '12px 24px',
            borderRadius: 'var(--radius-md)',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s var(--ease)'
          }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 30px var(--accent-glow)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}
          >
            Akses Sistem
            <ArrowRight size={14} weight="bold" />
          </a>

          <a href="/tracking" style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            padding: '12px 24px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            transition: 'all 0.3s var(--ease)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-focus)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            Lacak Kargo
            <MagnifyingGlass size={14} weight="bold" />
          </a>
        </div>

        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-xs)',
          color: 'var(--text-tertiary)',
          marginTop: '24px',
          letterSpacing: '0.5px'
        }}>
          Enkripsi AES-256 &middot; Autentikasi Multi-Faktor
        </p>
      </div>
    </section>
  );
}
