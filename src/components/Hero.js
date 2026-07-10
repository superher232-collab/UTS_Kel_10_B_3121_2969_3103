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
      // Parallax heading
      gsap.fromTo(headingRef.current,
        { y: 0 },
        { y: -60, ease: "none", scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: true } }
      );

      // Parallax subtitle
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
      color: { value: ['#A855F7', '#7C3AED'] },
      links: { enable: true, color: '#A855F7', distance: 100, opacity: 0.08, width: 1 },
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
            linear-gradient(rgba(168,85,247,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(168,85,247,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px'
        }} />
        <ParticlesProvider init={initFn}>
          <Particles id="hero-particles" particlesLoaded={particlesLoaded} options={particleOptions}
            style={{ position: 'absolute', inset: 0 }} />
        </ParticlesProvider>
        {/* Radial glow */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
      </div>

      {/* Content — asymmetric split */}
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
          {/* Logo + badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{
              width: '48px', height: '48px',
              background: 'white',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 30px rgba(168,85,247,0.3)'
            }}>
              <Image src="/logo.png" alt="PRIMELOG" width={36} height={36} style={{ objectFit: 'contain' }} />
            </div>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              color: 'rgba(168,85,247,0.8)',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              padding: '6px 16px',
              borderRadius: '100px',
              background: 'rgba(168,85,247,0.08)',
              border: '1px solid rgba(168,85,247,0.15)'
            }}>
              Enterprise Fleet Platform
            </span>
          </div>

          {/* Heading */}
          <h1 ref={headingRef} style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(48px, 7vw, 80px)',
            fontWeight: 700,
            color: '#F1F0F5',
            letterSpacing: '-0.03em',
            lineHeight: '1.02',
            marginBottom: '24px'
          }}>
            Command Your<br />
            <span style={{
              background: 'linear-gradient(135deg, #A855F7 0%, #C084FC 50%, #A855F7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Fleet Operations</span>
          </h1>

          {/* Subtitle */}
          <p ref={subtitleRef} style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(14px, 1.5vw, 16px)',
            color: 'rgba(241,240,245,0.5)',
            lineHeight: '1.6',
            maxWidth: '500px',
            marginBottom: '40px'
          }}>
            Integrated platform for real-time fleet monitoring, cargo management, and maritime operational optimization across Indonesian waters.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            <a href="/login" className="btn-inner" style={{ textDecoration: 'none' }}>
              Access System
              <span className="icon-wrap">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
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
          <div className="double-bezel">
            <div className="double-bezel-inner" style={{ padding: '32px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {[
                  { value: '24/7', label: 'Monitoring' },
                  { value: '14+', label: 'Ports' },
                  { value: '99.9%', label: 'Uptime' },
                  { value: 'AES-256', label: 'Encryption' }
                ].map(stat => (
                  <div key={stat.label} style={{ textAlign: 'center' }}>
                    <div style={{
                      fontFamily: '"Roboto Mono", monospace',
                      fontSize: 'clamp(24px, 3vw, 36px)',
                      fontWeight: 700,
                      color: '#A855F7',
                      letterSpacing: '1px',
                      lineHeight: 1
                    }}>
                      {stat.value}
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '10px',
                      color: 'rgba(241,240,245,0.4)',
                      letterSpacing: '1.5px',
                      marginTop: '6px',
                      textTransform: 'uppercase'
                    }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Feature preview */}
          <div className="double-bezel">
            <div className="double-bezel-inner" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '40px', height: '40px',
                borderRadius: '10px',
                background: 'rgba(168,85,247,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A855F7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="3" />
                  <line x1="12" y1="2" x2="12" y2="6" />
                  <line x1="12" y1="18" x2="12" y2="22" />
                </svg>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#F1F0F5', fontWeight: 600 }}>
                  Real-Time Vessel Tracking
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'rgba(241,240,245,0.4)', marginTop: '2px' }}>
                  Live position updates every 30 seconds
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Responsive override */}
      <style>{`
        @media (max-width: 768px) {
          #home > div { grid-template-columns: 1fr !important; gap: 40px !important; }
          #home { padding: 100px 20px 60px !important; }
        }
      `}</style>
    </section>
  );
}
