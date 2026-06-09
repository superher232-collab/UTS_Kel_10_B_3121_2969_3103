"use client";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
      delayChildren: 0.1,
      staggerChildren: 0.12
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

export default function Advantages() {
  const items = [
    { text: 'Monitoring 24/7 untuk seluruh armada', icon: '🔄' },
    { text: 'Dashboard interaktif dengan data real-time', icon: '📡' },
    { text: 'Sistem peringatan otomatis untuk anomali', icon: '🚨' },
    { text: 'Laporan komprehensif dan analitik mendalam', icon: '📋' },
    { text: 'Integrasi dengan sistem navigasi kapal', icon: '🧭' },
    { text: 'Keamanan data tingkat enterprise', icon: '🔐' }
  ];

  return (
    <motion.section
      id="keunggulan"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      style={{
        padding: '80px 24px',
        background: '#12101A',
        borderLeft: '3px solid #7C3AED',
        margin: '40px 0',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Section Label */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '40px'
      }}>
        <h2 style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: '24px',
          fontWeight: 700,
          color: '#F1F0F5',
          letterSpacing: '1px',
          margin: 0
        }}>
          KEUNGGULAN UTAMA
        </h2>
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '14px'
      }}>
        {items.map((item, i) => (
          <motion.div key={i} variants={itemVariants} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '16px',
            background: 'rgba(124, 58, 237, 0.05)',
            border: '1px solid rgba(124, 58, 237, 0.1)',
            borderRadius: '8px',
            transition: 'all 0.2s ease'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              background: 'rgba(124, 58, 237, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              flexShrink: 0
            }}>
              {item.icon}
            </div>
            <span style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: '14px',
              color: '#9B99A8',
              lineHeight: '1.5'
            }}>
              {item.text}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
