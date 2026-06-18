"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Footer() {
  const footerRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      gsap.fromTo(footerRef.current.children,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1, // Slight stagger for a nicer effect
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top bottom",
            end: "bottom bottom",
            scrub: true,
          }
        }
      );
    }, footerRef);
    
    return () => ctx.revert();
  }, []);
  return (
    <footer
      ref={footerRef}
      style={{
        width: '100%',
        padding: '80px 24px 40px',
        borderTop: '1px solid rgba(124, 58, 237, 0.1)',
        background: '#0D0B14',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px'
      }}
    >
      <span style={{
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: '12px',
        fontWeight: 'bold',
        color: '#9B99A8',
        letterSpacing: '1px'
      }}>
        PRIMELOG · FLEET COMMAND SYSTEM
      </span>

      <span style={{
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: '11px',
        color: '#9B99A8',
        letterSpacing: '0.5px'
      }}>
        © 2026 PrimeLog. All systems operational.
      </span>
    </footer>
  );
}
