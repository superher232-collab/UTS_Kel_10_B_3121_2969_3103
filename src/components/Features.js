"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Features() {
  const sectionRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      // Entrance animation for container and stagger for cards
      gsap.fromTo(sectionRef.current.children,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
          }
        }
      );
    }, sectionRef);
    
    return () => ctx.revert();
  }, []);
  const features = [
    {
      color: '#22C55E',
      glowColor: 'rgba(34, 197, 94, 0.15)',
      borderColor: 'rgba(34, 197, 94, 0.25)',
      title: 'Pelacakan Real-Time',
      desc: 'Monitor posisi dan rute kapal secara langsung dengan akurasi tinggi di seluruh perairan Indonesia',
      icon: '🛰️'
    },
    {
      color: '#F59E0B',
      glowColor: 'rgba(245, 158, 11, 0.15)',
      borderColor: 'rgba(245, 158, 11, 0.25)',
      title: 'Monitoring Bahan Bakar',
      desc: 'Pantau konsumsi armada untuk mengoptimalkan efisiensi dan mengurangi biaya operasional',
      icon: '⛽'
    },
    {
      color: '#3B82F6',
      glowColor: 'rgba(59, 130, 246, 0.15)',
      borderColor: 'rgba(59, 130, 246, 0.25)',
      title: 'Performa Kapal',
      desc: 'Pantau metrik kesehatan mesin dan performa teknis setiap armada kapal secara menyeluruh',
      icon: '⚙️'
    },
    {
      color: '#A855F7',
      glowColor: 'rgba(168, 85, 247, 0.15)',
      borderColor: 'rgba(168, 85, 247, 0.25)',
      title: 'Grafik Efisiensi',
      desc: 'Visualisasi data efisiensi operasional untuk mendukung keputusan strategis manajemen',
      icon: '📊'
    }
  ];

  return (
    <section
      id="fitur"
      ref={sectionRef}
      style={{
        width: '100%',
        padding: '80px 24px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '32px',
        boxSizing: 'border-box',
        maxWidth: '1200px',
        margin: '0 auto'
      }}
    >
      {features.map((f, i) => (
        <div
          key={i}
          style={{
            background: '#12101A',
            padding: '32px 28px',
            borderLeft: '3px solid #7C3AED',
            transition: 'all 0.3s ease',
            cursor: 'default',
            position: 'relative',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          {/* Icon */}
          <div style={{
            width: '48px',
            height: '48px',
            background: 'rgba(124, 58, 237, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            fontSize: '24px',
            marginBottom: '20px'
          }}>
            {f.icon}
          </div>

          {/* Title */}
          <h3 style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
            color: '#F1F0F5',
            fontSize: '18px',
            marginBottom: '12px',
            letterSpacing: '0.5px'
          }}>
            {f.title}
          </h3>

          {/* Description */}
          <p style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
            color: '#9B99A8',
            fontSize: '14px',
            lineHeight: '1.7',
            margin: 0
          }}>
            {f.desc}
          </p>
        </div>
      ))}
    </section>
  );
}