"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Registrasi ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Inisialisasi Lenis dengan konfigurasi yang diminta
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => 1 - Math.pow(1 - t, 3), // easeInOutCubic
      orientation: "vertical",
      smoothWheel: true,
      lerp: 0.08,
    });

    lenisRef.current = lenis;

    // Sinkronisasi Lenis requestAnimationFrame dengan GSAP ticker
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    // Menonaktifkan lag smoothing untuk menghindari konflik dengan scroll
    gsap.ticker.lagSmoothing(0);

    return () => {
      // Cleanup
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
