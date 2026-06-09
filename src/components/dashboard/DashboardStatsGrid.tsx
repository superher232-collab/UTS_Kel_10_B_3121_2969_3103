"use client";
import React, { useEffect, useRef } from 'react';
import { animate } from 'animejs';
import { motion } from 'framer-motion';

interface DashboardStatsGridProps {
  aktifCount: number;
  perjalananCount: number;
  selesaiCount: number;
}

export function DashboardStatsGrid({
  aktifCount,
  perjalananCount,
  selesaiCount
}: DashboardStatsGridProps) {
  const aktifRef = useRef<HTMLDivElement>(null);
  const perjalananRef = useRef<HTMLDivElement>(null);
  const selesaiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate aktifCount
    if (aktifRef.current) {
      const obj = { value: 0 };
      animate(obj, {
        value: aktifCount,
        ease: 'outQuad',
        duration: 1200,
        onRender: () => {
          if (aktifRef.current) {
            aktifRef.current.textContent = String(Math.round(obj.value));
          }
        }
      });
    }

    // Animate perjalananCount
    if (perjalananRef.current) {
      const obj = { value: 0 };
      animate(obj, {
        value: perjalananCount,
        ease: 'outQuad',
        duration: 1200,
        onRender: () => {
          if (perjalananRef.current) {
            perjalananRef.current.textContent = String(Math.round(obj.value));
          }
        }
      });
    }

    // Animate selesaiCount
    if (selesaiRef.current) {
      const obj = { value: 0 };
      animate(obj, {
        value: selesaiCount,
        ease: 'outQuad',
        duration: 1200,
        onRender: () => {
          if (selesaiRef.current) {
            selesaiRef.current.textContent = String(Math.round(obj.value));
          }
        }
      });
    }
  }, [aktifCount, perjalananCount, selesaiCount]);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1] as const,
      },
    }
  };

  const cards = [
    { label: 'KARGO AKTIF (SORTIR / PROSES)', ref: aktifRef, desc: 'Kargo dalam tahap verifikasi & packing' },
    { label: 'DALAM PERJALANAN / TRANSIT', ref: perjalananRef, desc: 'Kargo sedang diangkut armada maritim' },
    { label: 'PENGIRIMAN SELESAI / TIBA', ref: selesaiRef, desc: 'Kargo sukses diterima di pelabuhan tujuan' }
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}
    >
      {cards.map(card => (
        <motion.div
          key={card.label}
          variants={cardVariants}
          style={{
            background: '#12101A',
            border: '1px solid #2A2740',
            borderLeft: '3px solid #7C3AED',
            borderRadius: '8px',
            padding: '24px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            transition: 'transform 0.2s'
          }}
        >
          <span style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '11px', color: '#9B99A8', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{card.label}</span>
          <div ref={card.ref} style={{ fontSize: '3.5rem', fontWeight: 700, fontFamily: '"Roboto Mono", monospace', color: '#A855F7', lineHeight: 1 }}>0</div>
          <span style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '12px', color: '#9B99A8' }}>{card.desc}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}
