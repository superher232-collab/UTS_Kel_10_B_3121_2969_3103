"use client";
import { useCallback, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Particles, { ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Hero() {
  const heroRef = useRef(null);
  const headingRef = useRef(null);
  const subtitleRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(headingRef.current,
        { y: 0 },
        { y: -60, ease: "none", scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: true } }
      );

      gsap.fromTo(subtitleRef.current,
        { y: 0 },
        { y: -40, ease: "none", scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: true } }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const initFn = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async () => {}, []);

  const particleOptions = useMemo(() => ({
    fullScreen: { enable: false },
    fpsLimit: 60,
    particles: {
      color: { value: ['#00E5FF', '#0088AA'] },
      links: { enable: true, color: '#00E5FF', distance: 100, opacity: 0.06, width: 1 },
      move: { enable: true, speed: 0.4, direction: 'none', random: true, outModes: { default: 'out' } },
      number: { value: 40, density: { enable: true, area: 800 } },
      opacity: { value: { min: 0.2, max: 0.5 } },
      size: { value: { min: 1, max: 2 } }
    },
    interactivity: {
      events: { onHover: { enable: true, mode: 'repulse' } },
      modes: { repulse: { distance: 80, duration: 0.3 } }
    },
    detectRetina: true
  }), []);

  return (
    <section
      id="home"
      ref={heroRef}
      style={{
        position: 'relative',
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        padding: '120px 32px 80px',
        overflow: 'hidden',
        boxSizing: 'border-box'
      }}
    >
      {/* Background */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px'
        }} />
        <ParticlesProvider init={initFn}>
          <Particles id="hero-particles" particlesLoaded={particlesLoaded} options={particleOptions}
            style={{ position: 'absolute', inset: 0 }} />
        </ParticlesProvider>
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,229,255,0.06) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
      </div>

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1.2fr 0.8fr',
        gap: '64px',
        alignItems: 'center'
      }}>
        {/* Left — text */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{
              width: '48px', height: '48px',
              background: 'white',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 30px rgba(0,229,255,0.2)'
            }}>
              <Image src="/logo.png" alt="PRIMELOG" width={36} height={36} style={{ objectFit: 'contain' }} />
            </div>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-xs)',
              color: 'var(--accent)',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              padding: '6px 16px',
              borderRadius: '100px',
              background: 'var(--accent-dim)',
              border: '1px solid rgba(0,229,255,0.15)',
              fontWeight: 600
            }}>
              Sistem Manajemen Armada
            </span>
          </div>

          <h1 ref={headingRef} style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(48px, 7vw, 80px)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.03em',
            lineHeight: '1.02',
            marginBottom: '24px'
          }}>
            Kendalikan Armada<br />
            <span style={{ color: 'var(--accent)' }}>Secara Real-Time</span>
          </h1>

          <p ref={subtitleRef} style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(var(--text-base), 1.5vw, var(--text-lg))',
            color: 'var(--text-secondary)',
            lineHeight: '1.6',
            maxWidth: '500px',
            marginBottom: '40px'
          }}>
            Pantau posisi kapal, kelola pengiriman kargo, dan optimasi seluruh operasional maritim dari satu dashboard terpadu.
          </p>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            <a href="/login" style={{
              background: 'var(--accent)',
              color: '#060608',
              fontFamily: 'var(--font-body)',
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
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
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
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </a>
          </div>
        </motion.div>

        {/* Right — visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
        >
          {/* Stats card */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '32px'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {[
                { value: '24/7', label: 'Monitoring' },
                { value: '14+', label: 'Pelabuhan' },
                { value: '99.9%', label: 'Uptime' },
                { value: 'Real-time', label: 'Tracking' }
              ].map(stat => (
                <div key={stat.label} style={{ textAlign: 'center' }}>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'clamp(24px, 3vw, 36px)',
                    fontWeight: 700,
                    color: 'var(--accent)',
                    lineHeight: 1
                  }}>
                    {stat.value}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-xs)',
                    color: 'var(--text-tertiary)',
                    letterSpacing: '1px',
                    marginTop: '6px',
                    textTransform: 'uppercase'
                  }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feature preview */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              width: '40px', height: '40px',
              borderRadius: '10px',
              background: 'var(--accent-dim)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="3" />
                <line x1="12" y1="2" x2="12" y2="6" />
                <line x1="12" y1="18" x2="12" y2="22" />
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', fontWeight: 600 }}>
                Pelacakan Vessel Real-Time
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                Update posisi langsung setiap 30 detik
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Responsive override */}
      <style>{`
        @media (max-width: 768px) {
          #home > div:last-child { grid-template-columns: 1fr !important; gap: 40px !important; }
          #home { padding: 100px 20px 60px !important; }
        }
      `}</style>
    </section>
  );
}
