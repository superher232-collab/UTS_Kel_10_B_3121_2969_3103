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
      id="about"
      ref={sectionRef}
      style={{
        padding: '80px 32px',
        background: '#12101A',
        borderLeft: '3px solid #7C3AED',
        margin: '40px 0',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Scan-line overlay */}
      <div className="scan-line" aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}></div>

      {/* Section Label */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '32px'
      }}>
        <h2 style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: '28px',
          fontWeight: 700,
          color: '#F1F0F5',
          letterSpacing: '1px',
          margin: 0
        }}>
          About PRIMELOG
        </h2>
      </div>

      <p style={{
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: '16px',
        color: '#9B99A8',
        lineHeight: '1.8',
        margin: '0 0 20px 0'
      }}>
        PRIMELOG is a next-generation fleet command platform designed to monitor,
        manage, and optimize vessel operations in real-time across Indonesian waters. Our system provides
        full visibility into every operational aspect — from location tracking and cargo management
        to predictive maintenance scheduling.
      </p>
      <p style={{
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: '16px',
        color: '#9B99A8',
        lineHeight: '1.8',
        margin: 0
      }}>
        Powered by advanced monitoring technology and predictive analytics, we help
        maritime companies increase operational efficiency, reduce costs,
        and ensure fleet safety worldwide.
      </p>
    </section>
  );
}
