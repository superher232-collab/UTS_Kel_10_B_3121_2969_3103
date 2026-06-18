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
  const bgRef = useRef(null);
  const headingRef = useRef(null);
  const subtitleRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Parallax Background
      gsap.fromTo(bgRef.current,
        { y: 0 },
        {
          y: -150,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          }
        }
      );

      // Parallax Heading
      gsap.fromTo(headingRef.current,
        { y: 0 },
        {
          y: -80,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          }
        }
      );

      // Parallax Subtitle
      gsap.fromTo(subtitleRef.current,
        { y: 0 },
        {
          y: -50,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          }
        }
      );

      // Fade Out Stats Bar
      gsap.fromTo(statsRef.current,
        { opacity: 1 },
        {
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "30% top",
            end: "bottom top",
            scrub: true,
          }
        }
      );
    }, heroRef); // scope to heroRef

    return () => ctx.revert(); // cleanup
  }, []);
  const initFn = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    // particles loaded
  }, []);

  const particleOptions = useMemo(() => ({
    fullScreen: { enable: false },
    fpsLimit: 60,
    particles: {
      color: {
        value: ['#7C3AED', '#A855F7']
      },
      links: {
        enable: true,
        color: '#7C3AED',
        distance: 120,
        opacity: 0.15,
        width: 1
      },
      move: {
        enable: true,
        speed: 0.5,
        direction: 'none',
        random: true,
        straight: false,
        outModes: { default: 'out' }
      },
      number: {
        value: 60,
        density: { enable: true, area: 800 }
      },
      opacity: {
        value: { min: 0.3, max: 0.7 }
      },
      size: {
        value: { min: 1, max: 3 }
      }
    },
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: 'repulse'
        }
      },
      modes: {
        repulse: {
          distance: 100,
          duration: 0.4
        }
      }
    },
    detectRetina: true
  }), []);

  return (
    <section
      id="beranda"
      ref={heroRef}
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '120px 24px 60px',
        overflow: 'hidden',
        boxSizing: 'border-box'
      }}
    >
      {/* Background Wrapper */}
      <div ref={bgRef} style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        {/* Animated Grid Lines Background */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(168, 85, 247, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(168, 85, 247, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }} />

        {/* tsParticles Background */}
        <ParticlesProvider init={initFn}>
          <Particles
            id="hero-particles"
            particlesLoaded={particlesLoaded}
            options={particleOptions}
            style={{
              position: 'absolute',
              inset: 0,
            }}
          />
        </ParticlesProvider>
      </div>

      {/* Hero Content with fade-in-up */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          zIndex: 2
        }}
      >
        {/* Logo Box without neon glow */}
        <div style={{
          width: '120px',
          height: '120px',
          background: 'white',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '32px',
          animation: 'logoFloat 6s ease-in-out infinite'
        }}>
          <Image src="/logo.png" alt="PRIMELOG Logo" width={88} height={88} priority style={{ objectFit: 'contain' }} />
        </div>

        {/* Title */}
        <h1 ref={headingRef} style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: 'clamp(36px, 6vw, 56px)',
          fontWeight: 700,
          color: '#F1F0F5',
          letterSpacing: '4px',
          marginBottom: '12px',
          textAlign: 'center'
        }}>
          PRIMELOG
        </h1>

        {/* Subtitle */}
        <p ref={subtitleRef} style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: 'clamp(14px, 2.5vw, 20px)',
          color: '#9B99A8',
          letterSpacing: '3px',
          marginBottom: '8px',
          textAlign: 'center',
          fontWeight: 500
        }}>
          FLEET COMMAND SYSTEM
        </p>

        {/* Tagline */}
        <p style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: 'clamp(12px, 1.5vw, 15px)',
          color: '#9B99A8',
          letterSpacing: '0.5px',
          marginBottom: '40px',
          textAlign: 'center',
          maxWidth: '540px',
          lineHeight: '1.6'
        }}>
          Platform terpadu untuk monitoring, manajemen, dan optimalisasi operasional armada kapal secara real-time
        </p>

        {/* Gradient Divider */}
        <div style={{
          width: '80px',
          height: '3px',
          background: '#7C3AED',
          marginBottom: '40px',
          borderRadius: '2px'
        }} />

        {/* CTA Buttons */}
        <div style={{
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <a href="/login" className="btn-primary" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            background: '#7C3AED',
            color: '#F1F0F5',
            padding: '14px 36px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '13px',
            fontWeight: 'bold',
            letterSpacing: '1px',
            transition: 'all 0.3s ease'
          }}>
            MASUK SISTEM
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>

          <a href="/tracking" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            background: 'transparent',
            color: '#F1F0F5',
            padding: '14px 36px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '13px',
            fontWeight: 'bold',
            letterSpacing: '1px',
            border: '1px solid #7C3AED',
            transition: 'all 0.3s ease'
          }}>
            LACAK PAKET
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </a>
        </div>

        {/* Floating Stats Bar */}
        <div ref={statsRef} style={{
          display: 'flex',
          gap: '40px',
          marginTop: '60px',
          padding: '32px 48px',
          background: '#12101A',
          borderLeft: '3px solid #7C3AED',
          borderRadius: '12px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          {[
            { value: '24/7', label: 'MONITORING' },
            { value: '14+', label: 'PELABUHAN' },
            { value: '99.9%', label: 'UPTIME' },
            { value: 'AES-256', label: 'ENKRIPSI' }
          ].map((stat) => (
            <div key={stat.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontFamily: '"Roboto Mono", monospace', fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 700, color: '#A855F7', letterSpacing: '2px' }}>{stat.value}</span>
              <span style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '12px', color: '#9B99A8', letterSpacing: '1px' }}>{stat.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <style>{`
        .btn-primary:hover {
          background: #A855F7 !important;
          box-shadow: 0 0 20px rgba(168, 85, 247, 0.6) !important;
        }
        @keyframes logoFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </section>
  );
}
