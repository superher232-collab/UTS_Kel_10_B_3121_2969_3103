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
    { label: 'Kargo Aktif', ref: aktifRef, desc: 'Kargo dalam tahap verifikasi dan packing' },
    { label: 'Dalam Perjalanan', ref: perjalananRef, desc: 'Kargo sedang diangkut armada maritim' },
    { label: 'Selesai', ref: selesaiRef, desc: 'Kargo berhasil diterima di tujuan' }
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
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderLeft: '3px solid var(--accent)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            transition: 'transform 0.2s'
          }}
        >
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{card.label}</span>
          <div ref={card.ref} style={{ fontSize: '3rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent)', lineHeight: 1 }}>0</div>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{card.desc}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}
