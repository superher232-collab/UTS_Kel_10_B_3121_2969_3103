"use client";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
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
    </motion.footer>
  );
}
